import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './FeedbackPopup.css';

const FeedbackPopup = ({ isOpen, onClose, user }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    issue: '',
    feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.issue.trim() || !formData.feedback.trim()) {
      setSubmitStatus({ type: 'error', message: t('feedback.required_fields') });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitStatus({ type: 'error', message: 'Please log in to send feedback.' });
        return;
      }

      // Ensure user object is valid
      const userEmail = user?.email || 'unknown@example.com';
      const userName = user?.name || user?.first_name || user?.username || userEmail.split('@')[0];

      console.log('Sending feedback with:', { userEmail, userName });

      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          issue: formData.issue,
          feedback: formData.feedback,
          userEmail: userEmail,
          userName: userName
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Feedback submitted successfully:', result);
        setSubmitStatus({ type: 'success', message: t('feedback.success') });
        setFormData({ issue: '', feedback: '' });
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Feedback API error:', errorData);
        throw new Error(errorData.error || 'Failed to send feedback');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      setSubmitStatus({ type: 'error', message: error.message || t('feedback.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ issue: '', feedback: '' });
    setSubmitStatus(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-overlay">
      <div className="feedback-popup">
        <div className="feedback-header">
          <h2>{t('feedback.title')}</h2>
          <button className="feedback-close-btn" onClick={handleClose}>
            Ã—
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-field">
            <label htmlFor="issue">{t('feedback.issue_topic')}</label>
            <input
              type="text"
              id="issue"
              name="issue"
              value={formData.issue}
              onChange={handleInputChange}
              placeholder={t('feedback.issue_placeholder')}
              maxLength={100}
              required
            />
            <span className="char-count">{formData.issue.length}/100</span>
          </div>

          <div className="feedback-field">
            <label htmlFor="feedback">{t('feedback.feedback_label')}</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder={t('feedback.feedback_placeholder')}
              rows={6}
              maxLength={1000}
              required
            />
            <span className="char-count">{formData.feedback.length}/1000</span>
          </div>

          {submitStatus && (
            <div className={`feedback-status ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          <div className="feedback-actions">
            <button
              type="button"
              className="feedback-cancel-btn"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t('feedback.cancel')}
            </button>
            <button
              type="submit"
              className="feedback-submit-btn"
              disabled={isSubmitting || !formData.issue.trim() || !formData.feedback.trim()}
            >
              {isSubmitting ? t('feedback.sending') : t('feedback.send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPopup;

