const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS
const origins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
app.use(cors({ origin: origins.length ? origins : '*' }));
// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const artworksRoutes = require('./routes/artworks.routes');

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworksRoutes);

// Static
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Start
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
