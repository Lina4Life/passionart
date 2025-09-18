/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../services/articles';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch article details
      const response = await articlesAPI.getById(id);
      if (response.success) {
        setArticle(response.article);
        
        // Increment view count
        articlesAPI.incrementViews(id);
        
        // Fetch related articles from same category
        if (response.article.category) {
          const relatedResponse = await articlesAPI.getByCategory(response.article.category, 1, 3);
          if (relatedResponse.success) {
            // Filter out current article
            const filtered = relatedResponse.articles.filter(a => a.id !== parseInt(id));
            setRelatedArticles(filtered.slice(0, 2));
          }
        }
      } else {
        setError('Article not found');
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/articles');
  };

  const handleRelatedArticleClick = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  if (loading) {
    return (
      <div className="article-detail-page">
        <div className="article-container">
          <div className="loading">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-detail-page">
        <div className="article-container">
          <div className="error">
            {error}
            <button onClick={handleBackClick} className="back-btn">
              Back to Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-page">
        <div className="article-container">
          <div className="error">Article not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      {/* Navigation */}
      <div className="article-nav">
        <div className="article-container">
          <button onClick={handleBackClick} className="back-btn">
            ← BACK TO ARTICLES
          </button>
        </div>
      </div>

      {/* Article Header */}
      <article className="article-detail">
        <div className="article-container">
          <div className="article-header">
            <div className="article-meta">
              <span className="article-category">{article.category}</span>
              <span className="article-date">{article.date}</span>
            </div>
            <h1 className="article-title">{article.title}</h1>
            <div className="article-info">
              <div className="article-author">BY {article.author.toUpperCase()}</div>
              <div className="article-stats">
                <span className="read-time">{article.readTime}</span>
                <span className="views">{article.views} VIEWS</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="article-content">
            <div className="article-body">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="article-tags">
                <h3>TAGS</h3>
                <div className="tags-list">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="related-articles">
          <div className="article-container">
            <h2 className="section-title">RELATED ARTICLES</h2>
            <div className="related-articles-grid">
              {relatedArticles.map((relatedArticle) => (
                <article 
                  key={relatedArticle.id} 
                  className="related-article-card"
                  onClick={() => handleRelatedArticleClick(relatedArticle.id)}
                >
                  <div className="article-meta">
                    <span className="article-category">{relatedArticle.category}</span>
                    <span className="article-date">{relatedArticle.date}</span>
                  </div>
                  <h3 className="article-title">{relatedArticle.title}</h3>
                  <p className="article-excerpt">{relatedArticle.excerpt}</p>
                  <div className="article-footer">
                    <div className="article-author">BY {relatedArticle.author.toUpperCase()}</div>
                    <div className="article-read-time">{relatedArticle.readTime}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="article-container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">STAY UPDATED</h2>
            <p className="newsletter-subtitle">
              Subscribe to receive the latest articles and insights directly to your inbox
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="newsletter-btn">SUBSCRIBE</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticleDetail;
