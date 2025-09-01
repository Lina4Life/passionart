-- PassionArt Database Setup
-- Run this script in PostgreSQL to set up the complete database

-- First, create the database and user (run as postgres superuser)
-- psql -U postgres -c "CREATE DATABASE passionart;"
-- psql -U postgres -c "CREATE USER passionart_user WITH PASSWORD 'motdepasse';"
-- psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE passionart TO passionart_user;"
-- psql -U postgres -c "ALTER USER passionart_user CREATEDB;"

-- Then connect to the passionart database and run the rest:
-- psql -U passionart_user -d passionart -f database_setup.sql

\c passionart;

-- Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for login/signup with different user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('artist', 'gallery', 'sponsor', 'admin')),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table (basic info for all users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artist profiles table (specific details for artists)
CREATE TABLE artist_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    art_medium VARCHAR(50), -- paintings, mixed_media, prints, photography, sculpture, digital_art
    short_bio TEXT,
    location VARCHAR(255),
    years_of_experience INTEGER,
    portfolio_url VARCHAR(255),
    instagram_url VARCHAR(255),
    twitter_url VARCHAR(255),
    website_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery profiles table (specific details for galleries)
CREATE TABLE gallery_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gallery_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    year_established INTEGER,
    gallery_type VARCHAR(100), -- contemporary, modern, classical, etc.
    description TEXT,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sponsor profiles table (specific details for sponsors)
CREATE TABLE sponsor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    industry VARCHAR(100),
    website_url VARCHAR(255),
    description TEXT,
    budget_range VARCHAR(50), -- small, medium, large, enterprise
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (for organizing artworks and articles)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (artworks in the store)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES users(id), -- references the artist who created it
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category_id UUID REFERENCES categories(id),
    medium VARCHAR(100), -- painting, sculpture, digital, etc.
    dimensions VARCHAR(100), -- e.g., "24x36 inches"
    year_created INTEGER,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reserved', 'draft')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product images table (multiple images per product)
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles table (for the articles page)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id), -- admin or guest author
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    featured_image_url VARCHAR(255),
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    read_time INTEGER, -- estimated read time in minutes
    views_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table (for tracking art purchases)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    shipping_address TEXT,
    billing_address TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table (products within each order)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL, -- price at time of purchase
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table (users can favorite artworks)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Comments table (for articles)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscriptions table
CREATE TABLE newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

