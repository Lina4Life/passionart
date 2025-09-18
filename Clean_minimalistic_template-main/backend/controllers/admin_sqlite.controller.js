/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const db = require('../config/database');
const bcrypt = require('bcrypt');

const getAdminStats = async (req, res) => {
  console.log('🔍 getAdminStats called at:', new Date().toISOString());
  console.log('Authorization header:', req.headers.authorization);
  try {
    // Get user count
    db.get("SELECT COUNT(*) as count FROM users", (err, userResult) => {
      if (err) {
        console.error('Error getting user count:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Get artwork count
      db.get("SELECT COUNT(*) as count FROM artworks", (err2, artworkResult) => {
        if (err2) {
          console.error('Error getting artwork count:', err2);
          return res.status(500).json({ error: 'Database error' });
        }

        // Get articles count
        db.get("SELECT COUNT(*) as count FROM articles WHERE status = 'published'", (err3, articlesResult) => {
          if (err3) {
            console.error('Error getting articles count:', err3);
            articlesResult = { count: 0 }; // Default to 0 if error
          }

          // Get orders count and total revenue
          db.get("SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE payment_status = 'paid'", (err4, ordersResult) => {
            if (err4) {
              console.error('Error getting orders:', err4);
              ordersResult = { count: 0, revenue: 0 }; // Default values
            }

            // Get events count
            db.get("SELECT COUNT(*) as count FROM events", (err5, eventsResult) => {
              if (err5) {
                console.error('Error getting events count:', err5);
                eventsResult = { count: 0 };
              }

              const statsResponse = {
                totalUsers: userResult.count,
                totalArtworks: artworkResult.count,
                totalArticles: articlesResult.count,
                totalOrders: ordersResult.count,
                totalRevenue: ordersResult.revenue,
                totalEvents: eventsResult.count,
                // Legacy fields for compatibility
                totalProducts: artworkResult.count,
                totalCommunityPosts: articlesResult.count,
                totalPayments: ordersResult.count,
                pendingModeration: 0 // No moderation system yet
              };
              
              console.log('📊 Sending stats response:', statsResponse);
              res.json(statsResponse);
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    db.all("SELECT id, username, email, first_name, last_name, user_type, verification_status, created_at, password FROM users ORDER BY created_at DESC", (err, rows) => {
      if (err) {
        console.error('Error getting users:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const formattedUsers = rows.map(user => ({
        id: user.id.toString(),
        email: user.email,
        username: user.username,
        userType: user.user_type,
        firstName: user.first_name,
        lastName: user.last_name,
        isActive: user.verification_status === 'verified',
        createdAt: user.created_at,
        password: user.password // Show actual password from database
      }));

      res.json(formattedUsers);
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id, 
        a.title, 
        a.description,
        a.price, 
        a.category, 
        a.image_url,
        a.status, 
        a.created_at,
        a.user_id,
        u.first_name,
        u.last_name,
        u.email,
        COALESCE(u.first_name || ' ' || u.last_name, u.email, 'Unknown Artist') as artist_name
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `;

    db.all(query, (err, rows) => {
      if (err) {
        console.error('Error getting products:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const formattedProducts = rows.map(artwork => {
        // Map database status to admin interface status for display
        const statusDisplayMapping = {
          'inactive': 'pending',    // Inactive items show as pending
          'active': 'approved',     // Active items show as approved  
          'sold': 'sold',          // Direct mapping
          'reserved': 'reserved'   // Direct mapping
        };
        
        const displayStatus = statusDisplayMapping[artwork.status] || artwork.status;
        
        return {
          id: artwork.id.toString(),
          title: artwork.title,
          description: artwork.description,
          category: artwork.category,
          price: artwork.price,
          imageUrl: artwork.image_url,
          status: displayStatus,      // Show admin-friendly status
          databaseStatus: artwork.status,  // Also include actual DB status
          artistName: artwork.artist_name,
          artistEmail: artwork.email,
          userId: artwork.user_id,
          dateAdded: artwork.created_at,
          // Legacy compatibility
          name: artwork.title,
          artist: artwork.artist_name
        };
      });

      res.json(formattedProducts);
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

// Get community posts for admin
const getCommunityPosts = async (req, res) => {
  try {
    const query = `
      SELECT 
        cp.*,
        cc.name as category_name,
        u.username,
        u.first_name,
        u.last_name,
        pay.amount as payment_amount,
        pay.stripe_payment_status
      FROM community_posts cp
      LEFT JOIN community_categories cc ON cp.category_id = cc.id
      LEFT JOIN users u ON cp.user_id = u.id
      LEFT JOIN community_payments pay ON cp.id = pay.post_id
      ORDER BY cp.created_at DESC
    `;
    
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Error getting community posts:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const formattedPosts = rows.map(post => ({
        id: post.id.toString(),
        title: post.title,
        category: post.category_name,
        author: post.username || `${post.first_name} ${post.last_name}`,
        status: post.verification_status,
        paymentStatus: post.payment_status,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        comments: post.comment_count,
        createdAt: post.created_at,
        paymentAmount: post.payment_amount
      }));

      res.json(formattedPosts);
    });
  } catch (error) {
    console.error('Error getting community posts:', error);
    res.status(500).json({ error: 'Failed to get community posts' });
  }
};

// Get payments for admin
const getPayments = async (req, res) => {
  try {
    const query = `
      SELECT 
        pay.*,
        cp.title as post_title,
        u.username,
        u.email
      FROM community_payments pay
      LEFT JOIN community_posts cp ON pay.post_id = cp.id
      LEFT JOIN users u ON pay.user_id = u.id
      ORDER BY pay.created_at DESC
    `;
    
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Error getting payments:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const formattedPayments = rows.map(payment => ({
        id: payment.id.toString(),
        postTitle: payment.post_title,
        username: payment.username,
        email: payment.email,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.stripe_payment_status,
        paymentMethod: payment.payment_method,
        createdAt: payment.created_at,
        stripeId: payment.stripe_payment_intent_id
      }));

      res.json(formattedPayments);
    });
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ error: 'Failed to get payments' });
  }
};

// Get all orders for admin
const getAllOrders = async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['paid', 'pending', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: paid, pending, or failed' });
    }
    
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

// Update order price (Admin power)
const updateOrderPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ error: 'Invalid price. Must be a positive number.' });
    }
    
    const newPrice = parseFloat(price).toFixed(2);
    
    // Update order price in SQLite database
    const query = `UPDATE orders SET total_amount = ?, updated_at = datetime('now') WHERE id = ?`;
    
    db.run(query, [newPrice, id], function(err) {
      if (err) {
        console.error('Error updating order price:', err);
        return res.status(500).json({ error: 'Failed to update order price' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({ 
        message: 'Order price updated successfully',
        orderId: id,
        newPrice: newPrice,
        updatedAt: new Date().toISOString()
      });
    });
    
  } catch (error) {
    console.error('Error in updateOrderPrice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    console.log('createUser called with body:', req.body);
    const { email, password, userType, firstName, lastName } = req.body;
    
    if (!email || !password || !userType) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Email, password, and user type are required' });
    }

    console.log('Hashing password...');
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Check if user already exists
    db.get("SELECT id FROM users WHERE email = ?", [email], (err, existingUser) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        console.log('User already exists');
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      console.log('Inserting new user...');
      // Insert new user
      const insertQuery = `
        INSERT INTO users (email, password, user_type, first_name, last_name, verification_status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.run(insertQuery, [
        email, 
        hashedPassword, 
        userType.toLowerCase(), 
        firstName || '', 
        lastName || '', 
        'verified'
      ], function(err) {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }

        console.log('User created with ID:', this.lastID);
        // Return the created user (without password hash)
        const newUser = {
          id: this.lastID.toString(),
          email: email,
          userType: userType.toLowerCase(),
          firstName: firstName || '',
          lastName: lastName || '',
          password: password, // Return original password for display purposes only
          createdAt: new Date().toISOString(),
          isActive: true
        };

        console.log('User created successfully:', newUser);
        res.status(201).json({ 
          message: 'User created successfully',
          user: newUser
        });
      });
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Create a new product (for admin)
const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    
    const { title, description, price, category, artist, image_url, user_id } = req.body;
    
    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Title, price, and category are required' });
    }

    // Handle file upload if present
    let imageUrl = image_url || '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const insertQuery = `
      INSERT INTO artworks (title, description, artist, price, category, image_url, status, user_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, datetime('now'))
    `;
    
    db.run(insertQuery, [
      title, 
      description || '', 
      artist || 'Unknown Artist', 
      parseFloat(price), 
      category, 
      imageUrl,
      user_id || null
    ], function(err) {
      if (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ error: 'Failed to create product: ' + err.message });
      }

      const newProduct = {
        id: this.lastID.toString(),
        title,
        description: description || '',
        price: parseFloat(price),
        category,
        artist: artist || 'Unknown Artist',
        image_url: imageUrl,
        status: 'pending',
        user_id: user_id || null,
        created_at: new Date().toISOString()
      };

      console.log('Product created successfully:', newProduct);
      res.status(201).json({ 
        message: 'Product created successfully',
        product: newProduct
      });
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product status
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    
    console.log(`Updating product ${id} status to: ${status}`);
    if (rejectionReason) {
      console.log(`Rejection reason: ${rejectionReason}`);
    }
    
    // Map admin interface status values to database status values
    const statusMapping = {
      'pending': 'inactive',      // When pending approval, make it inactive
      'approved': 'active',       // When approved, make it active (visible)
      'rejected': 'inactive',     // When rejected, make it inactive
      'available': 'active',      // Available means active
      'sold': 'sold',            // Direct mapping
      'reserved': 'reserved',    // Direct mapping
      'inactive': 'inactive',    // Direct mapping
      'active': 'active'         // Direct mapping
    };
    
    const dbStatus = statusMapping[status];
    
    if (!dbStatus) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: pending, approved, rejected, available, sold, reserved, inactive, or active' 
      });
    }

    // If status is rejected and we have a reason, store it in admin_actions table for audit
    if (status === 'rejected' && rejectionReason) {
      // First, let's get the product info to notify the artist
      db.get("SELECT title, user_id FROM artworks WHERE id = ?", [id], (err, artwork) => {
        if (err) {
          console.error('Error getting artwork info:', err);
        } else if (artwork) {
          // Store rejection reason in admin_actions for audit trail
          const adminActionQuery = `
            INSERT INTO admin_settings (key, value, description, updated_at) 
            VALUES (?, ?, ?, datetime('now'))
          `;
          
          const rejectionKey = `rejection_${id}_${Date.now()}`;
          const rejectionData = JSON.stringify({
            artworkId: id,
            artworkTitle: artwork.title,
            artistId: artwork.user_id,
            reason: rejectionReason,
            adminAction: 'rejected',
            timestamp: new Date().toISOString()
          });
          
          db.run(adminActionQuery, [
            rejectionKey, 
            rejectionData, 
            `Rejection reason for artwork ${id}: ${artwork.title}`
          ], (err) => {
            if (err) {
              console.error('Error storing rejection reason:', err);
            } else {
              console.log('Rejection reason stored successfully');
            }
          });
          
          // TODO: Here you could add email notification to the artist
          // For now, we'll just log it
          console.log(`Artwork "${artwork.title}" rejected for user ${artwork.user_id}. Reason: ${rejectionReason}`);
        }
      });
    }

    const updateQuery = "UPDATE artworks SET status = ?, updated_at = datetime('now') WHERE id = ?";
    
    db.run(updateQuery, [dbStatus, id], function(err) {
      if (err) {
        console.error('Error updating product status:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      console.log(`Product ${id} status updated from ${status} to ${dbStatus} successfully`);
      res.json({ 
        message: 'Product status updated successfully',
        productId: id,
        adminStatus: status,      // What the admin interface sent
        databaseStatus: dbStatus, // What was actually stored in database
        rejectionReason: rejectionReason || null
      });
    });
  } catch (error) {
    console.error('Error updating product status:', error);
    res.status(500).json({ error: 'Failed to update product status' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    db.run("DELETE FROM artworks WHERE id = ?", [id], function(err) {
      if (err) {
        console.error('Error deleting product:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const getAllArticles = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        u.username as author_name,
        u.email as author_email
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
    `;
    
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Error getting articles:', err);
        // If articles table doesn't exist, return empty array
        return res.json([]);
      }

      const formattedArticles = rows.map(article => ({
        id: article.id.toString(),
        title: article.title,
        author_email: article.author_email || 'unknown@example.com',
        status: article.status || 'published',
        published_at: article.published_at,
        created_at: article.created_at,
        views: article.views || 0
      }));

      res.json(formattedArticles);
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.json([]);
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if user exists
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Prevent deletion of admin users
      if (user.email === 'admin@passionart.com') {
        return res.status(403).json({ error: 'Cannot delete admin user' });
      }
      
      // Delete user
      db.run("DELETE FROM users WHERE id = ?", [id], function(err) {
        if (err) {
          console.error('Error deleting user:', err);
          return res.status(500).json({ error: 'Failed to delete user' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ 
          success: true, 
          message: 'User deleted successfully',
          deletedUserId: id
        });
      });
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, userType, password } = req.body;
    
    // First check if user exists
    db.get("SELECT * FROM users WHERE id = ?", [id], async (err, user) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if email is already taken by another user
      if (email && email !== user.email) {
        db.get("SELECT id FROM users WHERE email = ? AND id != ?", [email, id], async (err2, existingUser) => {
          if (err2) {
            console.error('Error checking email:', err2);
            return res.status(500).json({ error: 'Database error' });
          }
          
          if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
          }
          
          // Proceed with update
          await performUpdate();
        });
      } else {
        // Proceed with update
        await performUpdate();
      }
      
      async function performUpdate() {
        let updateFields = [];
        let updateValues = [];
        
        if (email) {
          updateFields.push('email = ?');
          updateValues.push(email);
        }
        
        if (firstName) {
          updateFields.push('first_name = ?');
          updateValues.push(firstName);
        }
        
        if (lastName) {
          updateFields.push('last_name = ?');
          updateValues.push(lastName);
        }
        
        if (userType) {
          updateFields.push('user_type = ?');
          updateValues.push(userType);
        }
        
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updateFields.push('password = ?');
          updateValues.push(hashedPassword);
        }
        
        if (updateFields.length === 0) {
          return res.status(400).json({ error: 'No fields to update' });
        }
        
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        
        const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        
        db.run(updateQuery, updateValues, function(err) {
          if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Failed to update user' });
          }
          
          if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          // Get updated user data
          db.get("SELECT id, email, first_name, last_name, user_type, verification_status, created_at FROM users WHERE id = ?", [id], (err, updatedUser) => {
            if (err) {
              console.error('Error fetching updated user:', err);
              return res.status(500).json({ error: 'User updated but failed to fetch updated data' });
            }
            
            res.json({
              success: true,
              message: 'User updated successfully',
              user: {
                id: updatedUser.id,
                email: updatedUser.email,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                userType: updatedUser.user_type,
                isActive: updatedUser.verification_status === 'verified',
                createdAt: updatedUser.created_at
              }
            });
          });
        });
      }
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get rejection history for a specific artwork
const getRejectionHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Get rejection reasons from admin_settings
    const query = `
      SELECT key, value, description, updated_at 
      FROM admin_settings 
      WHERE key LIKE 'rejection_${productId}_%'
      ORDER BY updated_at DESC
    `;
    
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Error getting rejection history:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      const rejections = rows.map(row => {
        try {
          const data = JSON.parse(row.value);
          return {
            timestamp: row.updated_at,
            reason: data.reason,
            artworkTitle: data.artworkTitle,
            adminAction: data.adminAction
          };
        } catch (e) {
          return {
            timestamp: row.updated_at,
            reason: 'Invalid data format',
            artworkTitle: 'Unknown',
            adminAction: 'rejected'
          };
        }
      });
      
      res.json(rejections);
    });
  } catch (error) {
    console.error('Error getting rejection history:', error);
    res.status(500).json({ error: 'Failed to get rejection history' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllProducts,
  getAllArticles,
  getCommunityPosts,
  getPayments,
  getAllOrders,
  createUser,
  createProduct,
  updateProductStatus,
  deleteProduct,
  deleteUser,
  updateUser,
  updateOrderStatus,
  updateOrderPrice,
  getRejectionHistory
};
