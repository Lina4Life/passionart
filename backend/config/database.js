const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database path
const dbPath = path.join(__dirname, '..', 'data', 'passionart.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    user_type TEXT DEFAULT 'user',
    verification_status TEXT DEFAULT 'pending',
    email_verified INTEGER DEFAULT 0,
    verification_token TEXT,
    verification_token_expires INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add verification columns if they don't exist (for existing databases)
  db.run(`ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding email_verified column:', err);
    }
  });
  
  db.run(`ALTER TABLE users ADD COLUMN verification_token TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding verification_token column:', err);
    }
  });
  
  db.run(`ALTER TABLE users ADD COLUMN verification_token_expires INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding verification_token_expires column:', err);
    }
  });

  // Artworks table
  db.run(`CREATE TABLE IF NOT EXISTS artworks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    artist TEXT,
    price DECIMAL(10,2),
    category TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'pending',
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Community Categories table
  db.run(`CREATE TABLE IF NOT EXISTS community_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Community Posts table
  db.run(`CREATE TABLE IF NOT EXISTS community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    category_id INTEGER,
    user_id INTEGER,
    artwork_image TEXT,
    verification_status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_amount DECIMAL(10,2) DEFAULT 5.00,
    stripe_payment_id TEXT,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES community_categories (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Community Comments table
  db.run(`CREATE TABLE IF NOT EXISTS community_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    parent_id INTEGER,
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (parent_id) REFERENCES community_comments (id)
  )`);

  // Community Votes table
  db.run(`CREATE TABLE IF NOT EXISTS community_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    post_id INTEGER,
    comment_id INTEGER,
    vote_type TEXT CHECK(vote_type IN ('up', 'down')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES community_posts (id),
    FOREIGN KEY (comment_id) REFERENCES community_comments (id)
  )`);

  // Community Payments table
  db.run(`CREATE TABLE IF NOT EXISTS community_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    stripe_payment_intent_id TEXT,
    stripe_payment_status TEXT,
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Community Moderation table
  db.run(`CREATE TABLE IF NOT EXISTS community_moderation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    moderator_id INTEGER,
    action TEXT CHECK(action IN ('approve', 'reject', 'flag', 'featured')),
    reason TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts (id),
    FOREIGN KEY (moderator_id) REFERENCES users (id)
  )`);

  // Articles table
  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    author TEXT,
    status TEXT DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    artwork_id INTEGER,
    total_amount DECIMAL(10,2),
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (artwork_id) REFERENCES artworks (id)
  )`);

  // User Sessions table
  db.run(`CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    token TEXT,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Community servers (Discord-style servers for different art categories)
  db.run(`CREATE TABLE IF NOT EXISTS community_servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    color TEXT DEFAULT '#7289DA',
    member_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT 1,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  // Community channels (Discord-style channels within servers)
  db.run(`CREATE TABLE IF NOT EXISTS community_channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'text',
    server_id INTEGER NOT NULL,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (server_id) REFERENCES community_servers(id) ON DELETE CASCADE
  )`);

  // Server members (join/leave servers)
  db.run(`CREATE TABLE IF NOT EXISTS server_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    server_id INTEGER NOT NULL,
    role TEXT DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (server_id) REFERENCES community_servers(id) ON DELETE CASCADE,
    UNIQUE(user_id, server_id)
  )`);

  // Channel messages (chat messages in channels)
  db.run(`CREATE TABLE IF NOT EXISTS channel_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    channel_id INTEGER NOT NULL,
    reply_to INTEGER,
    attachment_url TEXT,
    message_type TEXT DEFAULT 'text',
    is_edited BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES community_channels(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to) REFERENCES channel_messages(id)
  )`);

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  // Check if data already exists
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      console.error('Error checking users:', err);
      return;
    }
    
    if (row.count === 0) {
      // Insert sample users
      const users = [
        ['admin', 'admin@passionart.com', 'admin123', 'Admin', 'User', 'admin', 'verified'],
        ['artist1', 'artist@passionart.com', 'artist123', 'Jane', 'Artist', 'artist', 'verified'],
        ['user1', 'user@passionart.com', 'user123', 'John', 'Doe', 'user', 'verified'],
        ['moderator', 'mod@passionart.com', 'mod123', 'Mike', 'Moderator', 'moderator', 'verified']
      ];

      const userStmt = db.prepare(`INSERT INTO users (username, email, password, first_name, last_name, user_type, verification_status) VALUES (?, ?, ?, ?, ?, ?, ?)`);
      users.forEach(user => userStmt.run(user));
      userStmt.finalize();

      // Insert community categories (keep for backward compatibility)
      const categories = [
        ['Digital Art', 'digital-art', 'Share your digital masterpieces', '', '#FF6B6B'],
        ['Traditional Art', 'traditional-art', 'Paintings, drawings, and physical art', '', '#4ECDC4'],
        ['Photography', 'photography', 'Capture the world through your lens', '', '#45B7D1'],
        ['Sculpture', 'sculpture', '3D art and sculptural works', '', '#96CEB4'],
        ['Mixed Media', 'mixed-media', 'Experimental and mixed medium art', '', '#FFEAA7']
      ];

      const categoryStmt = db.prepare(`INSERT INTO community_categories (name, slug, description, icon, color) VALUES (?, ?, ?, ?, ?)`);
      categories.forEach(category => categoryStmt.run(category));
      categoryStmt.finalize();

      // Insert Discord-style community servers
      const servers = [
        ['Photography Hub', 'A place for photographers to share their work and techniques', 'photography-hub', '/icons/camera.svg', '#3498db', 156, 1, 1],
        ['Digital Art Studio', 'Digital artists unite! Share your digital masterpieces', 'digital-art-studio', '/icons/tablet.svg', '#e74c3c', 203, 1, 1],
        ['Traditional Art Gallery', 'For painters, drawers, and traditional media artists', 'traditional-art-gallery', '/icons/brush.svg', '#2ecc71', 89, 1, 1],
        ['NFT Marketplace', 'Discuss and showcase NFT artworks and blockchain art', 'nft-marketplace', '/icons/coin.svg', '#f39c12', 312, 1, 1],
        ['Art Critique Corner', 'Get feedback and improve your artistic skills', 'art-critique-corner', '/icons/feedback.svg', '#9b59b6', 67, 1, 1]
      ];

      const serverStmt = db.prepare(`INSERT INTO community_servers (name, description, slug, icon, color, member_count, is_public, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      servers.forEach(server => serverStmt.run(server));
      serverStmt.finalize();

      // Insert channels for each server
      const channels = [
        // Photography Hub channels
        ['general-chat', 'General photography discussions', 'text', 1, 0, 1],
        ['showcase', 'Share your best photographs', 'text', 1, 1, 1],
        ['gear-talk', 'Discuss cameras, lenses, and equipment', 'text', 1, 2, 1],
        ['editing-tips', 'Photo editing and post-processing', 'text', 1, 3, 1],
        
        // Digital Art Studio channels
        ['general', 'General digital art chat', 'text', 2, 0, 1],
        ['artwork-showcase', 'Show off your digital creations', 'text', 2, 1, 1],
        ['tutorials', 'Share and request tutorials', 'text', 2, 2, 1],
        ['software-help', 'Photoshop, Procreate, and other tools', 'text', 2, 3, 1],
        
        // Traditional Art Gallery channels
        ['general-discussion', 'All things traditional art', 'text', 3, 0, 1],
        ['paintings', 'Share your paintings', 'text', 3, 1, 1],
        ['drawings', 'Sketches and drawings', 'text', 3, 2, 1],
        ['materials-review', 'Discuss paints, brushes, papers', 'text', 3, 3, 1],
        
        // NFT Marketplace channels
        ['general-nft', 'NFT discussions and news', 'text', 4, 0, 1],
        ['showcase-nfts', 'Show your NFT collections', 'text', 4, 1, 1],
        ['marketplace-talk', 'Trading and marketplace discussions', 'text', 4, 2, 1],
        ['crypto-art', 'Blockchain art and technology', 'text', 4, 3, 1],
        
        // Art Critique Corner channels
        ['request-critique', 'Ask for feedback on your art', 'text', 5, 0, 1],
        ['beginner-help', 'Help for new artists', 'text', 5, 1, 1],
        ['advanced-critique', 'In-depth artistic analysis', 'text', 5, 2, 1],
        ['resources', 'Learning resources and references', 'text', 5, 3, 1]
      ];

      const channelStmt = db.prepare(`INSERT INTO community_channels (name, description, type, server_id, position, is_active) VALUES (?, ?, ?, ?, ?, ?)`);
      channels.forEach(channel => channelStmt.run(channel));
      channelStmt.finalize();

      // Insert sample server memberships
      const memberships = [
        [1, 1, 'admin'], [1, 2, 'member'], [1, 3, 'member'], [1, 4, 'member'],
        [2, 1, 'member'], [2, 2, 'moderator'], [2, 3, 'member'], [2, 5, 'member'],
        [3, 1, 'member'], [3, 2, 'member'], [3, 3, 'admin'], [3, 4, 'moderator']
      ];

      const membershipStmt = db.prepare(`INSERT INTO server_members (user_id, server_id, role) VALUES (?, ?, ?)`);
      memberships.forEach(membership => membershipStmt.run(membership));
      membershipStmt.finalize();

      // Insert sample channel messages
      const messages = [
        ['Welcome to the Photography Hub! Share your best shots here.', 1, 1, null, null, 'text', 0],
        ['Just uploaded my latest landscape series!', 2, 2, null, '/uploads/landscape-series.jpg', 'image', 0],
        ['Amazing composition! What camera did you use?', 3, 2, 2, null, 'text', 0],
        ['Shot with my Canon EOS R5 and 24-70mm lens', 2, 2, 3, null, 'text', 0],
        ['Working on a new digital portrait, any feedback?', 2, 6, null, '/uploads/digital-portrait.jpg', 'image', 0],
        ['The lighting on the face is perfect!', 1, 6, 5, null, 'text', 0],
        ['Does anyone have experience with NFT minting?', 3, 13, null, null, 'text', 0],
        ['I can help! Been minting on OpenSea for months.', 1, 13, 7, null, 'text', 0]
      ];

      const messageStmt = db.prepare(`INSERT INTO channel_messages (content, user_id, channel_id, reply_to, attachment_url, message_type, is_edited) VALUES (?, ?, ?, ?, ?, ?, ?)`);
      messages.forEach(message => messageStmt.run(message));
      messageStmt.finalize();

      // Insert sample artworks
      const artworks = [
        ['Digital Sunset', 'Beautiful digital art piece', 'Jane Artist', 299.99, 'Digital Art', '/uploads/sunset.jpg', 'active', 2],
        ['Abstract Colors', 'Vibrant abstract painting', 'John Painter', 459.99, 'Traditional Art', '/uploads/abstract.jpg', 'active', 2],
        ['Nature Photography', 'Stunning landscape photo', 'Photo Master', 199.99, 'Photography', '/uploads/nature.jpg', 'active', 2]
      ];

      const artworkStmt = db.prepare(`INSERT INTO artworks (title, description, artist, price, category, image_url, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      artworks.forEach(artwork => artworkStmt.run(artwork));
      artworkStmt.finalize();

      // Insert sample community posts
      const posts = [
        ['My Latest Digital Portrait', 'Working on this portrait for weeks, finally happy with the result!', 1, 2, '/uploads/portrait.jpg', 'approved', 'completed', 5.00, null, 15, 2, 3],
        ['Abstract Expressionism Study', 'Exploring color relationships in this abstract piece', 2, 3, '/uploads/abstract-study.jpg', 'approved', 'completed', 5.00, null, 23, 1, 5],
        ['Street Photography Collection', 'Some shots from my recent urban exploration', 3, 2, '/uploads/street-photo.jpg', 'pending', 'pending', 5.00, null, 8, 0, 2]
      ];

      const postStmt = db.prepare(`INSERT INTO community_posts (title, content, category_id, user_id, artwork_image, verification_status, payment_status, payment_amount, stripe_payment_id, upvotes, downvotes, comment_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      posts.forEach(post => postStmt.run(post));
      postStmt.finalize();

      // Insert sample comments
      const comments = [
        [1, 3, null, 'Amazing work! The lighting is perfect.'],
        [1, 1, null, 'Thank you! It took many hours to get the lighting right.'],
        [2, 2, null, 'Love the color palette you chose here.'],
        [2, 3, 3, 'I agree, the colors work really well together.']
      ];

      const commentStmt = db.prepare(`INSERT INTO community_comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)`);
      comments.forEach(comment => commentStmt.run(comment));
      commentStmt.finalize();

      // Insert sample articles
      const articles = [
        ['Getting Started with Digital Art', 'Learn the basics of digital art creation...', 'Art Expert'],
        ['Color Theory for Beginners', 'Understanding color relationships in art...', 'Design Guru'],
        ['Photography Composition Tips', 'Master the rule of thirds and more...', 'Photo Pro'],
        ['Community Guidelines', 'How to participate in our art community...', 'PassionArt Team']
      ];

      const articleStmt = db.prepare(`INSERT INTO articles (title, content, author) VALUES (?, ?, ?)`);
      articles.forEach(article => articleStmt.run(article));
      articleStmt.finalize();

      console.log('✅ SQLite database initialized with sample data');
      console.log('📊 Tables created: users, artworks, community_categories, community_posts, community_comments, community_votes, community_payments, community_moderation, articles, orders, user_sessions');
    }
  });
}

module.exports = db;
