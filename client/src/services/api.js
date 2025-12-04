import axios from 'axios';

// 🚀 FIXED: Hardcoded URL *WITH* /api suffix
const API_URL = 'https://deployment-and-devops-essentials-hcoh.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  // Note: No default Content-Type header here. 
  // This allows the browser to automatically set 'multipart/form-data' for image uploads.
});

// 🧠 SMARTER TOKEN INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // 1. Try finding the token directly
    let token = localStorage.getItem('token');

    // 2. If not found, try finding it inside the 'userInfo' object
    // (This is where your AuthContext likely saves it)
    if (!token) {
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        try {
          const userInfo = JSON.parse(userInfoString);
          // Check if the token exists inside the object
          if (userInfo && userInfo.token) {
            token = userInfo.token;
          }
        } catch (error) {
          console.error("Error parsing userInfo for token:", error);
        }
      }
    }

    // 3. Attach the token if we found it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// --- SERVICES ---

export const postService = {
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await api.get(url);
    return response.data;
  },
  createPost: async (postData) => {
    // Axios handles the FormData headers automatically
    const response = await api.post('/posts', postData);
    return response.data;
  },
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  }
};

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      // Save token directly for easy access
      localStorage.setItem('token', response.data.token);
      // Save full user info for Context
      localStorage.setItem('userInfo', JSON.stringify(response.data)); 
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default api;