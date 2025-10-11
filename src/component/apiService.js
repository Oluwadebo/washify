// src/api/apiService.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const isBackendActive = process.env.REACT_APP_USE_BACKEND === 'true';

/**
 * Check if email exists
 */
export const checkEmail = async (email) => {
  if (isBackendActive) {
    try {
      const res = await API.post('/check-email', { email });
      return res.data.exists ? 'exists' : 'unavailable';
    } catch (err) {
      console.error('Email check error:', err);
      return null;
    }
  } else {
    const storedUsers = JSON.parse(localStorage.getItem('AllUsers')) || [];
    return storedUsers.find((u) => u.email.toLowerCase() === email)
      ? 'exists'
      : 'unavailable';
  }
};

/**
 * Save new user
 */
export const saveUser = async (userData) => {
  if (isBackendActive) {
    const formData = new FormData();
    for (let key in userData) formData.append(key, userData[key]);
    return await API.post('/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } else {
    const storedUsers = JSON.parse(localStorage.getItem('AllUsers')) || [];
    storedUsers.push(userData);
    localStorage.setItem('AllUsers', JSON.stringify(storedUsers));
    return { status: 201 };
  }
};

/**
 * Login user
 */
export const loginUser = async ({ email, password }) => {
  if (isBackendActive) {
    try {
      const res = await API.post('/auth/login', { email, password });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Invalid credentials');
    }
  } else {
    const storedUsers = JSON.parse(localStorage.getItem('AllUsers')) || [];
    const user = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('No account found with this email. Please sign up.');
    if (user.password !== password) throw new Error('Incorrect password. Please try again.');
    return { user };
  }
};

export default API;
