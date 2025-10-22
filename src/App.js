import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './component/Dashboard';
import Orders from './component/Orders';
import Expenses from './component/Expenses';
import Reports from './component/Reports';
import NotFound from './component/NotFound';
import Sidebar from './component/Sidebar';
import { DataProvider } from './DataContext';
import Login from './component/Login';
import Signup from './component/Signup';
import ProtectedRoute from './component/ProtectedRoute';
import useUserProfile from './component/useUserProfile';
import './App.css';

function App() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch user profile
  const { user, loading } = useUserProfile();

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (loading) {
    // Show loading while fetching user
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        {!isAuthPage && user && (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} user={user} />
        )}

        {/* Main Content */}
        <div
          className="flex-grow-1 d-flex flex-column"
          style={{
            marginLeft: !isAuthPage && isSidebarOpen ? '230px' : '0',
            transition: 'margin-left 0.3s ease',
          }}
        >
          {/* Navbar */}
          {!isAuthPage && user && (
            <nav
              className="navbar navbar-expand-md navbar-dark sticky-top shadow-sm"
              style={{ backgroundColor: '#2C3E50', padding: '0.75rem 1rem' }}
            >
              <div className="container-fluid">
                <button
                  className="btn btn-outline-light d-md-none"
                  onClick={toggleSidebar}
                >
                  <i className="bi bi-list fs-3"></i>
                </button>
                <span className="navbar-brand fw-bold">
                  <i className="bi bi-shop me-2 text-success"></i> Washify Admin
                </span>
                <div className="ms-auto text-white d-flex align-items-center">
                  <img
                    src={user.logo || '/favicon.png'}
                    alt="Logo"
                    className="rounded-circle me-2"
                    style={{
                      width: '38px',
                      height: '38px',
                      border: '2px solid #1ABC9C',
                    }}
                    onError={(e) => (e.target.src = '/favicon.png')}
                  />
                  <span>{user.shopName || 'Laundry Shop'}</span>
                </div>
              </div>
            </nav>
          )}

          {/* Routes */}
          <main className="flex-grow-1 p-4">
            <DataProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard orders={orders} expenses={expenses} user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders orders={orders} setOrders={setOrders} user={user}  />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <ProtectedRoute>
                      <Expenses expenses={expenses} setExpenses={setExpenses} user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports orders={orders} expenses={expenses} user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route path="/dashboard" element={<Navigate to="/" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DataProvider>
          </main>

          {/* Footer */}
          {!isAuthPage && (
            <footer
              className="text-center py-3 mt-auto"
              style={{ backgroundColor: '#2C3E50', color: 'white' }}
            >
              © {new Date().getFullYear()} Washify | All Rights Reserved
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
