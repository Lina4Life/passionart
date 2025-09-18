const axios = require('axios');

async function testConnection() {
    try {
        console.log('Testing connection to http://localhost:3001/api/health...');
        const response = await axios.get('http://localhost:3001/api/health');
        console.log('âœ… Success:', response.data);
    } catch (error) {
        console.log('âŒ Error:', error.message);
        if (error.code) {
            console.log('Error code:', error.code);
        }
    }
}

testConnection();

