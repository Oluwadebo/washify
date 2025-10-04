import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: 'bi-speedometer2' },
    { name: 'Orders', path: '/orders', icon: 'bi-cart-check' },
    { name: 'Expenses', path: '/expenses', icon: 'bi-cash-stack' },
    { name: 'Reports', path: '/reports', icon: 'bi-bar-chart' },
  ];

  return (
    <div
      className="p-3 vh-100"
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
      <div className="text-center mb-3">
        <img
          src="/images/brand.png"
          alt="Brand Logo"
          style={{ width: '60px', height: '60px', borderRadius: '50%' }}
        />
        <h5 className="mt-2" style={{ color: '#1ABC9C', fontWeight: '600' }}>
          Laundry Shop
        </h5>
      </div>
      {/* Header */}
      {/* <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ color: '#1ABC9C', fontWeight: 'bold' }}>Admin Panel</h4>
        <button
          className="btn btn-sm btn-outline-light d-md-none"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div> */}

      {/* Navigation Links */}
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
              <i className={`bi ${link.icon}`}></i>
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
