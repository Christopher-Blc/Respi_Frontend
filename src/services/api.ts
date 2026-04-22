import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getToken } from './authStorage';
import { Platform } from 'react-native';


const DEFAULT_BASE_URL =  'https://respi.es';

//descomentar eso si es en local
// const DEFAULT_BASE_URL = Platform.select({
//   android: 'http://10.0.2.2:8000',
//   ios: 'http://localhost:8000',
//   web: 'http://localhost:8000',
//   default: 'http://localhost:8000',  
// });



const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
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
    // Solo borramos el token si el error NO es en el login y es un 401
    // (un 401 en login solo significa contraseña mal, no token caducado)
    if (
      error.response && 
      error.response.status === 401 && 
      !error.config.url.includes('/auth/login')  &&
      !error.config.url.includes('/auth/register')
    ) {
      await SecureStore.deleteItemAsync('user_auth_token');
      // Aquí podrías disparar un evento de logout global si quisieras
    }
    return Promise.reject(error);
  },
);

export default api;
