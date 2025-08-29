import api from '../lib/api';

export async function register(email: string, password: string): Promise<string> {
  const res = await api.post('/Auth/register', { email, password });
  const token: string = res.data?.token;
  if (token) localStorage.setItem('authToken', token);
  return token;
}

export async function login(email: string, password: string): Promise<string> {
  const res = await api.post('/Auth/login', { email, password });
  const token: string = res.data?.token;
  if (token) localStorage.setItem('authToken', token);
  return token;
}

export function logout() {
  localStorage.removeItem('authToken');
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken');
}
