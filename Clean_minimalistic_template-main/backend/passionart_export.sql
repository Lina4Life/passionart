-- PassionArt Database Export
-- Generated on 2025-09-01T11:33:59.791Z
-- 

-- Table: users
DROP TABLE IF EXISTS users;
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
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  , verification_token_expires INTEGER, verification_token TEXT, email_verified INTEGER DEFAULT 0);

-- Table: user_sessions
DROP TABLE IF EXISTS user_sessions;
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    token TEXT,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

-- Table: orders
DROP TABLE IF EXISTS orders;
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

-- Table: community_moderation
DROP TABLE IF EXISTS community_moderation;
CREATE TABLE community_moderation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    moderator_id INTEGER,
    action TEXT CHECK(action IN ('approve', 'reject', 'flag', 'featured')),
    reason TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts (id),
    FOREIGN KEY (moderator_id) REFERENCES users (id)
  );

-- Table: artworks
DROP TABLE IF EXISTS artworks;
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
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, keywords TEXT, payment_intent_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

-- Table: server_members
DROP TABLE IF EXISTS server_members;
CREATE TABLE server_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    server_id INTEGER NOT NULL,
    role TEXT DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (server_id) REFERENCES community_servers(id) ON DELETE CASCADE,
    UNIQUE(user_id, server_id)
  );

-- Table: community_payments
DROP TABLE IF EXISTS community_payments;
CREATE TABLE community_payments (
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
  );

-- Table: community_votes
DROP TABLE IF EXISTS community_votes;
CREATE TABLE community_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    post_id INTEGER,
    comment_id INTEGER,
    vote_type TEXT CHECK(vote_type IN ('up', 'down')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES community_posts (id),
    FOREIGN KEY (comment_id) REFERENCES community_comments (id)
  );

-- Table: community_channels
DROP TABLE IF EXISTS community_channels;
CREATE TABLE community_channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'text',
    server_id INTEGER NOT NULL,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (server_id) REFERENCES community_servers(id) ON DELETE CASCADE
  );

-- Table: community_servers
DROP TABLE IF EXISTS community_servers;
CREATE TABLE community_servers (
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
  );

-- Table: community_posts
DROP TABLE IF EXISTS community_posts;
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

-- Table: articles
DROP TABLE IF EXISTS articles;
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

-- Table: community_categories
DROP TABLE IF EXISTS community_categories;
CREATE TABLE community_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

-- Table: community_comments
DROP TABLE IF EXISTS community_comments;
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

-- Table: articles_backup
DROP TABLE IF EXISTS articles_backup;
CREATE TABLE "articles_backup" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    author TEXT,
    status TEXT DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

-- Table: channel_messages
DROP TABLE IF EXISTS channel_messages;
CREATE TABLE channel_messages (
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
  );

-- Data for table: users
INSERT INTO users (id, username, email, password, first_name, last_name, user_type, verification_status, created_at, updated_at, verification_token_expires, verification_token, email_verified) VALUES (1, 'admin', 'admin@passionart.com', 'admin123', 'Admin', 'User', 'admin', 'verified', '2025-08-28 10:27:25', '2025-08-28 10:27:25', NULL, NULL, 0);
INSERT INTO users (id, username, email, password, first_name, last_name, user_type, verification_status, created_at, updated_at, verification_token_expires, verification_token, email_verified) VALUES (10, NULL, 'youssefelgharib03@gmail.com', '$2b$10$4m.GQlCK0hZVbG73PpouGusr29lbbwP81QadGNJbYkwW67ui11bOu', 'youssef', 'test', 'admin', 'verified', '2025-08-29 16:22:41', '2025-09-01 09:41:13', NULL, NULL, 0);

