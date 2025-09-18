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
    console.log('âœ… Registration response:', data);
  },
  status: (code) => {
    console.log('Status code:', code);
    return {
      json: (data) => {
        console.log('âŒ Error response:', data);
      }
    };
  }
};

console.log('Testing user registration with email verification...');
register(mockReq, mockRes);

