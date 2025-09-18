import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ShareButton from '../components/common/ShareButton';
import SocialMediaLinks from '../components/common/SocialMediaLinks';
import './ArtistProfile.css';

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    fetchArtistProfile();
    fetchArtistArtworks();
    if (user) {
      checkFollowStatus();
      fetchFollowCounts();
    }
  }, [id, user]);

  const fetchArtistProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setArtist(data.user);
      } else {
        console.error('Failed to fetch artist profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching artist profile:', error);
    }
  };

  const fetchArtistArtworks = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/artworks/artist/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setArtworks(data.artworks || []);
      }
    } catch (error) {
      console.error('Error fetching artist artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/profile/following', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setIsFollowing(data.following.some(f => f.id === parseInt(id)));
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const fetchFollowCounts = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        fetch(`http://localhost:3001/api/user/${id}/followers`),
        fetch(`http://localhost:3001/api/user/${id}/following`)
      ]);

      const followersData = await followersRes.json();
      const followingData = await followingRes.json();

      if (followersRes.ok) setFollowers(followersData.count || 0);
      if (followingRes.ok) setFollowing(followingData.count || 0);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      
      const response = await fetch(`http://localhost:3001/api/profile/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: parseInt(id) })
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setFollowers(prev => isFollowing ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const getArtistDisplayName = () => {
    if (artist?.first_name && artist?.last_name) {
      return `${artist.first_name} ${artist.last_name}`;
    }
    return artist?.username || 'Unknown Artist';
  };

  const getArtistInitials = () => {
    if (artist?.first_name && artist?.last_name) {
      return `${artist.first_name[0]}${artist.last_name[0]}`.toUpperCase();
    }
    if (artist?.username) {
      return artist.username.substring(0, 2).toUpperCase();
    }
    return 'UA';
  };

  const getProfilePictureUrl = () => {
    if (artist?.profile_picture) {
      return `http://localhost:3001/uploads/profile-pictures/${artist.profile_picture}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`artist-profile-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className={`artist-profile-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="error-state">
          <h2>Artist Not Found</h2>
          <p>The artist you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/artists')} className="back-btn">
            Back to Artists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`artist-profile-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="artist-profile-header">
        <div className="artist-cover">
          <div className="artist-main-info">
            <div className="artist-avatar-large">
              {getProfilePictureUrl() ? (
                <img 
                  src={getProfilePictureUrl()} 
                  alt={getArtistDisplayName()}
                  className="avatar-image-large"
                />
              ) : (
                <div className="avatar-placeholder-large">
                  {getArtistInitials()}
                </div>
              )}
            </div>
            
            <div className="artist-details">
              <h1 className="artist-name-large">{getArtistDisplayName()}</h1>
              <p className="artist-username-large">@{artist.username}</p>
              <span className="artist-type-badge">{artist.user_type}</span>
              
              {artist.bio && (
                <p className="artist-bio-large">{artist.bio}</p>
              )}
              
              {/* Social Media Links */}
              {artist.social_media && (
                <div className="artist-social-media">
                  <SocialMediaLinks socialMedia={artist.social_media} size="large" />
                </div>
              )}
              
              <div className="artist-stats">
                <div className="stat">
                  <span className="stat-number">{artworks.length}</span>
                  <span className="stat-label">Artworks</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{followers}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{following}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
              
              <div className="artist-actions-large">
                <button
                  className="back-btn"
                  onClick={() => navigate('/artists')}
                >
                  â† Back to Artists
                </button>
                
                {user && user.email !== artist.email && (
                  <button
                    className={`follow-btn-large ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'âœ“ Following' : '+ Follow'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="artist-content">
        <div className="content-section">
          <h2>ðŸŽ¨ Artworks</h2>
          
          {artworks.length === 0 ? (
            <div className="empty-artworks">
              <p>This artist hasn't uploaded any artworks yet.</p>
            </div>
          ) : (
            <div className="artworks-grid">
              {artworks.map(artwork => (
                <div key={artwork.id} className="artwork-card">
                  <div className="artwork-image">
                    {artwork.image_url ? (
                      <img 
                        src={`http://localhost:3001${artwork.image_url}`} 
                        alt={artwork.title}
                      />
                    ) : (
                      <div className="artwork-placeholder">
                        ðŸŽ¨
                      </div>
                    )}
                  </div>
                  
                  <div className="artwork-info">
                    <h3 className="artwork-title">{artwork.title}</h3>
                    {artwork.description && (
                      <p className="artwork-description">{artwork.description}</p>
                    )}
                    <div className="artwork-bottom">
                      {artwork.price && (
                        <span className="artwork-price">${artwork.price}</span>
                      )}
                      <ShareButton 
                        artwork={{
                          ...artwork,
                          artist: artist?.first_name && artist?.last_name 
                            ? `${artist.first_name} ${artist.last_name}` 
                            : artist?.username || 'Unknown Artist',
                          image: artwork.image_url ? `http://localhost:3001${artwork.image_url}` : null
                        }} 
                        size="small" 
                        showText={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;

