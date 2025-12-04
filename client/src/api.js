import axios from 'axios';

// TEMP FIX: Hardcode the URL to ensure connection
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_BASE_URL = 'https://deployment-and-devops-essentials-hcoh.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;