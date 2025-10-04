import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    shopName: '',
    email: '',
    password: '',
    logo: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'logo' && files.length > 0) {
      const file = files[0];
      setForm({ ...form, logo: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName || !form.shopName || !form.email || !form.password) {
      setError('All fields are required!');
      return;
    }

    // Convert logo to base64 before storing
    if (form.logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const userData = {
          ...form,
          logo: reader.result,
        };
        localStorage.setItem('authUser', JSON.stringify(userData));
        navigate('/login');
      };
      reader.readAsDataURL(form.logo);
    } else {
      localStorage.setItem('authUser', JSON.stringify(form));
      navigate('/login');
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
          maxWidth: '430px',
          borderRadius: '15px',
          borderTop: '5px solid #2C3E50',
        }}
      >
        <h4 className="text-center mb-4 fw-bold" style={{ color: '#2C3E50' }}>
          Create Your Business Account
        </h4>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Shop Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Shop Name</label>
            <input
              type="text"
              className="form-control"
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              placeholder="Enter your laundry shop name"
              required
            />
          </div>

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
              className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute`}
              style={{
                right: '15px',
                top: '40px',
                cursor: 'pointer',
                color: '#2C3E50',
              }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* Logo Upload */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Upload Logo</label>
            <input
              type="file"
              className="form-control"
              name="logo"
              accept="image/*"
              onChange={handleChange}
              required
            />
            {preview && (
              <div className="text-center mt-3">
                <img
                  src={preview}
                  alt="Logo Preview"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #2C3E50',
                  }}
                />
                <p className="small text-muted mt-1">Logo Preview</p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn w-100 text-white fw-semibold"
            style={{ backgroundColor: '#2C3E50' }}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Already have an account?{' '}
          <Link to="/login" className="fw-semibold" style={{ color: '#2C3E50' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
