import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getToken } from './authStorage';

const DEFAULT_BASE_URL = (global as any)?.SERVER_URL || 'https://respi.es';

const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
  (global as any).SERVER_URL = url;
};

// Interceptor para añadir el token a cada petición
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//para q haga logout solo
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Si el servidor devuelve 401 (No autorizado)
      await SecureStore.deleteItemAsync('user_auth_token');
      // Nota: el logout global debe manejarse desde AuthContext si quieres navegar automáticamente.
    }
    return Promise.reject(error);
  },
);

export default api;
