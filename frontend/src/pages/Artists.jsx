import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SocialMediaLinks from '../components/common/SocialMediaLinks';
import './Artists.css';

const Artists = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [followingUsers, setFollowingUsers] = useState(new Set());

  useEffect(() => {
    fetchArtists();
    if (user) {
      fetchFollowingList();
    }
  }, [user]);

  const fetchArtists = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/artists');
      const data = await response.json();
      
      if (response.ok) {
        setArtists(data.artists || []);
      } else {
        console.error('Failed to fetch artists:', data.message);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile/following', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setFollowingUsers(new Set(data.following.map(f => f.id)));
      }
    } catch (error) {
      console.error('Error fetching following list:', error);
    }
  };

  const handleFollow = async (artistId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const isFollowing = followingUsers.has(artistId);
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      
      const response = await fetch(`http://localhost:5000/api/profile/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: artistId })
      });

      if (response.ok) {
        const newFollowing = new Set(followingUsers);
        if (isFollowing) {
          newFollowing.delete(artistId);
        } else {
          newFollowing.add(artistId);
        }
        setFollowingUsers(newFollowing);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'following') {
      return matchesSearch && followingUsers.has(artist.id);
    }
    
    return matchesSearch;
  });

  const getArtistDisplayName = (artist) => {
    if (artist.first_name && artist.last_name) {
      return `${artist.first_name} ${artist.last_name}`;
    }
    return artist.username || 'Unknown Artist';
  };

  const getArtistInitials = (artist) => {
    if (artist.first_name && artist.last_name) {
      return `${artist.first_name[0]}${artist.last_name[0]}`.toUpperCase();
    }
    if (artist.username) {
      return artist.username.substring(0, 2).toUpperCase();
    }
    return 'UA';
  };

  const getProfilePictureUrl = (artist) => {
    if (artist.profile_picture) {
      return `http://localhost:5000/uploads/profile-pictures/${artist.profile_picture}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`artists-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`artists-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="artists-header">
        <h1>DISCOVER ARTISTS</h1>
        <p>Connect with talented artists from our community</p>
      </div>

      <div className="artists-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterBy === 'all' ? 'active' : ''}`}
            onClick={() => setFilterBy('all')}
          >
            All Artists
          </button>
          {user && (
            <button
              className={`filter-tab ${filterBy === 'following' ? 'active' : ''}`}
              onClick={() => setFilterBy('following')}
            >
              Following
            </button>
          )}
        </div>
      </div>

      <div className="artists-grid">
        {filteredArtists.length === 0 ? (
          <div className="empty-state">
            <h3>No artists found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredArtists.map(artist => (
            <div key={artist.id} className="artist-card">
              <div className="artist-avatar">
                {getProfilePictureUrl(artist) ? (
                  <img 
                    src={getProfilePictureUrl(artist)} 
                    alt={getArtistDisplayName(artist)}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {getArtistInitials(artist)}
                  </div>
                )}
              </div>
              
              <div className="artist-info">
                <h3 className="artist-name">{getArtistDisplayName(artist)}</h3>
                <p className="artist-username">@{artist.username}</p>
                {artist.bio && (
                  <p className="artist-bio">{artist.bio}</p>
                )}
                
                {/* Social Media Links */}
                {artist.social_media && (
                  <div className="artist-social-compact">
                    <SocialMediaLinks socialMedia={artist.social_media} size="small" />
                  </div>
                )}
                
                <span className="artist-type">{artist.user_type}</span>
              </div>
              
              <div className="artist-actions">
                <button
                  className="view-profile-btn"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  View Profile
                </button>
                
                {user && user.email !== artist.email && (
                  <button
                    className={`follow-btn ${followingUsers.has(artist.id) ? 'following' : ''}`}
                    onClick={() => handleFollow(artist.id)}
                  >
                    {followingUsers.has(artist.id) ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Artists;
