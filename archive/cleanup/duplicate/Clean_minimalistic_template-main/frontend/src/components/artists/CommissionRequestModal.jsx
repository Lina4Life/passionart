/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState } from 'react';
import './CommissionRequestModal.css';

const CommissionRequestModal = ({ artist, isOpen, onClose }) => {
  const [request, setRequest] = useState({
    title: '',
    type: '',
    budget: '',
    deadline: '',
    description: '',
    reference_images: []
  });
  const [submitting, setSubmitting] = useState(false);

  const commissionTypes = [
    { value: 'digital-art', label: 'Digital Art', icon: '🎨' },
    { value: 'portrait', label: 'Portrait', icon: '👤' },
    { value: 'logo-design', label: 'Logo Design', icon: '🎯' },
    { value: 'illustration', label: 'Illustration', icon: '✏️' },
    { value: 'character-design', label: 'Character Design', icon: '🧙‍♂️' },
    { value: 'concept-art', label: 'Concept Art', icon: '💭' },
    { value: 'nft-art', label: 'NFT Art', icon: '🔗' },
    { value: 'animation', label: 'Animation', icon: '🎬' },
    { value: 'other', label: 'Other', icon: '💡' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/artists/${artist.id}/commission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Commission request sent successfully!');
        onClose();
        setRequest({
          title: '',
          type: '',
          budget: '',
          deadline: '',
          description: '',
          reference_images: []
        });
      } else {
        alert(data.error || 'Failed to send commission request');
      }
    } catch (error) {
      console.error('Error sending commission request:', error);
      alert('Failed to send commission request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setRequest(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="commission-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Commission</h2>
          <p>Send a commission request to {artist.first_name || artist.username}</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="commission-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                placeholder="e.g., Custom Portrait Illustration"
                value={request.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Commission Type *</label>
              <div className="type-grid">
                {commissionTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`type-option ${request.type === type.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange('type', type.value)}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Budget (USD)</label>
                <input
                  type="number"
                  placeholder="e.g., 500"
                  min="0"
                  value={request.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
                <small>Leave empty if budget is flexible</small>
              </div>

              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={request.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <small>Preferred completion date</small>
              </div>
            </div>

            <div className="form-group">
              <label>Project Description *</label>
              <textarea
                placeholder="Describe your commission idea in detail... Include style preferences, dimensions, intended use, and any specific requirements."
                value={request.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Reference Images</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    // Handle file upload logic here
                    console.log('Files selected:', e.target.files);
                  }}
                  id="reference-images"
                />
                <label htmlFor="reference-images" className="file-upload-label">
                  <span className="upload-icon">📁</span>
                  <span>Click to upload reference images</span>
                  <small>PNG, JPG up to 10MB each</small>
                </label>
              </div>
            </div>
          </div>

          <div className="commission-info">
            <h3>📋 Commission Process</h3>
            <div className="process-steps">
              <div className="step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h4>Request Sent</h4>
                  <p>Your commission request will be sent to the artist</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h4>Artist Review</h4>
                  <p>The artist will review and respond within 2-3 business days</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h4>Agreement</h4>
                  <p>Discuss details, timeline, and finalize pricing</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <div className="step-content">
                  <h4>Creation</h4>
                  <p>Artist creates your commission with progress updates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || !request.title || !request.type || !request.description}
            >
              {submitting ? 'Sending...' : '💼 Send Commission Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionRequestModal;
