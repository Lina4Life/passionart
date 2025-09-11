/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user && user.email === 'admin@passionart.com';

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
        <li><NavLink to="/" style={linkStyle}>{t('nav.home')}</NavLink></li>
        <li><NavLink to="/community" style={linkStyle}>🎨 {t('nav.community')}</NavLink></li>
        {token && <li><NavLink to="/upload" style={linkStyle}>{t('nav.upload')}</NavLink></li>}
        {token && <li><NavLink to="/profile" style={linkStyle}>{t('nav.profile')}</NavLink></li>}
        {isAdmin && (
          <li>
            <NavLink 
              to="/admin" 
              style={({ isActive }) => ({
                ...linkStyle({ isActive }),
                background: isActive ? '#ff4444' : '#ff6b6b',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 1.25rem',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(255, 107, 107, 0.3)',
                transition: 'all 0.2s ease'
              })}
            >
              ⚡ {t('nav.admin')}
            </NavLink>
          </li>
        )}
        <li><LanguageSelector /></li>
        {!token && <li><NavLink to="/login" style={linkStyle}>{t('nav.login')}</NavLink></li>}
        {!token && <li><NavLink to="/register" style={linkStyle}>{t('nav.register')}</NavLink></li>}
        {token && <li><button onClick={logout} style={{ background: 'none', border: 'none', color: '#0077ff', cursor: 'pointer', fontWeight: 500, padding: '0.5rem 1rem' }}>{t('nav.logout')}</button></li>}
      </ul>
    </nav>
  );
}
