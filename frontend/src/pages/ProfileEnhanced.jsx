/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../context/ThemeContext';
import { profileAPI } from '../services/profile';
import SocialMediaManager from '../components/profile/SocialMediaManager';
import './ProfileEnhanced.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { isDarkMode, toggleTheme, setColorTheme } = useTheme();
  const [profileForm, setProfileForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    website: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preferences, setPreferences] = useState({
    websiteTheme: 'light', // This will sync with the actual website theme
    personalTheme: 'default', // This is the user's personal theme preference for custom features
    language: 'en',
    notifications: {
      email: true,
      push: true,
      community: true,
      artworks: true
    }
  });
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const { showToast } = useToast();

  const availableInterests = [
    'Abstract Art', 'Portrait Painting', 'Landscape Photography', 'Digital Art',
    'Sculpture', 'Street Art', 'Contemporary Art', 'Classical Art',
    'Mixed Media', 'Oil Painting', 'Watercolor', 'Acrylic Painting',
    'Printmaking', 'Ceramics', 'Installation Art', 'Performance Art',
    'Conceptual Art', 'Minimalism', 'Impressionism', 'Surrealism'
  ];

  const colorThemes = [
    { name: 'Default', value: 'default', primary: '#00b4a6', secondary: '#6dd5ed' },
    { name: 'Ocean Blue', value: 'ocean', primary: '#2193b0', secondary: '#6dd5ed' },
    { name: 'Sunset Orange', value: 'sunset', primary: '#ff7e5f', secondary: '#feb47b' },
    { name: 'Forest Green', value: 'forest', primary: '#134e5e', secondary: '#71b280' },
    { name: 'Royal Purple', value: 'royal', primary: '#667eea', secondary: '#764ba2' },
    { name: 'Cosmic Pink', value: 'cosmic', primary: '#f093fb', secondary: '#f5576c' },
    { name: 'Lavender Dream', value: 'lavender', primary: '#a8edea', secondary: '#fed6e3' },
    { name: 'Cherry Red', value: 'cherry', primary: '#ff416c', secondary: '#ff4b2b' },
    { name: 'Midnight Blue', value: 'midnight', primary: '#2c3e50', secondary: '#4ca1af' },
    { name: 'Emerald Green', value: 'emerald', primary: '#11998e', secondary: '#38ef7d' },
    { name: 'Golden Yellow', value: 'golden', primary: '#ffb347', secondary: '#ffcc33' },
    { name: 'Crimson Fire', value: 'crimson', primary: '#eb3349', secondary: '#f45c43' },
    { name: 'Violet Storm', value: 'violet', primary: '#8360c3', secondary: '#2ebf91' },
    { name: 'Aurora Lights', value: 'aurora', primary: '#00c9ff', secondary: '#92fe9d' },
    { name: 'Coral Reef', value: 'coral', primary: '#fa709a', secondary: '#fee140' },
    { name: 'Slate Gray', value: 'slate', primary: '#485563', secondary: '#29323c' },
    { name: 'Magenta Burst', value: 'magenta', primary: '#ee0979', secondary: '#ff6a00' },
    { name: 'Teal Splash', value: 'teal', primary: '#0fd850', secondary: '#f9f047' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  useEffect(() => {
    fetchProfile();
    loadPreferences();
  }, []);

  // Sync with website theme changes
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      websiteTheme: isDarkMode ? 'dark' : 'light'
    }));
  }, [isDarkMode]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('No authentication token found', 'error');
        return;
      }

      const response = await fetch('http://localhost:3001/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user data:', data.user);
        setUser(data.user);
        setProfileForm({
          username: data.user.username || '',
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          phone: data.user.phone || '',
          bio: data.user.bio || '',
          website: data.user.website || ''
        });
        console.log('Set profile form data:', {
          username: data.user.username || '',
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          phone: data.user.phone || '',
          bio: data.user.bio || '',
          website: data.user.website || ''
        });
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to fetch profile', 'error');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      showToast('Network error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = () => {
    const savedPreferences = localStorage.getItem('userPreferences');
    const savedInterests = localStorage.getItem('userInterests');
    
    if (savedPreferences) {
      const prefs = JSON.parse(savedPreferences);
      setPreferences(prefs);
      
      // Apply the personal theme if it exists
      if (prefs.personalTheme) {
        setColorTheme(prefs.personalTheme);
      }
    }
    
    if (savedInterests) {
      setSelectedInterests(JSON.parse(savedInterests));
    }
  };

  const savePreferences = (newPreferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    showToast('Preferences saved successfully!', 'success');
  };

  const saveInterests = (newInterests) => {
    localStorage.setItem('userInterests', JSON.stringify(newInterests));
    setSelectedInterests(newInterests);
    showToast('Interests updated successfully!', 'success');
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    setUploadingPicture(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch('http://localhost:3001/api/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Update user state with new profile picture
        setUser(prev => ({
          ...prev,
          profile_picture: data.profilePicture
        }));
        showToast('Profile picture updated successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to upload profile picture', 'error');
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      showToast('Network error occurred', 'error');
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    console.log('Submitting profile form:', profileForm);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();
      console.log('Profile update response:', data);

      if (response.ok) {
        setUser(data.user);
        console.log('Updated user state:', data.user);
        showToast('Profile updated successfully!', 'success');
      } else {
        console.error('Profile update failed:', data);
        showToast(data.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      showToast('Network error occurred', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/profile/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Password updated successfully!', 'success');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showToast(data.error || 'Failed to update password', 'error');
      }
    } catch (error) {
      console.error('Update password error:', error);
      showToast('Network error occurred', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    console.log(`Profile form change: ${name} = ${value}`);
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleThemeChange = (theme) => {
    const newPreferences = { ...preferences, personalTheme: theme };
    savePreferences(newPreferences);
    
    // Apply the color theme immediately to the website
    setColorTheme(theme);
  };

  const handleWebsiteThemeToggle = () => {
    toggleTheme(); // This will toggle the actual website theme
  };

  const handleLanguageChange = (language) => {
    const newPreferences = { ...preferences, language };
    savePreferences(newPreferences);
  };

  const handleNotificationChange = (type) => {
    const newPreferences = {
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [type]: !preferences.notifications[type]
      }
    };
    savePreferences(newPreferences);
  };

  const toggleInterest = (interest) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    saveInterests(newInterests);
  };

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.username) {
      return user.username;
    }
    // If no name info, extract name from email
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      // For emails like "youssefelgharib", try to split into readable format
      if (emailName.length > 0) {
        // Convert from camelCase or combined names to readable format
        const formatted = emailName
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
          .replace(/[0-9]/g, '') // Remove numbers
          .split(/[\.\-_]/) // Split on dots, dashes, underscores
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
        return formatted || emailName;
      }
    }
    return 'User';
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return 'U';
  };

  const getProfilePictureUrl = () => {
    if (user?.profile_picture) {
      return `http://localhost:3001/uploads/profile-pictures/${user.profile_picture}`;  
    }
    return null;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const currentTheme = colorThemes.find(t => t.value === preferences.personalTheme) || colorThemes[0];

  // Add a simple loading state at the top
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode ? '#0f0f23' : '#ffffff',
        color: isDarkMode ? '#edf2f7' : '#1a202c'
      }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={`profile-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{ '--theme-primary': currentTheme.primary, '--theme-secondary': currentTheme.secondary }}>
      <div className="profile-header">
        <div className="profile-avatar">
          {getProfilePictureUrl() ? (
            <img 
              src={getProfilePictureUrl()} 
              alt="Profile" 
              className="avatar-image"
            />
          ) : (
            <div className="avatar-placeholder">
              {getInitials()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{getDisplayName()}</h1>
          <p className="username">@{user?.username || 'username'}</p>
          <p className="email">{user?.email}</p>
          <span className={`user-type ${user?.user_type}`}>
            {user?.user_type?.charAt(0)?.toUpperCase() + user?.user_type?.slice(1)}
          </span>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Artworks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <span className="tab-icon">🎨</span>
          Preferences
        </button>
        <button 
          className={`tab-button ${activeTab === 'interests' ? 'active' : ''}`}
          onClick={() => setActiveTab('interests')}
        >
          <span className="tab-icon">❤️</span>
          Interests
        </button>
        <button 
          className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          <span className="tab-icon">🔗</span>
          Social Media
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <span className="tab-icon">🔒</span>
          Security
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>📝 Profile Information</h2>
              <p>Update your personal information and profile details</p>
            </div>
            
            {/* Profile Picture Upload Section */}
            <div className="profile-picture-section">
              <h3>📸 Profile Picture</h3>
              <div className="picture-upload-area">
                <div className="current-picture">
                  {getProfilePictureUrl() ? (
                    <img 
                      src={getProfilePictureUrl()} 
                      alt="Current Profile" 
                      className="current-avatar"
                    />
                  ) : (
                    <div className="current-avatar-placeholder">
                      {getInitials()}
                    </div>
                  )}
                </div>
                <div className="picture-upload-controls">
                  <button 
                    type="button"
                    className="upload-picture-btn"
                    onClick={() => document.getElementById('profilePictureInput').click()}
                    disabled={uploadingPicture}
                  >
                    {uploadingPicture ? (
                      <>⏳ Uploading...</>
                    ) : (
                      <>📷 Change Picture</>
                    )}
                  </button>
                  <input
                    id="profilePictureInput"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingPicture}
                  />
                  <p className="upload-help">
                    Upload a new profile picture. Maximum file size: 5MB
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profileForm.first_name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profileForm.last_name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={profileForm.website}
                  onChange={handleProfileChange}
                  placeholder="https://your-website.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={updating}
              >
                {updating ? '⏳ Updating...' : '✨ Update Profile'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>🎨 Preferences</h2>
              <p>Customize your experience with themes, languages, and notifications</p>
            </div>

            <div className="preferences-section">
              <h3>🎯 Website Theme</h3>
              <p>This controls the overall appearance of the website for you</p>
              <div className="website-theme-control">
                <div className="theme-toggle-container">
                  <span className="theme-label">
                    Current: {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                  </span>
                  <button 
                    className="theme-toggle-btn"
                    onClick={handleWebsiteThemeToggle}
                  >
                    Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
                  </button>
                </div>
              </div>
            </div>

            <div className="preferences-section">
              <h3>�🎨 Personal Color Theme</h3>
              <p>Choose your personal color scheme for custom features</p>
              <div className="theme-grid">
                {colorThemes.map((theme) => (
                  <div
                    key={theme.value}
                    className={`theme-card ${preferences.personalTheme === theme.value ? 'selected' : ''}`}
                    onClick={() => handleThemeChange(theme.value)}
                  >
                    <div 
                      className="theme-preview"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
                      }}
                    ></div>
                    <span className="theme-name">{theme.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="preferences-section">
              <h3>🌐 Language</h3>
              <div className="language-grid">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className={`language-card ${preferences.language === lang.code ? 'selected' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className="flag">{lang.flag}</span>
                    <span className="language-name">{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="preferences-section">
              <h3>🔔 Notifications</h3>
              <div className="notification-settings">
                {Object.entries(preferences.notifications).map(([type, enabled]) => (
                  <div key={type} className="notification-item">
                    <div className="notification-info">
                      <span className="notification-title">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
                      </span>
                      <span className="notification-desc">
                        {type === 'email' && 'Receive notifications via email'}
                        {type === 'push' && 'Browser push notifications'}
                        {type === 'community' && 'Community posts and messages'}
                        {type === 'artworks' && 'New artworks and features'}
                      </span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleNotificationChange(type)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interests' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>❤️ Art Interests</h2>
              <p>Select your favorite art styles and mediums to personalize your experience</p>
            </div>

            <div className="interests-grid">
              {availableInterests.map((interest) => (
                <div
                  key={interest}
                  className={`interest-tag ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  <span className="interest-name">{interest}</span>
                  {selectedInterests.includes(interest) && (
                    <span className="interest-check">✓</span>
                  )}
                </div>
              ))}
            </div>

            <div className="selected-interests">
              <h4>Selected Interests ({selectedInterests.length})</h4>
              <div className="selected-tags">
                {selectedInterests.map((interest) => (
                  <span key={interest} className="selected-tag">
                    {interest}
                    <button onClick={() => toggleInterest(interest)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="tab-content">
            <SocialMediaManager 
              user={user} 
              onUpdate={fetchProfile}
            />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>🔒 Security Settings</h2>
              <p>Manage your account security and password</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
                <small>Password must be at least 6 characters long</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={updating}
              >
                {updating ? '⏳ Updating...' : '🔐 Update Password'}
              </button>
            </form>

            <div className="account-info">
              <h3>📊 Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Account Created:</span>
                  <span className="value">{new Date(user?.created_at).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Account Status:</span>
                  <span className={`value status ${user?.is_active ? 'active' : 'inactive'}`}>
                    {user?.is_active ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">User Type:</span>
                  <span className="value">{user?.user_type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Last Updated:</span>
                  <span className="value">{new Date(user?.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
