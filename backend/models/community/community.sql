-- Community/Blog Database Schema for PassionArt
-- Reddit-like chat blog community with payment system

-- Categories/Subreddits for different art topics
CREATE TABLE IF NOT EXISTS community_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    banner_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    member_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community posts (similar to Reddit posts)
CREATE TABLE IF NOT EXISTS community_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    content TEXT,
    post_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'link', 'artwork'
    image_urls TEXT[], -- Array of image URLs
    link_url VARCHAR(500),
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES community_categories(id) ON DELETE CASCADE,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false, -- For paid artwork posts
    payment_status VARCHAR(50) DEFAULT 'none', -- 'none', 'pending', 'paid', 'verified'
    payment_amount DECIMAL(10,2) DEFAULT 0,
    payment_id VARCHAR(100), -- Stripe/PayPal payment ID
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    rejection_reason TEXT,
    tags TEXT[],
    language_code VARCHAR(10) DEFAULT 'en',
    view_count INTEGER DEFAULT 0,
    is_nsfw BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments system
CREATE TABLE IF NOT EXISTS community_comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES community_comments(id) ON DELETE CASCADE, -- For nested comments
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT false,
    language_code VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voting system for posts and comments
CREATE TABLE IF NOT EXISTS community_votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    comment_id INTEGER REFERENCES community_comments(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id, comment_id)
);

-- User subscriptions to categories
CREATE TABLE IF NOT EXISTS community_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES community_categories(id) ON DELETE CASCADE,
    notification_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id)
);

-- Payment transactions for artwork posts
CREATE TABLE IF NOT EXISTS community_payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    currency VARCHAR(3) DEFAULT 'EUR',
    payment_method VARCHAR(50), -- 'stripe', 'paypal', 'card'
    payment_provider_id VARCHAR(100), -- External payment ID
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    payment_data JSONB, -- Store additional payment metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Content moderation and verification queue
CREATE TABLE IF NOT EXISTS community_moderation (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    moderator_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- 'verify', 'reject', 'remove', 'feature'
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advertisements system
CREATE TABLE IF NOT EXISTS community_ads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    link_url VARCHAR(500),
    ad_type VARCHAR(50) DEFAULT 'banner', -- 'banner', 'sidebar', 'inline'
    category_id INTEGER REFERENCES community_categories(id),
    target_language VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Multi-language content translations
CREATE TABLE IF NOT EXISTS community_translations (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL, -- 'post', 'comment', 'category'
    content_id INTEGER NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    translated_title VARCHAR(300),
    translated_content TEXT,
    translator_id INTEGER REFERENCES users(id),
    is_auto_translated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User reputation system
CREATE TABLE IF NOT EXISTS community_reputation (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_points INTEGER DEFAULT 0,
    post_karma INTEGER DEFAULT 0,
    comment_karma INTEGER DEFAULT 0,
    verified_artworks INTEGER DEFAULT 0,
    moderator_actions INTEGER DEFAULT 0,
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reported content
CREATE TABLE IF NOT EXISTS community_reports (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    comment_id INTEGER REFERENCES community_comments(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_votes ON community_posts(upvotes DESC, downvotes ASC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_votes_user ON community_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_payments_user ON community_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_verification ON community_posts(verification_status, payment_status);

-- Insert default categories
INSERT INTO community_categories (name, slug, description) VALUES
('Digital Art', 'digital-art', 'Share and discuss digital artwork, illustrations, and graphic design'),
('Traditional Art', 'traditional-art', 'Paintings, drawings, sculptures and classical art forms'),
('Photography', 'photography', 'Share your photography and discuss techniques'),
('Street Art', 'street-art', 'Murals, graffiti, and urban art'),
('Gallery News', 'gallery-news', 'News and updates from art galleries worldwide'),
('Art Techniques', 'art-techniques', 'Discuss and learn different art techniques'),
('Art Critiques', 'art-critiques', 'Get feedback on your artwork'),
('Commissions', 'commissions', 'Find and offer art commission work'),
('Art Events', 'art-events', 'Exhibitions, workshops, and art events'),
('General Discussion', 'general', 'General art-related discussions')
ON CONFLICT (slug) DO NOTHING;
