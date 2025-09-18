-- PostgreSQL Database Setup for PassionArt Platform
-- Run this script after installing PostgreSQL

-- Create the database
CREATE DATABASE passionart_db;

-- Connect to the database
\c passionart_db;

-- Create user with password (you can change this)
CREATE USER passionart_user WITH PASSWORD 'motdepasse';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE passionart_db TO passionart_user;

-- Create Users table with enhanced features
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('artist', 'gallery', 'sponsor', 'admin')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    profile_picture VARCHAR(255),
    website VARCHAR(255),
    social_media JSONB,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Artworks table
CREATE TABLE artworks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    artist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    price DECIMAL(10,2),
    category VARCHAR(100),
    medium VARCHAR(100),
    dimensions VARCHAR(100),
    year_created INTEGER,
    image_url VARCHAR(255),
    gallery_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'exhibition')),
    featured BOOLEAN DEFAULT false,
    tags VARCHAR(255)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Galleries table (additional info for gallery users)
CREATE TABLE galleries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    gallery_name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    opening_hours JSONB,
    commission_rate DECIMAL(5,2) DEFAULT 0.30,
    specialization VARCHAR(255)[],
    established_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Articles table
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    category VARCHAR(100),
    tags VARCHAR(255)[],
    featured_image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER REFERENCES users(id),
    artwork_id INTEGER REFERENCES artworks(id),
    gallery_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    shipping_address TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Exhibitions table
CREATE TABLE exhibitions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    gallery_id INTEGER REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(255),
    featured_image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'past')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Exhibition_Artworks junction table
CREATE TABLE exhibition_artworks (
    id SERIAL PRIMARY KEY,
    exhibition_id INTEGER REFERENCES exhibitions(id) ON DELETE CASCADE,
    artwork_id INTEGER REFERENCES artworks(id) ON DELETE CASCADE,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Sponsorships table
CREATE TABLE sponsorships (
    id SERIAL PRIMARY KEY,
    sponsor_id INTEGER REFERENCES users(id),
    sponsored_type VARCHAR(20) CHECK (sponsored_type IN ('artist', 'exhibition', 'event')),
    sponsored_id INTEGER, -- Can reference different tables based on sponsored_type
    amount DECIMAL(10,2),
    duration_months INTEGER,
    start_date DATE,
    end_date DATE,
    terms TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions on all tables to the user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO passionart_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO passionart_user;

-- Insert default admin user
INSERT INTO users (email, password, user_type, first_name, last_name, verification_status) 
VALUES ('admin@passionart.com', '$2b$10$rQf7vO7QZ9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9', 'admin', 'Admin', 'User', 'verified');

-- Insert sample artists
INSERT INTO users (email, password, user_type, first_name, last_name, bio, verification_status) 
VALUES 
('jane@example.com', '$2b$10$rQf7vO7QZ9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9', 'artist', 'Jane', 'Artist', 'Contemporary artist specializing in abstract paintings', 'verified'),
('pierre@example.com', '$2b$10$rQf7vO7QZ9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9', 'artist', 'Pierre', 'Dubois', 'Sculptor working with modern materials', 'verified');

-- Insert sample gallery
INSERT INTO users (email, password, user_type, first_name, last_name, verification_status) 
VALUES ('gallery@example.com', '$2b$10$rQf7vO7QZ9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9', 'gallery', 'Modern', 'Gallery', 'verified');

-- Insert gallery details
INSERT INTO galleries (user_id, gallery_name, address, city, country, commission_rate) 
VALUES (4, 'Modern Art Gallery', '123 Art Street', 'Paris', 'France', 0.25);

-- Insert sample sponsor
INSERT INTO users (email, password, user_type, first_name, last_name, verification_status) 
VALUES ('sponsor@example.com', '$2b$10$rQf7vO7QZ9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9F9', 'sponsor', 'Art', 'Sponsor', 'verified');

-- Insert sample artworks
INSERT INTO artworks (title, description, artist_id, price, category, medium, year_created, status) 
VALUES 
('Abstract Symphony', 'A vibrant abstract painting exploring the relationship between color and emotion', 2, 2500.00, 'Abstract', 'Oil on Canvas', 2024, 'available'),
('Urban Reflections', 'Modern sculpture representing the urban landscape', 3, 4500.00, 'Sculpture', 'Steel and Glass', 2024, 'available'),
('Digital Dreams', 'Contemporary digital art piece', 2, 1200.00, 'Digital', 'Digital Print', 2024, 'available');

-- Insert sample articles
INSERT INTO articles (title, content, author_id, category, status, published_at) 
VALUES 
('The Future of Digital Art', 'Exploring how technology is transforming the art world...', 1, 'Technology', 'published', CURRENT_TIMESTAMP),
('Contemporary Sculpture Trends', 'An analysis of current trends in modern sculpture...', 1, 'Trends', 'published', CURRENT_TIMESTAMP),
('Supporting Emerging Artists', 'How galleries can better support new talent...', 1, 'Community', 'published', CURRENT_TIMESTAMP);

-- Create indexes for better performance
CREATE INDEX idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX idx_artworks_status ON artworks(status);
CREATE INDEX idx_artworks_category ON artworks(category);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_status ON articles(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artworks_updated_at BEFORE UPDATE ON artworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Show completion message
SELECT 'Database setup completed successfully!' as message;
