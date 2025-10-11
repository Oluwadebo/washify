import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🔹 Try backend validation first
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth/validate';
        const authUser = JSON.parse(localStorage.getItem('authUser')) || JSON.parse(sessionStorage.getItem('authUser'));

        if (!authUser) {
          setIsAuthenticated(false);
          return;
        }

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: authUser.email }),
        });

        if (!response.ok) throw new Error('Backend validation failed');

        const data = await response.json();
        // ✅ If backend validates the user
        if (data.valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authUser');
          sessionStorage.removeItem('authUser');
          setIsAuthenticated(false);
        }
      } catch (err) {
        // 🔹 If backend is down or fetch fails, fallback to localStorage
        const fallbackUser = JSON.parse(localStorage.getItem('authUser')) || JSON.parse(sessionStorage.getItem('authUser'));
        setIsAuthenticated(!!fallbackUser?.email);
      }
    };

    checkAuth();
  }, []);

  // 🔹 While checking, render nothing or a loader
  if (isAuthenticated === null) return <div>Loading...</div>;

  // 🔹 If not authenticated, redirect
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 🔹 Authenticated
  return children;
};

export default ProtectedRoute;
