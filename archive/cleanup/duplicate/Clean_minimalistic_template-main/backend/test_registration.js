/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const { register } = require('./controllers/auth.controller');

// Mock request and response objects for testing
const mockReq = {
  body: {
    email: 'youssefelgharib03@gmail.com',
    password: 'testpass123',
    username: 'testuser',
    first_name: 'Youssef',
    last_name: 'Elgharib'
  }
};

const mockRes = {
  json: (data) => {
    console.log('✅ Registration response:', data);
  },
  status: (code) => {
    console.log('Status code:', code);
    return {
      json: (data) => {
        console.log('❌ Error response:', data);
      }
    };
  }
};

console.log('Testing user registration with email verification...');
register(mockReq, mockRes);
