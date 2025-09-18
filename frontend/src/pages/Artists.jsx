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
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const [artistStats, setArtistStats] = useState({});

  // Fixed API endpoint to use correct port
  const API_BASE = 'http://localhost:3001/api';

  useEffect(() => {
    fetchArtists();
    if (user) {
      fetchFollowingList();
    }
  }, [user]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching artists from:', `${API_BASE}/artists`);
      const response = await fetch(`${API_BASE}/artists`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Artists API response:', data);
      
      if (data.success && data.artists) {
        setArtists(data.artists);
        console.log(`Successfully loaded ${data.artists.length} artists`);
        
        // Fetch stats for each artist
        fetchArtistStats(data.artists);
      } else {
        throw new Error(data.message || 'Failed to fetch artists');
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistStats = async (artistList) => {
    const stats = {};
    for (const artist of artistList) {
      try {
        // Fetch follower count
        const followerResponse = await fetch(`${API_BASE}/user/${artist.id}/followers`);
        const followerData = await followerResponse.json();
        
        // Fetch artworks count
        const artworkResponse = await fetch(`${API_BASE}/artworks/artist/${artist.id}`);
        const artworkData = await artworkResponse.json();
        
        stats[artist.id] = {
          followers: followerData.success ? followerData.count : 0,
          artworks: artworkData.success ? artworkData.artworks.length : 0
        };
      } catch (error) {
        console.error(`Error fetching stats for artist ${artist.id}:`, error);
        stats[artist.id] = { followers: 0, artworks: 0 };
      }
    }
    setArtistStats(stats);
  };

  const fetchFollowingList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/profile/following`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
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
      
      const response = await fetch(`${API_BASE}/profile/${endpoint}`, {
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
        
        // Update local stats
        setArtistStats(prev => ({
          ...prev,
          [artistId]: {
            ...prev[artistId],
            followers: prev[artistId]?.followers + (isFollowing ? -1 : 1) || (isFollowing ? 0 : 1)
          }
        }));
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const getSortedAndFilteredArtists = () => {
    let filtered = artists.filter(artist => {
      const matchesSearch = 
        artist.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === 'following') {
        return matchesSearch && followingUsers.has(artist.id);
      }
      
      return matchesSearch;
    });

    // Sort artists
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return getArtistDisplayName(a).localeCompare(getArtistDisplayName(b));
        case 'followers':
          return (artistStats[b.id]?.followers || 0) - (artistStats[a.id]?.followers || 0);
        case 'artworks':
          return (artistStats[b.id]?.artworks || 0) - (artistStats[a.id]?.artworks || 0);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return 0;
      }
    });

    return filtered;
  };

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
      return `${API_BASE.replace('/api', '')}/uploads/profile-pictures/${artist.profile_picture}`;
    }
    return null;
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently joined';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Recently joined';
    }
  };

  const filteredArtists = getSortedAndFilteredArtists();

  if (loading) {
    return (
      <div className={`artists-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h3>Discovering Amazing Artists...</h3>
          <p>Loading our talented community</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`artists-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="error-state">
          <div className="error-icon">âš ï¸</div>
          <h3>Unable to Load Artists</h3>
          <p>Error: {error}</p>
          <button onClick={fetchArtists} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`artists-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Enhanced Header */}
      <div className="artists-header">
        <div className="header-content">
          <h1 className="main-title">DISCOVER ARTISTS</h1>
          <p className="subtitle">Connect with {artists.length} talented artists from our community</p>
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">{artists.length}</span>
              <span className="stat-label">Artists</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Object.values(artistStats).reduce((sum, stats) => sum + (stats.artworks || 0), 0)}</span>
              <span className="stat-label">Artworks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{followingUsers.size}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="artists-controls">
        <div className="controls-row">
          <div className="search-section">
            <div className="search-bar">
              <div className="search-icon">ðŸ”</div>
              <input
                type="text"
                placeholder="Search by name, username, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  âœ•
                </button>
              )}
            </div>
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              âŠž
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              â˜°
            </button>
          </div>
        </div>

        <div className="controls-row">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filterBy === 'all' ? 'active' : ''}`}
              onClick={() => setFilterBy('all')}
            >
              <span className="tab-icon">ðŸ‘¥</span>
              All Artists
              <span className="tab-count">{artists.length}</span>
            </button>
            {user && (
              <button
                className={`filter-tab ${filterBy === 'following' ? 'active' : ''}`}
                onClick={() => setFilterBy('following')}
              >
                <span className="tab-icon">â¤ï¸</span>
                Following
                <span className="tab-count">{followingUsers.size}</span>
              </button>
            )}
          </div>

          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="followers">Most Followers</option>
              <option value="artworks">Most Artworks</option>
              <option value="newest">Newest Members</option>
              <option value="oldest">Longest Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="results-info">
        <p>
          {filteredArtists.length === 0 ? 'No artists found' : 
           filteredArtists.length === artists.length ? `Showing all ${artists.length} artists` :
           `Showing ${filteredArtists.length} of ${artists.length} artists`}
          {searchTerm && <span> for "{searchTerm}"</span>}
        </p>
      </div>

      {/* Artists Display */}
      <div className={`artists-display ${viewMode}-view`}>
        {filteredArtists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">ðŸŽ¨</div>
            <h3>No artists found</h3>
            <p>
              {searchTerm 
                ? `No artists match "${searchTerm}". Try a different search term.`
                : filterBy === 'following' 
                  ? "You're not following any artists yet. Explore and follow artists you like!"
                  : "No artists available at the moment."
              }
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="clear-filters-btn">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredArtists.map(artist => (
            <div key={artist.id} className={`artist-card ${viewMode}-card`}>
              <div className="artist-header">
                <div className="artist-avatar">
                  {getProfilePictureUrl(artist) ? (
                    <img 
                      src={getProfilePictureUrl(artist)} 
                      alt={getArtistDisplayName(artist)}
                      className="avatar-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="avatar-placeholder" style={{display: getProfilePictureUrl(artist) ? 'none' : 'flex'}}>
                    {getArtistInitials(artist)}
                  </div>
                </div>
                
                <div className="artist-basic-info">
                  <h3 className="artist-name">{getArtistDisplayName(artist)}</h3>
                  <p className="artist-username">@{artist.username || 'unknown'}</p>
                  <span className="artist-type">{artist.user_type}</span>
                </div>

                {viewMode === 'grid' && (
                  <div className="artist-stats">
                    <div className="stat">
                      <span className="stat-value">{artistStats[artist.id]?.followers || 0}</span>
                      <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{artistStats[artist.id]?.artworks || 0}</span>
                      <span className="stat-label">Artworks</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="artist-content">
                {artist.bio && (
                  <p className="artist-bio">{artist.bio}</p>
                )}
                
                <div className="artist-meta">
                  <span className="join-date">Member since {formatJoinDate(artist.created_at)}</span>
                  {viewMode === 'list' && (
                    <div className="list-stats">
                      <span>{artistStats[artist.id]?.followers || 0} followers</span>
                      <span>{artistStats[artist.id]?.artworks || 0} artworks</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="artist-actions">
                <button
                  className="view-profile-btn primary-btn"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  View Profile
                </button>
                
                {user && user.id !== artist.id && (
                  <button
                    className={`follow-btn ${followingUsers.has(artist.id) ? 'following' : 'follow'}`}
                    onClick={() => handleFollow(artist.id)}
                  >
                    {followingUsers.has(artist.id) ? (
                      <>
                        <span className="btn-icon">âœ“</span>
                        Following
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">+</span>
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button (for future pagination) */}
      {filteredArtists.length > 0 && (
        <div className="load-more-section">
          <p className="results-summary">
            Showing {filteredArtists.length} artists
          </p>
        </div>
      )}
    </div>
  );
};

export default Artists;

