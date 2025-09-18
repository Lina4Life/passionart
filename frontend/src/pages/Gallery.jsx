import React, { useEffect, useState } from 'react';
import { getArtworks } from '../services/api';
import '../styles.css';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getArtworks()
      .then(setArtworks)
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="gallery-page">
      <h2>Artworks Gallery</h2>
      {error && <div className="error-msg">{error}</div>}
      <div className="artwork-grid">
        {artworks.map(art => (
          <div key={art._id || art.id} className="artwork-card">
            <img src={art.image_url} alt={art.title} className="artwork-img" />
            <h3>{art.title}</h3>
            <p>{new Date(art.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;

