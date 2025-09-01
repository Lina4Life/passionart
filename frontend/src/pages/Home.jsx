
import React from 'react';
import './Home.css';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      title: "DIGITAL DREAMS",
      artist: "ALEX CHEN",
      price: "$2,400",
      image: "/uploads/1755864346013-908774130.jpg"
    },
    {
      id: 2,
      title: "NEON GENESIS",
      artist: "MAYA SINGH",
      price: "$3,200",
      image: "/uploads/1755944589868-849827225.png"
    },
    {
      id: 3,
      title: "CYBER PUNK",
      artist: "DAVID MOON",
      price: "$1,800",
      image: "/uploads/1755864346013-908774130.jpg"
    },
    {
      id: 4,
      title: "MATRIX CODE",
      artist: "ELENA KORA",
      price: "$4,100",
      image: "/uploads/1755944589868-849827225.png"
    }
  ];

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
          PASSION—ART
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
            FEATURED WORKS
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-xl)'
          }}>
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  height: '250px',
                  backgroundColor: 'var(--bg-secondary)',
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
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
                    {product.title}
                  </h3>
                  <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-sm)',
                    letterSpacing: '1px'
                  }}>
                    BY {product.artist}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: '0',
                    letterSpacing: '1px'
                  }}>
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
