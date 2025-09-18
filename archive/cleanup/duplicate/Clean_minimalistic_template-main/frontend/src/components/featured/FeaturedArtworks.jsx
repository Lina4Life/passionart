/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShareButton from '../common/ShareButton';

const artworks = [
  {
    title: 'Urban Reflection',
    artist: 'Kate Cooper',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    desc: 'Contemporary Urban Photography',
    category: 'Photography'
  },
  {
    title: 'Mountain Serenity',
    artist: 'James Wilson',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    desc: 'Landscape Photography',
    category: 'Photography'
  },
  {
    title: 'Abstract Dreams',
    artist: 'Sarah Chen',
    img: 'https://images.unsplash.com/photo-1579783483458-83d02161294e',
    desc: 'Abstract Expressionism',
    category: 'Painting'
  },
  {
    title: 'Desert Nights',
    artist: 'Mohammed Ali',
    img: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    desc: 'Night Photography',
    category: 'Photography'
  },
  {
    title: 'Digital Analog',
    artist: 'Maya Thompson',
    img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
    desc: 'Contemporary Mixed Media Collage',
    category: 'Collage'
  }
];

const FeaturedArtworks = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section style={{
      padding: '6rem 2rem',
      background: '#0a0a0a',
      color: '#fff'
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
            background: 'linear-gradient(90deg, #fff 0%, #ccc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Featured Artworks
          </h2>
          <Link to="/gallery" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '1.1rem',
            padding: '0.5rem 1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            ':hover': {
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}>
            View All
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          padding: '1rem'
        }}>
          {artworks.map((art, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: hoveredIndex === idx ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={art.img}
                alt={art.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  transition: 'all 0.3s ease',
                  filter: hoveredIndex === idx ? 'brightness(50%)' : 'brightness(80%)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                transform: hoveredIndex === idx ? 'translateY(0)' : 'translateY(20px)',
                opacity: hoveredIndex === idx ? 1 : 0.8,
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#d7263d',
                  marginBottom: '0.5rem'
                }}>
                  {art.category}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>
                  {art.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '0.5rem'
                }}>
                  by {art.artist}
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: hoveredIndex === idx ? 'block' : 'none',
                  marginBottom: '1rem'
                }}>
                  {art.desc}
                </p>
                <div style={{
                  display: hoveredIndex === idx ? 'flex' : 'none',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  <ShareButton 
                    artwork={{
                      id: idx + 1,
                      title: art.title,
                      artist: art.artist,
                      image: art.img,
                      description: art.desc,
                      price: 'Contact for pricing'
                    }} 
                    size="small" 
                    showText={false}
                    className="featured-share-btn"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworks;
