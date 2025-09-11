/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => (
  <section style={{
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 2rem',
    background: 'linear-gradient(160deg, #000000 0%, #1a1a1a 100%)',
    overflow: 'hidden'
  }}>
    {/* Background Art Grid */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      background: `
        linear-gradient(to right, #d7263d 1px, transparent 1px),
        linear-gradient(to bottom, #d7263d 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }} />

    {/* Content */}
    <div style={{
      position: 'relative',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      color: '#fff'
    }}>
      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        lineHeight: 1.2,
        background: 'linear-gradient(90deg, #d7263d 0%, #f46036 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'fadeInUp 0.8s ease'
      }}>
        Discover, Share, and<br />Celebrate Art
      </h1>

      <p style={{
        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
        marginBottom: '3rem',
        maxWidth: '800px',
        margin: '0 auto 3rem',
        lineHeight: 1.6,
        color: 'rgba(255, 255, 255, 0.9)'
      }}>
        Explore our curated exhibitions, connect with visionary artists,<br />
        and be part of a thriving creative community.
      </p>

      <div style={{
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        marginTop: '2.5rem'
      }}>
        <Link to="/exhibitions" style={{
          background: 'linear-gradient(90deg, #d7263d 0%, #f46036 100%)',
          color: '#fff',
          padding: '1rem 2.5rem',
          fontSize: '1.1rem',
          borderRadius: '3rem',
          textDecoration: 'none',
          fontWeight: '500',
          boxShadow: '0 4px 15px rgba(215, 38, 61, 0.3)',
          transition: 'all 0.3s ease',
          transform: 'translateY(0)',
          ':hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 20px rgba(215, 38, 61, 0.4)'
          }
        }}>
          View Exhibitions
        </Link>
        <Link to="/learn" style={{
          background: 'transparent',
          color: '#f46036',
          padding: '1rem 2.5rem',
          fontSize: '1.1rem',
          borderRadius: '3rem',
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'all 0.3s ease',
          border: '2px solid #f46036',
          boxShadow: '0 4px 15px rgba(244, 96, 54, 0.2)',
          ':hover': {
            background: 'rgba(244, 96, 54, 0.1)',
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 20px rgba(244, 96, 54, 0.3)'
          }
        }}>
          Learn More
        </Link>
      </div>

      {/* Featured Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '4rem',
        marginTop: '5rem',
        color: '#fff'
      }}>
        {[
          { number: '1,000+', label: 'Artworks' },
          { number: '500+', label: 'Artists' },
          { number: '50+', label: 'Exhibitions' }
        ].map((stat, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #d7263d 0%, #f46036 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {stat.number}
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: '0.5rem'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Decorative Elements */}
    <div style={{
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'rgba(255, 255, 255, 0.3)',
      fontSize: '1.5rem'
    }}>
      ↓
    </div>
  </section>
);

export default HeroSection;
