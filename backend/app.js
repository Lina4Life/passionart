const path = require('path');
require('dotenv').config();

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
const adminSimpleRoutes = require('./routes/admin_simple.routes');
const adminRoutes = require('./routes/admin.routes');
const communityRoutes = require('./routes/community.routes');
const aiChatRoutes = require('./routes/aiChat.routes');
const chatRoutes = require('./routes/chat_simple.routes');
const paymentRoutes = require('./routes/payment.routes');
const articlesRoutes = require('./routes/articles.routes');
const emailRoutes = require('./routes/email.routes');

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworksRoutes);
app.use('/api/admin', adminSimpleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ai-chat', aiChatRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/hubspot', require('./routes/hubspot.routes'));

// Static
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
