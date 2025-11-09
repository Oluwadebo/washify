import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from './apiService';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/');
      }
    };
    validateUser();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!form.email || !form.password)
        throw new Error('Please enter both email and password.');

      // ✅ Make API call to backend
      const data = await loginUser(form);

      // Just navigate on success
      if (data?.user) {
        window.location.href = '/';
        // navigate('/');
      } else {
        throw new Error('Invalid login response from server.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          Shop Admin
        </h4>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              disabled={loading}
            />
          </div>

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
              disabled={loading}
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
            className="btn w-100 text-white fw-semibold d-flex justify-content-center align-items-center"
            style={{ backgroundColor: '#2C3E50', height: '45px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></div>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don’t have an account?{' '}
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
