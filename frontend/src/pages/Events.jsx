import React from 'react';

const events = [
  { title: 'Artist Talk: Peter Saul', date: 'Thursday 18:00', desc: 'In conversation with Massimiliano.' },
  { title: 'Screening: Kenneth Tam', date: 'Saturday 20:00', desc: 'Screening and Q&A with the artist.' },
  { title: 'Art+Feminism Edit-a-thon', date: 'Sunday 12:00-16:00', desc: 'Collaborative Wikipedia editing event.' },
];

const Events = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Events</h1>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      {events.map((ev, idx) => (
        <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 320, marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{ev.title}</h2>
            <p style={{ color: '#888', marginBottom: '0.5rem' }}>{ev.date}</p>
            <p>{ev.desc}</p>
            <button style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', borderRadius: 4, border: 'none', background: '#f46036', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>RSVP</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Events;
