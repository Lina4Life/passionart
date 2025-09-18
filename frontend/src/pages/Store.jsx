import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/api';
import ShareButton from '../components/common/ShareButton';
import './Store_clean.css';

const Store = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch artworks from database
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const products = await getAllProducts();
        
        // Transform the database products to match expected artwork format
        const transformedArtworks = products
          .filter(product => product.status === 'available' || product.status === 'approved')
          .map(product => ({
            id: product.id,
            title: product.title || 'Untitled',
            artist: product.artistName || product.artist || 'Unknown Artist',
            price: `$${product.price}`,
            category: product.category || 'Mixed Media',
            image: product.image_url || '/uploads/1755864346013-908774130.jpg',
            description: product.description || 'No description available.',
            dimensions: 'Digital Art',
            medium: product.category || 'Digital Art',
            year: new Date(product.created_at || Date.now()).getFullYear().toString(),
            edition: 'Original'
          }));
        
        setArtworks(transformedArtworks);
        setError('');
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Failed to load artworks');
        // Fallback to some sample data if API fails
        setArtworks([
          {
            id: 1,
            title: "QUANTUM FLUX",
            artist: "ZARA NOVA",
            price: "$3,600",
            category: "Digital",
            image: "/uploads/1755864346013-908774130.jpg",
            description: "A mesmerizing exploration of quantum mechanics through digital artistry.",
            dimensions: "3840 x 2160 pixels",
            medium: "Digital Art, NFT",
            year: "2025",
            edition: "Limited Edition 1/10"
          },
          {
            id: 2,
            title: "URBAN FRAGMENTS",
            artist: "MAYA COLLAGE",
            price: "$850",
            category: "Collage",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
            description: "Mixed media collage exploring urban landscapes through layered paper and digital elements.",
            dimensions: "24\" x 18\"",
            medium: "Mixed Media Collage",
            year: "2024",
            edition: "Original"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  // Get unique categories from actual artworks
  const categories = useMemo(() => {
    return ['ALL', ...new Set(artworks.map(artwork => artwork.category))];
  }, [artworks]);

  // Filter artworks based on category and search query
  const filteredArtworks = useMemo(() => {
    return artworks.filter(artwork => {
      const matchesCategory = selectedCategory === 'ALL' || artwork.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, artworks]);

  const openModal = (artwork) => {
    setSelectedProduct(artwork);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handlePurchase = (artwork) => {
    // Navigate to payment page with artwork data
    navigate('/payment', {
      state: {
        type: 'artwork_purchase',
        artworkData: {
          id: artwork.id,
          title: artwork.title,
          artist: artwork.artist,
          price: artwork.price,
          image: artwork.image,
          description: artwork.description
        }
      }
    });
    closeModal();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <section style={{ 
        padding: 'var(--space-3xl) var(--space-lg) var(--space-2xl)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{ 
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-size-2xl)',
          fontWeight: '700',
          marginBottom: 'var(--space-md)',
          color: 'var(--text-primary)',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          OUR PIECES
        </h1>
        <p style={{ 
          fontSize: 'var(--font-size-base)',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          letterSpacing: '1px'
        }}>
          CURATED COLLECTION OF CONTEMPORARY DIGITAL ART
        </p>
      </section>

      {/* Search and Filter Section */}
      <section style={{ 
        padding: 'var(--space-xl) var(--space-lg)',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Search Bar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: 'var(--space-xl)' 
          }}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '500px' 
            }}>
              <input
                type="text"
                placeholder="Search artworks, artists, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-md) var(--space-lg)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'var(--font-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)',
                  letterSpacing: '1px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-color)';
                  e.target.style.outline = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                }}
              />
              <div style={{
                position: 'absolute',
                right: 'var(--space-md)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}>
                ðŸ”
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'var(--space-md)', 
            flexWrap: 'wrap' 
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: 'var(--space-sm) var(--space-lg)',
                  backgroundColor: selectedCategory === category ? 'var(--accent-color)' : 'transparent',
                  border: '1px solid var(--border-color)',
                  color: selectedCategory === category ? 'var(--bg-primary)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: '500',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.backgroundColor = 'var(--accent-color)';
                    e.target.style.borderColor = 'var(--accent-color)';
                    e.target.style.color = 'var(--bg-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.color = 'var(--text-primary)';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: 'var(--space-lg)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-sm)',
            letterSpacing: '1px'
          }}>
            {filteredArtworks.length} {filteredArtworks.length === 1 ? 'ARTWORK' : 'ARTWORKS'} FOUND
          </div>
        </div>
      </section>

      {/* Artworks Grid */}
      <section style={{ 
        padding: 'var(--space-3xl) var(--space-lg)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-xl)'
          }}>
            {loading ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: 'var(--space-3xl)',
                color: 'var(--text-secondary)'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: '600',
                  marginBottom: 'var(--space-md)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  LOADING ARTWORKS...
                </h3>
                <p style={{
                  fontSize: 'var(--font-size-base)',
                  letterSpacing: '1px'
                }}>
                  Please wait while we fetch the latest collection
                </p>
              </div>
            ) : error ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: 'var(--space-3xl)',
                color: 'var(--text-secondary)'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: '600',
                  marginBottom: 'var(--space-md)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#ff6b6b'
                }}>
                  ERROR LOADING ARTWORKS
                </h3>
                <p style={{
                  fontSize: 'var(--font-size-base)',
                  letterSpacing: '1px'
                }}>
                  {error}
                </p>
              </div>
            ) : filteredArtworks.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: 'var(--space-3xl)',
                color: 'var(--text-secondary)'
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: '600',
                  marginBottom: 'var(--space-md)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  NO ARTWORKS FOUND
                </h3>
                <p style={{
                  fontSize: 'var(--font-size-base)',
                  letterSpacing: '1px'
                }}>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="store-product-card"
              >
                <div style={{
                  height: '300px',
                  backgroundColor: 'var(--bg-secondary)',
                  backgroundImage: `url(${artwork.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 'var(--space-md)',
                    right: 'var(--space-md)',
                    backgroundColor: 'var(--accent-color)',
                    color: 'var(--bg-primary)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    fontSize: 'var(--font-size-xs)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    {artwork.category}
                  </div>
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
                    marginBottom: 'var(--space-md)',
                    letterSpacing: '1px'
                  }}>
                    BY {artwork.artist}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--space-sm)'
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: '0',
                      letterSpacing: '1px'
                    }}>
                      {artwork.price}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <ShareButton 
                        artwork={artwork} 
                        size="small" 
                        showText={false}
                      />
                      <button 
                        className="view-button"
                        onClick={() => openModal(artwork)}
                      >
                        VIEW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: 'var(--space-lg)'
        }} onClick={closeModal}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: 'var(--space-md)',
                right: 'var(--space-md)',
                background: 'none',
                border: 'none',
                fontSize: 'var(--font-size-xl)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                zIndex: 10,
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Ã—
            </button>

            {/* Product Image */}
            <div style={{
              height: '400px',
              backgroundImage: `url(${selectedProduct.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 'var(--space-md)',
                right: 'var(--space-md)',
                backgroundColor: 'var(--accent-color)',
                color: 'var(--bg-primary)',
                padding: 'var(--space-xs) var(--space-sm)',
                fontSize: 'var(--font-size-xs)',
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {selectedProduct.category}
              </div>
            </div>

            {/* Product Details */}
            <div style={{ padding: 'var(--space-2xl)' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: 'var(--space-2xl)',
                alignItems: 'start'
              }}>
                
                {/* Left Column - Details */}
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-sm)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                  }}>
                    {selectedProduct.title}
                  </h2>
                  
                  <p style={{
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-lg)',
                    letterSpacing: '1px',
                    fontFamily: 'var(--font-display)'
                  }}>
                    BY {selectedProduct.artist}
                  </p>

                  <p style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--text-primary)',
                    lineHeight: '1.6',
                    marginBottom: 'var(--space-xl)',
                    letterSpacing: '0.5px'
                  }}>
                    {selectedProduct.description}
                  </p>

                  {/* Technical Details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-md)',
                    marginBottom: 'var(--space-xl)'
                  }}>
                    <div>
                      <h4 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: '600',
                        color: 'var(--accent-color)',
                        marginBottom: 'var(--space-xs)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        Dimensions
                      </h4>
                      <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-secondary)',
                        margin: 0
                      }}>
                        {selectedProduct.dimensions}
                      </p>
                    </div>
                    
                    <div>
                      <h4 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: '600',
                        color: 'var(--accent-color)',
                        marginBottom: 'var(--space-xs)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        Medium
                      </h4>
                      <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-secondary)',
                        margin: 0
                      }}>
                        {selectedProduct.medium}
                      </p>
                    </div>
                    
                    <div>
                      <h4 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: '600',
                        color: 'var(--accent-color)',
                        marginBottom: 'var(--space-xs)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        Year
                      </h4>
                      <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-secondary)',
                        margin: 0
                      }}>
                        {selectedProduct.year}
                      </p>
                    </div>
                    
                    <div>
                      <h4 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: '600',
                        color: 'var(--accent-color)',
                        marginBottom: 'var(--space-xs)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        Edition
                      </h4>
                      <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-secondary)',
                        margin: 0
                      }}>
                        {selectedProduct.edition}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Purchase */}
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: 'var(--space-xl)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    textAlign: 'center',
                    marginBottom: 'var(--space-xl)'
                  }}>
                    <p style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--space-sm)',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>
                      Price
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: 0,
                      letterSpacing: '1px'
                    }}>
                      {selectedProduct.price}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePurchase(selectedProduct)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      backgroundColor: 'var(--accent-color)',
                      border: 'none',
                      color: 'var(--bg-primary)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--font-size-base)',
                      fontWeight: '600',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      marginBottom: 'var(--space-md)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--accent-color)';
                    }}
                  >
                    Purchase Now
                  </button>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    marginBottom: 'var(--space-md)'
                  }}>
                    <ShareButton 
                      artwork={selectedProduct} 
                      size="medium" 
                      showText={true}
                    />
                  </div>

                  <p style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    Secure payment â€¢ Instant digital delivery â€¢ Certificate of authenticity included
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;

