import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { checkEmail, saveUser } from './apiService';

const Signup = () => {
  const navigate = useNavigate();
  const errorRef = useRef(null);

  const [form, setForm] = useState({
    FirstName: '',
    LastName: '',
    shopName: '',
    tell: '',
    address: '',
    email: '',
    password: '',
    logo: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'logo' && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setForm({ ...form, logo: reader.result }); // store base64
        setPreview(reader.result); // show preview
      };

      reader.readAsDataURL(file); // ✅ convert to base64
    } else {
      setForm({ ...form, [name]: value });

      if (name === 'email') {
        const trimmedEmail = value.trim().toLowerCase();
        if (!trimmedEmail) return setEmailStatus(null);

        setEmailStatus('checking');
        setTimeout(async () => {
          const status = await checkEmail(trimmedEmail);
          setEmailStatus(status);
        }, 400);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Object.values(form).some((v) => v === '' || v === null)) {
      setError('All fields are required!');
      return;
    }

    if (emailStatus === 'exists') {
      setError('This email is already registered. Please log in instead.');
      return;
    }

    setLoading(true);
    try {
      await saveUser({
        ...form,
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        logo: form.logo, // ✅ already base64 now
      });
      setLoading(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };
  const Inputfield = [
    {
      label: 'First Name',
      name: 'FirstName',
      type: 'text',
      placeholder: 'Enter your first name',
    },
    {
      label: 'Last Name',
      name: 'LastName',
      type: 'text',
      placeholder: 'Enter your last name',
    },
    {
      label: 'Shop Name',
      name: 'shopName',
      type: 'text',
      placeholder: 'Enter your shop name',
    },
    {
      label: 'Shop Address',
      name: 'address',
      type: 'text',
      placeholder: 'Enter your shop address',
    },
    {
      label: 'Shop Phone Number',
      name: 'tell',
      type: 'tel',
      placeholder: 'Enter your shop phone number',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'Enter your email',
    },
  ];

  return (
    <div
      className="d-flex justify-content-center align-items-center my-2"
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

        {error && (
          <div ref={errorRef} className="alert alert-danger py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Dynamic Fields */}
          <div className="row">
            {Inputfield.map((field) => (
              <div className="mb-3 col-12" key={field.name}>
                <label className="form-label fw-semibold">{field.label}</label>
                <input
                  type={field.type}
                  className={`form-control ${
                    field.name === 'email'
                      ? emailStatus === 'exists'
                        ? 'is-invalid'
                        : emailStatus === 'unavailable'
                        ? 'is-valid'
                        : ''
                      : ''
                  }`}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  disabled={loading}
                />

                {/* Email feedback */}
                {field.name === 'email' && (
                  <>
                    {emailStatus === 'checking' && (
                      <div className="form-text text-secondary">
                        Checking email availability...
                      </div>
                    )}
                    {emailStatus === 'exists' && (
                      <div className="invalid-feedback">
                        This email is already registered.
                      </div>
                    )}
                    {emailStatus === 'unavailable' && (
                      <div className="valid-feedback">Email is unused ✅</div>
                    )}
                  </>
                )}
              </div>
            ))}
            {/* Password Field */}
            <div className="mb-3 position-relative col-12">
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

            {/* Logo Upload */}
            <div className="mb-3 col-12">
              <label className="form-label fw-semibold">Upload Logo</label>
              <input
                type="file"
                className="form-control"
                name="logo"
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
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
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-100 text-white fw-semibold d-flex justify-content-center align-items-center"
            style={{ backgroundColor: '#2C3E50', height: '45px' }}
            disabled={
              loading || emailStatus === 'checking' || emailStatus === 'exists'
            }
          >
            {loading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></div>
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Already have an account?{' '}
          <Link
            to="/login"
            className="fw-semibold"
            style={{ color: '#2C3E50' }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
