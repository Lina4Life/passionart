import React, { useState, useEffect } from 'react';
import './ArtistAnalytics.css';

const ArtistAnalytics = ({ artistId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [artistId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/artists/${artistId}/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h2>ðŸ“Š Artist Analytics</h2>
          <div className="loading-placeholder">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h2>ðŸ“Š Artist Analytics</h2>
          <p>No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>ðŸ“Š Artist Analytics</h2>
        <div className="time-range-selector">
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              className={`time-range-btn ${timeRange === option.value ? 'active' : ''}`}
              onClick={() => setTimeRange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="metrics-row">
          <div className="metric-card">
            <div className="metric-icon">ðŸ‘ï¸</div>
            <div className="metric-content">
              <h3>Profile Views</h3>
              <div className="metric-value">{formatNumber(analytics.profile_views?.current || 0)}</div>
              <div className={`metric-growth ${analytics.profile_views?.growth >= 0 ? 'positive' : 'negative'}`}>
                {analytics.profile_views?.growth >= 0 ? 'â†—ï¸' : 'â†˜ï¸'} 
                {Math.abs(analytics.profile_views?.growth || 0)}%
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">ðŸŽ¨</div>
            <div className="metric-content">
              <h3>Artwork Views</h3>
              <div className="metric-value">{formatNumber(analytics.artwork_views?.current || 0)}</div>
              <div className={`metric-growth ${analytics.artwork_views?.growth >= 0 ? 'positive' : 'negative'}`}>
                {analytics.artwork_views?.growth >= 0 ? 'â†—ï¸' : 'â†˜ï¸'} 
                {Math.abs(analytics.artwork_views?.growth || 0)}%
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">â¤ï¸</div>
            <div className="metric-content">
              <h3>Total Likes</h3>
              <div className="metric-value">{formatNumber(analytics.total_likes?.current || 0)}</div>
              <div className={`metric-growth ${analytics.total_likes?.growth >= 0 ? 'positive' : 'negative'}`}>
                {analytics.total_likes?.growth >= 0 ? 'â†—ï¸' : 'â†˜ï¸'} 
                {Math.abs(analytics.total_likes?.growth || 0)}%
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">ðŸ‘¥</div>
            <div className="metric-content">
              <h3>New Followers</h3>
              <div className="metric-value">{formatNumber(analytics.new_followers?.current || 0)}</div>
              <div className={`metric-growth ${analytics.new_followers?.growth >= 0 ? 'positive' : 'negative'}`}>
                {analytics.new_followers?.growth >= 0 ? 'â†—ï¸' : 'â†˜ï¸'} 
                {Math.abs(analytics.new_followers?.growth || 0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Artworks */}
        <div className="analytics-section">
          <h3>ðŸ† Top Performing Artworks</h3>
          <div className="top-artworks">
            {analytics.top_artworks?.map((artwork, index) => (
              <div key={artwork.id} className="artwork-performance">
                <div className="artwork-rank">#{index + 1}</div>
                <div className="artwork-thumbnail">
                  <img src={artwork.image_url || '/placeholder-artwork.jpg'} alt={artwork.title} />
                </div>
                <div className="artwork-stats">
                  <h4>{artwork.title}</h4>
                  <div className="artwork-metrics">
                    <span>ðŸ‘ï¸ {formatNumber(artwork.views)}</span>
                    <span>â¤ï¸ {formatNumber(artwork.likes)}</span>
                    <span>ðŸ’¬ {formatNumber(artwork.comments)}</span>
                  </div>
                </div>
              </div>
            )) || <p>No artwork data available</p>}
          </div>
        </div>

        {/* Engagement Insights */}
        <div className="analytics-section">
          <h3>ðŸ“ˆ Engagement Insights</h3>
          <div className="engagement-grid">
            <div className="engagement-card">
              <h4>Average Engagement Rate</h4>
              <div className="engagement-value">{analytics.engagement_rate || '0'}%</div>
              <p>Likes, comments, and shares per view</p>
            </div>
            <div className="engagement-card">
              <h4>Best Posting Time</h4>
              <div className="engagement-value">{analytics.best_posting_time || 'N/A'}</div>
              <p>When your audience is most active</p>
            </div>
            <div className="engagement-card">
              <h4>Most Popular Category</h4>
              <div className="engagement-value">{analytics.top_category || 'N/A'}</div>
              <p>Your most engaging artwork type</p>
            </div>
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="analytics-section">
          <h3>ðŸŒ Audience Demographics</h3>
          <div className="demographics-grid">
            <div className="demo-card">
              <h4>Top Countries</h4>
              <div className="demo-list">
                {analytics.top_countries?.map((country, index) => (
                  <div key={index} className="demo-item">
                    <span className="demo-label">{country.name}</span>
                    <span className="demo-value">{country.percentage}%</span>
                  </div>
                )) || <p>No data available</p>}
              </div>
            </div>
            <div className="demo-card">
              <h4>Age Groups</h4>
              <div className="demo-list">
                {analytics.age_groups?.map((group, index) => (
                  <div key={index} className="demo-item">
                    <span className="demo-label">{group.range}</span>
                    <span className="demo-value">{group.percentage}%</span>
                  </div>
                )) || <p>No data available</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="analytics-section">
          <h3>ðŸ’° Revenue Insights</h3>
          <div className="revenue-grid">
            <div className="revenue-card">
              <h4>Total Revenue</h4>
              <div className="revenue-value">${analytics.total_revenue || '0.00'}</div>
              <div className={`revenue-growth ${analytics.revenue_growth >= 0 ? 'positive' : 'negative'}`}>
                {analytics.revenue_growth >= 0 ? 'â†—ï¸' : 'â†˜ï¸'} 
                {Math.abs(analytics.revenue_growth || 0)}% from last period
              </div>
            </div>
            <div className="revenue-card">
              <h4>Commission Requests</h4>
              <div className="revenue-value">{analytics.commission_requests || 0}</div>
              <p>Active commission inquiries</p>
            </div>
            <div className="revenue-card">
              <h4>Average Sale Price</h4>
              <div className="revenue-value">${analytics.avg_sale_price || '0.00'}</div>
              <p>Per artwork sold</p>
            </div>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="analytics-section">
          <h3>ðŸŽ¯ Goal Progress</h3>
          <div className="goals-container">
            <div className="goal-item">
              <div className="goal-header">
                <span>Monthly Views Goal</span>
                <span>{analytics.monthly_views || 0} / {analytics.monthly_views_goal || 1000}</span>
              </div>
              <div className="goal-progress">
                <div 
                  className="goal-bar"
                  style={{ width: `${Math.min(100, (analytics.monthly_views || 0) / (analytics.monthly_views_goal || 1000) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="goal-item">
              <div className="goal-header">
                <span>Follower Goal</span>
                <span>{analytics.total_followers || 0} / {analytics.follower_goal || 100}</span>
              </div>
              <div className="goal-progress">
                <div 
                  className="goal-bar"
                  style={{ width: `${Math.min(100, (analytics.total_followers || 0) / (analytics.follower_goal || 100) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistAnalytics;

