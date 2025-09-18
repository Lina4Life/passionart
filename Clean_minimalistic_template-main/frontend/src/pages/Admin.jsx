/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  getAdminStats, 
  getAllUsers, 
  getAllProducts, 
  getAllArticles, 
  getAllOrders, 
  createUser, 
  createProduct,
  updateProductStatus,
  deleteProduct,
  getDatabaseInfo,
  getTableDetails,
  executeQuery,
  exportDatabase,
  getDatabaseHealth
} from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import './Admin.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Admin() {
  const { t } = useTranslation();
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
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionData, setRejectionData] = useState({
    productId: null,
    productTitle: '',
    rejectionReason: ''
  });
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
  // Feedback state
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [feedbackPagination, setFeedbackPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editUserData, setEditUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    userType: 'user',
    password: ''
  });
  const [artworks, setArtworks] = useState([]);
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [artworksLoading, setArtworksLoading] = useState(false);
  const [featuringArtwork, setFeaturingArtwork] = useState(null);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState('');
  
  // Order management states
  const [orderFilter, setOrderFilter] = useState('all'); // all, paid, pending, failed
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(null);
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  // Database state
  const [databaseInfo, setDatabaseInfo] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableDetails, setTableDetails] = useState(null);
  const [queryText, setQueryText] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [databaseHealth, setDatabaseHealth] = useState(null);
  const [databaseLoading, setDatabaseLoading] = useState(false);
  
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

  useEffect(() => {
    // Load feedback when feedback tab is active
    if (activeTab === 'feedback') {
      fetchFeedback();
    }
    // Load database info when database tab is active
    if (activeTab === 'database') {
      loadDatabaseInfo();
    }
  }, [activeTab, feedbackFilter, feedbackPagination.page]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      console.log('Loading admin data...');
      
      // Fetch stats
      console.log('Fetching stats...');
      const statsData = await getAdminStats();
      console.log('Stats received:', statsData);
      console.log('Setting stats state to:', statsData);
      setStats(statsData);
      console.log('Stats state should now be:', statsData);
      
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

  const fetchArtworks = async () => {
    setArtworksLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/artworks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const artworksData = await response.json();
        setArtworks(artworksData);
      } else {
        console.error('Failed to fetch artworks:', response.status);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setArtworksLoading(false);
    }
  };

  const fetchFeaturedArtworks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/artworks/featured');
      if (response.ok) {
        const featuredData = await response.json();
        setFeaturedArtworks(featuredData);
      } else {
        console.error('Failed to fetch featured artworks:', response.status);
      }
    } catch (error) {
      console.error('Error fetching featured artworks:', error);
    }
  };

  const handleFeatureArtwork = async (artworkId) => {
    setFeaturingArtwork(artworkId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/artworks/${artworkId}/feature`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchFeaturedArtworks();
        await fetchArtworks();
      } else {
        console.error('Failed to feature artwork');
      }
    } catch (error) {
      console.error('Error featuring artwork:', error);
    } finally {
      setFeaturingArtwork(null);
    }
  };

  const handleUnfeatureArtwork = async (artworkId) => {
    setFeaturingArtwork(artworkId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/artworks/${artworkId}/feature`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchFeaturedArtworks();
        await fetchArtworks();
      } else {
        console.error('Failed to unfeature artwork');
      }
    } catch (error) {
      console.error('Error unfeaturing artwork:', error);
    } finally {
      setFeaturingArtwork(null);
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

  const handleUpdateProductStatus = async (productId, newStatus, rejectionReason = null) => {
    try {
      setUpdatingProductStatus(productId);
      console.log(`Updating product ${productId} status to: ${newStatus}`);
      
      const updateData = { status: newStatus };
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
      
      await updateProductStatus(productId, updateData);
      
      // Refresh products list to show updated status
      const productsData = await getAllProducts();
      setProducts(productsData);
      
      console.log(`Product ${productId} status updated successfully to: ${newStatus}`);
      
      // Show success feedback
      if (newStatus === 'approved') {
        console.log('✅ Product approved! It will now appear in the store.');
      } else if (newStatus === 'rejected') {
        console.log('❌ Product rejected. Artist will be notified.');
      }
      
    } catch (error) {
      console.error('Error updating product status:', error);
      // You could add a toast notification here for better UX
      alert('Failed to update product status: ' + (error.response?.data?.error || error.message));
    } finally {
      setUpdatingProductStatus(null);
    }
  };

  const handleRejectProduct = (productId, productTitle) => {
    setRejectionData({
      productId,
      productTitle,
      rejectionReason: ''
    });
    setShowRejectionModal(true);
  };

  const handleRejectionSubmit = async () => {
    if (!rejectionData.rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    await handleUpdateProductStatus(
      rejectionData.productId, 
      'rejected', 
      rejectionData.rejectionReason
    );
    
    setShowRejectionModal(false);
    setRejectionData({
      productId: null,
      productTitle: '',
      rejectionReason: ''
    });
  };

  const handleApproveProduct = async (productId) => {
    await handleUpdateProductStatus(productId, 'approved');
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

  const fetchFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        status: feedbackFilter,
        page: feedbackPagination.page,
        limit: feedbackPagination.limit
      });
      
      const response = await fetch(`http://localhost:3001/api/feedback/admin?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Feedback data received:', data);
        setFeedback(data.feedback);
        setFeedbackPagination(data.pagination);
      } else {
        console.error('Failed to fetch feedback:', response.status);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const updateFeedbackStatus = async (feedbackId, status, adminNotes = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/feedback/${feedbackId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, adminNotes })
      });
      
      if (response.ok) {
        // Refresh feedback list
        fetchFeedback();
        setShowFeedbackModal(false);
      } else {
        console.error('Failed to update feedback status');
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const deleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      console.log('Attempting to delete feedback ID:', feedbackId);
      console.log('Using token:', token);
      
      const response = await fetch(`http://localhost:3001/api/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Delete successful:', result.message);
        // Refresh feedback list
        fetchFeedback();
        setShowFeedbackModal(false);
        alert('Feedback deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Delete failed with status:', response.status, 'Error:', errorData);
        alert(`Failed to delete feedback: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert(`Error deleting feedback: ${error.message}`);
    }
  };

  // Database Management Functions
  const loadDatabaseInfo = async () => {
    try {
      setDatabaseLoading(true);
      const [dbInfo, health] = await Promise.all([
        getDatabaseInfo(),
        getDatabaseHealth()
      ]);
      setDatabaseInfo(dbInfo);
      setDatabaseHealth(health);
    } catch (error) {
      console.error('Error loading database info:', error);
    } finally {
      setDatabaseLoading(false);
    }
  };

  const handleTableSelect = async (tableName) => {
    try {
      setSelectedTable(tableName);
      const details = await getTableDetails(tableName);
      setTableDetails(details);
    } catch (error) {
      console.error('Error loading table details:', error);
    }
  };

  const handleQueryExecute = async () => {
    try {
      setQueryLoading(true);
      const result = await executeQuery(queryText, true);
      setQueryResult(result);
    } catch (error) {
      console.error('Error executing query:', error);
      setQueryResult({ error: error.message });
    } finally {
      setQueryLoading(false);
    }
  };

  const handleDatabaseExport = async () => {
    try {
      const data = await exportDatabase();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passionart_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting database:', error);
      alert('Failed to export database');
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

  const renderDashboard = () => {
    // Process data for charts
    const orderStatusData = {
      labels: ['Paid', 'Pending', 'Failed'],
      datasets: [
        {
          label: 'Orders by Status',
          data: [
            orders.filter(o => o.status === 'paid').length,
            orders.filter(o => o.status === 'pending').length,
            orders.filter(o => o.status === 'failed').length,
          ],
          backgroundColor: [
            '#10b981',
            '#f59e0b', 
            '#ef4444',
          ],
          borderColor: [
            '#059669',
            '#d97706',
            '#dc2626',
          ],
          borderWidth: 2,
        },
      ],
    };

    // Revenue data by month (mock data for demonstration)
    const revenueData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [
        {
          label: 'Total Revenue Received by Admin',
          data: [1200, 1900, 800, 1600, 2000, 1700, 2200, 2400, 2100],
          borderColor: '#00b4a6',
          backgroundColor: 'rgba(0, 180, 166, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Amount Sent to Artists (After Admin Cut)',
          data: [120, 190, 80, 160, 200, 170, 220, 240, 210],
          borderColor: '#ff6b6b',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // User growth data
    const userGrowthData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'New Users',
          data: [12, 19, 8, 16],
          backgroundColor: 'rgba(64, 224, 208, 0.8)',
          borderColor: '#40e0d0',
          borderWidth: 2,
        },
        {
          label: 'New Artists',
          data: [3, 7, 2, 5],
          backgroundColor: 'rgba(255, 107, 107, 0.8)',
          borderColor: '#ff6b6b',
          borderWidth: 2,
        },
      ],
    };

    const totalRevenue = orders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

    const adminCutCalculation = totalRevenue * 0.9; // Admin keeps 90%
    const artistPaymentCalculation = totalRevenue * 0.1; // Amount to be sent to artists (10%)

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: 'var(--admin-text-primary)',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'var(--admin-text-secondary)',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        y: {
          ticks: {
            color: 'var(--admin-text-secondary)',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    };

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'var(--admin-text-primary)',
            padding: 20,
          },
        },
      },
    };

    return (
      <div className="admin-dashboard">
        {/* Enhanced Stats Grid */}
        <div className="dashboard-header">
          <h2>📊 Admin Dashboard Overview</h2>
          <div className="revenue-summary">
            <div className="revenue-card admin-revenue">
              <h4>💰 Total Revenue Received</h4>
              <div className="amount">${totalRevenue.toFixed(2)}</div>
              <div className="note">All customer payments received by admin</div>
            </div>
            <div className="revenue-card artist-revenue">
              <h4>💸 To Send to Artists (10%)</h4>
              <div className="amount">${artistPaymentCalculation.toFixed(2)}</div>
              <div className="note">Amount calculated for artist payments</div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card users">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Registered Users</div>
            </div>
          </div>
          <div className="stat-card products">
            <div className="stat-icon">🎨</div>
            <div className="stat-content">
              <h3>Artworks</h3>
              <div className="stat-number">{stats.totalProducts}</div>
              <div className="stat-label">Art Pieces</div>
            </div>
          </div>
          <div className="stat-card articles">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>Articles</h3>
              <div className="stat-number">{stats.totalArticles}</div>
              <div className="stat-label">Published Articles</div>
            </div>
          </div>
          <div className="stat-card orders">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <h3>Orders</h3>
              <div className="stat-number">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-container">
            <h3>📈 Revenue & Artist Payments</h3>
            <div className="chart-wrapper">
              <Line data={revenueData} options={chartOptions} />
            </div>
            <div className="chart-note">
              <p>💡 <strong>Payment Flow:</strong> Admin receives 100% → Calculates 10% for artists → Sends artist payments manually</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>📊 Order Status Distribution</h3>
            <div className="chart-wrapper doughnut">
              <Doughnut data={orderStatusData} options={doughnutOptions} />
            </div>
          </div>

          <div className="chart-container">
            <h3>👥 User Growth (Weekly)</h3>
            <div className="chart-wrapper">
              <Bar data={userGrowthData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-container quick-stats">
            <h3>⚡ Quick Stats</h3>
            <div className="quick-stats-grid">
              <div className="quick-stat">
                <span className="quick-stat-number">{orders.filter(o => o.status === 'pending').length}</span>
                <span className="quick-stat-label">Pending Orders</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-number">${(totalRevenue / stats.totalOrders || 0).toFixed(2)}</span>
                <span className="quick-stat-label">Avg Order Value</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-number">{((orders.filter(o => o.status === 'paid').length / orders.length) * 100 || 0).toFixed(1)}%</span>
                <span className="quick-stat-label">Success Rate</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-number">{users.filter(u => u.user_type === 'artist').length}</span>
                <span className="quick-stat-label">Active Artists</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>🔥 Recent Activity</h3>
          <div className="activity-list">
            {orders.slice(0, 5).map((order, index) => (
              <div key={order.id} className="activity-item">
                <div className={`activity-icon ${order.status}`}>
                  {order.status === 'paid' ? '�' : order.status === 'pending' ? '⏳' : '❌'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    Order #{order.id} - {order.product_title}
                  </div>
                  <div className="activity-meta">
                    <span>{order.customer_email}</span>
                    <span>${order.total_amount}</span>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="activity-time">{formatDate(order.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="admin-btn primary" onClick={handleAddUserClick}>
          Add User
        </button>
      </div>
      <div className="testing-warning">
        ⚠️ <strong>TESTING MODE:</strong> Passwords are visible for testing purposes only. Remove in production!
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
                      {showPasswords[user.id] ? user.password : '••••••••'}
                    </span>
                    <button 
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="password-toggle-btn"
                      title={showPasswords[user.id] ? 'Hide password' : 'Show password'}
                    >
                      {showPasswords[user.id] ? '👁️‍🗨️' : '👁️'}
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

  const renderProducts = () => {
    console.log('Rendering Products - products:', products.length, 'featuredArtworks:', featuredArtworks.length);
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Product Management</h2>
          <div className="section-header-actions">
            <button 
              className="admin-btn secondary"
              onClick={() => {
                console.log('Refresh Featured clicked');
                fetchArtworks();
                fetchFeaturedArtworks();
              }}
            >
              🔄 Refresh Featured
            </button>
            <button className="admin-btn primary" onClick={handleAddProductClick}>Add Product</button>
          </div>
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
              <th>Featured</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  No products found
                </td>
              </tr>
            ) : (
              products.map(product => {
                const isFeatured = featuredArtworks.some(fa => fa.id === product.id);
                return (
                  <tr key={product.id}>
                    <td>{product.id.toString().slice(0, 8)}...</td>
                    <td>{product.title}</td>
                    <td>{product.artistName || product.artistEmail || product.artist || 'Unknown'}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>
                      <div className="status-management">
                        <span className={`status-badge ${product.status}`}>
                          {product.status === 'pending' && '⏳ Pending'}
                          {product.status === 'approved' && '✅ Approved'}
                          {product.status === 'rejected' && '❌ Rejected'}
                          {product.status === 'available' && '🛍️ Available'}
                          {product.status === 'sold' && '💰 Sold'}
                          {product.status === 'reserved' && '🔒 Reserved'}
                        </span>
                        
                        {product.status === 'pending' && (
                          <div className="status-actions">
                            <button 
                              className="admin-btn small success"
                              onClick={() => handleApproveProduct(product.id)}
                              disabled={updatingProductStatus === product.id}
                              title="Approve this artwork"
                            >
                              ✅ Approve
                            </button>
                            <button 
                              className="admin-btn small danger"
                              onClick={() => handleRejectProduct(product.id, product.title)}
                              disabled={updatingProductStatus === product.id}
                              title="Reject this artwork"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                        
                        {product.status !== 'pending' && (
                          <select 
                            value={product.status || 'pending'} 
                            onChange={(e) => {
                              if (e.target.value === 'rejected') {
                                handleRejectProduct(product.id, product.title);
                              } else {
                                handleUpdateProductStatus(product.id, e.target.value);
                              }
                            }}
                            className="status-select small"
                            disabled={updatingProductStatus === product.id}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="approved">✅ Approved</option>
                            <option value="rejected">❌ Rejected</option>
                            <option value="available">🛍️ Available</option>
                            <option value="sold">💰 Sold</option>
                            <option value="reserved">🔒 Reserved</option>
                          </select>
                        )}
                        
                        {updatingProductStatus === product.id && (
                          <span className="updating-indicator">Updating...</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="featured-control">
                        <label className="featured-checkbox">
                          <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={() => {
                              if (isFeatured) {
                                handleUnfeatureArtwork(product.id);
                              } else {
                                handleFeatureArtwork(product.id);
                              }
                            }}
                            disabled={featuringArtwork === product.id || (!isFeatured && featuredArtworks.length >= 6)}
                          />
                          <span className="checkmark">
                            {isFeatured ? '⭐' : '☆'}
                          </span>
                        </label>
                        {featuringArtwork === product.id && (
                          <span className="updating-indicator">Updating...</span>
                        )}
                        {!isFeatured && featuredArtworks.length >= 6 && (
                          <span className="hint-text">Max 6</span>
                        )}
                      </div>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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

  const renderOrders = () => {
    // Filter orders based on status and search
    const filteredOrders = orders.filter(order => {
      const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
      const matchesSearch = orderSearch === '' || 
        order.customer_email.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.product_title.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.id.toString().includes(orderSearch);
      return matchesFilter && matchesSearch;
    });

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
      setUpdatingOrderStatus(orderId);
      try {
        // TODO: Implement order status update API
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
          // Update local state
          setOrders(prev => prev.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          ));
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      } finally {
        setUpdatingOrderStatus(null);
      }
    };

    const handleUpdateOrderPrice = async (orderId, newOrderPrice) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/price`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ price: newOrderPrice })
        });

        if (response.ok) {
          // Update local state
          setOrders(prev => prev.map(order => 
            order.id === orderId ? { ...order, total_amount: parseFloat(newOrderPrice).toFixed(2) } : order
          ));
          setEditingPrice(null);
          setNewPrice('');
        }
      } catch (error) {
        console.error('Error updating order price:', error);
      }
    };

    const handlePriceEdit = (orderId, currentPrice) => {
      setEditingPrice(orderId);
      setNewPrice(currentPrice);
    };

    const handleViewOrder = (order) => {
      setSelectedOrder(order);
      setShowOrderModal(true);
    };

    const getStatusColor = (status) => {
      switch(status) {
        case 'paid': return '#10b981';
        case 'pending': return '#f59e0b';
        case 'failed': return '#ef4444';
        default: return '#6b7280';
      }
    };

    const getTotalRevenue = () => {
      return filteredOrders
        .filter(order => order.status === 'paid')
        .reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
        .toFixed(2);
    };

    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>💼 Order Management</h2>
          <div className="order-stats">
            <div className="stat-card">
              <span className="stat-number">{filteredOrders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">${getTotalRevenue()}</span>
              <span className="stat-label">Revenue (Paid)</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{filteredOrders.filter(o => o.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* Order Filters and Search */}
        <div className="order-controls">
          <div className="filter-section">
            <label>Filter by Status:</label>
            <select 
              value={orderFilter} 
              onChange={(e) => setOrderFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Orders</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="search-section">
            <input
              type="text"
              placeholder="Search orders by customer, product, or order ID..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-container">
          <table className="admin-table orders-table">
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '40px' }}>
                    {orderSearch || orderFilter !== 'all' ? 'No orders match your filters' : 'No orders found'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className={`order-row status-${order.status}`}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{order.customer_name || 'Unknown'}</div>
                        <div className="customer-email">{order.customer_email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="product-info">
                        {order.product_image && (
                          <img 
                            src={order.product_image} 
                            alt={order.product_title}
                            className="product-thumb"
                          />
                        )}
                        <div>
                          <div className="product-title">{order.product_title}</div>
                          <div className="product-price">${order.product_price}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {editingPrice === order.id ? (
                        <div className="price-edit">
                          <input
                            type="number"
                            step="0.01"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="price-input"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateOrderPrice(order.id, newPrice);
                              }
                            }}
                          />
                          <div className="price-actions">
                            <button 
                              className="price-btn save"
                              onClick={() => handleUpdateOrderPrice(order.id, newPrice)}
                            >
                              ✓
                            </button>
                            <button 
                              className="price-btn cancel"
                              onClick={() => {
                                setEditingPrice(null);
                                setNewPrice('');
                              }}
                            >
                              ✗
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="amount-display">
                          <strong>${order.total_amount}</strong>
                          <button 
                            className="edit-price-btn"
                            onClick={() => handlePriceEdit(order.id, order.total_amount)}
                            title="Edit price (Admin power)"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="status-cell">
                        <span 
                          className={`status-badge status-${order.status}`}
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status.toUpperCase()}
                        </span>
                        {order.status === 'pending' && (
                          <div className="status-actions">
                            <button 
                              className="status-btn success"
                              onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                              disabled={updatingOrderStatus === order.id}
                            >
                              ✓ Mark Paid
                            </button>
                            <button 
                              className="status-btn danger"
                              onClick={() => handleUpdateOrderStatus(order.id, 'failed')}
                              disabled={updatingOrderStatus === order.id}
                            >
                              ✗ Mark Failed
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <div>{formatDate(order.created_at)}</div>
                        <div className="time-info">
                          {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="admin-btn small primary"
                          onClick={() => handleViewOrder(order)}
                        >
                          📋 View Details
                        </button>
                        {order.status === 'pending' && (
                          <button 
                            className="admin-btn small secondary"
                            onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                            disabled={updatingOrderStatus === order.id}
                          >
                            💳 Process Payment
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
            <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📋 Order Details - #{selectedOrder.id}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowOrderModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-details-grid">
                  <div className="detail-section">
                    <h4>👤 Customer Information</h4>
                    <div className="detail-row">
                      <span>Name:</span>
                      <span>{selectedOrder.customer_name || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Email:</span>
                      <span>{selectedOrder.customer_email}</span>
                    </div>
                    {selectedOrder.shipping_address && (
                      <div className="detail-row">
                        <span>Shipping:</span>
                        <span>{selectedOrder.shipping_address}</span>
                      </div>
                    )}
                  </div>

                  <div className="detail-section">
                    <h4>🎨 Product Information</h4>
                    <div className="product-detail">
                      {selectedOrder.product_image && (
                        <img 
                          src={selectedOrder.product_image} 
                          alt={selectedOrder.product_title}
                          className="product-image-large"
                        />
                      )}
                      <div>
                        <div className="detail-row">
                          <span>Title:</span>
                          <span>{selectedOrder.product_title}</span>
                        </div>
                        <div className="detail-row">
                          <span>Price:</span>
                          <span>${selectedOrder.product_price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>💰 Payment Information</h4>
                    <div className="detail-row">
                      <span>Total Amount:</span>
                      <span><strong>${selectedOrder.total_amount}</strong></span>
                    </div>
                    <div className="detail-row">
                      <span>Received by Admin:</span>
                      <span><strong>${selectedOrder.total_amount}</strong> (100%)</span>
                    </div>
                    <div className="detail-row">
                      <span>Admin Keeps:</span>
                      <span><strong>${(parseFloat(selectedOrder.total_amount) * 0.9).toFixed(2)}</strong> (90%)</span>
                    </div>
                    <div className="detail-row">
                      <span>To Send to Artist:</span>
                      <span><strong>${(parseFloat(selectedOrder.total_amount) * 0.1).toFixed(2)}</strong> (10%)</span>
                    </div>
                    <div className="detail-row">
                      <span>Status:</span>
                      <span 
                        className={`status-badge status-${selectedOrder.status}`}
                        style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                      >
                        {selectedOrder.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Order Date:</span>
                      <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                    </div>
                    <div className="payment-flow-info">
                      <h5>💳 Actual Payment Flow:</h5>
                      <div className="flow-step">
                        <span className="step-number">1</span>
                        <span>Customer pays ${selectedOrder.total_amount}</span>
                      </div>
                      <div className="flow-step">
                        <span className="step-number">2</span>
                        <span>Admin receives ALL ${selectedOrder.total_amount} (100%)</span>
                      </div>
                      <div className="flow-step">
                        <span className="step-number">3</span>
                        <span>Admin calculates: Keep ${(parseFloat(selectedOrder.total_amount) * 0.9).toFixed(2)} (90%)</span>
                      </div>
                      <div className="flow-step">
                        <span className="step-number">4</span>
                        <span>Admin manually sends ${(parseFloat(selectedOrder.total_amount) * 0.1).toFixed(2)} to artist</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button 
                        className="admin-btn success"
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, 'paid');
                          setShowOrderModal(false);
                        }}
                      >
                        ✓ Mark as Paid
                      </button>
                      <button 
                        className="admin-btn danger"
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, 'failed');
                          setShowOrderModal(false);
                        }}
                      >
                        ✗ Mark as Failed
                      </button>
                    </>
                  )}
                  <button 
                    className="admin-btn secondary"
                    onClick={() => setShowOrderModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMail = () => {
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>📧 HubSpot Email System</h2>
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
            📊 Refresh Stats
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
                {sending ? 'Sending...' : `📤 Send to ${emailStats.verifiedUsers || users.filter(user => user.email_verified).length} users`}
              </button>
              <button 
                className="admin-btn secondary"
                onClick={() => setEmailData({ subject: '', message: '', sendToAll: true })}
              >
                Clear
              </button>
            </div>
            
            <div className="resend-features">
              <h4>✨ Resend Features:</h4>
              <ul>
                <li>📨 Beautiful HTML email templates</li>
                <li>📊 Real-time delivery tracking</li>
                <li>🚀 99.9% uptime guarantee</li>
                <li>💎 Professional email infrastructure</li>
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

  const renderFeedback = () => {
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>💬 User Feedback Management</h2>
          <div className="feedback-controls">
            <select 
              value={feedbackFilter} 
              onChange={(e) => setFeedbackFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Feedback</option>
              <option value="pending">⏳ Pending</option>
              <option value="reviewing">👀 Reviewing</option>
              <option value="resolved">✅ Resolved</option>
              <option value="dismissed">❌ Dismissed</option>
            </select>
            <button 
              className="admin-btn primary"
              onClick={fetchFeedback}
              disabled={feedbackLoading}
            >
              {feedbackLoading ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {feedbackLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading feedback...</p>
          </div>
        ) : (
          <>
            <div className="feedback-grid">
              {feedback.length === 0 ? (
                <div className="no-feedback-card">
                  <div className="no-feedback-icon">📭</div>
                  <h3>No feedback found</h3>
                  <p>No feedback matches the selected filter.</p>
                </div>
              ) : (
                feedback.map((item) => (
                  <div key={item.id} className={`feedback-card status-${item.status}`}>
                    <div className="feedback-card-header">
                      <div className="feedback-priority">
                        <span className={`status-badge status-${item.status}`}>
                          {item.status === 'pending' && '⏳'}
                          {item.status === 'reviewing' && '👀'}
                          {item.status === 'resolved' && '✅'}
                          {item.status === 'dismissed' && '❌'}
                          {item.status.toUpperCase()}
                        </span>
                        <span className="feedback-date">
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="feedback-actions">
                        <button
                          className="action-btn view-btn"
                          onClick={() => {
                            setSelectedFeedback(item);
                            setShowFeedbackModal(true);
                          }}
                          title="View details"
                        >
                          👁️
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => deleteFeedback(item.id)}
                          title="Delete feedback"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="feedback-content">
                      <h4 className="feedback-issue">
                        📋 {item.issue}
                      </h4>
                      <div className="feedback-preview">
                        {item.feedback.length > 120 
                          ? `${item.feedback.substring(0, 120)}...` 
                          : item.feedback}
                      </div>
                      <div className="feedback-user">
                        <span className="user-avatar">👤</span>
                        <div className="user-details">
                          <span className="user-name">{item.user_name}</span>
                          <span className="user-email">{item.user_email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {feedbackPagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={feedbackPagination.page === 1}
                  onClick={() => setFeedbackPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  ⬅️ Previous
                </button>
                <div className="page-info">
                  <span className="page-current">{feedbackPagination.page}</span>
                  <span className="page-separator">of</span>
                  <span className="page-total">{feedbackPagination.pages}</span>
                </div>
                <button
                  className="pagination-btn"
                  disabled={feedbackPagination.page === feedbackPagination.pages}
                  onClick={() => setFeedbackPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next ➡️
                </button>
              </div>
            )}
          </>
        )}

        {/* Enhanced Feedback Modal */}
        {showFeedbackModal && selectedFeedback && (
          <div className="modal-overlay">
            <div className="modal-content feedback-modal-enhanced">
              <div className="modal-header">
                <div className="modal-title">
                  <h2>📋 Feedback Details</h2>
                  <span className={`status-badge status-${selectedFeedback.status}`}>
                    {selectedFeedback.status === 'pending' && '⏳'}
                    {selectedFeedback.status === 'reviewing' && '👀'}
                    {selectedFeedback.status === 'resolved' && '✅'}
                    {selectedFeedback.status === 'dismissed' && '❌'}
                    {selectedFeedback.status.toUpperCase()}
                  </span>
                </div>
                <button 
                  className="modal-close"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="feedback-details-enhanced">
                <div className="detail-card">
                  <div className="detail-header">
                    <h4>👤 User Information</h4>
                  </div>
                  <div className="detail-content">
                    <div className="detail-row">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedFeedback.user_name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedFeedback.user_email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{new Date(selectedFeedback.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-header">
                    <h4>📋 Issue/Topic</h4>
                  </div>
                  <div className="detail-content">
                    <div className="issue-content">{selectedFeedback.issue}</div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-header">
                    <h4>💬 Feedback Details</h4>
                  </div>
                  <div className="detail-content">
                    <div className="feedback-full-content">
                      {selectedFeedback.feedback}
                    </div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-header">
                    <h4>⚙️ Status Management</h4>
                  </div>
                  <div className="detail-content">
                    <div className="status-management">
                      <div className="status-controls">
                        <label htmlFor="status-select">Change Status:</label>
                        <select 
                          id="status-select"
                          defaultValue={selectedFeedback.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            const notes = prompt(`Update status to ${newStatus}. Add admin notes (optional):`);
                            if (notes !== null) {
                              updateFeedbackStatus(selectedFeedback.id, newStatus, notes);
                            }
                          }}
                          className="status-select-enhanced"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="reviewing">👀 Reviewing</option>
                          <option value="resolved">✅ Resolved</option>
                          <option value="dismissed">❌ Dismissed</option>
                        </select>
                      </div>
                      {selectedFeedback.admin_notes && (
                        <div className="admin-notes">
                          <h5>📝 Admin Notes:</h5>
                          <div className="admin-notes-content">{selectedFeedback.admin_notes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="action-btn-large delete-btn-large"
                    onClick={() => deleteFeedback(selectedFeedback.id)}
                  >
                    🗑️ Delete Feedback
                  </button>
                  <button
                    className="action-btn-large cancel-btn"
                    onClick={() => setShowFeedbackModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDatabase = () => {
    if (databaseLoading) {
      return (
        <div className="admin-section">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading database information...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>🗄️ Database Management</h2>
          <div className="database-actions">
            <button 
              className="admin-btn primary"
              onClick={loadDatabaseInfo}
              disabled={databaseLoading}
            >
              🔄 Refresh
            </button>
            <button 
              className="admin-btn success"
              onClick={handleDatabaseExport}
            >
              📥 Export Database
            </button>
          </div>
        </div>

        <div className="database-layout">
          {/* Database Overview */}
          <div className="database-panel">
            <h3>📊 Database Overview</h3>
            {databaseInfo && (
              <div className="database-overview">
                <div className="db-info-card">
                  <h4>📁 Database File</h4>
                  <p><strong>Path:</strong> {databaseInfo.database.path}</p>
                  <p><strong>Size:</strong> {(databaseInfo.database.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Last Modified:</strong> {new Date(databaseInfo.database.lastModified).toLocaleString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge ${databaseInfo.database.exists ? 'status-connected' : 'status-error'}`}>
                      {databaseInfo.database.exists ? '✅ Connected' : '❌ Not Found'}
                    </span>
                  </p>
                </div>

                <div className="db-info-card">
                  <h4>🔗 Connection Info</h4>
                  <p><strong>Type:</strong> {databaseInfo.connections.type}</p>
                  <p><strong>Version:</strong> {databaseInfo.connections.version || 'Unknown'}</p>
                  <p><strong>Status:</strong> 
                    <span className="status-badge status-connected">
                      {databaseInfo.connections.status}
                    </span>
                  </p>
                </div>

                <div className="db-info-card">
                  <h4>📋 Tables ({databaseInfo.tables.length})</h4>
                  <div className="table-list">
                    {databaseInfo.tables.map(table => (
                      <div 
                        key={table.name} 
                        className={`table-item ${selectedTable === table.name ? 'selected' : ''}`}
                        onClick={() => handleTableSelect(table.name)}
                      >
                        <div className="table-name">🗂️ {table.name}</div>
                        <div className="table-stats">
                          <span>{table.rowCount} rows</span>
                          <span>{table.columnCount} columns</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table Details */}
          {selectedTable && tableDetails && (
            <div className="database-panel">
              <h3>🗂️ Table: {selectedTable}</h3>
              <div className="table-details">
                <div className="table-schema">
                  <h4>📋 Schema</h4>
                  <div className="schema-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Column</th>
                          <th>Type</th>
                          <th>Constraints</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableDetails.columns.map(col => (
                          <tr key={col.name}>
                            <td>
                              <strong>{col.name}</strong>
                              {col.primaryKey && <span className="pk-badge">PK</span>}
                            </td>
                            <td><code>{col.type}</code></td>
                            <td>
                              {col.notNull && <span className="constraint-badge">NOT NULL</span>}
                              {col.defaultValue && <span className="constraint-badge">DEFAULT: {col.defaultValue}</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {tableDetails.sampleData && tableDetails.sampleData.length > 0 && (
                  <div className="sample-data">
                    <h4>📊 Sample Data (First 10 rows)</h4>
                    <div className="data-table">
                      <table>
                        <thead>
                          <tr>
                            {tableDetails.columns.map(col => (
                              <th key={col.name}>{col.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableDetails.sampleData.map((row, index) => (
                            <tr key={index}>
                              {tableDetails.columns.map(col => (
                                <td key={col.name}>
                                  {row[col.name] === null ? (
                                    <span className="null-value">NULL</span>
                                  ) : (
                                    String(row[col.name])
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Query Executor */}
          <div className="database-panel">
            <h3>⚡ Query Executor</h3>
            <div className="query-executor">
              <div className="query-input">
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Enter your SQL query here..."
                  rows={4}
                  className="query-textarea"
                />
                <div className="query-actions">
                  <button 
                    className="admin-btn primary"
                    onClick={handleQueryExecute}
                    disabled={queryLoading}
                  >
                    {queryLoading ? '⏳ Executing...' : '▶️ Execute Query'}
                  </button>
                  <button 
                    className="admin-btn secondary"
                    onClick={() => setQueryText('SELECT * FROM users LIMIT 10;')}
                  >
                    📝 Example Query
                  </button>
                </div>
              </div>

              {queryResult && (
                <div className="query-result">
                  {queryResult.error ? (
                    <div className="error-result">
                      <h4>❌ Query Error</h4>
                      <pre>{queryResult.error}</pre>
                    </div>
                  ) : (
                    <div className="success-result">
                      <h4>✅ Query Result ({queryResult.rowCount || queryResult.data?.length || 0} rows)</h4>
                      {queryResult.data && queryResult.data.length > 0 ? (
                        <div className="result-table">
                          <table>
                            <thead>
                              <tr>
                                {Object.keys(queryResult.data[0]).map(key => (
                                  <th key={key}>{key}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {queryResult.data.slice(0, 50).map((row, index) => (
                                <tr key={index}>
                                  {Object.keys(row).map(key => (
                                    <td key={key}>
                                      {row[key] === null ? (
                                        <span className="null-value">NULL</span>
                                      ) : (
                                        String(row[key])
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {queryResult.data.length > 50 && (
                            <p className="result-note">
                              Showing first 50 rows of {queryResult.data.length} total results.
                            </p>
                          )}
                        </div>
                      ) : (
                        <p>Query executed successfully. {queryResult.message || 'No data returned.'}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Health Check */}
          {databaseHealth && (
            <div className="database-panel">
              <h3>🏥 Database Health</h3>
              <div className="health-check">
                <div className={`health-status ${databaseHealth.status}`}>
                  <h4>
                    {databaseHealth.status === 'healthy' ? '✅' : databaseHealth.status === 'unhealthy' ? '❌' : '⚠️'} 
                    Status: {databaseHealth.status.toUpperCase()}
                  </h4>
                  <p className="health-timestamp">
                    Last checked: {new Date(databaseHealth.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div className="health-checks">
                  {databaseHealth.checks.map((check, index) => (
                    <div key={index} className={`health-check-item ${check.status}`}>
                      <div className="check-status">
                        {check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️'}
                      </div>
                      <div className="check-details">
                        <strong>{check.name}</strong>
                        <p>{check.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
      case 'feedback':
        return renderFeedback();
      case 'database':
        return renderDatabase();
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
              📊 Dashboard
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              🎨 Products
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('articles')}
            >
              📝 Articles
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              🛍️ Orders
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'mail' ? 'active' : ''}`}
              onClick={() => setActiveTab('mail')}
            >
              📧 Mail
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              💬 Feedback
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'database' ? 'active' : ''}`}
              onClick={() => setActiveTab('database')}
            >
              🗄️ Database
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
                ×
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
                    <option value="collector">Collector</option>
                    <option value="institution">Institution</option>
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
                ×
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
                  <option value="gallery">Gallery</option>
                  <option value="collector">Collector</option>
                  <option value="institution">Institution</option>
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
                ×
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
                    <option value="collage">Collage</option>
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

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="modal-overlay">
          <div className="modal-content rejection-modal">
            <div className="modal-header">
              <h2>🚫 Reject Artwork</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowRejectionModal(false)}
                type="button"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="rejection-info">
                <p><strong>Artwork:</strong> {rejectionData.productTitle}</p>
                <p className="rejection-warning">
                  ⚠️ This artwork will be rejected and the artist will be notified.
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="rejectionReason" className="form-label">
                  Reason for Rejection *
                </label>
                <textarea
                  id="rejectionReason"
                  value={rejectionData.rejectionReason}
                  onChange={(e) => setRejectionData({
                    ...rejectionData,
                    rejectionReason: e.target.value
                  })}
                  className="form-textarea"
                  rows="4"
                  placeholder="Please provide a clear reason for rejection (e.g., inappropriate content, poor quality, doesn't meet guidelines, etc.)"
                  required
                />
                <small className="form-help">
                  This reason will be sent to the artist to help them understand why their artwork was rejected.
                </small>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="admin-btn secondary"
                onClick={() => setShowRejectionModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="admin-btn danger"
                onClick={handleRejectionSubmit}
                disabled={!rejectionData.rejectionReason.trim()}
              >
                🚫 Reject Artwork
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
