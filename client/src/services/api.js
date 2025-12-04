import axios from 'axios';

// 1. DEBUG LOG (Look for this in your browser console!)
console.log("🚀 API SERVICE LOADED - FORCE VERSION 5.0");

// 2. SETUP: Base URL is ONLY the domain (No /api here)
const api = axios.create({
  baseURL: 'https://deployment-and-devops-essentials-hcoh.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. INTERCEPTOR: Add Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. SERVICES: Manually add '/api' to every path

export const postService = {
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    // MANUAL FIX: We type /api/posts explicitly
    let url = `/api/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await api.get(url);
    return response.data;
  },
  createPost: async (postData) => {
    const response = await api.post('/api/posts', postData);
    return response.data;
  },
  getPost: async (id) => {
    const response = await api.get(`/api/posts/${id}`);
    return response.data;
  }
};

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  }
};

export const authService = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default api;