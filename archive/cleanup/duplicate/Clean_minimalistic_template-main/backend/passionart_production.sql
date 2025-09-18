-- PassionArt Database Export for Production Server
-- Generated on 2025-09-01
-- This file contains the complete database structure and data

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS channel_messages;
DROP TABLE IF EXISTS community_channels;
DROP TABLE IF EXISTS server_members;
DROP TABLE IF EXISTS community_servers;
DROP TABLE IF EXISTS community_comments;
DROP TABLE IF EXISTS community_votes;
DROP TABLE IF EXISTS community_payments;
DROP TABLE IF EXISTS community_moderation;
DROP TABLE IF EXISTS community_posts;
DROP TABLE IF EXISTS community_categories;
DROP TABLE IF EXISTS articles_backup;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS artworks;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS users;

-- Create tables in correct order
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    user_type TEXT DEFAULT 'user',
    verification_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verification_token_expires INTEGER,
    verification_token TEXT,
    email_verified INTEGER DEFAULT 0
);

CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    token TEXT,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE artworks (
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
    keywords TEXT,
    payment_intent_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    artwork_id INTEGER,
    total_amount DECIMAL(10,2),
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (artwork_id) REFERENCES artworks (id)
);

CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER,
    category TEXT,
    tags TEXT,
    featured_image TEXT,
    status TEXT DEFAULT 'published',
    views INTEGER DEFAULT 0,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id)
);

CREATE TABLE community_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_posts (
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
);

CREATE TABLE community_comments (
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
);

-- Insert sample data
INSERT INTO users (id, username, email, password, first_name, last_name, user_type, verification_status, created_at, updated_at, verification_token_expires, verification_token, email_verified) VALUES 
(1, 'admin', 'admin@passionart.com', 'admin123', 'Admin', 'User', 'admin', 'verified', '2025-08-28 10:27:25', '2025-08-28 10:27:25', NULL, NULL, 0),
(10, NULL, 'youssefelgharib03@gmail.com', '$2b$10$4m.GQlCK0hZVbG73PpouGusr29lbbwP81QadGNJbYkwW67ui11bOu', 'youssef', 'test', 'admin', 'verified', '2025-08-29 16:22:41', '2025-09-01 09:41:13', NULL, NULL, 0);

INSERT INTO community_categories (id, name, slug, description, icon, color, created_at) VALUES 
(1, 'Digital Art', 'digital-art', 'Share your digital masterpieces', '🎨', '#FF6B6B', '2025-08-28 10:27:25'),
(2, 'Traditional Art', 'traditional-art', 'Paintings, drawings, and physical art', '🖼️', '#4ECDC4', '2025-08-28 10:27:25'),
(3, 'Photography', 'photography', 'Capture the world through your lens', '📸', '#45B7D1', '2025-08-28 10:27:25'),
(4, 'Sculpture', 'sculpture', '3D art and sculptural works', '🗿', '#96CEB4', '2025-08-28 10:27:25'),
(5, 'Mixed Media', 'mixed-media', 'Experimental and mixed medium art', '🎭', '#FFEAA7', '2025-08-28 10:27:25');

INSERT INTO artworks (id, title, description, artist, price, category, image_url, status, user_id, created_at, updated_at, keywords, payment_intent_id) VALUES 
(1, 'Digital Sunset', 'Beautiful digital art piece', 'Jane Artist', 299.99, 'Digital Art', '/uploads/sunset.jpg', 'approved', 2, '2025-08-28 10:27:25', '2025-08-29 14:50:22', NULL, NULL),
(2, 'Abstract Colors', 'Vibrant abstract painting', 'John Painter', 459.99, 'Traditional Art', '/uploads/abstract.jpg', 'approved', 2, '2025-08-28 10:27:25', '2025-08-29 14:50:23', NULL, NULL),
(3, 'Nature Photography', 'Stunning landscape photo', 'Photo Master', 199.99, 'Photography', '/uploads/nature.jpg', 'approved', 2, '2025-08-28 10:27:25', '2025-08-29 14:50:24', NULL, NULL),
(4, 'test', '', 'test', 666, 'painting', '/uploads/1756478623135-960416432.png', 'approved', NULL, '2025-08-29 14:43:43', '2025-08-29 17:30:44', NULL, NULL);

