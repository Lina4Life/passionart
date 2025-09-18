import React from 'react';

const HowItWorks = () => (
  <section style={{ padding: '2rem 0', background: '#fff' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>How It Works</h2>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
      <div style={{ maxWidth: 300 }}>
        <h3>1. Discover</h3>
        <p>Browse exhibitions and featured artworks curated for you.</p>
      </div>
      <div style={{ maxWidth: 300 }}>
        <h3>2. Connect</h3>
        <p>Join events, meet artists, and become part of our creative community.</p>
      </div>
      <div style={{ maxWidth: 300 }}>
        <h3>3. Share</h3>
        <p>Upload your own art and inspire others.</p>
      </div>
    </div>
  </section>
);

export default HowItWorks;

