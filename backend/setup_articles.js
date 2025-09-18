const db = require('./config/database');

// Create enhanced articles table if needed
const createEnhancedArticlesTable = () => {
  // First check if enhanced table already exists
  db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='articles'", (err, result) => {
    if (err) {
      console.error('Error checking table structure:', err);
      return;
    }
    
    // Check if the table has the enhanced structure
    if (result && result.sql.includes('author_id') && result.sql.includes('category')) {
      console.log('Enhanced articles table already exists');
      insertSampleArticles();
      return;
    }
    
    // Need to create enhanced table
    console.log('Creating enhanced articles table...');
    
    // Drop backup table if exists
    db.run(`DROP TABLE IF EXISTS articles_backup`, (dropErr) => {
      if (dropErr) {
        console.error('Error dropping backup table:', dropErr);
        return;
      }
      
      // Rename current table as backup
      db.run(`ALTER TABLE articles RENAME TO articles_backup`, (renameErr) => {
        if (renameErr) {
          console.log('No existing articles table to backup, creating new one...');
        }
        
        // Create new articles table with proper structure
        db.run(`CREATE TABLE IF NOT EXISTS articles (
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
        )`, (createErr) => {
          if (createErr) {
            console.error('Error creating articles table:', createErr);
            return;
          }
          
          console.log('Enhanced articles table created successfully');
          insertSampleArticles();
        });
      });
    });
  });
};

