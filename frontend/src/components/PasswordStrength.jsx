import React from 'react';

const PasswordStrength = ({ password, onStrengthChange }) => {
  // Password strength validation function
  const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '#ddd' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Calculate score
    Object.values(checks).forEach(check => {
      if (check) score++;
    });
    
    // Determine strength level
    let strength, text, color, bgColor;
    if (score < 3) {
      strength = 'weak';
      text = 'Weak Password';
      color = '#ff4757'; // Red
      bgColor = 'rgba(255, 71, 87, 0.1)';
    } else if (score < 5) {
      strength = 'medium';
      text = 'Medium Password';
      color = '#ffa502'; // Orange
      bgColor = 'rgba(255, 165, 2, 0.1)';
    } else {
      strength = 'strong';
      text = 'Strong Password';
      color = '#2ed573'; // Green
      bgColor = 'rgba(46, 213, 115, 0.1)';
    }
    
    return { strength, text, color, bgColor, score, checks };
  };

  const passwordInfo = checkPasswordStrength(password);
  
  // Notify parent component of strength change
  React.useEffect(() => {
    if (onStrengthChange) {
      onStrengthChange(passwordInfo.strength === 'strong');
    }
  }, [password, onStrengthChange]);

  if (!password) return null;

  const strengthPercentage = (passwordInfo.score / 5) * 100;

  return (
    <div style={{ 
      marginTop: '12px',
      padding: '16px',
      backgroundColor: passwordInfo.bgColor,
      border: `1px solid ${passwordInfo.color}20`,
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    }}>
      {/* Strength Bar */}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '12px',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
      }}>
        <div
          style={{
            width: `${strengthPercentage}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${passwordInfo.color}, ${passwordInfo.color}dd)`,
            transition: 'all 0.4s ease',
            borderRadius: '4px',
            boxShadow: `0 0 8px ${passwordInfo.color}40`
          }}
        />
      </div>
      
      {/* Strength Text */}
      <div style={{
        fontSize: '13px',
        color: passwordInfo.color,
        fontWeight: '600',
        marginBottom: '12px',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {passwordInfo.text}
      </div>
      
      {/* Requirements List */}
      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)' }}>
        <div style={{ 
          marginBottom: '8px', 
          fontWeight: '600',
          color: 'rgba(255, 255, 255, 0.9)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontSize: '10px'
        }}>
          Password Requirements:
        </div>
        {[
          { check: passwordInfo.checks.length, text: 'At least 8 characters' },
          { check: passwordInfo.checks.uppercase, text: 'One uppercase letter' },
          { check: passwordInfo.checks.lowercase, text: 'One lowercase letter' },
          { check: passwordInfo.checks.numbers, text: 'One number' },
          { check: passwordInfo.checks.special, text: 'One special character (!@#$%^&*...)' }
        ].map((requirement, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4px',
              color: requirement.check ? '#2ed573' : '#ff4757',
              transition: 'color 0.2s ease'
            }}
          >
            <span style={{ 
              marginRight: '8px', 
              fontSize: '12px',
              fontWeight: 'bold',
              width: '12px',
              textAlign: 'center'
            }}>
              {requirement.check ? 'âœ“' : 'âœ—'}
            </span>
            <span style={{ fontSize: '11px' }}>{requirement.text}</span>
          </div>
        ))}
      </div>
      
      {/* Success message for strong passwords */}
      {passwordInfo.strength === 'strong' && (
        <div style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: 'rgba(46, 213, 115, 0.15)',
          border: '1px solid rgba(46, 213, 115, 0.3)',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#2ed573',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          âœ“ Password meets all requirements
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;

