import React from 'react';

const events = [
  {
    title: 'Artist Talk: Peter Saul',
    date: 'September 28, 2025',
    time: '18:00 - 19:30',
    desc: 'Join us for an engaging conversation with renowned artist Peter Saul as he discusses his latest exhibition and creative process.',
    location: 'Main Gallery Auditorium',
    category: 'Talk',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2',
    speaker: 'Peter Saul',
    moderator: 'Massimiliano Gioni',
    capacity: 150,
    remaining: 45
  },
  {
    title: 'Experimental Film Night',
    date: 'September 30, 2025',
    time: '20:00 - 22:00',
    desc: 'A special screening of avant-garde films followed by an interactive Q&A session with filmmaker Kenneth Tam.',
    location: 'Screening Room',
    category: 'Screening',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
    speaker: 'Kenneth Tam',
    capacity: 80,
    remaining: 20
  },
  {
    title: 'Art+Feminism Wiki Edit-a-thon',
    date: 'October 1, 2025',
    time: '12:00 - 16:00',
    desc: "Join our community event to improve Wikipedia's coverage of women artists and art history. All experience levels welcome.",
    location: 'Digital Lab',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    facilitator: 'Sarah Chen',
    capacity: 40,
    remaining: 15
  },
  {
    title: 'Contemporary Art Symposium',
    date: 'October 5, 2025',
    time: '10:00 - 17:00',
    desc: 'A full-day symposium exploring current trends and future directions in contemporary art practice.',
    location: 'Conference Hall',
    category: 'Symposium',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    speakers: ['Dr. Maria Garcia', 'Prof. James Wilson', 'Lisa Chen'],
    capacity: 200,
    remaining: 75
  }
];

const Events = () => (
  <div style={{ 
    padding: '6rem 2rem',
    background: 'linear-gradient(to bottom, #f8f8f8 0%, #fff 100%)'
  }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '4rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          background: 'linear-gradient(90deg, #d7263d 0%, #f46036 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Upcoming Events
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Join us for exciting talks, workshops, and special events with leading artists and experts
        </p>
      </div>

      {/* Events Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem'
      }}>
        {events.map((ev, idx) => (
          <div key={idx} style={{
            background: '#fff',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            ':hover': {
              transform: 'translateY(-10px)'
            }
          }}>
            {/* Event Image */}
            <div style={{
              position: 'relative',
              height: '200px',
              overflow: 'hidden'
            }}>
              <img
                src={ev.image}
                alt={ev.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#d7263d',
                color: '#fff',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                {ev.category}
              </div>
            </div>

            {/* Event Content */}
            <div style={{ padding: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  background: 'rgba(215, 38, 61, 0.1)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  color: '#d7263d',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {ev.date}
                </div>
                <div style={{
                  marginLeft: '1rem',
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  {ev.time}
                </div>
              </div>

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                lineHeight: 1.3
              }}>
                {ev.title}
              </h2>

              <p style={{
                color: '#666',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: '1.5rem'
              }}>
                {ev.desc}
              </p>

              <div style={{
                borderTop: '1px solid #eee',
                paddingTop: '1.5rem',
                marginTop: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    <span style={{ marginRight: '0.5rem' }}>ðŸ“</span>
                    {ev.location}
                  </div>
                  <div style={{
                    color: ev.remaining < 20 ? '#d7263d' : '#666',
                    fontSize: '0.9rem'
                  }}>
                    {ev.remaining} spots left
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  padding: '1rem',
                  background: ev.remaining > 0 ? 'var(--text-primary)' : '#999',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: ev.remaining > 0 ? 'pointer' : 'not-allowed',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  if (ev.remaining > 0) {
                    e.target.style.backgroundColor = 'var(--accent-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (ev.remaining > 0) {
                    e.target.style.backgroundColor = 'var(--text-primary)';
                  }
                }}
                disabled={ev.remaining === 0}
              >
                  {ev.remaining > 0 ? 'RSVP Now' : 'Sold Out'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Events;

