import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ArtistRecommendations.css';

const ArtistRecommendations = ({ currentArtistId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationType, setRecommendationType] = useState('similar');

  const recommendationTypes = [
    { value: 'similar', label: 'ðŸŽ¨ Similar Style', description: 'Artists with similar artistic styles' },
    { value: 'trending', label: 'ðŸ”¥ Trending Now', description: 'Currently popular artists' },
    { value: 'new', label: 'â­ New Artists', description: 'Recently joined talented artists' },
    { value: 'local', label: 'ðŸ“ Local Artists', description: 'Artists from your area' },
    { value: 'followed', label: 'ðŸ‘¥ Community Picks', description: 'Artists followed by similar users' }
  ];

  useEffect(() => {
    fetchRecommendations();
  }, [currentArtistId, recommendationType]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/artists/recommendations?type=${recommendationType}&excludeId=${currentArtistId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowArtist = async (artistId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/artists/${artistId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Update the recommendation state to reflect the follow
        setRecommendations(prev => 
          prev.map(artist => 
            artist.id === artistId 
              ? { ...artist, is_following: !artist.is_following }
              : artist
          )
        );
      }
    } catch (error) {
      console.error('Error following artist:', error);
    }
  };

  const getVerificationBadge = (artist) => {
    if (artist.verification_status === 'verified') {
      return <span className="verification-badge">âœ…</span>;
    }
    return null;
  };

  const formatFollowerCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count?.toString() || '0';
  };

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h2>ðŸŒŸ Discover Artists</h2>
          <div className="loading-spinner">Loading recommendations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <div className="header-content">
          <h2>ðŸŒŸ Discover Artists</h2>
          <p>Find amazing artists you might love</p>
        </div>

        <div className="recommendation-types">
          {recommendationTypes.map(type => (
            <button
              key={type.value}
              className={`type-btn ${recommendationType === type.value ? 'active' : ''}`}
              onClick={() => setRecommendationType(type.value)}
              title={type.description}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="no-recommendations">
          <div className="no-recommendations-icon">ðŸŽ¨</div>
          <h3>No recommendations found</h3>
          <p>Try selecting a different recommendation type</p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map(artist => (
            <div key={artist.id} className="artist-recommendation-card">
              <div className="artist-card-header">
                <div className="artist-avatar">
                  <img 
                    src={artist.profile_picture || '/default-avatar.png'} 
                    alt={artist.username}
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  {artist.is_online && <div className="online-indicator"></div>}
                </div>
                <div className="artist-basic-info">
                  <h3>
                    {artist.first_name && artist.last_name 
                      ? `${artist.first_name} ${artist.last_name}`
                      : artist.username
                    }
                    {getVerificationBadge(artist)}
                  </h3>
                  <p className="artist-specialty">{artist.art_specialty || 'Digital Artist'}</p>
                  <p className="artist-location">
                    {artist.location ? `ðŸ“ ${artist.location}` : 'ðŸŒ Global'}
                  </p>
                </div>
              </div>

              <div className="artist-preview">
                {artist.featured_artworks && artist.featured_artworks.length > 0 ? (
                  <div className="artwork-preview">
                    {artist.featured_artworks.slice(0, 3).map((artwork, index) => (
                      <div key={artwork.id} className="preview-artwork">
                        <img 
                          src={artwork.image_url} 
                          alt={artwork.title}
                          onError={(e) => {
                            e.target.src = '/placeholder-artwork.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-artworks-preview">
                    <span>ðŸŽ¨</span>
                    <p>No artworks yet</p>
                  </div>
                )}
              </div>

              <div className="artist-stats">
                <div className="stat">
                  <span className="stat-icon">ðŸŽ¨</span>
                  <div className="stat-content">
                    <span className="stat-value">{artist.artwork_count || 0}</span>
                    <span className="stat-label">Artworks</span>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon">ðŸ‘¥</span>
                  <div className="stat-content">
                    <span className="stat-value">{formatFollowerCount(artist.follower_count || 0)}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon">â­</span>
                  <div className="stat-content">
                    <span className="stat-value">{artist.average_rating || 'N/A'}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>
              </div>

              {artist.bio && (
                <div className="artist-bio">
                  <p>{artist.bio}</p>
                </div>
              )}

              {artist.tags && artist.tags.length > 0 && (
                <div className="artist-tags">
                  {artist.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="artist-tag">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="artist-actions">
                <Link 
                  to={`/artist/${artist.id}`}
                  className="view-profile-btn"
                >
                  ðŸ‘ï¸ View Profile
                </Link>
                <button
                  className={`follow-btn ${artist.is_following ? 'following' : ''}`}
                  onClick={() => handleFollowArtist(artist.id)}
                >
                  {artist.is_following ? 'âœ… Following' : 'âž• Follow'}
                </button>
              </div>

              {artist.recent_activity && (
                <div className="recent-activity">
                  <span className="activity-indicator">ðŸ”¥</span>
                  <span className="activity-text">{artist.recent_activity}</span>
                </div>
              )}

              {/* Recommendation reason */}
              <div className="recommendation-reason">
                {recommendationType === 'similar' && 'ðŸŽ¨ Similar artistic style'}
                {recommendationType === 'trending' && 'ðŸ”¥ Trending in community'}
                {recommendationType === 'new' && 'â­ New talent to discover'}
                {recommendationType === 'local' && 'ðŸ“ From your area'}
                {recommendationType === 'followed' && 'ðŸ‘¥ Loved by similar users'}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="recommendations-footer">
        <button 
          className="load-more-btn"
          onClick={fetchRecommendations}
        >
          ðŸ”„ Refresh Recommendations
        </button>
        <p className="footer-text">
          Recommendations are personalized based on your interests and activity
        </p>
      </div>
    </div>
  );
};

export default ArtistRecommendations;

