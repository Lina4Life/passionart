import Navbar from './components/common/Navbar.jsx';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Exhibitions from './pages/Exhibitions.jsx';
import Events from './pages/Events.jsx';
import Learn from './pages/Learn.jsx';
import Store from './pages/Store.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';

function App() {
  const { toast, clearToast } = useToast();

  return (
    <BrowserRouter>
  <Navbar />
  {/* Main structure now handled by Home.js */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exhibitions" element={<Exhibitions />} />
        <Route path="/events" element={<Events />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/store" element={<Store />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        {/* add more routes here */}
      </Routes>
      <Toast toast={toast} onClose={clearToast} />
    </BrowserRouter>
  );
}

export default App;
