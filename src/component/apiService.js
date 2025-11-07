// src/apiService.js
import axios from 'axios';
import { USERS } from './endpoint';

// ✅ Create Axios instance
const API = axios.create({
  baseURL: USERS,
  withCredentials: true,
});

// ✅ Reusable request helper
const tryRequest = async (endpoint, data, config = {}) => {
  try {
    const res = await API.post(endpoint, data, config);
    return res.data;
  } catch (err) {
    console.error(`${endpoint} error:`, err);
    throw new Error(err.response?.data?.message || 'Request failed');
  }
};

// ✅ Always backend
export const isBackendActive = true;

// ✅ SIGNUP FUNCTION
export const saveUser = async (userData) => {
  const formData = new FormData();
  for (const key in userData) formData.append(key, userData[key]);

  return await tryRequest('/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ✅ CHECK EMAIL
export const checkEmail = async (email) => {
  const res = await tryRequest('/check-email', { email });
  return res.status; // expect 'exists' or 'unavailable'
};

// ✅ LOGIN
export const loginUser = async ({ email, password }) => {
  const res = await API.post('/login', { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export default API;
// export { baseUrl };
