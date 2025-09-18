import React from 'react';

const artworks = [
  { title: 'Kate Cooper', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', desc: 'Screens Series' },
  { title: 'Art in Partnership', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', desc: 'Apple Collaboration' },
];

const FeaturedArtworks = () => (
  <section style={{ padding: '2rem 0', background: '#fafafa' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Artworks</h2>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
      {artworks.map((art, idx) => (
        <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 300 }}>
          <img src={art.img} alt={art.title} style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, height: 180, objectFit: 'cover' }} />
          <div style={{ padding: '1rem' }}>
            <h3>{art.title}</h3>
            <p>{art.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturedArtworks;

