-- PassionArt Database Seed Data
-- Sample data for testing and development

-- Insert sample admin user (password should be hashed in application)
-- This is just for reference - actual user creation should go through the API

-- Sample categories are already inserted in schema.sql

-- Sample articles for the articles page
INSERT INTO articles (
    id,
    title, 
    slug, 
    excerpt, 
    content,
    category_id,
    is_published,
    is_featured,
    read_time,
    published_at
) VALUES 
(
    uuid_generate_v4(),
    'THE FUTURE OF DIGITAL ART: EXPLORING NFT LANDSCAPES',
    'future-of-digital-art-nft-landscapes',
    'An in-depth exploration of how blockchain technology is revolutionizing the art world and creating new possibilities for digital creators.',
    'Full article content would go here... This would be a comprehensive exploration of NFTs, blockchain technology, and their impact on the art world.',
    (SELECT id FROM categories WHERE slug = 'blockchain'),
    true,
    true,
    8,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    'NEURAL NETWORKS IN CREATIVE EXPRESSION',
    'neural-networks-creative-expression',
    'Understanding how artificial intelligence is becoming a collaborative tool rather than a replacement for human creativity.',
    'Full article content about AI and creativity would go here...',
    (SELECT id FROM categories WHERE slug = 'ai-art'),
    true,
    true,
    6,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    'SUSTAINABLE ART PRACTICES IN THE DIGITAL AGE',
    'sustainable-art-practices-digital-age',
    'Examining eco-friendly approaches to art creation and distribution in our increasingly digital world.',
    'Full article content about sustainable art practices...',
    (SELECT id FROM categories WHERE slug = 'sustainability'),
    true,
    false,
    7,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    'VIRTUAL REALITY GALLERIES: REDEFINING EXHIBITION SPACES',
    'virtual-reality-galleries-redefining-spaces',
    'How virtual reality is creating immersive art experiences that transcend physical limitations.',
    'Full article content about VR galleries...',
    (SELECT id FROM categories WHERE slug = 'vr-ar'),
    true,
    false,
    5,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    'THE PSYCHOLOGY OF COLOR IN DIGITAL MEDIA',
    'psychology-of-color-digital-media',
    'Scientific insights into how color perception affects emotional response in digital art forms.',
    'Full article content about color psychology...',
    (SELECT id FROM categories WHERE slug = 'psychology'),
    true,
    false,
    9,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    'BLOCKCHAIN AUTHENTICATION FOR ARTIST ROYALTIES',
    'blockchain-authentication-artist-royalties',
    'A technical deep-dive into how smart contracts are ensuring fair compensation for artists.',
    'Full article content about blockchain and royalties...',
    (SELECT id FROM categories WHERE slug = 'blockchain'),
    true,
    false,
    12,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    'AUGMENTED REALITY IN PUBLIC ART INSTALLATIONS',
    'augmented-reality-public-art-installations',
    'Case studies of successful AR art projects that have transformed urban spaces worldwide.',
    'Full article content about AR installations...',
    (SELECT id FROM categories WHERE slug = 'vr-ar'),
    true,
    false,
    6,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    'MOTION GRAPHICS: THE EVOLUTION OF KINETIC ART',
    'motion-graphics-evolution-kinetic-art',
    'Tracing the lineage from traditional kinetic sculptures to modern digital motion design.',
    'Full article content about motion graphics...',
    (SELECT id FROM categories WHERE slug = 'motion'),
    true,
    false,
    8,
    CURRENT_TIMESTAMP
);

-- Views counter (for demo purposes)
UPDATE articles SET views_count = FLOOR(RANDOM() * 1000 + 100);

-- Sample newsletter subscriptions
INSERT INTO newsletter_subscriptions (email, subscribed_at) VALUES
('user1@example.com', CURRENT_TIMESTAMP),
('user2@example.com', CURRENT_TIMESTAMP),
('user3@example.com', CURRENT_TIMESTAMP);

-- Note: Sample users, products, and other data should be created through the API
-- to ensure proper password hashing and data validation

-- Update article authors to null for now (until we have sample users)
-- In production, these would reference actual admin users
