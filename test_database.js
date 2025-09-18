// Test database connection and setup
const pool = require('./backend/config/db');

async function testConnection() {
  try {
    console.log('ðŸ”„ Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('âœ… Database connection successful!');
    
    // Test if tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log(`\nðŸ“Š Found ${result.rows.length} tables:`);
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Test sample data
    const articlesCount = await client.query('SELECT COUNT(*) FROM articles WHERE is_published = true');
    const categoriesCount = await client.query('SELECT COUNT(*) FROM categories');
    
    console.log(`\nðŸ“ Sample data loaded:`);
    console.log(`   - ${articlesCount.rows[0].count} published articles`);
    console.log(`   - ${categoriesCount.rows[0].count} categories`);
    
    // Test sample article query
    const featuredArticles = await client.query(`
      SELECT title, excerpt, read_time 
      FROM articles 
      WHERE is_featured = true 
      LIMIT 3
    `);
    
    console.log(`\nðŸŒŸ Featured articles:`);
    featuredArticles.rows.forEach(article => {
      console.log(`   - ${article.title} (${article.read_time} min read)`);
    });
    
    client.release();
    console.log('\nðŸŽ‰ Database is ready for your application!');
    console.log('\nNext steps:');
    console.log('1. Start backend: cd backend && npm start');
    console.log('2. Start frontend: cd frontend && npm run dev');
    console.log('3. Visit: http://localhost:5173');
    
  } catch (error) {
    console.error('âŒ Database connection failed:', error.message);
    console.log('\nðŸ”§ Troubleshooting:');
    console.log('1. Make sure PostgreSQL is installed and running');
    console.log('2. Check your .env file configuration');
    console.log('3. Run the database setup script first');
    console.log('4. Verify database credentials');
  } finally {
    await pool.end();
  }
}

testConnection();

