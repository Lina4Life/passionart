/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React from 'react';

const FooterLinks = () => (
  <footer style={{ background: '#222', color: '#fff', padding: '2rem 0', textAlign: 'center', marginTop: '3rem' }}>
    <div style={{ marginBottom: '1rem' }}>
      <a href="#" style={{ color: '#fff', margin: '0 1rem' }}>About</a>
      <a href="#" style={{ color: '#fff', margin: '0 1rem' }}>Press</a>
      <a href="#" style={{ color: '#fff', margin: '0 1rem' }}>Contact</a>
      <a href="#" style={{ color: '#fff', margin: '0 1rem' }}>Support</a>
    </div>
    <div style={{ fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} PassionArt. All rights reserved.</div>
  </footer>
);

export default FooterLinks;
