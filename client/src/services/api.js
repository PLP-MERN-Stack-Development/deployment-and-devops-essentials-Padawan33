import axios from 'axios';

// 🛑 FORCE HARDCODED URL WITH /api SUFFIX
// The error happened because '/api' was missing from this line
const api = axios.create({
  baseURL: 'https://deployment-and-devops-essentials-hcoh.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export the authService that RegisterPage uses
export const authService = {
  register: async (userData) => {
    // This combines with baseURL to make: ...onrender.com/api/auth/register
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