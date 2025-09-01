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

// Admin API functions
export const getAdminStats = () =>
  api.get('/admin/stats').then(r => r.data);

export const getAllUsers = () =>
  api.get('/admin/users').then(r => r.data);

export const createUser = (userData) =>
  api.post('/admin/users', userData).then(r => r.data);

export const createProduct = (productData) => {
  // Check if productData is FormData (file upload) or regular object
  if (productData instanceof FormData) {
    return api.post('/admin/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  } else {
    return api.post('/admin/products', productData).then(r => r.data);
  }
};

export const updateProductStatus = (productId, status) =>
  api.put(`/admin/products/${productId}/status`, { status }).then(r => r.data);

export const deleteProduct = (productId) =>
  api.delete(`/admin/products/${productId}`).then(r => r.data);

export const getAllProducts = () =>
  api.get('/admin/products').then(r => r.data);

export const getAllArticles = () =>
  fetch('http://localhost:5000/api/articles?limit=100')
    .then(r => r.json())
    .then(data => {
      const articles = data.articles || [];
      // Transform to match admin dashboard format
      return articles.map(article => ({
        id: article.id.toString(),
        title: article.title,
        author_email: article.author_email || 'admin@passionart.com',
        status: 'published',
        published_at: article.published_at,
        created_at: article.created_at || article.published_at,
        views: article.views || 0
      }));
    });

export const getAllOrders = () =>
  api.get('/admin/orders').then(r => r.data);

export default api;
