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
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        {/* Sidebar (hidden on auth pages) */}
        {!isAuthPage && (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )}

        {/* Main Content */}
        <div
          className="flex-grow-1 d-flex flex-column"
          style={{
            marginLeft: !isAuthPage && isSidebarOpen ? '220px' : '0',
            transition: 'margin-left 0.3s ease',
            backgroundColor: isAuthPage ? '#fff' : '#f8f9fa',
          }}
        >
          {/* ✅ Sticky Navbar */}
          {!isAuthPage && (
            <nav
              className="navbar navbar-dark sticky-top px-3 shadow-sm"
              style={{ backgroundColor: '#2C3E50', zIndex: 1000 }}
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

          {/* ✅ Page Routes */}
          <main className="flex-grow-1 p-4">
            <DataProvider>
              <Routes>
                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Pages */}
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
          </main>

          {/* ✅ Footer */}
          {!isAuthPage && (
            <footer
              className="text-center py-3 mt-auto"
              style={{
                backgroundColor: '#2C3E50',
                color: 'white',
                fontSize: '0.9rem',
              }}
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
