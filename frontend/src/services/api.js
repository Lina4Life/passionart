import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const API_ORIGIN = (() => {
  try {
    const u = new URL(API_URL, window.location.origin);
    return u.origin;
  } catch {
    return '';
  }
})();

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

export const register = (email, password) =>
  api.post('/auth/register', { email, password }).then(r => r.data);

export const fetchArtworks = () =>
  api.get('/artworks').then(r => r.data);

export const uploadArtwork = (formData) =>
  api.post('/artworks/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export default api;
