const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/database.controller');

// Database information endpoints
router.get('/info', databaseController.getDatabaseInfo);
router.get('/tables/:tableName', databaseController.getTableDetails);
router.post('/query', databaseController.executeQuery);
router.get('/export', databaseController.exportDatabase);
router.get('/health', databaseController.healthCheck);

module.exports = router;

