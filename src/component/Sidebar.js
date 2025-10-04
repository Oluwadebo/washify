import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  // ✅ Get user info from localStorage
  const storedUser = JSON.parse(localStorage.getItem('authUser'));
  const shopName = storedUser?.shopName || 'Laundry Shop';
  const logo = storedUser?.logo || '/images/brand.png';

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: 'bi-speedometer2' },
    { name: 'Orders', path: '/orders', icon: 'bi-cart-check' },
    { name: 'Expenses', path: '/expenses', icon: 'bi-cash-stack' },
    { name: 'Reports', path: '/reports', icon: 'bi-bar-chart' },
  ];

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  return (
    <div
      className="p-3 d-flex flex-column justify-content-between vh-100"
      style={{
        width: '230px',
        position: 'fixed',
        top: 0,
        left: isOpen ? '0' : '-230px',
        backgroundColor: '#2C3E50',
        color: '#fff',
        transition: 'left 0.3s ease',
        zIndex: 1000,
      }}
    >
      {/* ✅ Top Section - Brand (Dynamic) */}
      <div>
        <div className="text-center mb-3">
          <img
            src={logo}
            alt="Shop Logo"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #1ABC9C',
            }}
          />
          <h5
            className="mt-2 text-uppercase"
            style={{
              color: '#1ABC9C',
              fontWeight: '600',
              letterSpacing: '1px',
            }}
          >
            {shopName}
          </h5>
        </div>

        {/* ✅ Navigation Links */}
        <ul className="nav flex-column">
          {navLinks.map((link) => (
            <li className="nav-item mb-2" key={link.name}>
              <NavLink
                to={link.path}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                className={({ isActive }) =>
                  `nav-link-custom ${isActive ? 'active' : 'inactive'}`
                }
              >
                <i className={`bi ${link.icon} me-2`}></i>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Bottom Section - Logout */}
      <div className="mt-auto pt-3 border-top border-secondary">
        <button
          onClick={handleLogout}
          className="btn w-100 d-flex align-items-center justify-content-center text-white"
          style={{
            backgroundColor: '#1ABC9C',
            borderRadius: '8px',
            fontWeight: '600',
          }}
        >
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
