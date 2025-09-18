import React, { useEffect } from 'react';

const GoogleAds = ({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block' },
  className = 'google-ad'
}) => {
  useEffect(() => {
    try {
      // Push the ad to Google AdSense
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Google Ads error:', error);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your Google AdSense Publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      ></ins>
    </div>
  );
};

export default GoogleAds;

