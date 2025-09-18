import React, { useState } from 'react';
import './CollaborationRequestModal.css';

const CollaborationRequestModal = ({ artist, isOpen, onClose }) => {
  const [request, setRequest] = useState({
    title: '',
    description: '',
    collaboration_type: '',
    duration: '',
    start_date: '',
    end_date: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const collaborationTypes = [
    { value: 'art-piece', label: 'Joint Art Piece', icon: 'ðŸŽ¨', description: 'Create artwork together' },
    { value: 'exhibition', label: 'Exhibition', icon: 'ðŸ–¼ï¸', description: 'Organize joint exhibition' },
    { value: 'project', label: 'Creative Project', icon: 'ðŸ’¡', description: 'Collaborative creative project' },
    { value: 'mentorship', label: 'Mentorship', icon: 'ðŸ‘¥', description: 'Learning and guidance' },
    { value: 'workshop', label: 'Workshop', icon: 'ðŸŽ“', description: 'Educational collaboration' },
    { value: 'series', label: 'Art Series', icon: 'ðŸ“š', description: 'Multi-piece series' }
  ];

  const durationOptions = [
    { value: 'short-term', label: 'Short-term (1-4 weeks)' },
    { value: 'medium-term', label: 'Medium-term (1-3 months)' },
    { value: 'long-term', label: 'Long-term (3+ months)' },
    { value: 'ongoing', label: 'Ongoing collaboration' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/artists/${artist.id}/collaborate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Collaboration request sent successfully!');
        onClose();
        setRequest({
          title: '',
          description: '',
          collaboration_type: '',
          duration: '',
          start_date: '',
          end_date: ''
        });
      } else {
        alert(data.error || 'Failed to send collaboration request');
      }
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      alert('Failed to send collaboration request');
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
      <div className="collaboration-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>ðŸ¤ Collaboration Request</h2>
          <p>Propose a collaboration with {artist.first_name || artist.username}</p>
          <button className="close-btn" onClick={onClose}>Ã—</button>
        </div>

        <form onSubmit={handleSubmit} className="collaboration-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Collaboration Title *</label>
              <input
                type="text"
                placeholder="e.g., Joint Digital Art Exhibition"
                value={request.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Collaboration Type *</label>
              <div className="collab-type-grid">
                {collaborationTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`collab-type-option ${request.collaboration_type === type.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange('collaboration_type', type.value)}
                  >
                    <span className="collab-icon">{type.icon}</span>
                    <div className="collab-details">
                      <span className="collab-label">{type.label}</span>
                      <span className="collab-description">{type.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <select
                value={request.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
              >
                <option value="">Select duration</option>
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preferred Start Date</label>
                <input
                  type="date"
                  value={request.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Target End Date</label>
                <input
                  type="date"
                  value={request.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  min={request.start_date || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Collaboration Description *</label>
              <textarea
                placeholder="Describe your collaboration idea in detail... Include your vision, goals, each person's role, and expected outcomes."
                value={request.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="6"
                required
              />
            </div>
          </div>

          <div className="collaboration-benefits">
            <h3>âœ¨ Benefits of Collaboration</h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <span className="benefit-icon">ðŸŽ¯</span>
                <div>
                  <h4>Shared Vision</h4>
                  <p>Combine unique perspectives and skills</p>
                </div>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">ðŸ“ˆ</span>
                <div>
                  <h4>Growth</h4>
                  <p>Learn new techniques and expand your network</p>
                </div>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">ðŸŒŸ</span>
                <div>
                  <h4>Recognition</h4>
                  <p>Reach new audiences and gain exposure</p>
                </div>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">ðŸŽ¨</span>
                <div>
                  <h4>Creativity</h4>
                  <p>Push creative boundaries together</p>
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
              disabled={submitting || !request.title || !request.collaboration_type || !request.description}
            >
              {submitting ? 'Sending...' : 'ðŸ¤ Send Collaboration Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaborationRequestModal;

