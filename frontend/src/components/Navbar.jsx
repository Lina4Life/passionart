
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#0077ff' : '#222',
    fontWeight: isActive ? 700 : 500,
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: 4,
    background: isActive ? '#f0f7ff' : 'none',
  });

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '0.5rem 2rem', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
        <li><NavLink to="/" style={linkStyle}>Gallery</NavLink></li>
        {token && <li><NavLink to="/upload" style={linkStyle}>Upload</NavLink></li>}
        {token && <li><NavLink to="/profile" style={linkStyle}>Profile</NavLink></li>}
        {!token && <li><NavLink to="/login" style={linkStyle}>Login</NavLink></li>}
        {!token && <li><NavLink to="/register" style={linkStyle}>Register</NavLink></li>}
        {token && <li><button onClick={logout} style={{ background: 'none', border: 'none', color: '#0077ff', cursor: 'pointer', fontWeight: 500, padding: '0.5rem 1rem' }}>Logout</button></li>}
      </ul>
    </nav>
  );
}
