/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, register as apiRegister } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUser({ email: decoded.email });
      } catch {
        setUser(null);
      }
    }
  }, []);

  const saveToken = (tok) => {
    setToken(tok);
    localStorage.setItem('token', tok);
    try {
      const decoded = jwtDecode(tok);
      setUser({ email: decoded.email });
    } catch {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    saveToken(data.token);
    return data;
  };

  const register = async (email, password) => {
    const data = await apiRegister(email, password);
    saveToken(data.token);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
