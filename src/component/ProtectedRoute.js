// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from './endpoint';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    const validateUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/users/validate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.valid) {
          setIsAuthenticated(true);
          if (res.data.expiresAt) {
            const timeLeft = res.data.expiresAt * 1000 - Date.now();
            if (timeLeft > 0) {
              setTimeout(() => {
                handleLogout();
              }, timeLeft);
            } else {
              handleLogout();
            }
          }
        } else {
          handleLogout();
        }
      } catch (err) {
        handleLogout();
      } finally {
        setLoading(false);
        setFadeIn(true);
      }
    };

    validateUser();
  }, []);

  // ✅ Loading state
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-success"
          role="status"
          style={{ width: '4rem', height: '4rem' }}
        >
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
