import React from 'react';
import './ArtistAchievements.css';

const ArtistAchievements = ({ achievements }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const achievementCategories = {
    milestone: { color: '#FFD700', label: 'Milestone' },
    social: { color: '#FF6B6B', label: 'Social' },
    creation: { color: '#4ECDC4', label: 'Creation' },
    recognition: { color: '#45B7D1', label: 'Recognition' },
    commerce: { color: '#96CEB4', label: 'Commerce' }
  };

  const getAchievementCategory = (type) => {
    if (type.includes('follower') || type.includes('follow')) return 'social';
    if (type.includes('sale') || type.includes('revenue')) return 'commerce';
    if (type.includes('upload') || type.includes('create')) return 'creation';
    if (type.includes('feature') || type.includes('award')) return 'recognition';
    return 'milestone';
  };

  return (
    <div className="artist-achievements">
      <div className="achievements-header">
        <h3>ðŸ† Achievements</h3>
        <p>Recognition earned through artistic excellence and community engagement</p>
      </div>

      {achievements.length === 0 ? (
        <div className="no-achievements">
          <div className="no-achievements-icon">ðŸŽ¯</div>
          <h4>No achievements yet</h4>
          <p>Keep creating and engaging with the community to earn achievements!</p>
        </div>
      ) : (
        <div className="achievements-grid">
          {achievements.map(achievement => {
            const category = getAchievementCategory(achievement.achievement_type);
            const categoryInfo = achievementCategories[category];
            
            return (
              <div 
                key={achievement.id} 
                className="achievement-card"
                style={{'--achievement-color': categoryInfo.color}}
              >
                <div className="achievement-icon">
                  {achievement.achievement_icon}
                </div>
                
                <div className="achievement-info">
                  <h4 className="achievement-name">
                    {achievement.achievement_name}
                  </h4>
                  
                  {achievement.description && (
                    <p className="achievement-description">
                      {achievement.description}
                    </p>
                  )}
                  
                  <div className="achievement-meta">
                    <span 
                      className="achievement-category"
                      style={{backgroundColor: categoryInfo.color}}
                    >
                      {categoryInfo.label}
                    </span>
                    <span className="achievement-date">
                      {formatDate(achievement.earned_date)}
                    </span>
                  </div>
                </div>
                
                <div className="achievement-badge">
                  <span className="badge-checkmark">âœ“</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Achievement Progress Section */}
      <div className="achievement-progress">
        <h4>ðŸŽ¯ Progress Towards Next Achievements</h4>
        <div className="progress-items">
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-icon">ðŸ‘¥</span>
              <span className="progress-name">100 Followers</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '65%'}}></div>
            </div>
            <span className="progress-text">65/100</span>
          </div>
          
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-icon">ðŸŽ¨</span>
              <span className="progress-name">10 Artworks</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '80%'}}></div>
            </div>
            <span className="progress-text">8/10</span>
          </div>
          
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-icon">â­</span>
              <span className="progress-name">5.0 Rating</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '90%'}}></div>
            </div>
            <span className="progress-text">4.5/5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistAchievements;

