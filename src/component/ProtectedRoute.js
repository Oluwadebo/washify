// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from './endpoint';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem('token'); // 🔥 add this

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${baseUrl}/users/validate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // withCredentials: true, // ✅ includes cookies in the request
        });
        if (res.data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Validation error:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, []);

  // ✅ Loading state
  if (loading) return <div className="text-center p-5">loading...</div>;

  // ✅ Not authenticated → redirect
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ✅ Authenticated → render page
  return children;
};

export default ProtectedRoute;
