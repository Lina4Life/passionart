/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
// Example: Direct Database Connection (Frontend-only approach)
// Note: This would only work in Node.js, not in browsers due to security

import sqlite3 from 'sqlite3';
import { useState } from 'react';

// This approach has MAJOR security issues for web apps!
const DirectDatabaseLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const loginDirectly = () => {
    // This would expose your database to the internet!
    const db = new sqlite3.Database('./backend/data/passionart.db');
    
    db.get(
      "SELECT * FROM users WHERE email = ? AND password = ?", 
      [credentials.email, credentials.password],
      (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return;
        }
        
        if (user) {
          console.log('Login successful:', user);
          // Handle successful login
        } else {
          console.log('Invalid credentials');
        }
      }
    );
    
    db.close();
  };

  return (
    <div>
      <input 
        type="email" 
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        placeholder="Email"
      />
      <input 
        type="password"
        value={credentials.password} 
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        placeholder="Password"
      />
      <button onClick={loginDirectly}>
        Login Directly to Database
      </button>
    </div>
  );
};

export default DirectDatabaseLogin;
