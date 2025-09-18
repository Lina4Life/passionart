import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedArtworks();
  }, []);

  const fetchFeaturedArtworks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/artworks/featured');
      const data = await response.json();
      if (data.success) {
        setFeaturedArtworks(data.featured || []);
      }
    } catch (error) {
      console.error('Error fetching featured artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "DIGITAL ART",
    "PHOTOGRAPHY", 
    "MIXED MEDIA",
    "INSTALLATIONS"
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: 'var(--space-3xl) var(--space-lg)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{ 
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-size-3xl)',
          fontWeight: '700',
          marginBottom: 'var(--space-md)',
          color: 'var(--text-primary)',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          PASSIONâ€”ART
        </h1>
        <p style={{ 
          fontSize: 'var(--font-size-base)',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
          letterSpacing: '1px'
        }}>
          CONTEMPORARY DIGITAL ART & FUTURE AESTHETICS
        </p>
      </section>

      {/* Categories */}
      <section style={{ 
        padding: 'var(--space-3xl) var(--space-lg)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--font-size-xl)',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 'var(--space-2xl)',
            color: 'var(--text-primary)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            EXPLORE CATEGORIES
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--border-color)'
          }}>
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-tile"
              >
                <h3>
                  {category}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ 
        padding: 'var(--space-3xl) var(--space-lg)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--font-size-xl)',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 'var(--space-2xl)',
            color: 'var(--text-primary)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            {t('home.featured_artworks')}
          </h2>
          
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--space-3xl)',
              color: 'var(--text-secondary)'
            }}>
              {t('common.loading')}
            </div>
          ) : featuredArtworks.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--space-3xl)',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ 
                fontSize: 'var(--font-size-2xl)', 
                marginBottom: 'var(--space-md)',
                opacity: 0.5 
              }}>
                ðŸŽ¨
              </div>
              <h3 style={{ marginBottom: 'var(--space-sm)' }}>No Featured Artworks Yet</h3>
              <p>Check back soon for amazing featured artworks from our community!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-xl)'
            }}>
              {featuredArtworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="product-card"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    height: '250px',
                    backgroundColor: 'var(--bg-secondary)',
                    backgroundImage: artwork.image_url ? `url(${artwork.image_url})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)'
                  }}>
                    {!artwork.image_url && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>ðŸŽ¨</div>
                        <div>No Image</div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 'var(--space-lg)' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--font-size-base)',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>
                      {artwork.title}
                    </h3>
                    <p style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--space-sm)',
                      letterSpacing: '1px'
                    }}>
                      BY {artwork.artist_name?.toUpperCase() || artwork.artist_username?.toUpperCase()}
                    </p>
                    {artwork.medium && (
                      <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-tertiary)',
                        marginBottom: 'var(--space-sm)',
                        fontStyle: 'italic'
                      }}>
                        {artwork.medium}
                      </p>
                    )}
                    {artwork.price && (
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: '700',
                        color: 'var(--accent-color)',
                        margin: '0',
                        letterSpacing: '1px'
                      }}>
                        ${parseFloat(artwork.price).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ 
        padding: 'var(--space-3xl) var(--space-lg)',
        textAlign: 'center',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--font-size-xl)',
            fontWeight: '600',
            marginBottom: 'var(--space-md)',
            color: 'var(--text-primary)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            STAY CONNECTED
          </h2>
          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-xl)',
            letterSpacing: '1px'
          }}>
            GET NOTIFIED ABOUT NEW RELEASES & EXHIBITIONS
          </p>
          <div style={{
            display: 'flex',
            gap: '1px',
            maxWidth: '400px',
            margin: '0 auto',
            backgroundColor: 'var(--border-color)'
          }}>
            <input
              type="email"
              placeholder="YOUR EMAIL"
              style={{
                flex: '1',
                padding: 'var(--space-md)',
                border: 'none',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-sm)',
                letterSpacing: '1px',
                outline: 'none'
              }}
            />
            <button
              className="subscribe-button"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

