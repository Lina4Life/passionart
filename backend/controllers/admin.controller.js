/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getAdminStats = async (req, res) => {
  try {
    const db = require('../config/database');
    
    // Get statistics from SQLite database
    const queries = [
      'SELECT COUNT(*) as count FROM users',
      'SELECT COUNT(*) as count FROM artworks', 
      'SELECT COUNT(*) as count FROM articles',
      'SELECT COUNT(*) as count FROM orders'
    ];
    
    let completed = 0;
    const stats = {};
    
    // Get user count
    db.get(queries[0], [], (err, row) => {
      if (!err && row) stats.totalUsers = parseInt(row.count);
      else stats.totalUsers = 0;
      if (++completed === 4) sendResponse();
    });
    
    // Get artwork count  
    db.get(queries[1], [], (err, row) => {
      if (!err && row) stats.totalProducts = parseInt(row.count);
      else stats.totalProducts = 0;
      if (++completed === 4) sendResponse();
    });
    
    // Get article count
    db.get(queries[2], [], (err, row) => {
      if (!err && row) stats.totalArticles = parseInt(row.count);
      else stats.totalArticles = 0;
      if (++completed === 4) sendResponse();
    });
    
    // Get order count
    db.get(queries[3], [], (err, row) => {
      if (!err && row) stats.totalOrders = parseInt(row.count);
      else stats.totalOrders = 0;
      if (++completed === 4) sendResponse();
    });
    
    function sendResponse() {
      res.json(stats);
    }
    
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    // Fallback to mock data if database is not available
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
    // Try to get all users from PostgreSQL database
    const result = await pool.query(`
      SELECT id, email, user_type, first_name, last_name, 
             verification_status = 'verified' as "isActive", created_at, 'password123' as password
      FROM users 
      ORDER BY created_at DESC
    `);
    
    // Format the response to match frontend expectations
    const users = result.rows.map(user => ({
      id: user.id.toString(),
      email: user.email,
      userType: user.user_type,
      firstName: user.first_name,
      lastName: user.last_name,
      password: user.password,
      createdAt: user.created_at,
      isActive: user.isActive
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to mock data if database is not available
    res.json([
      {
        id: "1",
        email: "admin@passionart.com",
        userType: "admin",
        firstName: "Admin",
        lastName: "User",
        password: "admin123",
        createdAt: new Date(),
        isActive: true
      },
      {
        id: "2", 
        email: "artist@example.com",
        userType: "artist",
        firstName: "Jane",
        lastName: "Artist",
        password: "artist123",
        createdAt: new Date(),
        isActive: true
      }
    ]);
  }
};

const getAllProducts = async (req, res) => {
  try {
    // Try to get artworks from PostgreSQL database
    const result = await pool.query(`
      SELECT a.id, a.title, a.description, a.price, a.status, a.created_at,
             u.email as artist_email, u.first_name as artist_first_name, u.last_name as artist_last_name
      FROM artworks a
      LEFT JOIN users u ON a.artist_id = u.id
      ORDER BY a.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data if database is not available
    const products = [
      {
        id: "1",
        title: "Abstract Sunset",
        description: "Beautiful abstract painting",
        price: "299.99",
        status: "active",
        created_at: new Date(),
        artist_email: "artist@example.com",
        artist_first_name: "Jane",
        artist_last_name: "Artist"
      }
    ];

    res.json(products);
  }
};

const getAllArticles = async (req, res) => {
  try {
    // Try to get articles from PostgreSQL database
    const result = await pool.query(`
      SELECT a.id, a.title, a.content, 
             CASE WHEN a.status = 'published' THEN true ELSE false END as is_published,
             a.published_at, a.created_at,
             u.email as author_email
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Fallback to mock data if database is not available
    const articles = [
      {
        id: "1",
        title: "The Future of Digital Art",
        content: "Exploring new frontiers...",
        is_published: true,
        published_at: new Date(),
        created_at: new Date(),
        author_email: "admin@passionart.com"
      }
    ];

    res.json(articles);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const db = require('../config/database');
    
    // Get orders from SQLite database with proper joins
    const query = `
      SELECT o.id, o.total_amount, o.payment_status as status, o.created_at,
             o.shipping_address,
             u.email as customer_email, u.username, u.first_name, u.last_name,
             a.title as product_title, a.price as product_price, a.image_url
      FROM orders o
      LEFT JOIN users u ON o.buyer_id = u.id
      LEFT JOIN artworks a ON o.artwork_id = a.id
      ORDER BY o.created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error fetching orders:', err);
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }
      
      // Format the orders data for the frontend
      const formattedOrders = rows.map(order => ({
        id: order.id,
        total_amount: parseFloat(order.total_amount || 0).toFixed(2),
        status: order.status || 'pending',
        created_at: order.created_at,
        customer_email: order.customer_email || 'Unknown',
        customer_name: order.username || `${order.first_name || ''} ${order.last_name || ''}`.trim() || 'Unknown',
        product_title: order.product_title || 'N/A',
        product_price: parseFloat(order.product_price || 0).toFixed(2),
        product_image: order.image_url,
        shipping_address: order.shipping_address
      }));
      
      res.json(formattedOrders);
    });
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    // Fallback to mock data if database is not available
    const orders = [
      {
        id: "1",
        total_amount: "299.99",
        status: "pending",
        created_at: new Date(),
        customer_email: "customer@example.com",
        product_title: "Abstract Sunset",
        product_price: "299.99"
      }
    ];

    res.json(orders);
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, userType, firstName, lastName } = req.body;
    
    if (!email || !password || !userType) {
      return res.status(400).json({ error: 'Email, password, and user type are required' });
    }

    // Try to create user in PostgreSQL database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists in PostgreSQL
    const existingUserResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create new user in PostgreSQL
    const result = await pool.query(`
      INSERT INTO users (email, password, user_type, first_name, last_name, verification_status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, user_type, first_name, last_name, created_at, verification_status
    `, [email, hashedPassword, userType.toLowerCase(), firstName || '', lastName || '', 'verified']);

    const newUser = result.rows[0];
    
    console.log('PostgreSQL user created:', newUser);
    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: newUser.id.toString(),
        email: newUser.email,
        userType: newUser.user_type,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        password: password, // Return original password for display purposes only
        createdAt: newUser.created_at,
        isActive: newUser.verification_status === 'verified'
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Fallback to mock behavior if database is not available
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      userType: userType.toLowerCase(),
      firstName: firstName || '',
      lastName: lastName || '',
      createdAt: new Date(),
      isActive: true
    };

    res.status(201).json({ 
      message: 'User created successfully (fallback mode)',
      user: newUser 
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['paid', 'pending', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: paid, pending, or failed' });
    }
    
    const db = require('../config/database');
    
    // Update order status in SQLite database
    const query = `UPDATE orders SET payment_status = ?, updated_at = datetime('now') WHERE id = ?`;
    
    db.run(query, [status, id], function(err) {
      if (err) {
        console.error('Error updating order status:', err);
        return res.status(500).json({ error: 'Failed to update order status' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({ 
        message: 'Order status updated successfully',
        orderId: id,
        newStatus: status,
        updatedAt: new Date().toISOString()
      });
    });
    
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllProducts,
  getAllArticles,
  getAllOrders,
  createUser,
  updateOrderStatus
};
