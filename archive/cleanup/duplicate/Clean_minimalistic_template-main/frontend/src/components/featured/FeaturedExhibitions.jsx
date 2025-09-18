/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React from 'react';
import { Link } from 'react-router-dom';

const exhibitions = [
  {
    title: 'The Future of Digital Art',
    date: 'Sept 15 - Oct 30, 2025',
    desc: 'Exploring the intersection of technology and creativity in the digital age',
    image: 'https://images.unsplash.com/photo-1573152958734-1922c188fba3',
    location: 'Main Gallery Hall',
    curator: 'Dr. Sarah Chen'
  },
  {
    title: 'Contemporary Visions',
    date: 'Oct 1 - Nov 15, 2025',
    desc: 'A groundbreaking exhibition featuring emerging artists from around the globe',
    image: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73',
    location: 'East Wing Gallery',
    curator: 'James Wilson'
  },
  {
    title: 'Retrospective: Masters of Light',
    date: 'Sept 20 - Dec 1, 2025',
    desc: 'Celebrating the works of pioneering photographers from the 20th century',
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3',
    location: 'Photography Pavilion',
    curator: 'Maria Garcia'
  }
];

const FeaturedExhibitions = () => (
  <section style={{
    padding: '6rem 2rem',
    background: '#fff'
  }}>
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #d7263d 0%, #f46036 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Featured Exhibitions
        </h2>
        <Link to="/exhibitions" style={{
          background: 'transparent',
          color: '#d7263d',
          textDecoration: 'none',
          fontSize: '1.1rem',
          padding: '0.5rem 1.5rem',
          border: '1px solid #d7263d',
          borderRadius: '25px',
          transition: 'all 0.3s ease',
          ':hover': {
            background: 'rgba(215, 38, 61, 0.1)'
          }
        }}>
          View All Exhibitions
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem'
      }}>
        {exhibitions.map((ex, idx) => (
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
            <div style={{
              position: 'relative',
              height: '250px',
              overflow: 'hidden'
            }}>
              <img
                src={ex.image}
                alt={ex.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  ':hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                {ex.date}
              </div>
            </div>

            <div style={{
              padding: '2rem'
            }}>
              <div style={{
                color: '#d7263d',
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
              }}>
                {ex.location}
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1a1a1a'
              }}>
                {ex.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                marginBottom: '1rem',
                lineHeight: 1.6
              }}>
                {ex.desc}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.5rem'
              }}>
                <div style={{
                  color: '#888',
                  fontSize: '0.9rem'
                }}>
                  Curated by {ex.curator}
                </div>
                <Link to={`/exhibitions/${idx + 1}`} style={{
                  color: '#d7263d',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  ':hover': {
                    textDecoration: 'underline'
                  }
                }}>
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedExhibitions;
