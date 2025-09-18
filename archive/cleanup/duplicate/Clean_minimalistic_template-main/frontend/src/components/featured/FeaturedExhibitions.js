/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React from 'react';

const exhibitions = [
  { title: 'Wiki Edit-a-thon', date: 'Sunday 12:00-16:00', desc: 'Art+Feminism: Wikipedia Edit-a-thon' },
  { title: 'Peter Saul in Conversation', date: 'Thursday 18:00', desc: 'With Massimiliano...' },
];

const FeaturedExhibitions = () => (
  <section style={{ padding: '2rem 0' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Exhibitions</h2>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
      {exhibitions.map((ex, idx) => (
        <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 300 }}>
          <div style={{ padding: '1rem' }}>
            <h3>{ex.title}</h3>
            <p>{ex.desc}</p>
            <span style={{ fontSize: '0.9rem', color: '#888' }}>{ex.date}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturedExhibitions;
