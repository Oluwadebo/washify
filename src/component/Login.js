import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('authUser');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === form.email && user.password === form.password) {
        navigate('/');
      } else {
        setError('Invalid email or password.');
      }
    } else {
      setError('No user found. Please sign up first.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '15px',
          borderTop: '5px solid #2C3E50',
        }}
      >
        <h4 className="text-center mb-4 fw-bold" style={{ color: '#2C3E50' }}>
          Laundry Shop Admin
        </h4>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password with Eye Icon */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <i
              className={`bi ${
                showPassword ? 'bi-eye-slash' : 'bi-eye'
              } position-absolute`}
              style={{
                right: '15px',
                top: '40px',
                cursor: 'pointer',
                color: '#2C3E50',
              }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <button
            type="submit"
            className="btn w-100 text-white fw-semibold"
            style={{ backgroundColor: '#2C3E50' }}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="fw-semibold"
            style={{ color: '#2C3E50' }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
