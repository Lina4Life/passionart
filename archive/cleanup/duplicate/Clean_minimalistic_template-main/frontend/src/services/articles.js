/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const API_BASE_URL = 'http://localhost:3001/api';

// Articles API service
export const articlesAPI = {
  // Get all articles with pagination
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Get featured articles
  getFeatured: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/featured`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured articles');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      throw error;
    }
  },

  // Get article by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  // Get articles by category
  getByCategory: async (category, page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/category/${category}?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles by category');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      throw error;
    }
  },

  // Search articles
  search: async (query, category = null, page = 1, limit = 10) => {
    try {
      let url = `${API_BASE_URL}/articles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
      if (category && category !== 'ALL') {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to search articles');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  },

  // Increment article views
  incrementViews: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}/view`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to increment views');
      }
      return await response.json();
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Don't throw error for view tracking failures
    }
  }
};

export default articlesAPI;
