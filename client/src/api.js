import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://fintrack-backend-6n2p.onrender.com/api/v1'
      : 'http://localhost:8080/api/v1',
});

export default api;