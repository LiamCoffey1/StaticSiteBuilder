import axios from 'axios';
import { getValidToken, handleExpiredToken } from './jwt';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'https://localhost:7158/api',
});

api.interceptors.request.use((config) => {
  // Allow unauthenticated endpoints (e.g., Auth) and requests when no token is present
  const rawToken = localStorage.getItem('authToken');
  if (!rawToken) return config;

  const token = getValidToken();
  if (!token) {
    // Token exists but is invalid/expired; clear and redirect
    handleExpiredToken();
    return Promise.reject(new axios.Cancel('Token expired'));
  }
  config.headers = config.headers || {};
  (config.headers as any).Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      handleExpiredToken();
    }
    return Promise.reject(error);
  }
);

export default api;
