import React from 'react';

const resources = [
  { title: 'How to Curate an Exhibition', desc: 'A step-by-step guide for aspiring curators.' },
  { title: 'Art History 101', desc: 'Explore the basics of art history and movements.' },
  { title: 'Digital Art Techniques', desc: 'Tips and tutorials for creating digital art.' },
];

const Learn = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Learn</h1>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      {resources.map((res, idx) => (
        <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 320, marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{res.title}</h2>
            <p>{res.desc}</p>
            <button style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', borderRadius: 4, border: 'none', background: '#0077ff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Read More</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Learn;
