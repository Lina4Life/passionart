
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../services/api';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    lastName: '',
    email: '',
    password: '',
    artPiece: '',
    
    // Artist professional details
    shortBio: '',
    location: '',
    yearOfExperience: '',
    portfolio: '',
    socialMediaAccount: '',
    socialMediaAccount2: '',
    socialMediaAccount3: '',
    
    // Gallery details
    galleryName: '',
    galleryLocation: '',
    yearEstablished: '',
    galleryType: '',
    galleryDescription: '',
    galleryLogo: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };

  const handleNext = (e) => {
    e.preventDefault();
    console.log('Next button clicked!', { step, userType }); // Debug log
    console.log('Form data:', formData); // Debug log
    
    if (userType === 'artist') {
      setStep(3); // Artist professional details
    } else if (userType === 'gallery') {
      setStep(4); // Gallery details
    } else {
      // For sponsor, go straight to submission
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Submit button clicked!'); // Debug log
      console.log('Registration submitted:', { userType, ...formData });
      
      // Call the backend API
      const response = await apiRegister(formData.email, formData.password);
      console.log('Registration successful:', response);
      
      // Show verification message instead of auto-login
      if (response.requiresVerification) {
        alert('Registration successful! Please check your email to verify your account before logging in.');
        navigate('/login');
      } else {
        // Store the token if no verification required
        localStorage.setItem('token', response.token);
        navigate('/');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Skip button clicked!'); // Debug log
      console.log('Account created with basic info:', { 
        userType, 
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        artPiece: formData.artPiece
      });
      
      // Call the backend API with just basic info
      const response = await apiRegister(formData.email, formData.password);
      console.log('Registration successful:', response);
      
      // Show verification message instead of auto-login
      if (response.requiresVerification) {
        alert('Registration successful! Please check your email to verify your account before logging in.');
        navigate('/login');
      } else {
        // Store the token if no verification required
        localStorage.setItem('token', response.token);
        navigate('/');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const artPieceOptions = [
    'PAINTINGS',
    'MIXED MEDIA',
    'PRINTS',
    'PHOTOGRAPHY',
    'SCULPTURE',
    'DIGITAL ART'
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          
          {/* Step 1: User Type Selection */}
          {step === 1 && (
            <>
              <h1 className="auth-title">ARE YOU</h1>
              <div className="user-type-selection">
                <button
                  type="button"
                  className={`user-type-btn ${userType === 'artist' ? 'selected' : ''}`}
                  onClick={() => handleUserTypeSelect('artist')}
                >
                  AN ARTIST
                </button>
                <button
                  type="button"
                  className={`user-type-btn ${userType === 'gallery' ? 'selected' : ''}`}
                  onClick={() => handleUserTypeSelect('gallery')}
                >
                  A GALLERY
                </button>
                <button
                  type="button"
                  className={`user-type-btn ${userType === 'sponsor' ? 'selected' : ''}`}
                  onClick={() => handleUserTypeSelect('sponsor')}
                >
                  A SPONSOR
                </button>
              </div>
            </>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <>
              <h1 className="auth-title">CREATE ACCOUNT</h1>
              <p className="auth-subtitle">Join as {userType.toUpperCase()}</p>
              
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleNext} className="auth-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">NAME</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">LAST NAME</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">E-MAIL</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">PASSWORD</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                {userType === 'artist' && (
                  <div className="form-group">
                    <label htmlFor="artPiece" className="form-label">ART PIECE</label>
                    <select
                      id="artPiece"
                      name="artPiece"
                      value={formData.artPiece}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select your art medium</option>
                      {artPieceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button type="submit" className="auth-submit-btn">
                  NEXT
                </button>
              </form>
            </>
          )}

          {/* Step 3: Artist Professional Details */}
          {step === 3 && userType === 'artist' && (
            <>
              <h1 className="auth-title">PROFESSIONAL DETAILS</h1>
              <p className="auth-subtitle">Complete your profile (Optional - you can skip these fields)</p>
              
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-section">
                  <h3 className="section-title">About You (Optional)</h3>
                  
                  <div className="form-group">
                    <label htmlFor="shortBio" className="form-label">SHORT BIO <span className="optional-label">(Optional)</span></label>
                    <textarea
                      id="shortBio"
                      name="shortBio"
                      value={formData.shortBio}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Tell us about yourself and your artistic journey..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="location" className="form-label">LOCATION <span className="optional-label">(Optional)</span></label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="yearOfExperience" className="form-label">YEARS OF EXPERIENCE <span className="optional-label">(Optional)</span></label>
                    <input
                      type="number"
                      id="yearOfExperience"
                      name="yearOfExperience"
                      value={formData.yearOfExperience}
                      onChange={handleChange}
                      className="form-input"
                      min="0"
                      placeholder="How many years have you been creating art?"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Portfolio & Social Media (Optional)</h3>
                  
                  <div className="form-group">
                    <label htmlFor="portfolio" className="form-label">UPLOAD YOUR PORTFOLIO <span className="optional-label">(Optional)</span></label>
                    <input
                      type="file"
                      id="portfolio"
                      name="portfolio"
                      onChange={handleChange}
                      className="form-file"
                      accept=".pdf,.jpg,.jpeg,.png,.zip"
                    />
                    <small className="form-help">Accepted formats: PDF, JPG, PNG, ZIP</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">SOCIAL MEDIA ACCOUNTS <span className="optional-label">(Optional)</span></label>
                    <div className="social-inputs">
                      <input
                        type="url"
                        name="socialMediaAccount"
                        value={formData.socialMediaAccount}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Instagram URL (Optional)"
                      />
                      <input
                        type="url"
                        name="socialMediaAccount2"
                        value={formData.socialMediaAccount2}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Twitter URL (Optional)"
                      />
                      <input
                        type="url"
                        name="socialMediaAccount3"
                        value={formData.socialMediaAccount3}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Website URL (Optional)"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-buttons">
                  <button 
                    type="button" 
                    className="auth-skip-btn" 
                    onClick={handleSkip}
                    disabled={loading}
                  >
                    {loading ? 'CREATING ACCOUNT...' : 'SKIP & CREATE ACCOUNT'}
                  </button>
                  <button 
                    type="submit" 
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'CREATING ACCOUNT...' : 'COMPLETE PROFILE'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 4: Gallery Details */}
          {step === 4 && userType === 'gallery' && (
            <>
              <h1 className="auth-title">GALLERIE DETAILS</h1>
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="galleryName" className="form-label">GALLERY NAME</label>
                  <input
                    type="text"
                    id="galleryName"
                    name="galleryName"
                    value={formData.galleryName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="galleryLocation" className="form-label">LOCATION</label>
                  <input
                    type="text"
                    id="galleryLocation"
                    name="galleryLocation"
                    value={formData.galleryLocation}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="yearEstablished" className="form-label">YEAR ESTABLISHED</label>
                  <input
                    type="number"
                    id="yearEstablished"
                    name="yearEstablished"
                    value={formData.yearEstablished}
                    onChange={handleChange}
                    className="form-input"
                    min="1900"
                    max="2025"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="galleryType" className="form-label">GALLERY TYPE</label>
                  <input
                    type="text"
                    id="galleryType"
                    name="galleryType"
                    value={formData.galleryType}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Contemporary, Modern, Classical"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="galleryDescription" className="form-label">GALLERY DESCRIPTION</label>
                  <textarea
                    id="galleryDescription"
                    name="galleryDescription"
                    value={formData.galleryDescription}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="galleryLogo" className="form-label">UPLOAD GALLERY LOGO</label>
                  <input
                    type="file"
                    id="galleryLogo"
                    name="galleryLogo"
                    onChange={handleChange}
                    className="form-file"
                    accept=".jpg,.jpeg,.png,.svg"
                  />
                </div>

                <button type="submit" className="auth-submit-btn">
                  NEXT
                </button>
              </form>
            </>
          )}

          {step > 1 && (
            <div className="auth-footer">
              <p className="auth-link-text">
                Already have an account?{' '}
                <NavLink to="/login" className="auth-link">
                  Sign In
                </NavLink>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Register;
