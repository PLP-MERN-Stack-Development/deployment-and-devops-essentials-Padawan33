import axios from 'axios';

// 🚀 CONFIG UPDATE: Pointing directly to your live Render Backend
const api = axios.create({
  baseURL: 'https://deployment-and-devops-essentials-hcoh.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;