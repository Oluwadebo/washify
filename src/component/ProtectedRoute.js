// src/components/ProtectedRoute.js
import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from './endpoint';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  const idleTimeout = useRef(null);
  const tokenCheckTimeout = useRef(null);

  // ✅ Set idle time in milliseconds (example: 2 hours)
  const idleTime = 2 * 60 * 60 * 1000;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // ✅ Validate token with backend
  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const res = await axios.get(`${baseUrl}/users/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.valid) return false;

      // Optional: check remaining time
      if (res.data.expiresAt) {
        const timeLeft = res.data.expiresAt * 1000 - Date.now();
        if (timeLeft <= 0) return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  // ✅ Reset idle timer & check token on activity
  const resetTimer = async () => {
    // Clear previous timers
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    if (tokenCheckTimeout.current) clearTimeout(tokenCheckTimeout.current);

    // Validate token before resetting idle timer
    const valid = await validateToken();
    if (!valid) {
      console.log('Token expired during activity. Logging out...');
      handleLogout();
      return;
    }

    // Start idle timer
    idleTimeout.current = setTimeout(() => {
      console.log('User idle. Logging out...');
      handleLogout();
    }, idleTime);
  };

  useEffect(() => {
    // Listen to user activity events
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start initial timer
    resetTimer();

    // Cleanup on unmount
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      if (tokenCheckTimeout.current) clearTimeout(tokenCheckTimeout.current);
    };
  }, []);

  useEffect(() => {
    // Validate token on initial load
    const initValidation = async () => {
      const valid = await validateToken();
      if (!valid) {
        handleLogout();
      } else {
        setIsAuthenticated(true);
        setLoading(false);
        setFadeIn(true);

        // Optional: auto-logout when token expires
        const token = localStorage.getItem('token');
        const res = await axios.get(`${baseUrl}/users/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.expiresAt) {
          const timeLeft = res.data.expiresAt * 1000 - Date.now();
          if (timeLeft > 0) {
            tokenCheckTimeout.current = setTimeout(() => {
              console.log('Token expired. Logging out...');
              handleLogout();
            }, timeLeft);
          } else {
            handleLogout();
          }
        }
      }
    };

    initValidation();
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