const insertSampleArticles = () => {
  // Check if articles already exist
  db.get("SELECT COUNT(*) as count FROM articles", (countErr, countResult) => {
    if (countErr) {
      console.error('Error checking article count:', countErr);
      return;
    }
    
    if (countResult.count > 0) {
      console.log('Articles already exist in database');
      process.exit(0);
      return;
    }
    
    // First, ensure we have a user to associate articles with
    db.run(`INSERT OR IGNORE INTO users (username, email, password, user_type) 
            VALUES ('admin', 'admin@passionart.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')`, 
      function(userErr) {
        if (userErr) {
          console.error('Error creating admin user:', userErr);
          return;
        }
        
        // Get admin user ID
        db.get("SELECT id FROM users WHERE email = 'admin@passionart.com' OR username = 'admin' LIMIT 1", (getUserErr, user) => {
          if (getUserErr) {
            console.error('Error getting admin user:', getUserErr);
            return;
          }
          
          // If no admin user, use user ID 1
          const adminId = user ? user.id : 1;
          
          // Sample articles data
          const articles = [
            {
              title: "THE FUTURE OF DIGITAL ART: EXPLORING NFT LANDSCAPES",
              content: "The digital art world is experiencing an unprecedented transformation. Non-Fungible Tokens (NFTs) have emerged as a revolutionary technology that's reshaping how we create, distribute, and value digital artwork. This comprehensive exploration delves into the intricate relationship between blockchain technology and artistic expression, examining how artists are leveraging decentralized platforms to reach global audiences and establish new economic models. From the early days of CryptoPunks to the sophisticated art marketplaces of today, we trace the evolution of digital art ownership and its implications for both creators and collectors. The democratization of art through blockchain technology has opened doors for emerging artists worldwide, while established institutions grapple with integrating these new forms of artistic expression into traditional frameworks. As we look toward the future, the intersection of artificial intelligence, virtual reality, and blockchain promises even more innovative approaches to digital art creation and curation.",
              author_id: adminId,
              category: "TECHNOLOGY",
              tags: "NFT,blockchain,digital art,cryptocurrency,innovation",
              views: 1250,
              published_at: "2025-08-20 10:00:00"
            },
            {
              title: "NEURAL NETWORKS IN CREATIVE EXPRESSION",
              content: "Artificial intelligence has transcended its role as a mere tool and evolved into a collaborative partner in the creative process. This in-depth analysis explores how neural networks are transforming artistic expression across multiple mediums, from generative art and music composition to interactive installations and performance art. We examine case studies of artists who have successfully integrated AI into their creative workflows, highlighting both the opportunities and challenges that arise when human creativity meets machine learning. The philosophical implications of AI-generated art raise fundamental questions about authorship, originality, and the nature of creativity itself. As algorithms become more sophisticated in understanding and replicating artistic styles, we must consider how this technology can enhance rather than replace human artistic vision. The symbiotic relationship between artist and algorithm opens new possibilities for exploration and expression that were previously unimaginable.",
              author_id: adminId,
              category: "AI & ART",
              tags: "artificial intelligence,neural networks,generative art,machine learning,creativity",
              views: 980,
              published_at: "2025-08-18 14:30:00"
            },
            {
              title: "SUSTAINABLE ART PRACTICES IN THE DIGITAL AGE",
              content: "As environmental consciousness grows within the art community, artists and institutions are reevaluating their practices to minimize ecological impact. This comprehensive study examines sustainable approaches to art creation, exhibition, and distribution in our increasingly digital world. From eco-friendly materials and energy-efficient digital processes to virtual exhibitions that reduce carbon footprints, the art world is pioneering innovative solutions to environmental challenges. We explore case studies of galleries and museums that have successfully implemented green practices, as well as artists who have made sustainability central to their creative practice. The transition to digital platforms for art distribution and viewing has created new opportunities for reducing environmental impact while expanding global accessibility. However, this shift also presents unique challenges, including the energy consumption of blockchain technologies and digital storage systems. Through interviews with leading practitioners and analysis of emerging trends, we provide a roadmap for sustainable art practices that don't compromise artistic integrity or innovation.",
              author_id: adminId,
              category: "SUSTAINABILITY",
              tags: "sustainability,eco-friendly,green practices,environmental impact,digital transformation",
              views: 756,
              published_at: "2025-08-15 09:15:00"
            },
            {
              title: "VIRTUAL REALITY GALLERIES: REDEFINING EXHIBITION SPACES",
              content: "Virtual reality technology is revolutionizing how we experience and interact with art, creating immersive exhibition spaces that transcend physical limitations. This exploration examines the innovative ways museums, galleries, and independent artists are utilizing VR to create unprecedented artistic experiences. From virtual reconstructions of historical sites to entirely imagined spaces that defy the laws of physics, VR galleries offer unlimited creative possibilities. We analyze successful VR art exhibitions and installations, highlighting the unique challenges and opportunities presented by this medium. The democratization of VR technology has enabled smaller institutions and individual artists to create world-class exhibition experiences without the constraints of physical space or geographical location. However, the technical requirements and learning curves associated with VR development present significant barriers to entry. Through detailed case studies and expert interviews, we examine how VR is reshaping curatorial practices and audience engagement strategies.",
              author_id: adminId,
              category: "VR/AR",
              tags: "virtual reality,VR galleries,immersive art,digital exhibitions,spatial computing",
              views: 543,
              published_at: "2025-08-12 16:45:00"
            },
            {
              title: "THE PSYCHOLOGY OF COLOR IN DIGITAL MEDIA",
              content: "Color perception and emotional response form the foundation of effective digital art creation. This scientific exploration delves into the psychological mechanisms that govern how viewers interpret and react to color in digital contexts. Drawing from extensive research in cognitive psychology, neuroscience, and visual perception, we examine how digital artists can leverage color theory to create more impactful and emotionally resonant works. The transition from traditional pigments to digital color spaces has introduced new possibilities and challenges for artists working in digital mediums. We analyze how different display technologies, viewing environments, and cultural contexts influence color perception and emotional response. Through controlled studies and real-world applications, we demonstrate how understanding color psychology can enhance artistic communication and viewer engagement. The research includes practical guidelines for digital artists seeking to optimize their color choices for maximum emotional impact across various platforms and viewing conditions.",
              author_id: adminId,
              category: "PSYCHOLOGY",
              tags: "color psychology,digital media,visual perception,cognitive science,emotional response",
              views: 1100,
              published_at: "2025-08-10 11:20:00"
            },
            {
              title: "BLOCKCHAIN AUTHENTICATION FOR ARTIST ROYALTIES",
              content: "The implementation of blockchain technology for artist royalty management represents a paradigm shift in how creative professionals are compensated for their work. This technical deep-dive examines the mechanics of smart contracts and their application in ensuring fair and transparent royalty distribution. We explore various blockchain platforms and their approaches to artist compensation, analyzing the benefits and limitations of each system. The traditional art market has long struggled with issues of provenance, authenticity, and fair compensation for artists, particularly in secondary sales. Blockchain technology offers solutions to these persistent challenges through immutable records and automated payment systems. However, the implementation of these systems requires careful consideration of legal frameworks, technical infrastructure, and user adoption challenges. Through detailed analysis of existing platforms and emerging protocols, we provide insights into the future of artist compensation in the digital age.",
              author_id: adminId,
              category: "BLOCKCHAIN",
              tags: "blockchain,smart contracts,artist royalties,cryptocurrency,digital rights",
              views: 820,
              published_at: "2025-08-08 13:10:00"
            },
            {
              title: "AUGMENTED REALITY IN PUBLIC ART INSTALLATIONS",
              content: "Augmented reality technology is transforming public spaces into dynamic canvases for artistic expression, creating interactive experiences that blend digital and physical worlds. This comprehensive analysis examines successful AR art projects that have redefined urban landscapes and community engagement. From location-based installations that respond to environmental data to interactive murals that come alive through mobile devices, AR is opening new possibilities for public art. We explore the collaborative processes involved in creating AR installations, including partnerships between artists, technologists, and city planners. The accessibility and democratic nature of AR technology enables broader community participation in public art projects, while also presenting unique challenges related to technical implementation and ongoing maintenance. Through case studies from major cities worldwide, we demonstrate how AR installations can revitalize public spaces and create meaningful connections between art and community.",
              author_id: adminId,
              category: "AR/PUBLIC",
              tags: "augmented reality,public art,community engagement,urban design,interactive installations",
              views: 675,
              published_at: "2025-08-05 10:30:00"
            },
            {
              title: "MOTION GRAPHICS: THE EVOLUTION OF KINETIC ART",
              content: "The digital evolution of kinetic art through motion graphics represents a fascinating intersection of traditional artistic principles and cutting-edge technology. This historical and technical analysis traces the lineage from early kinetic sculptures and optical art to contemporary motion design and animated installations. We examine how digital tools have expanded the possibilities for time-based art, enabling artists to create complex animations and interactive systems that respond to environmental inputs. The democratization of motion graphics software has enabled a new generation of artists to explore temporal and spatial relationships in their work. However, the technical complexity of motion graphics requires artists to develop new skills and collaborative relationships with programmers and technologists. Through interviews with pioneering motion graphics artists and analysis of landmark projects, we explore how this medium continues to evolve and influence contemporary art practice.",
              author_id: adminId,
              category: "MOTION",
              tags: "motion graphics,kinetic art,animation,digital art,time-based media",
              views: 892,
              published_at: "2025-08-02 15:00:00"
            }
          ];
          
          // Insert articles
          const insertStmt = db.prepare(`
            INSERT INTO articles (title, content, author_id, category, tags, views, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `);
          
          articles.forEach(article => {
            insertStmt.run([
              article.title,
              article.content,
              article.author_id,
              article.category,
              article.tags,
              article.views,
              article.published_at
            ]);
          });
          
          insertStmt.finalize();
          console.log('Sample articles inserted successfully');
          process.exit(0);
        });
      });
  });
};

// Run the setup
createEnhancedArticlesTable();

