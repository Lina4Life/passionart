const { createUser, findUserByEmail } = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const user = await createUser(email, password);
    const token = generateToken(user);
    res.json({ user, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };
