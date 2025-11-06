import React from 'react';

const NotFound = () => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        height: '100vh',
        background: '#0d1117',
        color: '#e5e7eb',
        margin: 0,
        padding: 0,
        zIndex: 9999,
      }}
    >
      <h1 className="fw-bold display-1 text-info">404</h1>
      <h3 className="fw-semibold mb-3">Page Not Found</h3>
      <p className="mb-4" style={{ maxWidth: '400px', color: '#94a3b8' }}>
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <a href="/" className="btn btn-info text-dark fw-bold shadow">
        ⬅ Back to Dashboard
      </a>
    </div>
  );
};

export default NotFound;
