import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card p-4 border-secondary shadow-lg">
            <h3 className="fw-bold text-center mb-4 text-warning">
              <i className="bi bi-box-arrow-in-right me-2"></i>Login
            </h3>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-light-50">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small text-light-50">Password</label>
                <input
                  type="password"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-warning w-100 fw-bold py-2 mb-3"
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center text-muted small mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-warning text-decoration-none">
                Register here
              </Link>
            </div>
            <div className="mt-3 p-2 bg-dark rounded border border-secondary text-center small text-light-50">
              Demo account: <code>demo@imovies.com</code> / <code>password123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
