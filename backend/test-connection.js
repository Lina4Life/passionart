/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const axios = require('axios');

async function testConnection() {
    try {
        console.log('Testing connection to http://localhost:3001/api/health...');
        const response = await axios.get('http://localhost:3001/api/health');
        console.log('✅ Success:', response.data);
    } catch (error) {
        console.log('❌ Error:', error.message);
        if (error.code) {
            console.log('Error code:', error.code);
        }
    }
}

testConnection();
