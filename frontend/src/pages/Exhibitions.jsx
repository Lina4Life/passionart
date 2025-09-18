import React from 'react';

const exhibitions = [
  { title: 'Screens Series: Kate Cooper', date: 'On view through April 5', desc: 'A vibrant digital exhibition exploring identity and technology.' },
  { title: 'Art in Partnership: Apple', date: 'Current', desc: 'Collaborative works between artists and Apple.' },
  { title: 'Wiki Edit-a-thon', date: 'Sunday 12:00-16:00', desc: 'Art+Feminism: Wikipedia Edit-a-thon.' },
];

const Exhibitions = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Exhibitions</h1>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      {exhibitions.map((ex, idx) => (
        <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 320, marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{ex.title}</h2>
            <p style={{ color: '#888', marginBottom: '0.5rem' }}>{ex.date}</p>
            <p>{ex.desc}</p>
            <button 
              style={{ 
                marginTop: '1rem', 
                padding: '0.5rem 1.5rem', 
                borderRadius: 4, 
                border: 'none', 
                background: 'var(--text-primary)', 
                color: '#fff', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-color)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--text-primary)';
              }}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Exhibitions;

