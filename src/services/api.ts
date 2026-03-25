import axios from 'axios';

const api = axios.create({
  baseURL: 'https://respi.es', // Tu dominio
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;