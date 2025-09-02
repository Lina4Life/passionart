const db = require('../config/database');
const bcrypt = require('bcrypt');

const getAdminStats = async (req, res) => {
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

        // Get community posts count
        db.get("SELECT COUNT(*) as count FROM community_posts", (err3, postsResult) => {
          if (err3) {
            console.error('Error getting posts count:', err3);
            return res.status(500).json({ error: 'Database error' });
          }

          // Get payments count and total revenue
          db.get("SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as revenue FROM community_payments WHERE stripe_payment_status = 'succeeded'", (err4, paymentsResult) => {
            if (err4) {
              console.error('Error getting payments:', err4);
              return res.status(500).json({ error: 'Database error' });
            }

            // Get articles count
            db.get("SELECT COUNT(*) as count FROM articles WHERE status = 'published'", (err5, articlesResult) => {
              if (err5) {
                console.error('Error getting articles count:', err5);
                articlesResult = { count: 0 }; // Default to 0 if table doesn't exist
              }

              // Get pending moderation count
              db.get("SELECT COUNT(*) as count FROM community_posts WHERE verification_status = 'pending'", (err6, moderationResult) => {
                if (err6) {
                  console.error('Error getting moderation count:', err6);
                  return res.status(500).json({ error: 'Database error' });
                }

                res.json({
                  totalUsers: userResult.count,
                  totalArtworks: artworkResult.count,
                  totalCommunityPosts: postsResult.count,
                  totalPayments: paymentsResult.count,
                  totalRevenue: paymentsResult.revenue,
                  pendingModeration: moderationResult.count,
                  // Legacy fields for compatibility
                  totalProducts: artworkResult.count,
                  totalArticles: articlesResult.count,
                  totalOrders: paymentsResult.count
                });
              });
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

      const formattedProducts = rows.map(artwork => ({
        id: artwork.id.toString(),
        title: artwork.title,
        description: artwork.description,
        category: artwork.category,
        price: artwork.price,
        imageUrl: artwork.image_url,
        status: artwork.status,
        artistName: artwork.artist_name,
        artistEmail: artwork.email,
        userId: artwork.user_id,
        dateAdded: artwork.created_at,
        // Legacy compatibility
        name: artwork.title,
        artist: artwork.artist_name
      }));

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
    const { status } = req.body;
    
    console.log(`Updating product ${id} status to: ${status}`);
    
    // Allow the status values that the frontend sends
    if (!['pending', 'approved', 'rejected', 'available'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: pending, approved, rejected, or available' });
    }

    const updateQuery = "UPDATE artworks SET status = ?, updated_at = datetime('now') WHERE id = ?";
    
    db.run(updateQuery, [status, id], function(err) {
      if (err) {
        console.error('Error updating product status:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      console.log(`Product ${id} status updated to ${status} successfully`);
      res.json({ 
        message: 'Product status updated successfully',
        productId: id,
        newStatus: status
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

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllProducts,
  getAllArticles,
  getCommunityPosts,
  getPayments,
  createUser,
  createProduct,
  updateProductStatus,
  deleteProduct,
  deleteUser,
  updateUser
};