-- Data for table: community_posts
INSERT INTO community_posts (id, title, content, category_id, user_id, artwork_image, verification_status, payment_status, payment_amount, stripe_payment_id, upvotes, downvotes, comment_count, is_featured, created_at, updated_at) VALUES (1, 'My Latest Digital Portrait', 'Working on this portrait for weeks, finally happy with the result!', 1, 2, '/uploads/portrait.jpg', 'approved', 'completed', 5, NULL, 15, 2, 3, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25');
INSERT INTO community_posts (id, title, content, category_id, user_id, artwork_image, verification_status, payment_status, payment_amount, stripe_payment_id, upvotes, downvotes, comment_count, is_featured, created_at, updated_at) VALUES (2, 'Abstract Expressionism Study', 'Exploring color relationships in this abstract piece', 2, 3, '/uploads/abstract-study.jpg', 'approved', 'completed', 5, NULL, 23, 1, 5, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25');
INSERT INTO community_posts (id, title, content, category_id, user_id, artwork_image, verification_status, payment_status, payment_amount, stripe_payment_id, upvotes, downvotes, comment_count, is_featured, created_at, updated_at) VALUES (3, 'Street Photography Collection', 'Some shots from my recent urban exploration', 3, 2, '/uploads/street-photo.jpg', 'pending', 'pending', 5, NULL, 8, 0, 2, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25');

-- Data for table: articles
INSERT INTO articles (id, title, content, author_id, category, tags, featured_image, status, views, published_at, created_at, updated_at) VALUES (2, 'THE FUTURE OF DIGITAL ART: EXPLORING NFT LANDSCAPES', 'The digital art revolution has transformed the creative landscape in unprecedented ways. Non-Fungible Tokens (NFTs) have emerged as a groundbreaking technology that promises to reshape how we perceive, create, and trade digital artwork. This comprehensive exploration delves into the intricate world of blockchain-based art ownership and its implications for artists worldwide.

The concept of digital scarcity, once considered an oxymoron, has become a reality through blockchain technology. Artists can now create unique, verifiable digital assets that cannot be replicated or forged. This technological breakthrough has opened new revenue streams for digital creators who previously struggled with piracy and unauthorized reproduction of their work.

Smart contracts embedded within NFTs provide artists with unprecedented control over their creations. These self-executing contracts can include royalty mechanisms, ensuring that creators receive compensation each time their work is resold in secondary markets. This perpetual income stream represents a paradigm shift from traditional art sales models.

The environmental impact of blockchain technology has sparked intense debate within the art community. While some networks consume significant energy, newer blockchain solutions are emerging with more sustainable consensus mechanisms. Artists and platforms are increasingly conscious of their carbon footprint and actively seeking eco-friendly alternatives.

Digital galleries and virtual museums are redefining how we experience art. Virtual reality spaces allow for immersive exhibitions that transcend physical limitations, enabling global audiences to engage with artworks in entirely new ways. These digital venues offer artists unlimited creative possibilities for presenting their work.

The democratization of art ownership through fractional NFTs is creating new investment opportunities. Multiple individuals can now own shares of expensive digital artworks, making high-value art accessible to a broader audience. This fractional ownership model could revolutionize art investment and collection practices.

As we look toward the future, the integration of artificial intelligence with NFT creation is opening fascinating possibilities. AI-generated art, authenticated through blockchain technology, challenges traditional notions of authorship and creativity. This convergence of technologies continues to push the boundaries of what we consider art.

The regulatory landscape surrounding NFTs remains in flux, with governments worldwide grappling with classification and taxation issues. Artists and collectors must navigate this evolving legal framework while the industry awaits clearer guidelines and standardization.', 1, 'AI & ART', 'NFT,blockchain,digital art,cryptocurrency,smart contracts', NULL, 'published', 2157, '2025-08-15 14:30:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25');
INSERT INTO articles (id, title, content, author_id, category, tags, featured_image, status, views, published_at, created_at, updated_at) VALUES (3, 'BLOCKCHAIN AUTHENTICATION FOR ARTIST ROYALTIES', 'The integration of blockchain technology into art markets has revolutionized how artists receive compensation for their work, creating transparent, automated systems for royalty distribution that protect creator rights across secondary sales and licensing agreements.

Smart contracts embedded in blockchain-authenticated artworks automatically execute royalty payments whenever ownership transfers occur. This eliminates the need for intermediaries and ensures that artists receive their fair share of proceeds from every subsequent sale of their work.

Transparency in provenance tracking has become a cornerstone of blockchain-based art authentication. Every transaction, modification, and ownership change is permanently recorded on the distributed ledger, creating an immutable history that prevents fraud and forgery.

Decentralized autonomous organizations (DAOs) are emerging as new models for collective art ownership and royalty distribution. These blockchain-based entities allow multiple stakeholders to participate in art investment while automatically distributing returns according to predetermined smart contract rules.

Cross-platform compatibility ensures that blockchain-authenticated artworks can be traded across different marketplaces while maintaining their royalty structures. This interoperability prevents platform lock-in and gives artists more freedom in how they distribute their work.

Micropayments enabled by blockchain technology allow for granular royalty distributions that were previously impractical. Artists can now receive compensation for individual views, shares, or interactions with their digital artworks, creating new revenue streams.

Fractional ownership models facilitated by blockchain technology democratize art investment while ensuring that original creators continue to benefit from appreciation in value. Token holders can trade their shares while artists maintain royalty rights.

International royalty payments become seamless through blockchain networks that operate across borders without traditional banking intermediaries. This global accessibility is particularly beneficial for artists in developing countries who previously faced barriers to international art markets.

Dispute resolution mechanisms built into smart contracts provide automated arbitration for royalty disagreements. These systems can resolve conflicts without expensive legal proceedings, making art investment more accessible to smaller creators and collectors.', 1, 'BLOCKCHAIN', 'blockchain,smart contracts,royalties,art authentication,decentralization', NULL, 'published', 1789, '2025-08-05 09:30:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25');
INSERT INTO articles (id, title, content, author_id, category, tags, featured_image, status, views, published_at, created_at, updated_at) VALUES (4, 'MOTION GRAPHICS: WHERE TECHNOLOGY MEETS CREATIVITY', 'Motion graphics represent the convergence of traditional design principles with cutting-edge technology, creating dynamic visual experiences that captivate audiences across digital platforms. This evolving medium continues to push the boundaries of what''s possible in visual communication.

Real-time rendering capabilities have transformed motion graphics from pre-calculated animations to interactive, responsive experiences. Modern graphics processing units can generate complex visual effects instantly, allowing for live manipulation and audience participation in ways previously impossible.

Procedural animation techniques use algorithmic generation to create motion that responds to data inputs, environmental conditions, or user interactions. This approach enables graphics that evolve and adapt, creating unique experiences for each viewer while maintaining consistent aesthetic principles.

The integration of artificial intelligence in motion graphics workflows is automating routine tasks while opening new creative possibilities. AI can analyze music, speech, or environmental data to generate synchronized visual responses, creating more immersive and emotionally resonant experiences.

Virtual production techniques borrowed from film industry are revolutionizing how motion graphics are created and integrated into live events. LED wall technology and real-time compositing allow designers to create immersive environments that respond instantly to performer movements and audience reactions.

Cross-platform optimization ensures that motion graphics maintain their impact across devices with varying processing capabilities. Adaptive rendering techniques automatically adjust complexity based on hardware limitations, ensuring smooth playback on everything from smartphones to large-scale installations.

Interactive motion graphics respond to user input in real-time, creating personalized experiences that blur the line between artwork and user interface. Touch gestures, eye tracking, and voice commands can all trigger visual responses, making viewers active participants in the creative experience.

Data visualization through motion graphics transforms complex information into engaging, understandable narratives. Animated charts, graphs, and infographics can reveal patterns and trends that static presentations might miss, making data more accessible to broader audiences.

Collaborative creation tools enable teams of designers, animators, and programmers to work together in real-time on motion graphics projects. Cloud-based platforms allow for simultaneous editing and version control, streamlining the creative process for complex productions.', 1, 'MOTION', 'motion graphics,animation,real-time rendering,procedural design,interactive media', NULL, 'published', 1456, '2025-08-03 13:45:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25');
INSERT INTO articles (id, title, content, author_id, category, tags, featured_image, status, views, published_at, created_at, updated_at) VALUES (5, 'AUGMENTED REALITY IN PUBLIC ART INSTALLATIONS', 'Augmented reality is transforming public spaces into dynamic galleries where digital artworks coexist with physical environments, creating layered experiences that challenge traditional boundaries between virtual and real, temporary and permanent artistic interventions.

Location-based AR installations respond to specific geographical contexts, creating artworks that exist only in particular places while remaining accessible to global audiences through mobile devices. These site-specific digital interventions can comment on local history, culture, or environmental conditions.

Community participation in AR art projects democratizes public art creation, allowing local residents to contribute digital elements to shared virtual spaces. This collaborative approach ensures that public art reflects the diversity and creativity of the communities it serves.

Historical reconstruction through AR enables public art that bridges past and present, overlaying historical imagery or recreated structures onto contemporary landscapes. These temporal layers help audiences understand how spaces have evolved while imagining future possibilities.

Interactive storytelling in public AR installations creates narrative experiences that unfold as viewers move through space. These location-aware stories can adapt to individual paths and preferences, creating personalized journeys through shared public artworks.

Social AR features allow multiple viewers to share synchronized augmented reality experiences, fostering community engagement and collective art appreciation. Friends and strangers can interact with the same virtual elements simultaneously, creating shared moments of wonder and discovery.

Environmental responsiveness enables AR installations that react to weather conditions, time of day, or seasonal changes. These dynamic artworks create different experiences throughout the year, encouraging repeat visits and ongoing community engagement.

Accessibility features in AR public art ensure that these digital experiences can be enjoyed by people with diverse abilities. Audio descriptions, haptic feedback, and simplified visual modes make augmented reality art more inclusive and welcoming to all community members.

Perpetual art preservation through AR technology means that public artworks can exist indefinitely without physical maintenance or degradation. Digital installations can be updated, evolved, or restored to their original state without the limitations of physical materials.', 1, 'AR/PUBLIC', 'augmented reality,public art,community engagement,location-based art,digital installation', NULL, 'published', 1335, '2025-08-01 10:00:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25');
INSERT INTO articles (id, title, content, author_id, category, tags, featured_image, status, views, published_at, created_at, updated_at) VALUES (6, 'VIRTUAL GALLERIES: THE FUTURE OF ART EXHIBITION', 'The traditional gallery space is undergoing a radical transformation as virtual reality technology creates new possibilities for art exhibition and viewer engagement. Virtual galleries are not merely digital replicas of physical spaces; they represent entirely new paradigms for experiencing and interacting with art.

Immersive virtual environments can transport viewers to impossible architectural spaces that defy physical limitations. Artists can create exhibitions in fantastical settings, from underwater caverns to floating space stations, providing context and atmosphere that would be impossible to achieve in traditional galleries.

Interactive elements within virtual galleries allow for unprecedented levels of engagement. Viewers can manipulate digital artworks, explore their creation process, and even step inside paintings to experience them from within. This level of interaction transforms passive observation into active participation.

Global accessibility is perhaps the most significant advantage of virtual galleries. Art enthusiasts from around the world can attend exhibition openings, participate in artist talks, and engage with communities of collectors and creators without the constraints of geography or physical ability.

The curation process in virtual spaces opens new creative possibilities for exhibition designers. Digital curators can create narrative journeys through artworks, implementing dynamic lighting, soundscapes, and even time-based elements that evolve throughout the exhibition period.

Virtual reality democratizes the gallery experience by eliminating many barriers to access. Economic constraints, physical disabilities, and geographical limitations no longer prevent art appreciation. This inclusivity is fostering more diverse audiences and expanding the art market globally.

Collaborative virtual spaces allow multiple artists to work together in shared digital environments, creating collective artworks that exist only in virtual reality. These collaborative pieces push the boundaries of traditional artistic practice and challenge notions of individual authorship.

The preservation of virtual exhibitions creates permanent archives of artistic moments. Unlike physical exhibitions that exist only temporarily, virtual galleries can be revisited indefinitely, creating a living history of artistic movements and cultural moments.

Augmented reality integration bridges the gap between physical and virtual spaces. Viewers can use AR devices to overlay digital artworks onto physical environments, creating hybrid experiences that combine the best aspects of both worlds.', 1, 'VR/AR', 'virtual reality,VR galleries,digital exhibition,immersive art,accessibility', NULL, 'published', 1923, '2025-08-08 11:15:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25');
INSERT INTO articles (id, title, content, author_id, category, tags, featured_image, status, views, published_at, created_at, updated_at) VALUES (7, 'THE EVOLUTION OF DIGITAL BRUSHES AND TOOLS', 'Digital art tools have evolved from simple bitmap editors to sophisticated platforms that simulate traditional media while enabling entirely new forms of creative expression. The development of digital brushes and artistic tools continues to reshape how artists approach their craft in the 21st century.

Pressure sensitivity technology has advanced to provide incredibly nuanced control over digital brushes, detecting not just pressure but also tilt, rotation, and velocity. This multi-dimensional input allows digital tools to respond as naturally as traditional brushes, pencils, and pens.

Artificial intelligence is being integrated into digital brushes to provide intelligent assistance during the creative process. AI-powered tools can suggest color palettes, predict brush strokes, or even complete partially drawn elements while maintaining the artist''s individual style.

Customizable brush engines allow artists to create their own tools tailored to specific techniques or aesthetic goals. These programmable brushes can simulate everything from watercolor bleeding to oil paint impasto, or create entirely abstract effects impossible with traditional media.

Collaborative drawing tools enable multiple artists to work simultaneously on the same digital canvas, with each contributor''s actions visible in real-time. These platforms support remote artistic collaboration and have become essential for distributed creative teams.

Vector-based drawing tools provide infinite scalability and editability, allowing artists to create works that can be reproduced at any size without quality loss. These tools are particularly valuable for commercial art, illustration, and designs intended for multiple formats.

Haptic feedback technology adds a tactile dimension to digital art creation, providing physical sensations that correspond to virtual brush interactions. Artists can feel the texture of digital canvas or the resistance of different simulated materials.

Cloud-based art platforms allow artists to access their tools and works from any device, enabling creativity unconstrained by hardware limitations. These platforms also facilitate automatic backup and version control, protecting artistic work from loss.

Procedural generation tools create complex textures, patterns, and effects through algorithmic processes. These tools can generate infinite variations of organic textures, geometric patterns, or abstract effects, providing artists with vast libraries of creative resources.', 1, 'TECHNOLOGY', 'digital tools,brush technology,AI assistance,creative software,digital painting', NULL, 'published', 1245, '2025-07-28 15:30:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25');
INSERT INTO articles (id, title, content, author_id, category, tags, featured_image, status, views, published_at, created_at, updated_at) VALUES (8, 'THE PSYCHOLOGY OF COLOR IN DIGITAL MEDIA', 'Color psychology has taken on new dimensions in the digital age, where screen technology and algorithmic processing create unprecedented opportunities for emotional manipulation and artistic expression. Understanding how colors affect human psychology in digital contexts is crucial for contemporary artists and designers.

Digital displays operate fundamentally differently from traditional pigments, using additive light rather than subtractive materials. This RGB color system allows for brilliant, saturated colors that can exceed the range possible with physical paints, creating new psychological impacts that artists are only beginning to explore.

Cultural variations in color perception become even more complex in global digital environments. What evokes joy in one culture may represent mourning in another, and digital artists must navigate these differences when creating work for international audiences.

The temporal aspect of digital color allows for dynamic palettes that shift and evolve over time. Artists can create emotional journeys through color transitions, using algorithmic changes to guide viewer emotions throughout the experience of a digital artwork.

Screen addiction and digital fatigue have introduced new considerations for color choice in digital art. Blue light exposure, color temperature variations, and viewing duration all affect how audiences perceive and are affected by digital color schemes.

Personalization algorithms are beginning to tailor color experiences to individual psychological profiles. AI systems can analyze user responses to different color combinations and adjust digital artworks accordingly, creating personalized emotional experiences.

Synesthesia research has informed digital art creation, with artists deliberately creating cross-sensory experiences through color. Digital platforms can now simulate the way synesthetes experience color as sound, texture, or taste, opening new avenues for inclusive art creation.

The psychology of dark mode and light mode interfaces has influenced artistic composition in digital media. Artists must consider how their color choices will appear across different viewing modes and device settings, adapting their palettes accordingly.

Neuromarketing research continues to reveal how specific color combinations trigger measurable brain responses. Digital artists are incorporating these findings into their work, creating pieces designed to induce specific emotional and physiological states in viewers.', 1, 'PSYCHOLOGY', 'color psychology,digital media,visual perception,cognitive science,emotional response', NULL, 'published', 1567, '2025-08-10 11:20:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25');
INSERT INTO articles (id, title, content, author_id, category, tags, featured_image, status, views, published_at, created_at, updated_at) VALUES (9, 'SUSTAINABLE ART PRACTICES IN THE DIGITAL AGE', 'Environmental consciousness has become a driving force in contemporary art, with artists worldwide embracing sustainable practices that minimize ecological impact while maximizing creative expression. The digital age presents unique opportunities and challenges for environmentally responsible art creation.

Traditional art materials often come with significant environmental costs, from toxic pigments to unsustainable harvesting practices. Digital art offers an alternative that eliminates many of these concerns, though it introduces new considerations around energy consumption and electronic waste.

Carbon-neutral art studios are becoming increasingly common, with artists investing in renewable energy sources and implementing waste reduction strategies. Solar-powered studios, rainwater harvesting systems, and composting programs are just some of the initiatives being adopted by environmentally conscious creators.

The concept of ''slow art'' encourages artists to adopt more deliberate, sustainable creation processes. This movement emphasizes quality over quantity, promoting artwork that is built to last and created with minimal environmental impact. Digital preservation techniques ensure that electronic artworks can survive for generations without degradation.

Sustainable art education is reshaping how new artists approach their practice. Art schools are integrating environmental awareness into their curricula, teaching students to consider the ecological implications of their material choices and creative processes.

Recycled and upcycled materials are finding new life in contemporary art installations. Artists are transforming electronic waste, plastic debris, and discarded industrial materials into powerful statements about consumption and environmental responsibility.

The sharing economy has influenced art creation, with tool libraries and collaborative workshops reducing the need for individual artists to own every piece of equipment. This communal approach to resources decreases overall environmental impact while fostering artistic community.

Virtual exhibitions and digital galleries have significantly reduced the carbon footprint associated with art transportation and venue operations. Online art sales platforms eliminate the need for physical shipping in many cases, further reducing environmental impact.

Biodegradable art materials and non-toxic alternatives are becoming more sophisticated and accessible. Artists no longer need to compromise their vision to maintain environmental responsibility, as sustainable options continue to improve in quality and variety.', 1, 'SUSTAINABILITY', 'sustainability,eco-friendly,green art,environmental awareness,renewable energy', NULL, 'published', 1834, '2025-08-12 16:45:00', '2025-08-29 15:47:25', '2025-08-29 15:47:25');

-- Data for table: community_categories
INSERT INTO community_categories (id, name, slug, description, icon, color, created_at) VALUES (1, 'Digital Art', 'digital-art', 'Share your digital masterpieces', '🎨', '#FF6B6B', '2025-08-28 10:27:25');
INSERT INTO community_categories (id, name, slug, description, icon, color, created_at) VALUES (2, 'Traditional Art', 'traditional-art', 'Paintings, drawings, and physical art', '🖼️', '#4ECDC4', '2025-08-28 10:27:25');
INSERT INTO community_categories (id, name, slug, description, icon, color, created_at) VALUES (3, 'Photography', 'photography', 'Capture the world through your lens', '📸', '#45B7D1', '2025-08-28 10:27:25');
INSERT INTO community_categories (id, name, slug, description, icon, color, created_at) VALUES (4, 'Sculpture', 'sculpture', '3D art and sculptural works', '🗿', '#96CEB4', '2025-08-28 10:27:25');
INSERT INTO community_categories (id, name, slug, description, icon, color, created_at) VALUES (5, 'Mixed Media', 'mixed-media', 'Experimental and mixed medium art', '🎭', '#FFEAA7', '2025-08-28 10:27:25');

-- Data for table: community_comments
INSERT INTO community_comments (id, post_id, user_id, parent_id, content, upvotes, downvotes, created_at, updated_at) VALUES (1, 1, 3, NULL, 'Amazing work! The lighting is perfect.', 0, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25');
INSERT INTO community_comments (id, post_id, user_id, parent_id, content, upvotes, downvotes, created_at, updated_at) VALUES (2, 1, 1, NULL, 'Thank you! It took many hours to get the lighting right.', 0, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25');
INSERT INTO community_comments (id, post_id, user_id, parent_id, content, upvotes, downvotes, created_at, updated_at) VALUES (3, 2, 2, NULL, 'Love the color palette you chose here.', 0, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25');
INSERT INTO community_comments (id, post_id, user_id, parent_id, content, upvotes, downvotes, created_at, updated_at) VALUES (4, 2, 3, 3, 'I agree, the colors work really well together.', 0, 0, '2025-08-28 10:27:25', '2025-08-28 10:27:25');

-- Data for table: artworks
INSERT INTO artworks (id, title, description, artist, price, category, image_url, status, user_id, created_at, updated_at, keywords, payment_intent_id) VALUES (1, 'Digital Sunset', 'Beautiful digital art piece', 'Jane Artist', 299.99, 'Digital Art', '/uploads/sunset.jpg', 'approved', 2, '2025-08-28 10:27:25', '2025-08-29 14:50:22', NULL, NULL);
INSERT INTO artworks (id, title, description, artist, price, category, image_url, status, user_id, created_at, updated_at, keywords, payment_intent_id) VALUES (2, 'Abstract Colors', 'Vibrant abstract painting', 'John Painter', 459.99, 'Traditional Art', '/uploads/abstract.jpg', 'approved', 2, '2025-08-28 10:27:25', '2025-08-29 14:50:23', NULL, NULL);
INSERT INTO artworks (id, title, description, artist, price, category, image_url, status, user_id, created_at, updated_at, keywords, payment_intent_id) VALUES (3, 'Nature Photography', 'Stunning landscape photo', 'Photo Master', 199.99, 'Photography', '/uploads/nature.jpg', 'approved', 2, '2025-08-28 10:27:25', '2025-08-29 14:50:24', NULL, NULL);
INSERT INTO artworks (id, title, description, artist, price, category, image_url, status, user_id, created_at, updated_at, keywords, payment_intent_id) VALUES (4, 'test', '', 'test', 666, 'painting', '/uploads/1756478623135-960416432.png', 'approved', NULL, '2025-08-29 14:43:43', '2025-08-29 17:30:44', NULL, NULL);

