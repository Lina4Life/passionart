import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './EmailVerification.css';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { state: { verified: true } });
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to verify email.');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="email-verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <h1>PassionArt</h1>
          <h2>Email Verification</h2>
        </div>

        <div className="verification-content">
          {status === 'verifying' && (
            <>
              <div className="loading-spinner"></div>
              <p>{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="success-icon">âœ“</div>
              <h3>Verification Successful!</h3>
              <p>{message}</p>
              <p className="redirect-message">Redirecting to login page in 3 seconds...</p>
              <div className="button-group">
                <button onClick={handleGoToLogin} className="btn-primary">
                  Go to Login Now
                </button>
                <button onClick={handleGoHome} className="btn-secondary">
                  Back to Home
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="error-icon">âœ—</div>
              <h3>Verification Failed</h3>
              <p>{message}</p>
              <div className="button-group">
                <button onClick={handleGoToLogin} className="btn-primary">
                  Go to Login
                </button>
                <button onClick={handleGoHome} className="btn-secondary">
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

