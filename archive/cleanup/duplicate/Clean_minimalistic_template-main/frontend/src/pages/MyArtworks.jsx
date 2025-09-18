/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyArtworks.css';

const MyArtworks = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchArtworks();
  }, [user, navigate]);

  const fetchArtworks = async () => {
    try {
      const response = await fetch(`/api/artworks/my-artworks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setArtworks(data);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtwork = async (artworkId) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) {
      return;
    }

    try {
      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setArtworks(artworks.filter(art => art.id !== artworkId));
      }
    } catch (error) {
      console.error('Error deleting artwork:', error);
    }
  };

  const filteredArtworks = artworks.filter(artwork => {
    if (filter === 'all') return true;
    return artwork.status === filter;
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'views':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="my-artworks loading">
        <div className="loading-spinner">Loading your artworks...</div>
      </div>
    );
  }

  return (
    <div className="my-artworks">
      <div className="artworks-header">
        <h1>My Artworks</h1>
        <p>Manage and track your art collection</p>
        <button className="upload-btn" onClick={() => navigate('/upload')}>
          <span>📤</span>
          Upload New Artwork
        </button>
      </div>

      <div className="artworks-controls">
        <div className="filter-controls">
          <label>Filter by status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Artworks</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      <div className="artworks-stats">
        <div className="stat">
          <span className="number">{artworks.length}</span>
          <span className="label">Total Artworks</span>
        </div>
        <div className="stat">
          <span className="number">{artworks.filter(art => art.status === 'approved').length}</span>
          <span className="label">Approved</span>
        </div>
        <div className="stat">
          <span className="number">{artworks.filter(art => art.status === 'pending').length}</span>
          <span className="label">Pending</span>
        </div>
        <div className="stat">
          <span className="number">{artworks.reduce((sum, art) => sum + (art.views || 0), 0)}</span>
          <span className="label">Total Views</span>
        </div>
      </div>

      {sortedArtworks.length > 0 ? (
        <div className="artworks-grid">
          {sortedArtworks.map(artwork => (
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
                <div className="artwork-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => navigate(`/edit-artwork/${artwork.id}`)}
                    title="Edit Artwork"
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteArtwork(artwork.id)}
                    title="Delete Artwork"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="artwork-details">
                <h3>{artwork.title}</h3>
                <p className="description">{artwork.description}</p>
                
                <div className="artwork-meta">
                  <div className="meta-row">
                    <span className="label">Medium:</span>
                    <span className="value">{artwork.medium}</span>
                  </div>
                  <div className="meta-row">
                    <span className="label">Dimensions:</span>
                    <span className="value">{artwork.dimensions}</span>
                  </div>
                  <div className="meta-row">
                    <span className="label">Price:</span>
                    <span className="value price">${artwork.price}</span>
                  </div>
                </div>
                
                <div className="artwork-stats">
                  <div className="stat-item">
                    <span className="icon">👁️</span>
                    <span>{artwork.views || 0} views</span>
                  </div>
                  <div className="stat-item">
                    <span className="icon">❤️</span>
                    <span>{artwork.likes || 0} likes</span>
                  </div>
                </div>
                
                <div className="artwork-dates">
                  <div className="date">
                    <span className="label">Created:</span>
                    <span>{new Date(artwork.created_at).toLocaleDateString()}</span>
                  </div>
                  {artwork.updated_at !== artwork.created_at && (
                    <div className="date">
                      <span className="label">Updated:</span>
                      <span>{new Date(artwork.updated_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                {artwork.tags && (
                  <div className="artwork-tags">
                    {artwork.tags.split(',').map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3>No artworks found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't uploaded any artworks yet. Start your artistic journey!"
              : `No artworks with status "${filter}" found.`
            }
          </p>
          <button className="upload-btn" onClick={() => navigate('/upload')}>
            <span>📤</span>
            Upload Your First Artwork
          </button>
        </div>
      )}
    </div>
  );
};

export default MyArtworks;
