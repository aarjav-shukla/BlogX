import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const getToken = (): string | null => {
  return localStorage.getItem('token') || localStorage.getItem('authorization');
};

export const setToken = (token: string, email?: string): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('authorization', token);
  if (email) {
    localStorage.setItem('user_email', email);
  }
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('authorization');
  localStorage.removeItem('user_email');
};

export const getUserEmail = (): string => {
  return localStorage.getItem('user_email') || 'Author User';
};

export const isAuthenticated = (): boolean => {
  return Boolean(getToken());
};

export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: token } : {};
};

// The backend signs JWTs as { id: <user id> } (backend/src/routes/user.ts).
// Decoding the payload (no verification needed — verification is the
// backend's job) lets the UI tell which stories belong to the signed-in
// contributor.
export const getAuthUserId = (): string | null => {
  const token = getToken();
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64)) as { id?: unknown };
    return typeof payload.id === 'string' ? payload.id : null;
  } catch {
    return null;
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization header automatically to all API calls
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

