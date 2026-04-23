import axios from 'axios';
import { 
  getToken, 
  saveToken, 
  getRefreshToken, 
  saveRefreshToken, 
  logout 
} from './authStorage';

// Esta variable vive fuera de la instancia para controlar peticiones simultáneas
let isRedirecting = false;
let isRefreshing = false;
 
const api = axios.create({
  baseURL: 'https://respi.es',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * INTERCEPTOR DE PETICIÓN
 * Añade el token de acceso a todas las cabeceras automáticamente
 */
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


//interceptor que cuando sale un 401 , mira aver si es pq el token ha caducado , si es
//el caso , intenta pillar un nuevo con el refresh , si eso tamb falla ya manda al login y 
//borra los tokens que teniamos guardados

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // --- FILTRO DE SEGURIDAD ---
    // Si NO es un 401, no es cosa de "sesión caducada". 
    // Lo devolvemos para que el componente (Login) maneje su error 400, 500, etc.
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // A. Si el error 401 viene del LOGIN o REGISTER, no intentamos refresh ni sacamos modal.
    // El usuario simplemente ha metido mal la contraseña o el usuario no existe.
    if (originalRequest.url.includes('/auth/login')||originalRequest.url.includes('/auth/register')) {
      return Promise.reject(error);
    }

    // B. Si el error 401 viene del REFRESH, ahí sí que el token ha muerto del todo.
    if (originalRequest.url.includes('/auth/refresh')) {
      if (!isRedirecting) {
        isRedirecting = true;
        await logout(true); // Sacamos modal de sesión caducada
        setTimeout(() => { isRedirecting = false; }, 2000);
      }
      return Promise.reject(error);
    }

    // C. Si es un 401 en cualquier otra petición (mis-reservas, perfil, etc.)
    if (!originalRequest._retry) {
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No hay refresh token');

        // Intentamos el refresh con axios plano
        const res = await axios.post('https://respi.es/auth/refresh', {
          refresh_token: refreshToken
        });

        if (res.status === 200 || res.status === 201) {
          const newAccessToken = res.data.access_token;
          await saveToken(newAccessToken);
          if (res.data.refresh_token) await saveRefreshToken(res.data.refresh_token);

          isRefreshing = false; 
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        isRefreshing = false;
        if (!isRedirecting) {
          isRedirecting = true;
          console.error("Fallo crítico en refresh. Expulsando...");
          await logout(true); // ¡Pum! Modal de sesión caducada
          setTimeout(() => { isRedirecting = false; }, 2000);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default api;