// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from './endpoint';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
   const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem('token');

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
        setFadeIn(true);
      }
    };

    validateUser();
  }, []);

  // ✅ Loading state
  if (loading) return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status" style={{ width: '4rem', height: '4rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  // ✅ Not authenticated → redirect
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ✅ Authenticated → render page
  return <div className={`fade-in ${fadeIn ? 'visible' : ''}`}>{children}</div>;
};

export default ProtectedRoute;
