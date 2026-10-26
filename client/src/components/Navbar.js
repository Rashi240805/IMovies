import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black bg-opacity-75 sticky-top border-bottom border-secondary">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-warning d-flex align-items-center gap-2" to="/">
          <i className="bi bi-film"></i> IMovies
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Movies
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-bookings">
                  My Bookings
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-light-50 small">
                  <i className="bi bi-person-circle me-1 text-warning"></i>
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-light">
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm btn-warning">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
