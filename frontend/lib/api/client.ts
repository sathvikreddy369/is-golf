import axios from 'axios';
import { isTokenExpired } from '../auth/jwt';
import { tokenStorage } from '../auth/token';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
