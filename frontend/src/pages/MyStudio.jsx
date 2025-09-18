import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMyArtworks } from '../services/api';
import './MyStudio.css';

const MyStudio = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArtworks: 0,
    approvedArtworks: 0,
    pendingArtworks: 0,
    totalViews: 0,
    totalLikes: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchArtworks();
  }, [user, navigate]);

  const fetchArtworks = async () => {
    try {
      const data = await getMyArtworks();
      setArtworks(data);
      
      // Calculate stats
      const totalArtworks = data.length;
      const approvedArtworks = data.filter(art => art.status === 'approved').length;
      const pendingArtworks = data.filter(art => art.status === 'pending').length;
      const totalViews = data.reduce((sum, art) => sum + (art.views || 0), 0);
      const totalLikes = data.reduce((sum, art) => sum + (art.likes || 0), 0);
      
      setStats({
        totalArtworks,
        approvedArtworks,
        pendingArtworks,
        totalViews,
        totalLikes
      });
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadNew = () => {
    navigate('/upload');
  };

  const handleViewArtworks = () => {
    navigate('/my-artworks');
  };

  if (loading) {
    return (
      <div className="my-studio loading">
        <div className="loading-spinner">Loading your studio...</div>
      </div>
    );
  }

  return (
    <div className="my-studio">
      <div className="studio-header">
        <h1>My Studio</h1>
        <p>Welcome back, {user?.email}! Here's your art dashboard.</p>
      </div>

      <div className="studio-stats">
        <div className="stat-card">
          <div className="stat-icon">ðŸŽ¨</div>
          <div className="stat-content">
            <h3>{stats.totalArtworks}</h3>
            <p>Total Artworks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">âœ…</div>
          <div className="stat-content">
            <h3>{stats.approvedArtworks}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">â³</div>
          <div className="stat-content">
            <h3>{stats.pendingArtworks}</h3>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">ðŸ‘ï¸</div>
          <div className="stat-content">
            <h3>{stats.totalViews}</h3>
            <p>Total Views</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">â¤ï¸</div>
          <div className="stat-content">
            <h3>{stats.totalLikes}</h3>
            <p>Total Likes</p>
          </div>
        </div>
      </div>

      <div className="studio-actions">
        <button className="action-btn primary" onClick={handleUploadNew}>
          <span className="btn-icon">ðŸ“¤</span>
          Upload New Artwork
        </button>
        <button className="action-btn secondary" onClick={handleViewArtworks}>
          <span className="btn-icon">ðŸ–¼ï¸</span>
          Manage My Artworks
        </button>
        <button className="action-btn secondary" onClick={() => navigate('/profile')}>
          <span className="btn-icon">ðŸ‘¤</span>
          Edit Profile
        </button>
      </div>

      <div className="recent-artworks">
        <h2>Recent Artworks</h2>
        {artworks.length > 0 ? (
          <div className="artworks-grid">
            {artworks.slice(0, 6).map(artwork => (
              <div key={artwork.id} className="artwork-card">
                <div className="artwork-image">
                  <img 
                    src={artwork.image_url || '/placeholder-art.jpg'} 
                    alt={artwork.title}
                    onError={(e) => {
                      e.target.src = '/placeholder-art.jpg';
                    }}
                  />
                  <div className={`status-badge ${artwork.status}`}>
                    {artwork.status}
                  </div>
                </div>
                <div className="artwork-info">
                  <h3>{artwork.title}</h3>
                  <p className="price">${artwork.price}</p>
                  <div className="artwork-stats">
                    <span>ðŸ‘ï¸ {artwork.views || 0}</span>
                    <span>â¤ï¸ {artwork.likes || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">ðŸŽ¨</div>
            <h3>No artworks yet</h3>
            <p>Start your artistic journey by uploading your first piece!</p>
            <button className="action-btn primary" onClick={handleUploadNew}>
              Upload Your First Artwork
            </button>
          </div>
        )}
      </div>

      <div className="studio-tips">
        <h2>Tips for Success</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">ðŸ“¸</div>
            <h3>High-Quality Images</h3>
            <p>Use high-resolution images with good lighting to showcase your work effectively.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">ðŸ“</div>
            <h3>Detailed Descriptions</h3>
            <p>Write compelling descriptions that tell the story behind your artwork.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">ðŸ·ï¸</div>
            <h3>Smart Pricing</h3>
            <p>Research similar artworks and price competitively while valuing your work.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">ðŸ“±</div>
            <h3>Stay Active</h3>
            <p>Regularly upload new pieces and engage with the community to grow your audience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStudio;

