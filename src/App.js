import './App.css';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
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
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('authUser'));
  } catch (err) {
    localStorage.removeItem('authUser'); // clear corrupted data
  }
  const logo = storedUser?.logo || '/favicon.png';
  const shopName = storedUser?.shopName || 'Laundry Shop';


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
              className="navbar navbar-expand-md navbar-dark sticky-top shadow-sm"
              style={{
                backgroundColor: '#2C3E50',
                padding: '0.75rem 1rem',
                zIndex: 1000,
              }}
            >
              <div className="container-fluid">
                {/* Sidebar Toggle */}
                <button
                  className="btn btn-outline-light d-md-none me-2"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <i className="bi bi-list fs-3"></i>
                </button>

                {/* Brand */}
                <span
                  className="navbar-brand d-flex align-items-center fw-bold"
                  style={{ fontSize: '1.3rem', letterSpacing: '0.5px' }}
                >
                  <i className="bi bi-shop me-2 text-success"></i> Washify Admin
                </span>

                {/* Search */}
                <form className="d-none d-md-flex ms-auto me-3">
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Search..."
                    style={{
                      width: '200px',
                      borderRadius: '20px',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                    }}
                  />
                </form>

                {/* User Actions */}
                <div className="d-flex align-items-center">

                  {/* User Dropdown */}
                  <div className="dropdown d-inline d-md-none">
                    <button
                      className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                      type="button"
                      id="userMenu"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <img
                        src={logo}
                        alt="Logo"
                        className="rounded-circle me-2"
                        onError={(e) => (e.target.src = '/favicon.png')}
                        style={{
                          width: '38px',
                          height: '38px',
                          objectFit: 'cover',
                          border: '2px solid #1ABC9C',
                        }}
                      />
                      <span className="fw-semibold">
                        {shopName}
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end shadow-sm"
                      aria-labelledby="userMenu"
                    >
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          <i className="bi bi-person me-2"></i> Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/settings">
                          <i className="bi bi-gear me-2"></i> Settings
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item text-danger">
                          <i className="bi bi-box-arrow-right me-2"></i> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-light me-3 position-relative"
                    style={{ borderRadius: '50%' }}
                  >
                    <i className="bi bi-bell fs-5"></i>
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.6rem' }}
                    >
                      3
                    </span>
                  </button>
                </div>
              </div>
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
