// src/api.js
import axios from 'axios';
import { baseUrl } from './endpoint';
// import { toast } from 'react-toastify'; // optional for notifications

const API = axios.create({
  baseURL: baseUrl,
});

// ✅ Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized → logout
      localStorage.removeItem('token');
      window.location.href = '/login'; // redirect globally
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

export default API;
