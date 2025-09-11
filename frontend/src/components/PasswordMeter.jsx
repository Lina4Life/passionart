/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React from 'react';
import './PasswordMeter.css';

const PasswordMeter = ({ password, showCriteria = true }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, level: 'none', feedback: [] };

    let score = 0;
    const feedback = [];
    const criteria = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      noRepeating: !/(.)\1{2,}/.test(pwd),
      noSequential: !/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pwd)
    };

    // Scoring
    if (criteria.length) score += 25;
    if (criteria.lowercase) score += 10;
    if (criteria.uppercase) score += 10;
    if (criteria.numbers) score += 15;
    if (criteria.special) score += 20;
    if (criteria.noRepeating) score += 10;
    if (criteria.noSequential) score += 10;

    // Length bonus
    if (pwd.length >= 12) score += 10;
    if (pwd.length >= 16) score += 10;

    // Feedback
    if (!criteria.length) feedback.push('Use at least 8 characters');
    if (!criteria.lowercase) feedback.push('Include lowercase letters');
    if (!criteria.uppercase) feedback.push('Include uppercase letters');
    if (!criteria.numbers) feedback.push('Include numbers');
    if (!criteria.special) feedback.push('Include special characters (!@#$%^&*)');
    if (!criteria.noRepeating) feedback.push('Avoid repeating characters');
    if (!criteria.noSequential) feedback.push('Avoid sequential characters');

    // Determine level
    let level = 'weak';
    if (score >= 90) level = 'very-strong';
    else if (score >= 70) level = 'strong';
    else if (score >= 50) level = 'medium';
    else if (score >= 25) level = 'weak';
    else level = 'very-weak';

    return { score: Math.min(score, 100), level, feedback, criteria };
  };

  const strength = calculateStrength(password);

  const getLevelColor = (level) => {
    switch (level) {
      case 'very-strong': return '#10b981';
      case 'strong': return '#059669';
      case 'medium': return '#f59e0b';
      case 'weak': return '#f97316';
      case 'very-weak': return '#ef4444';
      default: return '#e5e7eb';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'very-strong': return 'Very Strong';
      case 'strong': return 'Strong';
      case 'medium': return 'Medium';
      case 'weak': return 'Weak';
      case 'very-weak': return 'Very Weak';
      default: return 'No Password';
    }
  };

  if (!password) return null;

  return (
    <div className="password-meter">
      <div className="strength-bar-container">
        <div 
          className="strength-bar" 
          style={{ 
            width: `${strength.score}%`,
            backgroundColor: getLevelColor(strength.level)
          }}
        />
      </div>
      
      <div className="strength-info">
        <span 
          className={`strength-level ${strength.level}`}
          style={{ color: getLevelColor(strength.level) }}
        >
          {getLevelText(strength.level)} ({strength.score}%)
        </span>
      </div>

      {showCriteria && (
        <div className="password-criteria">
          <div className="criteria-grid">
            <div className={`criterion ${strength.criteria.length ? 'met' : 'unmet'}`}>
              <span className="criterion-icon">{strength.criteria.length ? '✓' : '✗'}</span>
              <span>At least 8 characters</span>
            </div>
            <div className={`criterion ${strength.criteria.lowercase ? 'met' : 'unmet'}`}>
              <span className="criterion-icon">{strength.criteria.lowercase ? '✓' : '✗'}</span>
              <span>Lowercase letter</span>
            </div>
            <div className={`criterion ${strength.criteria.uppercase ? 'met' : 'unmet'}`}>
              <span className="criterion-icon">{strength.criteria.uppercase ? '✓' : '✗'}</span>
              <span>Uppercase letter</span>
            </div>
            <div className={`criterion ${strength.criteria.numbers ? 'met' : 'unmet'}`}>
              <span className="criterion-icon">{strength.criteria.numbers ? '✓' : '✗'}</span>
              <span>Number</span>
            </div>
            <div className={`criterion ${strength.criteria.special ? 'met' : 'unmet'}`}>
              <span className="criterion-icon">{strength.criteria.special ? '✓' : '✗'}</span>
              <span>Special character</span>
            </div>
            <div className={`criterion ${strength.criteria.noRepeating ? 'met' : 'unmet'}`}>
              <span className="criterion-icon">{strength.criteria.noRepeating ? '✓' : '✗'}</span>
              <span>No repeating characters</span>
            </div>
          </div>
          
          {strength.feedback.length > 0 && (
            <div className="feedback">
              <h4>Improve your password:</h4>
              <ul>
                {strength.feedback.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordMeter;
