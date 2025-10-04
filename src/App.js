import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './component/Dashboard';
import Orders from './component/Orders';
import Expenses from './component/Expenses';
import Reports from './component/Reports';
import NotFound from './component/NotFound';
import Sidebar from './component/Sidebar';

function App() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

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

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isSidebarOpen ? '220px' : '0',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
        }}
      >
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
          <span className="navbar-brand mb-0 h5 text-light">
            Laundry Shop Admin
          </span>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<Dashboard orders={orders} expenses={expenses} />}
          />
          <Route
            path="/orders"
            element={<Orders orders={orders} setOrders={setOrders} />}
          />
          <Route
            path="/expenses"
            element={<Expenses expenses={expenses} setExpenses={setExpenses} />}
          />
          <Route
            path="/reports"
            element={<Reports orders={orders} expenses={expenses} />}
          />
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
