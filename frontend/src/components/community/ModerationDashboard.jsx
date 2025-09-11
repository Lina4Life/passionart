/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect } from 'react';
import './ModerationDashboard.css';

const ModerationDashboard = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      const response = await fetch('/api/community/moderation/pending', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setPendingPosts(data.posts);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    }
    setLoading(false);
  };

  const moderatePost = async (postId, action, reason = '') => {
    try {
      const response = await fetch(`/api/community/moderation/posts/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          action,
          reason,
          notes: `Moderated via admin dashboard`
        })
      });

      if (response.ok) {
        setPendingPosts(pendingPosts.filter(post => post.id !== postId));
        setSelectedPost(null);
        alert(`Post ${action}d successfully!`);
      }
    } catch (error) {
      console.error('Error moderating post:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading pending posts...</div>;
  }

  return (
    <div className="moderation-dashboard">
      <div className="dashboard-header">
        <h1>🛡️ Content Moderation</h1>
        <p>Review and verify paid artwork submissions</p>
        <div className="stats">
          <span className="stat-item">
            📝 {pendingPosts.length} posts pending review
          </span>
        </div>
      </div>

      <div className="moderation-content">
        <div className="posts-queue">
          <h2>Verification Queue</h2>
          {pendingPosts.length === 0 ? (
            <div className="no-posts">
              <h3>🎉 All caught up!</h3>
              <p>No posts pending verification at the moment.</p>
            </div>
          ) : (
            <div className="posts-list">
              {pendingPosts.map(post => (
                <div 
                  key={post.id} 
                  className={`post-item ${selectedPost?.id === post.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="post-preview">
                    {post.image_urls && post.image_urls.length > 0 && (
                      <img 
                        src={post.image_urls[0]} 
                        alt={post.title}
                        className="post-thumbnail"
                      />
                    )}
                    <div className="post-info">
                      <h4>{post.title}</h4>
                      <p className="post-meta">
                        By {post.author_name} • €{post.payment_amount} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                      <span className="payment-badge">💳 Payment Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedPost && (
          <div className="post-details">
            <div className="post-header">
              <h2>{selectedPost.title}</h2>
              <div className="post-actions">
                <button 
                  className="btn-approve"
                  onClick={() => moderatePost(selectedPost.id, 'approve')}
                >
                  ✅ Approve
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => {
                    const reason = prompt('Reason for rejection:');
                    if (reason) {
                      moderatePost(selectedPost.id, 'reject', reason);
                    }
                  }}
                >
                  ❌ Reject
                </button>
              </div>
            </div>

            <div className="post-content-details">
              <div className="content-section">
                <h3>Artwork Images</h3>
                {selectedPost.image_urls && selectedPost.image_urls.length > 0 ? (
                  <div className="artwork-gallery">
                    {selectedPost.image_urls.map((url, index) => (
                      <img 
                        key={index}
                        src={url} 
                        alt={`${selectedPost.title} - ${index + 1}`}
                        className="artwork-image"
                      />
                    ))}
                  </div>
                ) : (
                  <p>No images provided</p>
                )}
              </div>

              <div className="content-section">
                <h3>Description</h3>
                <div className="post-description">
                  {selectedPost.content || 'No description provided'}
                </div>
              </div>

              <div className="content-section">
                <h3>Submission Details</h3>
                <div className="submission-info">
                  <div className="info-row">
                    <strong>Artist:</strong> {selectedPost.author_name} ({selectedPost.author_email})
                  </div>
                  <div className="info-row">
                    <strong>Category:</strong> {selectedPost.category_name}
                  </div>
                  <div className="info-row">
                    <strong>Payment:</strong> €{selectedPost.payment_amount} via {selectedPost.payment_method}
                  </div>
                  <div className="info-row">
                    <strong>Submitted:</strong> {new Date(selectedPost.created_at).toLocaleString()}
                  </div>
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="info-row">
                      <strong>Tags:</strong> {selectedPost.tags.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              <div className="content-section">
                <h3>Verification Checklist</h3>
                <div className="checklist">
                  <label className="checklist-item">
                    <input type="checkbox" />
                    <span>✅ Original artwork by the submitter</span>
                  </label>
                  <label className="checklist-item">
                    <input type="checkbox" />
                    <span>✅ High quality and appropriate content</span>
                  </label>
                  <label className="checklist-item">
                    <input type="checkbox" />
                    <span>✅ Follows community guidelines</span>
                  </label>
                  <label className="checklist-item">
                    <input type="checkbox" />
                    <span>✅ Payment has been processed</span>
                  </label>
                  <label className="checklist-item">
                    <input type="checkbox" />
                    <span>✅ No copyright violations</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationDashboard;
