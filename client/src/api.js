import axios from 'axios';

// ⚠️ HARDCODED URL FOR ASSIGNMENT SUBMISSION
// This connects directly to your live Render Backend
const API_BASE_URL = 'https://deployment-and-devops-essentials-hcoh.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;