-- Insert all the articles (this is a large dataset with 8 comprehensive articles)
INSERT INTO articles (id, title, content, author_id, category, tags, featured_image, status, views, published_at, created_at, updated_at) VALUES 
(2, 'THE FUTURE OF DIGITAL ART: EXPLORING NFT LANDSCAPES', 'The digital art revolution has transformed the creative landscape in unprecedented ways. Non-Fungible Tokens (NFTs) have emerged as a groundbreaking technology that promises to reshape how we perceive, create, and trade digital artwork...', 1, 'AI & ART', 'NFT,blockchain,digital art,cryptocurrency,smart contracts', NULL, 'published', 2157, '2025-08-15 14:30:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25'),
(3, 'BLOCKCHAIN AUTHENTICATION FOR ARTIST ROYALTIES', 'The integration of blockchain technology into art markets has revolutionized how artists receive compensation for their work...', 1, 'BLOCKCHAIN', 'blockchain,smart contracts,royalties,art authentication,decentralization', NULL, 'published', 1789, '2025-08-05 09:30:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25'),
(4, 'MOTION GRAPHICS: WHERE TECHNOLOGY MEETS CREATIVITY', 'Motion graphics represent the convergence of traditional design principles with cutting-edge technology...', 1, 'MOTION', 'motion graphics,animation,real-time rendering,procedural design,interactive media', NULL, 'published', 1456, '2025-08-03 13:45:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25'),
(5, 'AUGMENTED REALITY IN PUBLIC ART INSTALLATIONS', 'Augmented reality is transforming public spaces into dynamic galleries...', 1, 'AR/PUBLIC', 'augmented reality,public art,community engagement,location-based art,digital installation', NULL, 'published', 1335, '2025-08-01 10:00:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25'),
(6, 'VIRTUAL GALLERIES: THE FUTURE OF ART EXHIBITION', 'The traditional gallery space is undergoing a radical transformation...', 1, 'VR/AR', 'virtual reality,VR galleries,digital exhibition,immersive art,accessibility', NULL, 'published', 1923, '2025-08-08 11:15:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25'),
(7, 'THE EVOLUTION OF DIGITAL BRUSHES AND TOOLS', 'Digital art tools have evolved from simple bitmap editors to sophisticated platforms...', 1, 'TECHNOLOGY', 'digital tools,brush technology,AI assistance,creative software,digital painting', NULL, 'published', 1245, '2025-07-28 15:30:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25'),
(8, 'THE PSYCHOLOGY OF COLOR IN DIGITAL MEDIA', 'Color psychology has taken on new dimensions in the digital age...', 1, 'PSYCHOLOGY', 'color psychology,digital media,visual perception,cognitive science,emotional response', NULL, 'published', 1567, '2025-08-10 11:20:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25'),
(9, 'SUSTAINABLE ART PRACTICES IN THE DIGITAL AGE', 'Environmental consciousness has become a driving force in contemporary art...', 1, 'SUSTAINABILITY', 'sustainability,eco-friendly,green art,environmental awareness,renewable energy', NULL, 'published', 1834, '2025-08-12 16:45:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25');

-- Add some sample community posts
INSERT INTO community_posts (id, title, content, category_id, user_id, artwork_image, verification_status, payment_status, payment_amount, stripe_payment_id, upvotes, downvotes, comment_count, is_featured, created_at, updated_at) VALUES 
(1, 'My Latest Digital Portrait', 'Working on this portrait for weeks, finally happy with the result!', 1, 2, '/uploads/portrait.jpg', 'approved', 'completed', 5, NULL, 15, 2, 3, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25'),
(2, 'Abstract Expressionism Study', 'Exploring color relationships in this abstract piece', 2, 3, '/uploads/abstract-study.jpg', 'approved', 'completed', 5, NULL, 23, 1, 5, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25'),
(3, 'Street Photography Collection', 'Some shots from my recent urban exploration', 3, 2, '/uploads/street-photo.jpg', 'pending', 'pending', 5, NULL, 8, 0, 2, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25');

-- Add sample comments
INSERT INTO community_comments (id, post_id, user_id, parent_id, content, upvotes, downvotes, created_at, updated_at) VALUES 
(1, 1, 3, NULL, 'Amazing work! The lighting is perfect.', 0, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25'),
(2, 1, 1, NULL, 'Thank you! It took many hours to get the lighting right.', 0, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25'),
(3, 2, 2, NULL, 'Love the color palette you chose here.', 0, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25'),
(4, 2, 3, 3, 'I agree, the colors work really well together.', 0, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25');

-- Set auto-increment counters to avoid conflicts
-- SQLite will automatically handle this when inserting new records
