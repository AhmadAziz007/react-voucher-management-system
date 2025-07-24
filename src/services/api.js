import axios from 'axios';

const api = axios.create({
  baseURL: '/api/',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  console.log('Request:', config.method, config.url, config.data);
  return config;
});

api.interceptors.response.use(response => {
  console.log('Response:', response.status, response.data);
  return response;
}, error => {
  console.error('API Error:', error);
  return Promise.reject(error);
});

export default api;