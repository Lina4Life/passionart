import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAdminStats, 
  getAllUsers, 
  getAllProducts, 
  getAllArticles, 
  getAllOrders, 
  createUser, 
  createProduct,
  updateProductStatus,
  deleteProduct
} from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import './Admin.css';

function Admin() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalArticles: 0,
    totalOrders: 0
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState({}); // Track which passwords are visible
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addUserData, setAddUserData] = useState({
    email: '',
    password: '',
    userType: 'artist',
    firstName: '',
    lastName: ''
  });
  const [addProductData, setAddProductData] = useState({
    title: '',
    description: '',
    artist: '',
    price: '',
    category: '',
    image_url: '',
    user_id: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addProductLoading, setAddProductLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [addProductError, setAddProductError] = useState('');
  const [updatingProductStatus, setUpdatingProductStatus] = useState(null);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    sendToAll: true
  });
  const [sending, setSending] = useState(false);
  const [hubspotStatus, setHubspotStatus] = useState({ connected: false, testing: false });
  const [emailStats, setEmailStats] = useState({ totalUsers: 0, verifiedUsers: 0, unverifiedUsers: 0 });
  const [editingUser, setEditingUser] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    userType: 'user',
    password: ''
  });
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.email !== 'admin@passionart.com') {
      navigate('/');
      return;
    }

    // Set a simple admin token for API requests
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'admin-token-' + Date.now());
    }

    setUser(parsedUser);
    
    // Fetch real data from database
    loadAdminData();
  }, [navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      console.log('Loading admin data...');
      
      // Fetch stats
      console.log('Fetching stats...');
      const statsData = await getAdminStats();
      console.log('Stats received:', statsData);
      setStats(statsData);
      
      // Fetch all data for tables
      console.log('Fetching all tables data...');
      const [usersData, productsData, articlesData, ordersData] = await Promise.all([
        getAllUsers().catch(err => { console.error('Users fetch failed:', err); return []; }),
        getAllProducts().catch(err => { console.error('Products fetch failed:', err); return []; }),
        getAllArticles().catch(err => { console.error('Articles fetch failed:', err); return []; }),
        getAllOrders().catch(err => { console.error('Orders fetch failed:', err); return []; })
      ]);
      
      console.log('Users data received:', usersData);
      console.log('Products data received:', productsData);
      
      setUsers(usersData);
      setProducts(productsData);
      setArticles(articlesData);
      setOrders(ordersData);
      
      // Fetch email stats
      fetchEmailStats();
      
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleAddUserClick = () => {
    setShowAddUserModal(true);
    setAddUserError('');
    setAddUserData({
      email: '',
      password: '',
      userType: 'artist',
      firstName: '',
      lastName: ''
    });
  };

  const handleAddUserCancel = () => {
    setShowAddUserModal(false);
    setAddUserError('');
    setAddUserData({
      email: '',
      password: '',
      userType: 'artist',
      firstName: '',
      lastName: ''
    });
  };

  const handleAddUserChange = (e) => {
    setAddUserData({
      ...addUserData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError('');

    try {
      await createUser(addUserData);
      
      // Refresh users list and stats
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getAdminStats()
      ]);
      
      setUsers(usersData);
      setStats(statsData);
      
      // Close modal
      setShowAddUserModal(false);
      setAddUserData({
        email: '',
        password: '',
        userType: 'artist',
        firstName: '',
        lastName: ''
      });
      
    } catch (error) {
      console.error('Error creating user:', error);
      setAddUserError(error.response?.data?.error || 'Failed to create user');
    } finally {
      setAddUserLoading(false);
    }
  };

  // Product Management Functions
  const handleAddProductClick = () => {
    setShowAddProductModal(true);
    setAddProductError('');
    setEditingProduct(null);
    setSelectedFile(null);
    setFilePreview(null);
    setAddProductData({
      title: '',
      description: '',
      artist: '',
      price: '',
      category: '',
      image_url: '',
      user_id: ''
    });
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setShowAddProductModal(true);
    setAddProductError('');
    setAddProductData({
      title: product.title || '',
      description: product.description || '',
      artist: product.artist || '',
      price: product.price || '',
      category: product.category || '',
      image_url: product.image_url || '',
      user_id: product.user_id || ''
    });
  };

  const handleAddProductCancel = () => {
    setShowAddProductModal(false);
    setAddProductError('');
    setEditingProduct(null);
    setSelectedFile(null);
    setFilePreview(null);
    setAddProductData({
      title: '',
      description: '',
      artist: '',
      price: '',
      category: '',
      image_url: '',
      user_id: ''
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProductChange = (e) => {
    setAddProductData({
      ...addProductData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setAddProductLoading(true);
    setAddProductError('');

    try {
      if (editingProduct) {
        // Update existing product (you might need to add updateProduct API)
        console.log('Updating product:', editingProduct.id, addProductData);
        // await updateProduct(editingProduct.id, addProductData);
      } else {
        // Create new product with file upload
        const formData = new FormData();
        
        // Add all form fields to FormData
        Object.keys(addProductData).forEach(key => {
          if (addProductData[key]) {
            formData.append(key, addProductData[key]);
          }
        });
        
        // Add the selected file if present
        if (selectedFile) {
          formData.append('image', selectedFile);
        }
        
        await createProduct(formData);
      }
      
      // Refresh products list and stats
      const [productsData, statsData] = await Promise.all([
        getAllProducts(),
        getAdminStats()
      ]);
      
      setProducts(productsData);
      setStats(statsData);
      
      // Close modal and reset form
      setShowAddProductModal(false);
      setEditingProduct(null);
      setSelectedFile(null);
      setFilePreview(null);
      setAddProductData({
        title: '',
        description: '',
        artist: '',
        price: '',
        category: '',
        image_url: '',
        user_id: ''
      });
      
    } catch (error) {
      console.error('Error managing product:', error);
      setAddProductError(error.response?.data?.error || 'Failed to save product');
    } finally {
      setAddProductLoading(false);
    }
  };

  const handleUpdateProductStatus = async (productId, newStatus) => {
    try {
      setUpdatingProductStatus(productId);
      console.log(`Updating product ${productId} status to: ${newStatus}`);
      
      await updateProductStatus(productId, newStatus);
      
      // Refresh products list to show updated status
      const productsData = await getAllProducts();
      setProducts(productsData);
      
      console.log(`Product ${productId} status updated successfully to: ${newStatus}`);
      
      // Show success feedback
      if (newStatus === 'approved') {
        console.log('âœ… Product approved! It will now appear in the store.');
      }
      
    } catch (error) {
      console.error('Error updating product status:', error);
      // You could add a toast notification here for better UX
      alert('Failed to update product status: ' + (error.response?.data?.error || error.message));
    } finally {
      setUpdatingProductStatus(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      
      // Refresh products list and stats
      const [productsData, statsData] = await Promise.all([
        getAllProducts(),
        getAdminStats()
      ]);
      
      setProducts(productsData);
      setStats(statsData);
      
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSendEmail = async (emailData) => {
    try {
      setSending(true);
      const response = await fetch('http://localhost:5000/api/hubspot/send-bulk-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          subject: emailData.subject,
          content: emailData.message,
          sendToAll: emailData.sendToAll
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Email sent successfully!\n\nStats:\n- Total users: ${result.stats.total}\n- Successful: ${result.stats.successful}\n- Failed: ${result.stats.failed}`);
        setEmailData({ subject: '', message: '', sendToAll: true });
        // Refresh email stats
        fetchEmailStats();
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Failed to send email: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const testHubspotConnection = async () => {
    setHubspotStatus({ ...hubspotStatus, testing: true });
    try {
      const response = await fetch('http://localhost:5000/api/hubspot/test-connection', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      setHubspotStatus({ 
        connected: result.success, 
        testing: false,
        message: result.message 
      });
    } catch (error) {
      setHubspotStatus({ 
        connected: false, 
        testing: false,
        message: 'Connection failed: ' + error.message 
      });
    }
  };

  const fetchEmailStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hubspot/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setEmailStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching email stats:', error);
    }
  };

  // User Management Functions
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditUserData({
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      userType: user.userType || 'user',
      password: '' // Don't populate password for security
    });
    setEditUserError('');
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async () => {
    setEditUserLoading(true);
    setEditUserError('');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editUserData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh the entire users list to ensure we have the latest data
        await fetchUsers();
        setShowEditUserModal(false);
        setEditingUser(null);
        alert('User updated successfully!');
      } else {
        setEditUserError(result.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setEditUserError('Failed to update user. Please try again.');
    } finally {
      setEditUserLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.email === 'admin@passionart.com') {
      alert('Cannot delete admin user!');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${user.email}"?\n\nUser Details:\n- Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}\n- Type: ${user.userType}\n- Status: ${user.isActive ? 'Active' : 'Inactive'}\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove user from the list
        setUsers(users.filter(u => u.id !== user.id));
        alert('User deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Registered Users</div>
        </div>
        <div className="stat-card">
          <h3>Products</h3>
          <div className="stat-number">{stats.totalProducts}</div>
          <div className="stat-label">Art Pieces</div>
        </div>
        <div className="stat-card">
          <h3>Articles</h3>
          <div className="stat-number">{stats.totalArticles}</div>
          <div className="stat-label">Published Articles</div>
        </div>
        <div className="stat-card">
          <h3>Orders</h3>
          <div className="stat-number">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">ðŸ‘¤</div>
            <div className="activity-content">
              <div className="activity-title">New user registered</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">ðŸŽ¨</div>
            <div className="activity-content">
              <div className="activity-title">New artwork uploaded</div>
              <div className="activity-time">5 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">ðŸ“</div>
            <div className="activity-content">
              <div className="activity-title">Article published</div>
              <div className="activity-time">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="admin-btn primary" onClick={handleAddUserClick}>
          Add User
        </button>
      </div>
      <div className="testing-warning">
        âš ï¸ <strong>TESTING MODE:</strong> Passwords are visible for testing purposes only. Remove in production!
      </div>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>User Type</th>
              <th>Password (Testing)</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id.slice(0, 8)}...</td>
                <td>{user.email}</td>
                <td>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}</td>
                <td>{user.userType}</td>
                <td className="password-cell">
                  <div className="password-container">
                    <span className="password-text">
                      {showPasswords[user.id] ? user.password : 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'}
                    </span>
                    <button 
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="password-toggle-btn"
                      title={showPasswords[user.id] ? 'Hide password' : 'Show password'}
                    >
                      {showPasswords[user.id] ? 'ðŸ‘ï¸â€ðŸ—¨ï¸' : 'ðŸ‘ï¸'}
                    </button>
                  </div>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button 
                    className="admin-btn small"
                    onClick={() => handleEditUser(user)}
                    title="Edit user"
                  >
                    Edit
                  </button>
                  <button 
                    className="admin-btn small danger"
                    onClick={() => handleDeleteUser(user)}
                    title="Delete user"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Product Management</h2>
        <button className="admin-btn primary" onClick={handleAddProductClick}>Add Product</button>
      </div>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Price</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  No products found
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>{product.id.toString().slice(0, 8)}...</td>
                  <td>{product.title}</td>
                  <td>{product.artistName || product.artistEmail || product.artist || 'Unknown'}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <select 
                      value={product.status || 'pending'} 
                      onChange={(e) => handleUpdateProductStatus(product.id, e.target.value)}
                      className="status-select"
                      disabled={updatingProductStatus === product.id}
                      style={{
                        opacity: updatingProductStatus === product.id ? 0.5 : 1,
                        cursor: updatingProductStatus === product.id ? 'wait' : 'pointer'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved âœ…</option>
                      <option value="rejected">Rejected âŒ</option>
                      <option value="available">Available ðŸ›ï¸</option>
                    </select>
                    {updatingProductStatus === product.id && (
                      <span style={{ 
                        marginLeft: '8px', 
                        fontSize: '12px', 
                        color: 'var(--accent-color)' 
                      }}>
                        Updating...
                      </span>
                    )}
                  </td>
                  <td>{formatDate(product.created_at || product.createdAt)}</td>
                  <td>
                    <button 
                      className="admin-btn small" 
                      onClick={() => handleEditProductClick(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="admin-btn small danger" 
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderArticles = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Article Management</h2>
        <button className="admin-btn primary">Add Article</button>
      </div>
      <div className="table-container">
        <div className="table-scroll-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Published</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    No articles found
                </td>
              </tr>
            ) : (
              articles.map(article => (
                <tr key={article.id}>
                  <td>{article.id.slice(0, 8)}...</td>
                  <td>{article.title}</td>
                  <td>{article.author_email || 'Unknown'}</td>
                  <td>
                    <span className={`status ${article.status === 'published' ? 'active' : 'pending'}`}>
                      {article.status}
                    </span>
                  </td>
                  <td>{article.published_at ? formatDate(article.published_at) : 'Not published'}</td>
                  <td>{formatDate(article.created_at)}</td>
                  <td>
                    <button className="admin-btn small">Edit</button>
                    <button className="admin-btn small danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Order Management</h2>
      </div>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>{order.customer_email || 'Unknown'}</td>
                  <td>{order.product_title || 'N/A'}</td>
                  <td>${order.total_amount}</td>
                  <td>
                    <span className={`status ${order.status === 'completed' ? 'active' : 'pending'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <button className="admin-btn small">View</button>
                    <button className="admin-btn small">Update</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMail = () => {
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>ðŸ“§ HubSpot Email System</h2>
          <div className="email-stats">
            <span>Total Users: {emailStats.totalUsers || users.length}</span>
            <span>Verified Emails: {emailStats.verifiedUsers || users.filter(user => user.email_verified).length}</span>
            <span>Service: HubSpot</span>
          </div>
        </div>

        {/* HubSpot Connection Status */}
        <div className="hubspot-status">
          <div className="status-row">
            <div className="status-indicator">
              <span className={`status-dot ${hubspotStatus.connected ? 'connected' : 'disconnected'}`}></span>
              <span>HubSpot: {hubspotStatus.connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <button 
              className="admin-btn secondary small"
              onClick={testHubspotConnection}
              disabled={hubspotStatus.testing}
            >
              {hubspotStatus.testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
          {hubspotStatus.message && (
            <div className="status-message">{hubspotStatus.message}</div>
          )}
        </div>

        {/* Email Quick Actions */}
        <div className="quick-actions">
          <button 
            className="admin-btn primary"
            onClick={fetchEmailStats}
          >
            ðŸ“Š Refresh Stats
          </button>
        </div>
        
        <div className="mail-composer">
          <div className="mail-form">
            <div className="form-group">
              <label htmlFor="email-subject">Email Subject</label>
              <input
                id="email-subject"
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                placeholder="Enter email subject..."
                className="admin-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email-message">Email Content</label>
              <textarea
                id="email-message"
                value={emailData.message}
                onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                placeholder="Compose your message (HTML supported)..."
                className="admin-textarea"
                rows="8"
              />
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="send-to-all"
                  checked={emailData.sendToAll}
                  onChange={(e) => setEmailData({...emailData, sendToAll: e.target.checked})}
                />
                <label htmlFor="send-to-all">Send to verified users only</label>
              </div>
            </div>
            
            <div className="mail-actions">
              <button 
                className="admin-btn primary large"
                disabled={!emailData.subject || !emailData.message || sending}
                onClick={() => handleSendEmail(emailData)}
              >
                {sending ? 'Sending...' : `ðŸ“¤ Send to ${emailStats.verifiedUsers || users.filter(user => user.email_verified).length} users`}
              </button>
              <button 
                className="admin-btn secondary"
                onClick={() => setEmailData({ subject: '', message: '', sendToAll: true })}
              >
                Clear
              </button>
            </div>
            
            <div className="resend-features">
              <h4>âœ¨ Resend Features:</h4>
              <ul>
                <li>ðŸ“¨ Beautiful HTML email templates</li>
                <li>ðŸ“Š Real-time delivery tracking</li>
                <li>ðŸš€ 99.9% uptime guarantee</li>
                <li>ðŸ’Ž Professional email infrastructure</li>
              </ul>
            </div>
          </div>
          
          <div className="mail-preview">
            <h3>Email Preview</h3>
            <div className="email-preview-content">
              <div className="email-header">
                <strong>From:</strong> PassionArt &lt;noreply@passionart.com&gt;
              </div>
              <div className="email-header">
                <strong>Subject:</strong> {emailData.subject || 'No subject'}
              </div>
              <div className="email-body">
                <strong>Content:</strong>
                <div className="message-preview">
                  {emailData.message || 'No email content'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'products':
        return renderProducts();
      case 'articles':
        return renderArticles();
      case 'orders':
        return renderOrders();
      case 'mail':
        return renderMail();
      default:
        return renderDashboard();
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>PASSION-ART ADMIN</h1>
          <p>Welcome back, Administrator</p>
        </div>
        <div className="admin-header-right">
          <ThemeToggle />
          <span className="admin-user">Admin Panel</span>
          <button onClick={handleLogout} className="admin-btn logout">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              ðŸ“Š Dashboard
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              ðŸ‘¥ Users
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              ðŸŽ¨ Products
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('articles')}
            >
              ðŸ“ Articles
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              ðŸ›ï¸ Orders
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'mail' ? 'active' : ''}`}
              onClick={() => setActiveTab('mail')}
            >
              ðŸ“§ Mail
            </button>
          </nav>
        </div>

        <div className="admin-content">
          {renderContent()}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New User</h2>
              <button 
                className="modal-close" 
                onClick={handleAddUserCancel}
                type="button"
              >
                Ã—
              </button>
            </div>
            
            <form onSubmit={handleAddUserSubmit} className="modal-form">
              {addUserError && (
                <div className="error-message">
                  {addUserError}
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={addUserData.email}
                    onChange={handleAddUserChange}
                    className="form-input"
                    required
                    disabled={addUserLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="userType" className="form-label">User Type *</label>
                  <select
                    id="userType"
                    name="userType"
                    value={addUserData.userType}
                    onChange={handleAddUserChange}
                    className="form-input"
                    required
                    disabled={addUserLoading}
                  >
                    <option value="artist">Artist</option>
                    <option value="gallery">Gallery</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="user">Regular User</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={addUserData.firstName}
                    onChange={handleAddUserChange}
                    className="form-input"
                    disabled={addUserLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={addUserData.lastName}
                    onChange={handleAddUserChange}
                    className="form-input"
                    disabled={addUserLoading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={addUserData.password}
                  onChange={handleAddUserChange}
                  className="form-input"
                  required
                  disabled={addUserLoading}
                  placeholder="Minimum 6 characters"
                  minLength="6"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="admin-btn" 
                  onClick={handleAddUserCancel}
                  disabled={addUserLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn primary"
                  disabled={addUserLoading}
                >
                  {addUserLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button 
                className="modal-close" 
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                  setEditUserError('');
                }}
                type="button"
              >
                Ã—
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }} className="modal-form">
              {editUserError && (
                <div className="error-message">
                  {editUserError}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="editEmail" className="form-label">Email *</label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                  className="form-input"
                  required
                  disabled={editUserLoading}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="editFirstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="editFirstName"
                    name="firstName"
                    value={editUserData.firstName}
                    onChange={(e) => setEditUserData({...editUserData, firstName: e.target.value})}
                    className="form-input"
                    disabled={editUserLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="editLastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="editLastName"
                    name="lastName"
                    value={editUserData.lastName}
                    onChange={(e) => setEditUserData({...editUserData, lastName: e.target.value})}
                    className="form-input"
                    disabled={editUserLoading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="editUserType" className="form-label">User Type</label>
                <select
                  id="editUserType"
                  name="userType"
                  value={editUserData.userType}
                  onChange={(e) => setEditUserData({...editUserData, userType: e.target.value})}
                  className="form-input"
                  disabled={editUserLoading}
                >
                  <option value="user">User</option>
                  <option value="artist">Artist</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="editPassword" className="form-label">New Password (leave empty to keep current)</label>
                <input
                  type="password"
                  id="editPassword"
                  name="password"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData({...editUserData, password: e.target.value})}
                  className="form-input"
                  placeholder="Enter new password or leave empty"
                  disabled={editUserLoading}
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="admin-btn secondary"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingUser(null);
                    setEditUserError('');
                  }}
                  disabled={editUserLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn primary"
                  disabled={editUserLoading || !editUserData.email}
                >
                  {editUserLoading ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button 
                className="modal-close" 
                onClick={handleAddProductCancel}
                type="button"
              >
                Ã—
              </button>
            </div>
            
            <form onSubmit={handleAddProductSubmit} className="modal-form">
              {addProductError && (
                <div className="error-message">
                  {addProductError}
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={addProductData.title}
                    onChange={handleAddProductChange}
                    className="form-input"
                    required
                    disabled={addProductLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="artist" className="form-label">Artist *</label>
                  <input
                    type="text"
                    id="artist"
                    name="artist"
                    value={addProductData.artist}
                    onChange={handleAddProductChange}
                    className="form-input"
                    required
                    disabled={addProductLoading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={addProductData.description}
                  onChange={handleAddProductChange}
                  className="form-input"
                  rows="3"
                  disabled={addProductLoading}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price" className="form-label">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={addProductData.price}
                    onChange={handleAddProductChange}
                    className="form-input"
                    required
                    disabled={addProductLoading}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={addProductData.category}
                    onChange={handleAddProductChange}
                    className="form-input"
                    required
                    disabled={addProductLoading}
                  >
                    <option value="">Select Category</option>
                    <option value="painting">Painting</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="photography">Photography</option>
                    <option value="digital">Digital Art</option>
                    <option value="mixed-media">Mixed Media</option>
                    <option value="drawing">Drawing</option>
                    <option value="printmaking">Printmaking</option>
                    <option value="ceramics">Ceramics</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="textile">Textile Art</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="image" className="form-label">Product Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="form-input"
                    disabled={addProductLoading}
                  />
                  {filePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '150px', 
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }} 
                      />
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="user_id" className="form-label">User ID</label>
                  <input
                    type="text"
                    id="user_id"
                    name="user_id"
                    value={addProductData.user_id}
                    onChange={handleAddProductChange}
                    className="form-input"
                    disabled={addProductLoading}
                    placeholder="Leave empty to auto-assign"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="admin-btn" 
                  onClick={handleAddProductCancel}
                  disabled={addProductLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn primary"
                  disabled={addProductLoading}
                >
                  {addProductLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;