-- Admin activity log table (for tracking admin actions)
CREATE TABLE admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- created, updated, deleted, etc.
    table_name VARCHAR(50) NOT NULL, -- which table was affected
    record_id UUID, -- ID of the affected record
    details JSONB, -- additional details about the action
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_products_artist_id ON products(artist_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_is_published ON articles(is_published);
CREATE INDEX idx_articles_is_featured ON articles(is_featured);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON artist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_profiles_updated_at BEFORE UPDATE ON gallery_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sponsor_profiles_updated_at BEFORE UPDATE ON sponsor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Technology', 'technology', 'Articles about technology in art'),
('AI & Art', 'ai-art', 'Artificial intelligence and creative expression'),
('Sustainability', 'sustainability', 'Sustainable practices in art'),
('VR/AR', 'vr-ar', 'Virtual and augmented reality in art'),
('Psychology', 'psychology', 'Psychology of art and creativity'),
('Blockchain', 'blockchain', 'Blockchain and NFTs in art'),
('Motion', 'motion', 'Motion graphics and kinetic art'),
('Digital Art', 'digital-art', 'Digital artwork category'),
('Paintings', 'paintings', 'Traditional and contemporary paintings'),
('Photography', 'photography', 'Photographic artworks'),
('Sculpture', 'sculpture', 'Three-dimensional artworks'),
('Mixed Media', 'mixed-media', 'Artworks combining multiple mediums'),
('Prints', 'prints', 'Limited edition prints and reproductions');

-- Insert sample articles for the articles page
INSERT INTO articles (
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
    'THE FUTURE OF DIGITAL ART: EXPLORING NFT LANDSCAPES',
    'future-of-digital-art-nft-landscapes',
    'An in-depth exploration of how blockchain technology is revolutionizing the art world and creating new possibilities for digital creators.',
    'The intersection of blockchain technology and digital art has created unprecedented opportunities for artists worldwide. NFTs (Non-Fungible Tokens) have emerged as a revolutionary force, enabling creators to authenticate, monetize, and distribute their digital works in ways previously impossible.

In this comprehensive exploration, we delve into the mechanics of NFT marketplaces, the impact on artist royalties, and the environmental considerations of blockchain-based art. We examine case studies of successful digital artists who have transformed their careers through NFT platforms, while also addressing the criticisms and challenges facing this emerging market.

The article also covers the technical aspects of minting NFTs, the role of smart contracts in ensuring artist attribution, and the future possibilities of programmable art that can evolve over time. As we look toward the future, we consider how NFTs might integrate with virtual reality experiences and augmented reality installations.

Finally, we discuss the democratization of art ownership and how fractional NFTs are making high-value digital art accessible to a broader audience, potentially reshaping how we think about art collection and investment in the digital age.',
    (SELECT id FROM categories WHERE slug = 'blockchain'),
    true,
    true,
    8,
    CURRENT_TIMESTAMP - INTERVAL '7 days'
),
(
    'NEURAL NETWORKS IN CREATIVE EXPRESSION',
    'neural-networks-creative-expression',
    'Understanding how artificial intelligence is becoming a collaborative tool rather than a replacement for human creativity.',
    'Artificial intelligence has entered the creative realm not as a replacement for human artists, but as a powerful collaborative tool that augments and enhances creative expression. This article explores the fascinating intersection of machine learning and artistic creation.

We begin by examining the evolution of AI art tools, from early generative algorithms to sophisticated neural networks capable of producing stunning visual art. The discussion covers various AI models including GANs (Generative Adversarial Networks), diffusion models, and transformer architectures, explaining how each contributes to different aspects of creative generation.

The piece delves into real-world applications, showcasing artists who have successfully integrated AI into their workflow. We explore how these tools are being used for concept generation, style exploration, and even collaborative creation where human intuition guides AI capabilities.

Ethical considerations form a crucial part of our analysis, addressing questions of authorship, originality, and the value of human creativity in an age of machine-generated art. We also examine the technical skills modern artists are developing to effectively collaborate with AI systems.

The article concludes with a forward-looking perspective on how AI might continue to evolve as a creative partner, potentially leading to entirely new forms of artistic expression that blur the boundaries between human and machine creativity.',
    (SELECT id FROM categories WHERE slug = 'ai-art'),
    true,
    true,
    6,
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    'SUSTAINABLE ART PRACTICES IN THE DIGITAL AGE',
    'sustainable-art-practices-digital-age',
    'Examining eco-friendly approaches to art creation and distribution in our increasingly digital world.',
    'As environmental consciousness grows within the art community, artists and institutions are seeking sustainable alternatives to traditional art practices. This comprehensive guide explores how digital technologies can support eco-friendly art creation and distribution.

The article begins with an analysis of the environmental impact of traditional art materials and processes, from oil paints containing heavy metals to the carbon footprint of international art shipping. We then explore digital alternatives that can significantly reduce environmental impact while maintaining artistic integrity.

Key topics include the rise of digital exhibitions and virtual galleries, which eliminate the need for physical transportation and reduce the carbon footprint of art consumption. We examine successful case studies of virtual exhibitions that have reached global audiences while maintaining the intimacy and impact of traditional gallery experiences.

The piece also covers sustainable digital practices, including energy-efficient computing for digital art creation, the environmental considerations of blockchain-based art platforms, and how artists can minimize their digital carbon footprint while maximizing their creative output.

We explore innovative materials and techniques being developed for physical art creation, including biodegradable mediums, recycled materials, and local sourcing strategies. The article concludes with practical guidelines for artists, galleries, and collectors seeking to reduce their environmental impact while supporting vibrant artistic communities.',
    (SELECT id FROM categories WHERE slug = 'sustainability'),
    true,
    false,
    7,
    CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
    'VIRTUAL REALITY GALLERIES: REDEFINING EXHIBITION SPACES',
    'virtual-reality-galleries-redefining-spaces',
    'How virtual reality is creating immersive art experiences that transcend physical limitations.',
    'Virtual reality technology is revolutionizing how we experience and interact with art, creating exhibition spaces that transcend the physical limitations of traditional galleries. This exploration examines the transformative potential of VR in the art world.

The article begins with an overview of current VR gallery platforms and technologies, analyzing their capabilities and limitations. We explore how VR environments can create impossible architectural spaces, allowing for exhibitions that would be physically unfeasible in the real world.

Case studies feature pioneering virtual galleries and their innovative approaches to digital curation. We examine how artists are creating works specifically designed for VR environments, exploring new forms of interactive and immersive art that respond to viewer presence and movement.

The discussion covers the technical challenges of creating compelling VR art experiences, including considerations of resolution, presence, motion sickness, and accessibility. We also address the social aspects of virtual gallery visits, exploring how VR platforms are facilitating shared experiences and virtual opening events.

Economic implications are thoroughly examined, including how VR galleries are democratizing access to art by eliminating geographical barriers and reducing exhibition costs. The article concludes with predictions for the future of VR in art, including potential integration with haptic feedback systems and brain-computer interfaces.',
    (SELECT id FROM categories WHERE slug = 'vr-ar'),
    true,
    false,
    5,
    CURRENT_TIMESTAMP - INTERVAL '2 days'
),
(
    'THE PSYCHOLOGY OF COLOR IN DIGITAL MEDIA',
    'psychology-of-color-digital-media',
    'Scientific insights into how color perception affects emotional response in digital art forms.',
    'Color psychology plays a crucial role in how viewers experience and interpret digital art. This scientific exploration examines the neurological and psychological mechanisms behind color perception and its application in digital creative mediums.

The article begins with an overview of color theory fundamentals, covering the electromagnetic spectrum, color models (RGB, CMYK, HSV), and how digital displays reproduce color. We then delve into the neuroscience of color perception, explaining how the human visual system processes color information and translates it into emotional and cognitive responses.

Cultural variations in color perception and meaning are thoroughly examined, highlighting how artists must consider diverse audiences when creating works for global digital distribution. The piece explores how different cultures associate colors with specific emotions, concepts, and spiritual meanings.

Practical applications for digital artists are extensively covered, including color palette selection for different emotional impacts, the use of color contrast to guide viewer attention, and techniques for creating visual harmony in digital compositions. We examine case studies of successful digital artworks and analyze their effective use of color psychology.

The article also addresses technical considerations unique to digital media, including screen calibration, color gamut limitations, and how different devices affect color reproduction. Advanced topics include the emerging field of computational color science and how AI algorithms are being developed to automatically optimize color choices for specific emotional targets.',
    (SELECT id FROM categories WHERE slug = 'psychology'),
    true,
    false,
    9,
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    'BLOCKCHAIN AUTHENTICATION FOR ARTIST ROYALTIES',
    'blockchain-authentication-artist-royalties',
    'A technical deep-dive into how smart contracts are ensuring fair compensation for artists.',
    'The traditional art market has long struggled with ensuring artists receive ongoing compensation for their works secondary sales. Blockchain technology and smart contracts are revolutionizing this landscape by providing automated, transparent royalty systems.

This technical analysis begins with an explanation of smart contract functionality, covering how these self-executing contracts with terms directly written into code can automatically distribute royalties whenever an artwork is resold. We examine different blockchain platforms and their varying approaches to royalty implementation.

The article provides detailed case studies of successful royalty systems, analyzing their code architecture, gas efficiency, and real-world performance. We explore the challenges of implementing complex royalty structures, including split payments to multiple parties, tiered royalty rates, and handling of collaborative works.

Technical implementation details are thoroughly covered, including best practices for smart contract security, methods for preventing royalty circumvention, and integration with various marketplace platforms. The piece addresses scalability concerns and examines Layer 2 solutions that make micro-royalty payments economically viable.

Legal and regulatory considerations form a significant portion of the analysis, exploring how blockchain-based royalty systems interact with existing copyright law and international regulations. The article concludes with forward-looking perspectives on how evolving blockchain technology might further enhance artist compensation mechanisms.',
    (SELECT id FROM categories WHERE slug = 'blockchain'),
    true,
    false,
    12,
    CURRENT_TIMESTAMP - INTERVAL '4 days'
),
(
    'AUGMENTED REALITY IN PUBLIC ART INSTALLATIONS',
    'augmented-reality-public-art-installations',
    'Case studies of successful AR art projects that have transformed urban spaces worldwide.',
    'Augmented reality is transforming public spaces by overlaying digital art onto physical environments, creating dynamic installations that respond to viewer interaction and environmental changes. This comprehensive examination explores the most innovative AR public art projects worldwide.

The article begins with an overview of AR technology fundamentals, explaining how devices recognize physical spaces and overlay digital content. We examine different AR platforms and their capabilities for artistic expression, from smartphone-based experiences to advanced headset installations.

Featured case studies include groundbreaking projects from major cities, analyzing their artistic concept, technical implementation, and public reception. We explore how artists are using AR to address social issues, create historical overlays, and transform mundane urban spaces into interactive art experiences.

Technical challenges specific to public AR installations are thoroughly discussed, including GPS accuracy, lighting conditions, device compatibility, and maintaining experiences across diverse hardware platforms. The piece examines solutions for creating robust AR experiences that function reliably in variable outdoor conditions.

Community engagement strategies are explored, showing how successful AR art projects incorporate local history, culture, and community input. We analyze the collaborative process between artists, technologists, and urban planners required to implement large-scale AR installations.

The article concludes with analysis of the social impact of AR public art, including its role in urban revitalization, tourism, and community building. Future possibilities are explored, including integration with smart city infrastructure and the potential for persistent, community-maintained AR art spaces.',
    (SELECT id FROM categories WHERE slug = 'vr-ar'),
    true,
    false,
    6,
    CURRENT_TIMESTAMP - INTERVAL '6 days'
),
(
    'MOTION GRAPHICS: THE EVOLUTION OF KINETIC ART',
    'motion-graphics-evolution-kinetic-art',
    'Tracing the lineage from traditional kinetic sculptures to modern digital motion design.',
    'Motion graphics represent the contemporary evolution of kinetic art, transforming from mechanical sculptures to sophisticated digital experiences. This historical and technical exploration traces the development of motion-based art from its physical origins to its current digital manifestations.

The article begins with a comprehensive history of kinetic art, examining pioneering works by artists like Alexander Calder and Jean Tinguely. We explore how mechanical movement in sculpture laid the groundwork for contemporary digital motion design, identifying key principles that transcend medium.

Technical evolution is thoroughly documented, from early computer animation systems to modern motion graphics software. We examine how advances in processing power, display technology, and software tools have expanded the possibilities for motion-based artistic expression.

Contemporary motion graphics techniques are analyzed in detail, covering principles of timing, easing, and visual flow. The piece explores how motion designers use principles borrowed from traditional animation while developing new approaches unique to digital media.

Case studies feature outstanding examples of motion graphics in various contexts, from branding and advertising to fine art installations. We analyze the artistic and technical approaches that make these works effective, examining their use of color, typography, and dynamic composition.

The article addresses the intersection of motion graphics with other technologies, including real-time rendering, interactive media, and generative art systems. Future directions are explored, including the potential for AI-assisted motion design and integration with emerging display technologies like holographic projections.',
    (SELECT id FROM categories WHERE slug = 'motion'),
    true,
    false,
    8,
    CURRENT_TIMESTAMP - INTERVAL '8 days'
);

-- Sample newsletter subscriptions
INSERT INTO newsletter_subscriptions (email, subscribed_at) VALUES
('artist@example.com', CURRENT_TIMESTAMP - INTERVAL '10 days'),
('gallery@example.com', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('collector@example.com', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('artlover@example.com', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Update article view counts with realistic numbers
UPDATE articles SET views_count = FLOOR(RANDOM() * 1500 + 250);

-- Grant permissions to the user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO passionart_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO passionart_user;

ECHO 'Database setup completed successfully!';
ECHO 'Tables created: users, user_profiles, artist_profiles, gallery_profiles, sponsor_profiles';
ECHO 'Tables created: categories, products, product_images, articles, orders, order_items';
ECHO 'Tables created: favorites, comments, newsletter_subscriptions, admin_activity_log';
ECHO 'Sample data inserted: categories, articles, newsletter subscriptions';
ECHO 'Ready for application connection!';
