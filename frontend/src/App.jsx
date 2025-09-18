import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import './App.css';

import Home from './pages/Home.jsx';
import Articles from './pages/Articles.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import Exhibitions from './pages/Exhibitions.jsx';
import Events from './pages/Events.jsx';
import Learn from './pages/Learn.jsx';
import Store from './pages/Store.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import PaymentPage from './pages/PaymentPage';
import Admin from './pages/Admin';
import Profile from './pages/ProfileEnhanced';
import Artists from './pages/Artists';
import ArtistProfile from './pages/ArtistProfile';
import Community from './pages/community/CommunityChat';
import AiChat from './pages/AiChat';
import EmailVerification from './pages/EmailVerification';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/common/Navbar.jsx';
import Toast from './components/Toast.jsx';
import FeedbackPopup from './components/common/FeedbackPopup.jsx';
import { useToast } from './hooks/useToast';

function App() {
  const { t } = useTranslation();
  const { toast, clearToast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Get user info for feedback
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const token = localStorage.getItem('token');

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="app">
          <BrowserRouter>
            <Navbar />
            <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:categorySlug" element={<Community />} />
            <Route path="/ai-chat" element={<AiChat />} />
            <Route path="/exhibitions" element={<Exhibitions />} />
            <Route path="/events" element={<Events />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/store" element={<Store />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/gallery" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Toast toast={toast} onClose={clearToast} />
        
        {/* Floating Feedback Button */}
        {token && (
          <>
            <button
              onClick={() => setFeedbackOpen(true)}
              style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
                zIndex: 1000,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
              }}
              title={t('nav.send_feedback')}
            >
              ðŸ’¬
            </button>
            <FeedbackPopup
              isOpen={feedbackOpen}
              onClose={() => setFeedbackOpen(false)}
              user={user}
            />
          </>
        )}
      </BrowserRouter>
    </div>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

