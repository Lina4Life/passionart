const pool = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (email, password) => {
  const hash = await bcrypt.hash(password, 10);
  const res = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
    [email, hash]
  );
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

module.exports = { createUser, findUserByEmail };
