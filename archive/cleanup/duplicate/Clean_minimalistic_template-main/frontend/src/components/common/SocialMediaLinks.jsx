/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React from 'react';
import SocialIcon from './SocialIcon';
import './SocialMediaLinks.css';

const SocialMediaLinks = ({ socialMedia, size = 'medium' }) => {
  if (!socialMedia) return null;
  
  let socialData;
  try {
    socialData = typeof socialMedia === 'string' ? JSON.parse(socialMedia) : socialMedia;
  } catch (error) {
    console.error('Error parsing social media data:', error);
    return null;
  }

  const socialPlatforms = [
    {
      key: 'instagram',
      name: 'Instagram',
      color: '#E4405F',
      baseUrl: 'https://instagram.com/'
    },
    {
      key: 'twitter',
      name: 'Twitter',
      color: '#1DA1F2',
      baseUrl: 'https://twitter.com/'
    },
    {
      key: 'facebook',
      name: 'Facebook',
      color: '#1877F2',
      baseUrl: 'https://facebook.com/'
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      color: '#0A66C2',
      baseUrl: 'https://linkedin.com/in/'
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      color: '#000000',
      baseUrl: 'https://tiktok.com/@'
    },
    {
      key: 'youtube',
      name: 'YouTube',
      color: '#FF0000',
      baseUrl: 'https://youtube.com/c/'
    },
    {
      key: 'website',
      name: 'Website',
      color: '#6366F1',
      baseUrl: ''
    },
    {
      key: 'behance',
      name: 'Behance',
      color: '#1769FF',
      baseUrl: 'https://behance.net/'
    },
    {
      key: 'dribbble',
      name: 'Dribbble',
      color: '#EA4C89',
      baseUrl: 'https://dribbble.com/'
    },
    {
      key: 'pinterest',
      name: 'Pinterest',
      color: '#E60023',
      baseUrl: 'https://pinterest.com/'
    }
  ];

  const availableLinks = socialPlatforms.filter(platform => 
    socialData[platform.key] && socialData[platform.key].trim() !== ''
  );

  if (availableLinks.length === 0) return null;

  const formatUrl = (url, platform) => {
    if (!url) return '';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a website and doesn't start with http, add https
    if (platform.key === 'website') {
      return url.startsWith('www.') ? `https://${url}` : `https://www.${url}`;
    }
    
    // For social platforms, prepend the base URL if needed
    return `${platform.baseUrl}${url.replace('@', '')}`;
  };

  return (
    <div className={`social-media-links ${size}`}>
      {availableLinks.map((platform) => (
        <a
          key={platform.key}
          href={formatUrl(socialData[platform.key], platform)}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          style={{ '--social-color': platform.color }}
          title={`Visit ${platform.name}`}
          aria-label={`Visit ${platform.name} profile`}
        >
          <span className="social-icon">
            <SocialIcon platform={platform.key} size={size === 'large' ? 24 : size === 'medium' ? 20 : 16} />
          </span>
          {size === 'large' && (
            <span className="social-name">{platform.name}</span>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialMediaLinks;
