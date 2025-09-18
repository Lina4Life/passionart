/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React from 'react';

const HeroSection = () => (
  <section style={{ background: 'linear-gradient(90deg, #d7263d 0%, #f46036 100%)', color: '#fff', padding: '4rem 2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Discover, Share, and Celebrate Art</h1>
    <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
      Explore featured exhibitions, connect with artists, and join our creative community.
    </p>
    <button style={{ background: '#fff', color: '#d7263d', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '2rem', cursor: 'pointer', fontWeight: 'bold' }}>
      View Exhibitions
    </button>
  </section>
);

export default HeroSection;
