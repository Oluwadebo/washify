import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './component/Dashboard';
import Orders from './component/Orders';
import Expenses from './component/Expenses';
import Reports from './component/Reports';
import NotFound from './component/NotFound';
import Sidebar from './component/Sidebar';
import { DataProvider } from './DataContext';
import Login from './component/Login';
import Signup from './component/Signup';
import ProtectedRoute from './component/ProtectedRoute'; // ✅ NEW: added protection layer

function App() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  // Sidebar toggle for mobile
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Automatically adjust sidebar when resizing screen
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide sidebar and navbar on auth pages
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="d-flex">
      {/* Sidebar (hidden on auth pages) */}
      {!isAuthPage && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: !isAuthPage && isSidebarOpen ? '220px' : '0',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          backgroundColor: isAuthPage ? '#fff' : '#f8f9fa',
        }}
      >
        {/* Navbar (hidden on auth pages) */}
        {!isAuthPage && (
          <nav
            className="navbar navbar-dark px-3"
            style={{ backgroundColor: '#2C3E50' }}
          >
            <button
              className="btn btn-outline-light d-md-none"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <span className="navbar-brand mb-0 h5 text-light">Shop Admin</span>
          </nav>
        )}

        {/* Page Routes */}
        <DataProvider>
          <Routes>
            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Dashboard Pages */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard orders={orders} expenses={expenses} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders orders={orders} setOrders={setOrders} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Expenses expenses={expenses} setExpenses={setExpenses} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports orders={orders} expenses={expenses} />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<Navigate to="/" />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DataProvider>
      </div>
    </div>
  );
}

export default App;
