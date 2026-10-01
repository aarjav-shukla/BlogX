import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: token } : {};
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
