import React from 'react';

const products = [
  { title: 'Art Print: Dreamscape', price: '$30', desc: 'High-quality print of a featured artwork.' },
  { title: 'Book: Modern Artists', price: '$18', desc: 'A curated book about contemporary artists.' },
  { title: 'Sticker Pack', price: '$5', desc: 'Fun art stickers for your laptop or sketchbook.' },
];

const Store = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Store</h1>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      {products.map((prod, idx) => (
        <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 320, marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{prod.title}</h2>
            <p style={{ color: '#888', marginBottom: '0.5rem' }}>{prod.price}</p>
            <p>{prod.desc}</p>
            <button style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', borderRadius: 4, border: 'none', background: '#d7263d', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Store;
