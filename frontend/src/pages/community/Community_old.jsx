/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Community.css';

const Community = () => {
  const { categorySlug } = useParams();
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('hot');
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categorySlug) {
      fetchPosts(categorySlug);
    }
  }, [categorySlug, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/community/categories');
      const data = await response.json();
      setCategories(data);
      if (!categorySlug && data.length > 0) {
        setSelectedCategory(data[0]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPosts = async (slug) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/community/categories/${slug}/posts?sort=${sortBy}`);
      const data = await response.json();
      setPosts(data.posts);
      const category = categories.find(c => c.slug === slug);
      setSelectedCategory(category);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const handleVote = async (postId, voteType) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ voteType })
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, upvotes: data.upvotes, downvotes: data.downvotes }
            : post
        ));
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="community-container">
      {/* Sidebar with categories */}
      <div className="community-sidebar">
        <h3>🎨 Art Communities</h3>
        <div className="categories-list">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/community/${category.slug}`}
              className={`category-item ${selectedCategory?.slug === category.slug ? 'active' : ''}`}
            >
              <div className="category-icon">🎨</div>
              <div className="category-info">
                <h4>{category.display_name || category.name}</h4>
                <span className="category-stats">
                  {category.member_count} members • {category.post_count} posts
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="community-main">
        {selectedCategory && (
          <>
            {/* Category header */}
            <div className="category-header">
              <div className="category-banner">
                <h1>{selectedCategory.display_name || selectedCategory.name}</h1>
                <p>{selectedCategory.display_description || selectedCategory.description}</p>
                <div className="category-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => setShowCreatePost(true)}
                  >
                    ✍️ Create Post
                  </button>
                  <button className="btn-secondary">
                    ➕ Join Community
                  </button>
                </div>
              </div>
            </div>

            {/* Sort options */}
            <div className="sort-options">
              <div className="sort-buttons">
                {['hot', 'new', 'top', 'rising'].map(sort => (
                  <button
                    key={sort}
                    className={`sort-btn ${sortBy === sort ? 'active' : ''}`}
                    onClick={() => setSortBy(sort)}
                  >
                    {sort === 'hot' && '🔥'} 
                    {sort === 'new' && '🆕'} 
                    {sort === 'top' && '⭐'} 
                    {sort === 'rising' && '📈'} 
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts list */}
            <div className="posts-container">
              {loading ? (
                <div className="loading">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="no-posts">
                  <h3>No posts yet in this community</h3>
                  <p>Be the first to share something amazing!</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowCreatePost(true)}
                  >
                    Create First Post
                  </button>
                </div>
              ) : (
                posts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onVote={handleVote}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Ads sidebar */}
      <div className="community-ads">
        <div className="ad-banner">
          <h4>🎨 Featured</h4>
          <div className="google-ad">
            {/* Google Ads will be integrated here */}
            <div className="ad-placeholder">
              <p>Advertisement Space</p>
              <small>Support our community</small>
            </div>
          </div>
        </div>
        
        <div className="community-rules">
          <h4>📋 Community Rules</h4>
          <ul>
            <li>Be respectful to all community members</li>
            <li>Original artwork requires €5 verification fee</li>
            <li>No spam or self-promotion without contribution</li>
            <li>Credit original artists when sharing</li>
            <li>Use appropriate language and content warnings</li>
          </ul>
        </div>
      </div>

      {/* Create post modal */}
      {showCreatePost && (
        <CreatePostModal 
          category={selectedCategory}
          onClose={() => setShowCreatePost(false)}
          onSuccess={() => {
            setShowCreatePost(false);
            fetchPosts(selectedCategory.slug);
          }}
        />
      )}
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, onVote }) => {
  const score = post.upvotes - post.downvotes;
  const timeAgo = new Date(post.created_at).toLocaleDateString();

  return (
    <div className="post-card">
      <div className="post-votes">
        <button 
          className="vote-btn upvote"
          onClick={() => onVote(post.id, 'upvote')}
        >
          ⬆️
        </button>
        <span className="vote-score">{score}</span>
        <button 
          className="vote-btn downvote"
          onClick={() => onVote(post.id, 'downvote')}
        >
          ⬇️
        </button>
      </div>

      <div className="post-content">
        <div className="post-header">
          <h3 className="post-title">
            <Link to={`/community/post/${post.id}`}>
              {post.display_title || post.title}
            </Link>
          </h3>
          <div className="post-meta">
            {post.post_type === 'artwork' && (
              <span className="post-type artwork">🎨 Artwork</span>
            )}
            {post.verification_status === 'verified' && (
              <span className="verified-badge">✅ Verified</span>
            )}
            {post.is_featured && (
              <span className="featured-badge">⭐ Featured</span>
            )}
          </div>
        </div>

        {post.image_urls && post.image_urls.length > 0 && (
          <div className="post-images">
            <img 
              src={post.image_urls[0]} 
              alt={post.title}
              className="post-image"
            />
          </div>
        )}

        <div className="post-text">
          {post.display_content || post.content}
        </div>

        <div className="post-footer">
          <span className="post-author">by {post.author_name}</span>
          <span className="post-time">{timeAgo}</span>
          <span className="post-comments">💬 {post.comment_count} comments</span>
          <span className="post-views">👁️ {post.view_count} views</span>
        </div>
      </div>
    </div>
  );
};

// Create Post Modal Component
const CreatePostModal = ({ category, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: 'text',
    imageUrls: [],
    linkUrl: '',
    tags: [],
    isNsfw: false
  });
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          ...formData,
          categorySlug: category.slug
        })
      });

      const data = await response.json();
      
      if (data.paymentRequired) {
        setPaymentRequired(true);
        setPaymentInfo(data);
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handlePayment = async () => {
    // Integrate with Stripe/PayPal here
    // For now, simulate payment success
    try {
      const response = await fetch(`/api/community/posts/${paymentInfo.post.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          paymentMethod: 'stripe',
          paymentProviderId: 'pi_mock_payment_id',
          amount: 5.00
        })
      });

      if (response.ok) {
        alert('Payment successful! Your artwork is now in the verification queue.');
        onSuccess();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  if (paymentRequired) {
    return (
      <div className="modal-overlay">
        <div className="modal-content payment-modal">
          <h2>💳 Payment Required</h2>
          <p>To publish artwork, a verification fee of €{paymentInfo.amount} is required.</p>
          <p>This helps us maintain quality and support our verification team.</p>
          
          <div className="payment-options">
            <button className="btn-primary" onClick={handlePayment}>
              Pay €{paymentInfo.amount} with Stripe
            </button>
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content create-post-modal">
        <div className="modal-header">
          <h2>✍️ Create Post in {category.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Post Type</label>
            <select 
              value={formData.postType}
              onChange={(e) => setFormData({...formData, postType: e.target.value})}
            >
              <option value="text">💬 Text Post</option>
              <option value="image">🖼️ Image Post</option>
              <option value="link">🔗 Link Post</option>
              <option value="artwork">🎨 Original Artwork (€5 fee)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="What's your post about?"
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Share your thoughts, techniques, or story..."
              rows={6}
            />
          </div>

          {formData.postType === 'artwork' && (
            <div className="artwork-notice">
              ⚠️ Artwork posts require a €5 verification fee and manual approval by our team.
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {formData.postType === 'artwork' ? 'Create & Pay €5' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Community;
