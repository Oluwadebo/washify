// src/endpoint.js
let baseUrl;
if (process.env.NODE_ENV == 'production') {
  baseUrl = 'https://washify-backend.onrender.com/api';
} else {
  baseUrl = 'http://localhost:5000/api'; // no trailing slash
}

export const USERS = `${baseUrl}/users`;
export const ORDERS = `${baseUrl}/orders`;
export const EXPENSES = `${baseUrl}/expenses`;
export { baseUrl };
