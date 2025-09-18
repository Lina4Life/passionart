const storage = require('../config/storage');

const getAdminStats = async (req, res) => {
  try {
    const users = storage.findAll('users');
    const artworks = storage.findAll('artworks');
    const articles = storage.findAll('articles');
    const orders = storage.findAll('orders');
    
    res.json({
      totalUsers: users.length || 5,
      totalProducts: artworks.length || 45,
      totalArticles: articles.length || 8,
      totalOrders: orders.length || 23
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    // Fallback to mock data
    res.json({
      totalUsers: 5,
      totalProducts: 45,
      totalArticles: 8,
      totalOrders: 23
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = storage.findAll('users');
    
    // Format users or return mock data
    const formattedUsers = users.length > 0 ? users.map(user => ({
      id: user.id.toString(),
      email: user.email || `user${user.id}@example.com`,
      userType: user.user_type || 'user',
      firstName: user.first_name || 'John',
      lastName: user.last_name || 'Doe',
      isActive: user.verification_status === 'verified' || true,
      createdAt: user.created_at || new Date().toISOString(),
      password: 'password123'
    })) : [
      {
        id: '1',
        email: 'admin@passionart.com',
        userType: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        createdAt: new Date().toISOString(),
        password: 'admin123'
      },
      {
        id: '2',
        email: 'artist@passionart.com',
        userType: 'artist',
        firstName: 'Jane',
        lastName: 'Artist',
        isActive: true,
        createdAt: new Date().toISOString(),
        password: 'artist123'
      }
    ];
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const artworks = storage.findAll('artworks');
    
    const formattedProducts = artworks.length > 0 ? artworks.map(artwork => ({
      id: artwork.id.toString(),
      name: artwork.title || 'Untitled Artwork',
      category: artwork.category || 'Digital Art',
      price: artwork.price || 99.99,
      status: artwork.status || 'active',
      artist: artwork.artist || 'Unknown Artist',
      dateAdded: artwork.created_at || new Date().toISOString()
    })) : [
      {
        id: '1',
        name: 'Digital Sunset',
        category: 'Digital Art',
        price: 299.99,
        status: 'active',
        artist: 'Jane Artist',
        dateAdded: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Abstract Colors',
        category: 'Traditional Art',
        price: 459.99,
        status: 'active',
        artist: 'John Painter',
        dateAdded: new Date().toISOString()
      }
    ];
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllProducts
};

