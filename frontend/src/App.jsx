import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
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
import Community from './pages/community/Community';
import AiChat from './pages/AiChat';
import EmailVerification from './pages/EmailVerification';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/common/Navbar.jsx';
import Toast from './components/Toast.jsx';
import { useToast } from './hooks/useToast';

function App() {
  const { toast, clearToast } = useToast();

  return (
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
            <Route path="/gallery" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/admin" element={<Admin />} />
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
      </BrowserRouter>
    </div>
    </ThemeProvider>
  );
}

export default App;
