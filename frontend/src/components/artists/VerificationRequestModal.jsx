import React, { useState } from 'react';
import './VerificationRequestModal.css';

const VerificationRequestModal = ({ isOpen, onClose }) => {
  const [request, setRequest] = useState({
    verification_type: '',
    supporting_documents: '',
    social_media_links: '',
    portfolio_highlights: '',
    professional_statement: '',
    contact_info: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const verificationTypes = [
    { 
      value: 'professional', 
      label: 'Professional Artist', 
      icon: 'ðŸŽ¨',
      description: 'Verified professional artist with established career',
      requirements: ['Portfolio of work', 'Professional credentials', 'Exhibition history']
    },
    { 
      value: 'emerging', 
      label: 'Emerging Artist', 
      icon: 'â­',
      description: 'Verified emerging artist with growing presence',
      requirements: ['Active portfolio', 'Recent works', 'Social media presence']
    },
    { 
      value: 'gallery', 
      label: 'Gallery Represented', 
      icon: 'ðŸ›ï¸',
      description: 'Artist represented by galleries or institutions',
      requirements: ['Gallery representation proof', 'Exhibition records', 'Professional portfolio']
    },
    { 
      value: 'educator', 
      label: 'Art Educator', 
      icon: 'ðŸŽ“',
      description: 'Verified art educator or instructor',
      requirements: ['Teaching credentials', 'Educational institution proof', 'Student testimonials']
    },
    { 
      value: 'collector', 
      label: 'Art Collector', 
      icon: 'ðŸ’Ž',
      description: 'Verified art collector and patron',
      requirements: ['Collection documentation', 'Purchase history', 'Community involvement']
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/artists/verification/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Verification request submitted successfully! We will review your application within 5-7 business days.');
        onClose();
        setRequest({
          verification_type: '',
          supporting_documents: '',
          social_media_links: '',
          portfolio_highlights: '',
          professional_statement: '',
          contact_info: ''
        });
      } else {
        alert(data.error || 'Failed to submit verification request');
      }
    } catch (error) {
      console.error('Error submitting verification request:', error);
      alert('Failed to submit verification request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setRequest(prev => ({ ...prev, [field]: value }));
  };

  const selectedType = verificationTypes.find(type => type.value === request.verification_type);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="verification-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>âœ… Artist Verification Request</h2>
          <p>Get verified to build trust and unlock premium features</p>
          <button className="close-btn" onClick={onClose}>Ã—</button>
        </div>

        <form onSubmit={handleSubmit} className="verification-form">
          <div className="verification-benefits">
            <h3>ðŸŒŸ Verification Benefits</h3>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">âœ…</span>
                <span>Verified badge on your profile</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">ðŸ”</span>
                <span>Higher ranking in search results</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">ðŸ’°</span>
                <span>Access to premium commission features</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">ðŸ¤</span>
                <span>Increased trust from collectors</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">ðŸ“ˆ</span>
                <span>Advanced analytics and insights</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Verification Type</h3>
            <div className="verification-types">
              {verificationTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  className={`verification-type ${request.verification_type === type.value ? 'selected' : ''}`}
                  onClick={() => handleInputChange('verification_type', type.value)}
                >
                  <div className="type-header">
                    <span className="type-icon">{type.icon}</span>
                    <div className="type-info">
                      <h4>{type.label}</h4>
                      <p>{type.description}</p>
                    </div>
                  </div>
                  <div className="type-requirements">
                    <strong>Requirements:</strong>
                    <ul>
                      {type.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedType && (
            <div className="form-section">
              <h3>Application Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Professional Statement *</label>
                  <textarea
                    placeholder="Tell us about your artistic journey, achievements, and why you're seeking verification..."
                    value={request.professional_statement}
                    onChange={(e) => handleInputChange('professional_statement', e.target.value)}
                    rows="5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Portfolio Highlights *</label>
                  <textarea
                    placeholder="Describe your best artworks, exhibitions, awards, or notable achievements..."
                    value={request.portfolio_highlights}
                    onChange={(e) => handleInputChange('portfolio_highlights', e.target.value)}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Supporting Documents</label>
                  <textarea
                    placeholder="List any certificates, degrees, exhibition catalogs, press coverage, or other documentation you can provide..."
                    value={request.supporting_documents}
                    onChange={(e) => handleInputChange('supporting_documents', e.target.value)}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Social Media & Online Presence</label>
                  <textarea
                    placeholder="Share your social media profiles, website, online galleries, or any other online presence..."
                    value={request.social_media_links}
                    onChange={(e) => handleInputChange('social_media_links', e.target.value)}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Information</label>
                  <textarea
                    placeholder="Provide alternative contact methods (phone, email, studio address) for verification purposes..."
                    value={request.contact_info}
                    onChange={(e) => handleInputChange('contact_info', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="verification-process">
            <h3>ðŸ“‹ Verification Process</h3>
            <div className="process-steps">
              <div className="step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h4>Submit Application</h4>
                  <p>Complete this form with accurate information</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h4>Review Process</h4>
                  <p>Our team reviews your application (5-7 business days)</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h4>Verification</h4>
                  <p>We may contact you for additional information</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <div className="step-content">
                  <h4>Approval</h4>
                  <p>Get your verified badge and premium features</p>
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
              disabled={submitting || !request.verification_type || !request.professional_statement || !request.portfolio_highlights}
            >
              {submitting ? 'Submitting...' : 'âœ… Submit Verification Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationRequestModal;

