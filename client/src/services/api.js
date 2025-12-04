import axios from 'axios';

// 1. Setup the Base Connection to Render
const api = axios.create({
  // Hardcoded Render URL for assignment submission
  baseURL: 'https://deployment-and-devops-essentials-hcoh.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add Token to Requests (Interceptor)
// This automatically adds your login token to every request (needed for creating posts)
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

// 3. Define the Services

// --- Post Service (Handles all blog post actions) ---
export const postService = {
  // Get all posts (public)
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Create a post (protected)
  createPost: async (postData) => {
    // Note: If sending a file (image), the header content-type might need to be multipart/form-data
    // But usually axios handles that if you pass FormData. 
    // For raw JSON:
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Get single post
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  }
};

// --- Category Service ---
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};

// --- Auth Service ---
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
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