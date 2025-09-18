/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React from 'react';

const testimonials = [
  { name: 'Jordan Casteel', text: 'PassionArt helped me connect with a vibrant community of artists.' },
  { name: 'Kate Cooper', text: 'The exhibitions are always inspiring and fresh!' },
];

const Testimonials = () => (
  <section style={{ padding: '2rem 0', background: '#fafafa' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Testimonials</h2>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
      {testimonials.map((t, idx) => (
        <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 300, padding: '1rem' }}>
          <p style={{ fontStyle: 'italic' }}>&quot;{t.text}&quot;</p>
          <div style={{ marginTop: '1rem', fontWeight: 'bold', color: '#d7263d' }}>{t.name}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
