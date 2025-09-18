const express = require('express');
const app = express();
const PORT = 3002;

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Test server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

