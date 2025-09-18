/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section style={{ background: '#f46036', color: '#fff', padding: '2rem 0', textAlign: 'center' }}>
      <h2>Stay Updated</h2>
      <p>Sign up for our newsletter to get the latest news and events.</p>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
          required
          style={{ padding: '0.5rem 1rem', borderRadius: 4, border: 'none', marginRight: '1rem', fontSize: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1.5rem', borderRadius: 4, border: 'none', background: '#fff', color: '#f46036', fontWeight: 'bold', fontSize: '1rem' }}>Subscribe</button>
      </form>
      {submitted && <p style={{ marginTop: '1rem' }}>Thank you for subscribing!</p>}
    </section>
  );
};

export default NewsletterSignup;
