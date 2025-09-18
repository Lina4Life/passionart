import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import SocialIcon from '../common/SocialIcon';
import './SocialMediaManager.css';

const SocialMediaManager = ({ user, onUpdate }) => {
  const [socialMedia, setSocialMedia] = useState({});
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const socialPlatforms = [
    {
      key: 'instagram',
      name: 'Instagram',
      color: '#E4405F',
      placeholder: 'Your Instagram username or URL',
      description: 'Connect your Instagram account to showcase your visual art'
    },
    {
      key: 'twitter',
      name: 'Twitter',
      color: '#1DA1F2',
      placeholder: 'Your Twitter username or URL',
      description: 'Share your thoughts and connect with the art community'
    },
    {
      key: 'facebook',
      name: 'Facebook',
      color: '#1877F2',
      placeholder: 'Your Facebook page or profile URL',
      description: 'Connect with friends and showcase your work'
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      color: '#0A66C2',
      placeholder: 'Your LinkedIn profile URL',
      description: 'Professional networking for artists and galleries'
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      color: '#000000',
      placeholder: 'Your TikTok username',
      description: 'Show your creative process and reach younger audiences'
    },
    {
      key: 'youtube',
      name: 'YouTube',
      color: '#FF0000',
      placeholder: 'Your YouTube channel URL',
      description: 'Share video content about your art and process'
    },
    {
      key: 'website',
      name: 'Personal Website',
      color: '#6366F1',
      placeholder: 'Your website URL',
      description: 'Your personal portfolio or business website'
    },
    {
      key: 'behance',
      name: 'Behance',
      color: '#1769FF',
      placeholder: 'Your Behance profile URL',
      description: 'Showcase your creative portfolio on Adobe Behance'
    },
    {
      key: 'dribbble',
      name: 'Dribbble',
      color: '#EA4C89',
      placeholder: 'Your Dribbble profile URL',
      description: 'Share your design work with the creative community'
    },
    {
      key: 'pinterest',
      name: 'Pinterest',
      color: '#E60023',
      placeholder: 'Your Pinterest profile URL',
      description: 'Pin your artworks and inspire others'
    }
  ];

  useEffect(() => {
    if (user?.social_media) {
      try {
        const parsed = typeof user.social_media === 'string' 
          ? JSON.parse(user.social_media) 
          : user.social_media;
        setSocialMedia(parsed || {});
      } catch (error) {
        console.error('Error parsing social media data:', error);
        setSocialMedia({});
      }
    }
  }, [user]);

  const handleInputChange = (platform, value) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value.trim()
    }));
  };

  const handleRemovePlatform = (platform) => {
    setSocialMedia(prev => {
      const updated = { ...prev };
      delete updated[platform];
      return updated;
    });
  };

  const formatUrl = (url, platform) => {
    if (!url) return '';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Platform-specific formatting
    const baseUrls = {
      instagram: 'https://instagram.com/',
      twitter: 'https://twitter.com/',
      facebook: 'https://facebook.com/',
      linkedin: 'https://linkedin.com/in/',
      tiktok: 'https://tiktok.com/@',
      youtube: 'https://youtube.com/c/',
      behance: 'https://behance.net/',
      dribbble: 'https://dribbble.com/',
      pinterest: 'https://pinterest.com/'
    };
    
    if (platform === 'website') {
      return url.startsWith('www.') ? `https://${url}` : `https://www.${url}`;
    }
    
    const baseUrl = baseUrls[platform];
    if (baseUrl) {
      return `${baseUrl}${url.replace('@', '')}`;
    }
    
    return url;
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      
      // Clean up empty values and format URLs
      const cleanedSocialMedia = {};
      Object.entries(socialMedia).forEach(([platform, url]) => {
        if (url && url.trim()) {
          cleanedSocialMedia[platform] = formatUrl(url.trim(), platform);
        }
      });

      const response = await fetch('http://localhost:5000/api/profile/social-media', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ socialMedia: cleanedSocialMedia })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Social media links updated successfully!', 'success');
        onUpdate?.();
      } else {
        throw new Error(data.message || 'Failed to update social media');
      }
    } catch (error) {
      console.error('Error updating social media:', error);
      showToast(error.message || 'Failed to update social media links', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getConnectedCount = () => {
    return Object.values(socialMedia).filter(url => url && url.trim()).length;
  };

  return (
    <div className="social-media-manager">
      <div className="social-media-header">
        <h2>Social Media Connections</h2>
        <p className="social-media-description">
          Connect your social media accounts to showcase them on your artist profile. 
          Your followers can easily find and connect with you across different platforms.
        </p>
        <div className="connection-stats">
          <span className="connected-count">{getConnectedCount()}/10 platforms connected</span>
        </div>
      </div>

      <div className="social-platforms-grid">
        {socialPlatforms.map((platform) => {
          const isConnected = socialMedia[platform.key] && socialMedia[platform.key].trim();
          
          return (
            <div 
              key={platform.key} 
              className={`social-platform-card ${isConnected ? 'connected' : ''}`}
              style={{ '--platform-color': platform.color }}
            >
              <div className="platform-header">
                <div className="platform-info">
                  <span className="platform-icon">
                    <SocialIcon platform={platform.key} size={32} />
                  </span>
                  <div className="platform-details">
                    <h3 className="platform-name">{platform.name}</h3>
                    <p className="platform-description">{platform.description}</p>
                  </div>
                </div>
                <div className="connection-status">
                  {isConnected ? (
                    <span className="status-badge connected">Connected</span>
                  ) : (
                    <span className="status-badge disconnected">Not Connected</span>
                  )}
                </div>
              </div>

              <div className="platform-input-section">
                <div className="input-group">
                  <input
                    type="text"
                    value={socialMedia[platform.key] || ''}
                    onChange={(e) => handleInputChange(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                    className="social-input"
                  />
                  {isConnected && (
                    <button
                      type="button"
                      onClick={() => handleRemovePlatform(platform.key)}
                      className="remove-button"
                      title="Remove this connection"
                    >
                      âœ•
                    </button>
                  )}
                </div>
                
                {isConnected && (
                  <div className="preview-link">
                    <a 
                      href={formatUrl(socialMedia[platform.key], platform.key)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="preview-url"
                    >
                      ðŸ”— {formatUrl(socialMedia[platform.key], platform.key)}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="social-media-actions">
        <button
          onClick={handleSave}
          disabled={updating}
          className="save-social-button"
        >
          {updating ? 'ðŸ’¾ Saving...' : 'ðŸ’¾ Save Social Media Links'}
        </button>
      </div>
    </div>
  );
};

export default SocialMediaManager;

