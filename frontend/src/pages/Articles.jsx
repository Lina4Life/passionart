import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesAPI } from '../services/articles';
import './Articles.css';

const Articles = () => {
  const navigate = useNavigate();
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const categories = [
    "ALL",
    "TECHNOLOGY", 
    "AI & ART",
    "SUSTAINABILITY",
    "VR/AR", 
    "PSYCHOLOGY",
    "BLOCKCHAIN",
    "MOTION",
    "AR/PUBLIC"
  ];

  useEffect(() => {
    fetchFeaturedArticles();
    fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedCategory !== 'ALL') {
      fetchArticlesByCategory(selectedCategory);
    } else if (searchQuery) {
      searchArticles(searchQuery);
    } else {
      fetchArticles();
    }
  }, [selectedCategory]);

  const fetchFeaturedArticles = async () => {
    try {
      const response = await articlesAPI.getFeatured();
      if (response.success) {
        setFeaturedArticles(response.articles);
      }
    } catch (error) {
      console.error('Error fetching featured articles:', error);
    }
  };

  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await articlesAPI.getAll(page, 8);
      if (response.success) {
        setArticles(response.articles);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchArticlesByCategory = async (category, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await articlesAPI.getByCategory(category, page, 8);
      if (response.success) {
        setArticles(response.articles);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async (query, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await articlesAPI.search(query, selectedCategory, page, 8);
      if (response.success) {
        setArticles(response.articles);
        setPagination(response.pagination);
      } else {
        setError('No articles found');
      }
    } catch (error) {
      console.error('Error searching articles:', error);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setPagination({ page: 1, total: 0, pages: 0 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchArticles(searchQuery.trim());
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Auto-search when cleared
    if (!value.trim()) {
      setSelectedCategory('ALL');
      fetchArticles();
    }
  };

  const handleArticleClick = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const handleNewsletterSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      alert('Thank you for subscribing! You will receive the latest articles in your inbox.');
      e.target.reset();
    }
  };

  return (
    <div className="articles-page">
      {/* Hero Section */}
      <section className="articles-hero">
        <div className="articles-hero-content">
          <h1 className="articles-hero-title">ARTICLES</h1>
          <p className="articles-hero-subtitle">
            INSIGHTS, ANALYSIS & PERSPECTIVES ON THE FUTURE OF ART
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                SEARCH
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="featured-articles-section">
          <div className="articles-container">
            <h2 className="section-title">FEATURED ARTICLES</h2>
            <div className="featured-articles-grid">
              {featuredArticles.map((article) => (
                <article 
                  key={article.id} 
                  className="featured-article-card"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <div className="article-meta">
                    <span className="article-category">{article.category}</span>
                    <span className="article-date">{article.date}</span>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="article-footer">
                    <div className="article-author">BY {article.author.toUpperCase()}</div>
                    <div className="article-read-time">{article.readTime}</div>
                  </div>
                  <button className="read-article-btn">READ ARTICLE</button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="articles-filter-section">
        <div className="articles-container">
          <div className="category-filters">
            {categories.map((category) => (
              <button 
                key={category} 
                className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="all-articles-section">
        <div className="articles-container">
          <div className="section-header">
            <h2 className="section-title">
              {searchQuery ? `SEARCH RESULTS FOR "${searchQuery}"` : 
               selectedCategory !== 'ALL' ? `${selectedCategory} ARTICLES` : 'ALL ARTICLES'}
            </h2>
            {pagination.total > 0 && (
              <p className="results-count">
                Showing {articles.length} of {pagination.total} articles
              </p>
            )}
          </div>

          {loading ? (
            <div className="loading">Loading articles...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : articles.length === 0 ? (
            <div className="no-results">
              No articles found. Try adjusting your search or filter.
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map((article) => (
                <article 
                  key={article.id} 
                  className="article-card"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <div className="article-meta">
                    <span className="article-category">{article.category}</span>
                    <span className="article-date">{article.date}</span>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="article-footer">
                    <div className="article-author">BY {article.author.toUpperCase()}</div>
                    <div className="article-stats">
                      <span className="article-read-time">{article.readTime}</span>
                      <span className="article-views">{article.views} views</span>
                    </div>
                  </div>
                  <button className="read-article-btn">READ ARTICLE</button>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={pagination.page === 1}
                onClick={() => {
                  const newPage = pagination.page - 1;
                  if (selectedCategory !== 'ALL') {
                    fetchArticlesByCategory(selectedCategory, newPage);
                  } else if (searchQuery) {
                    searchArticles(searchQuery, newPage);
                  } else {
                    fetchArticles(newPage);
                  }
                }}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button
                className="pagination-btn"
                disabled={pagination.page === pagination.pages}
                onClick={() => {
                  const newPage = pagination.page + 1;
                  if (selectedCategory !== 'ALL') {
                    fetchArticlesByCategory(selectedCategory, newPage);
                  } else if (searchQuery) {
                    searchArticles(searchQuery, newPage);
                  } else {
                    fetchArticles(newPage);
                  }
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="articles-container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">STAY UPDATED</h2>
            <p className="newsletter-subtitle">
              Subscribe to receive the latest articles and insights directly to your inbox
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="newsletter-form">
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">SUBSCRIBE</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Articles;

