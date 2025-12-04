import axios from 'axios';

const api = axios.create({
  // Ensure /api is at the end!
  baseURL: 'https://deployment-and-devops-essentials-hcoh.onrender.com/api', 
});

export default api;