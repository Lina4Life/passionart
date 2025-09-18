/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use the same database path as the main app
const dbPath = path.join(__dirname, '..', 'data', 'passionart.db');
const db = new sqlite3.Database(dbPath);

// Get all artworks
const getAllArtworks = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        u.username as artist_username,
        COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') as artist_name
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error fetching artworks:', err);
        return res.status(500).json({ error: 'Failed to fetch artworks' });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Error in getAllArtworks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get featured artworks (using the 'featured' column in data/passionart.db)
const getFeaturedArtworks = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        u.username as artist_username,
        COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') as artist_name
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.featured = 1 
        AND a.status = 'active'
      ORDER BY a.updated_at DESC
      LIMIT 6
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error fetching featured artworks:', err);
        return res.status(500).json({ error: 'Failed to fetch featured artworks' });
      }
      res.json({ success: true, featured: rows });
    });
  } catch (error) {
    console.error('Error in getFeaturedArtworks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add artwork to featured
const featureArtwork = async (req, res) => {
  try {
    const artworkId = req.params.id;
    
    // First check if artwork exists and is active
    const checkQuery = `
      SELECT id, title, status FROM artworks
      WHERE id = ? AND status = 'active'
    `;
    
    db.get(checkQuery, [artworkId], (err, artwork) => {
      if (err) {
        console.error('Error checking artwork:', err);
        return res.status(500).json({ error: 'Failed to check artwork' });
      }
      
      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found or not active' });
      }
      
      // Update artwork to be featured
      const updateQuery = `
        UPDATE artworks 
        SET featured = 1, updated_at = datetime('now')
        WHERE id = ?
      `;
      
      db.run(updateQuery, [artworkId], function(err) {
        if (err) {
          console.error('Error featuring artwork:', err);
          return res.status(500).json({ error: 'Failed to feature artwork' });
        }
        
        res.json({ 
          success: true, 
          message: `Artwork "${artwork.title}" has been featured` 
        });
      });
    });
  } catch (error) {
    console.error('Error in featureArtwork:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove artwork from featured
const unfeatureArtwork = async (req, res) => {
  try {
    const artworkId = req.params.id;
    
    const updateQuery = `
      UPDATE artworks 
      SET featured = 0, updated_at = datetime('now')
      WHERE id = ?
    `;
    
    db.run(updateQuery, [artworkId], function(err) {
      if (err) {
        console.error('Error unfeaturing artwork:', err);
        return res.status(500).json({ error: 'Failed to unfeature artwork' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Artwork not found' });
      }
      
      res.json({ 
        success: true, 
        message: 'Artwork has been removed from featured' 
      });
    });
  } catch (error) {
    console.error('Error in unfeatureArtwork:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get artwork by ID
const getArtworkById = async (req, res) => {
  try {
    const artworkId = req.params.id;
    
    const query = `
      SELECT 
        a.*,
        u.username as artist_username,
        COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') as artist_name
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `;
    
    db.get(query, [artworkId], (err, row) => {
      if (err) {
        console.error('Error fetching artwork:', err);
        return res.status(500).json({ error: 'Failed to fetch artwork' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Artwork not found' });
      }
      
      res.json({ success: true, artwork: row });
    });
  } catch (error) {
    console.error('Error in getArtworkById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new artwork
const createArtwork = async (req, res) => {
  try {
    const {
      title,
      description,
      keywords,
      category,
      medium,
      dimensions,
      year_created,
      price,
      image_url,
      user_id
    } = req.body;

    const query = `
      INSERT INTO artworks (
        user_id, title, description, keywords, category, medium, 
        dimensions, year_created, price, image_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `;

    db.run(query, [
      user_id, title, description, keywords, category, medium, 
      dimensions, year_created, price, image_url
    ], function(err) {
      if (err) {
        console.error('Error creating artwork:', err);
        return res.status(500).json({ error: 'Failed to create artwork' });
      }

      res.json({
        success: true,
        artwork: {
          id: this.lastID,
          user_id,
          title,
          description,
          keywords,
          category,
          medium,
          dimensions,
          year_created,
          price,
          image_url,
          status: 'active'
        }
      });
    });
  } catch (error) {
    console.error('Error in createArtwork:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update artwork
const updateArtwork = async (req, res) => {
  try {
    const artworkId = req.params.id;
    const updates = req.body;
    
    // Build dynamic update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE artworks SET ${setClause}, updated_at = datetime('now') WHERE id = ?`;
    
    db.run(query, [...values, artworkId], function(err) {
      if (err) {
        console.error('Error updating artwork:', err);
        return res.status(500).json({ error: 'Failed to update artwork' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Artwork not found' });
      }
      
      res.json({ success: true, message: 'Artwork updated successfully' });
    });
  } catch (error) {
    console.error('Error in updateArtwork:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete artwork
const deleteArtwork = async (req, res) => {
  try {
    const artworkId = req.params.id;
    
    const query = `DELETE FROM artworks WHERE id = ?`;
    
    db.run(query, [artworkId], function(err) {
      if (err) {
        console.error('Error deleting artwork:', err);
        return res.status(500).json({ error: 'Failed to delete artwork' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Artwork not found' });
      }
      
      res.json({ success: true, message: 'Artwork deleted successfully' });
    });
  } catch (error) {
    console.error('Error in deleteArtwork:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllArtworks,
  getFeaturedArtworks,
  featureArtwork,
  unfeatureArtwork,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork
};
