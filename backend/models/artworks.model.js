const pool = require('../config/db');

const saveArtwork = async (userId, title, description, keywords, imagePath) => {
  const res = await pool.query(
    `INSERT INTO artworks (user_id, title, description, keywords, image_path, created_at)
     VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
    [userId, title, description, keywords, imagePath]
  );
  return res.rows[0];
};

const listArtworks = async () => {
  const res = await pool.query(
    `SELECT id, user_id, title, description, keywords,
            image_path AS image_url, created_at
     FROM artworks ORDER BY id DESC`
  );
  return res.rows;
};

module.exports = { saveArtwork, listArtworks };
