import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getToken, saveToken, getRefreshToken, saveRefreshToken, logout } from './authStorage'; // Asumo que tienes estas funciones

const api = axios.create({
  baseURL: 'https://respi.es',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de Petición (Se queda casi igual)
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTOR DE RESPUESTA (El que hace la magia)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es un 401 y no es login/register y no hemos reintentado ya esta misma peticion
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register') &&
      !originalRequest._retry // Evita bucles infinitos si el refresh falla
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken(); // Sacas el refresh de SecureStore

        if (!refreshToken) throw new Error('No hay refresh token');

        // pedimos un nuevo access token al backend
         const res = await axios.post('https://respi.es/auth/refresh', {
          refresh_token: refreshToken
        });

        if (res.status === 200 || res.status === 201) {
          const newAccessToken = res.data.access_token;
          
          // 1. Guardamos el nuevo access
          await saveToken(newAccessToken);
          
          // 2. Si el backend te da un nuevo refresh también, guárdalo:
          if (res.data.refresh_token) {
             await saveRefreshToken(res.data.refresh_token);
          }

          // 3. Actualizamos el header de la petición que falló y la reintentamos
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Si llegamos aquí, el refresh token ha muerto o es inválido
        console.error("Refresh token caducado. Cerrando sesión...");
        await logout(); // Limpia SecureStore y redirige
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;