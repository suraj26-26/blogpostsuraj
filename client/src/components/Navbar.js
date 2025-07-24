import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name  = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">MERN Blog</Link>
        <div>
          {token ? (
            <>
              <span className="me-3">Welcome, {name}</span>
              <Link className="btn btn-success me-2" to="/create">New Post</Link>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-primary me-2" to="/signin">Sign In</Link>
              <Link className="btn btn-primary" to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
