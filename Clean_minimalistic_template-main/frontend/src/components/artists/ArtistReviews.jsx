/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './ArtistReviews.css';

const ArtistReviews = ({ reviews, artistId, onReviewAdded }) => {
  const { user } = useContext(AuthContext);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const StarRating = ({ rating, onChange, readonly = false }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
            onClick={!readonly ? () => onChange(star) : undefined}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/artists/${artistId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      const data = await response.json();
      
      if (response.ok) {
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        onReviewAdded(); // Refresh reviews
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasUserReviewed = user && reviews.some(review => review.reviewer_id === user.id);

  return (
    <div className="artist-reviews">
      <div className="reviews-header">
        <h3>Reviews & Ratings</h3>
        <div className="average-rating">
          <StarRating rating={Math.round(calculateAverageRating())} readonly />
          <span className="rating-text">
            {calculateAverageRating()}/5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {/* Add Review Button */}
      {user && !hasUserReviewed && user.id !== parseInt(artistId) && (
        <div className="add-review-section">
          <button
            className="add-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            ✍️ Write a Review
          </button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-container">
          <form onSubmit={handleSubmitReview} className="review-form">
            <h4>Share Your Experience</h4>
            
            <div className="form-group">
              <label>Rating:</label>
              <StarRating
                rating={newReview.rating}
                onChange={(rating) => setNewReview({...newReview, rating})}
              />
            </div>
            
            <div className="form-group">
              <label>Your Review:</label>
              <textarea
                placeholder="Share your experience working with this artist..."
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                rows="4"
                required
              />
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.reviewer_avatar ? (
                      <img 
                        src={`http://localhost:5000/uploads/profile-pictures/${review.reviewer_avatar}`}
                        alt={review.reviewer_username}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {review.reviewer_first_name?.[0] || review.reviewer_username?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">
                      {review.reviewer_first_name && review.reviewer_last_name
                        ? `${review.reviewer_first_name} ${review.reviewer_last_name}`
                        : review.reviewer_username
                      }
                    </h4>
                    <div className="review-meta">
                      <StarRating rating={review.rating} readonly />
                      <span className="review-date">{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="review-content">
                <p>{review.comment}</p>
                {review.is_verified_purchase && (
                  <span className="verified-purchase">✓ Verified Commission</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArtistReviews;
