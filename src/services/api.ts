import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


const api = axios.create({
  baseURL: 'https://respi.es', // Tu dominio
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a cada petición
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('user_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//para q haga logout solo
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Si el servidor devuelve 401 (No autorizado)
      await SecureStore.deleteItemAsync('user_auth_token');
      // Aquí podrías disparar una redirección global
    }
    return Promise.reject(error);
  }
);

export default api;






