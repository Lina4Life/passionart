/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database connection
const dbPath = path.join(__dirname, '..', 'data', 'passionart.db');

// Get database overview information
const getDatabaseInfo = async (req, res) => {
  try {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    
    const result = {
      database: {
        path: dbPath,
        exists: fs.existsSync(dbPath),
        size: fs.existsSync(dbPath) ? fs.statSync(dbPath).size : 0,
        lastModified: fs.existsSync(dbPath) ? fs.statSync(dbPath).mtime : null
      },
      tables: [],
      connections: {
        type: 'SQLite',
        status: 'Connected',
        version: null
      }
    };

    // Get SQLite version
    db.get("SELECT sqlite_version() as version", (err, row) => {
      if (!err && row) {
        result.connections.version = row.version;
      }
    });

    // Get all tables
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
      if (err) {
        console.error('Error fetching tables:', err);
        return res.status(500).json({ error: 'Failed to fetch tables' });
      }

      const tablePromises = rows.map(row => {
        return new Promise((resolve) => {
          const tableName = row.name;
          
          // Get table info
          db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
            if (err) {
              resolve({ name: tableName, columns: [], rowCount: 0, error: err.message });
              return;
            }

            // Get row count
            db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, countRow) => {
              const rowCount = err ? 0 : countRow.count;
              
              resolve({
                name: tableName,
                columns: columns.map(col => ({
                  name: col.name,
                  type: col.type,
                  notNull: col.notnull === 1,
                  primaryKey: col.pk === 1,
                  defaultValue: col.dflt_value
                })),
                rowCount: rowCount,
                columnCount: columns.length
              });
            });
          });
        });
      });

      Promise.all(tablePromises).then(tables => {
        result.tables = tables;
        db.close();
        res.json(result);
      });
    });

  } catch (error) {
    console.error('Database info error:', error);
    res.status(500).json({ error: 'Failed to get database information' });
  }
};

// Get detailed table information
const getTableDetails = async (req, res) => {
  try {
    const { tableName } = req.params;
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    
    // Get table schema
    db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to get table schema' });
      }

      // Get sample data (first 10 rows)
      db.all(`SELECT * FROM ${tableName} LIMIT 10`, (err, sampleData) => {
        if (err) {
          console.error('Error getting sample data:', err);
          sampleData = [];
        }

        // Get indexes
        db.all(`PRAGMA index_list(${tableName})`, (err, indexes) => {
          if (err) {
            console.error('Error getting indexes:', err);
            indexes = [];
          }

          db.close();
          res.json({
            tableName,
            columns: columns.map(col => ({
              name: col.name,
              type: col.type,
              notNull: col.notnull === 1,
              primaryKey: col.pk === 1,
              defaultValue: col.dflt_value
            })),
            sampleData,
            indexes: indexes.map(idx => ({
              name: idx.name,
              unique: idx.unique === 1,
              origin: idx.origin
            }))
          });
        });
      });
    });

  } catch (error) {
    console.error('Table details error:', error);
    res.status(500).json({ error: 'Failed to get table details' });
  }
};

// Execute database query (admin only, be careful!)
const executeQuery = async (req, res) => {
  try {
    const { query, readOnly = true } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Security check - only allow SELECT statements if readOnly is true
    const trimmedQuery = query.trim().toUpperCase();
    if (readOnly && !trimmedQuery.startsWith('SELECT')) {
      return res.status(400).json({ error: 'Only SELECT queries allowed in read-only mode' });
    }

    const db = new sqlite3.Database(dbPath, readOnly ? sqlite3.OPEN_READONLY : sqlite3.OPEN_READWRITE);
    
    if (trimmedQuery.startsWith('SELECT')) {
      db.all(query, (err, rows) => {
        db.close();
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, data: rows, rowCount: rows.length });
      });
    } else {
      db.run(query, function(err) {
        db.close();
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ 
          success: true, 
          message: 'Query executed successfully',
          changes: this.changes,
          lastID: this.lastID 
        });
      });
    }

  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({ error: 'Failed to execute query' });
  }
};

// Export database backup
const exportDatabase = async (req, res) => {
  try {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    const exportData = {};

    // Get all tables
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to get tables' });
      }

      const tablePromises = tables.map(table => {
        return new Promise((resolve) => {
          db.all(`SELECT * FROM ${table.name}`, (err, rows) => {
            if (err) {
              resolve({ table: table.name, error: err.message });
            } else {
              resolve({ table: table.name, data: rows });
            }
          });
        });
      });

      Promise.all(tablePromises).then(results => {
        results.forEach(result => {
          if (result.error) {
            exportData[result.table] = { error: result.error };
          } else {
            exportData[result.table] = result.data;
          }
        });

        db.close();
        
        // Set headers for file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="passionart_backup_${new Date().toISOString().split('T')[0]}.json"`);
        res.json({
          exportDate: new Date().toISOString(),
          database: 'passionart.db',
          tables: exportData
        });
      });
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export database' });
  }
};

// Database health check
const healthCheck = async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      checks: [],
      timestamp: new Date().toISOString()
    };

    const db = new sqlite3.Database(dbPath);

    // Check database connection
    health.checks.push({
      name: 'Database Connection',
      status: 'pass',
      message: 'Successfully connected to SQLite database'
    });

    // Check database file
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      health.checks.push({
        name: 'Database File',
        status: 'pass',
        message: `Database file exists (${(stats.size / 1024 / 1024).toFixed(2)} MB)`
      });
    } else {
      health.checks.push({
        name: 'Database File',
        status: 'fail',
        message: 'Database file not found'
      });
      health.status = 'unhealthy';
    }

    // Check essential tables
    const essentialTables = ['users', 'artworks', 'articles'];
    
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        health.checks.push({
          name: 'Table Check',
          status: 'fail',
          message: err.message
        });
        health.status = 'unhealthy';
      } else {
        const tableNames = tables.map(t => t.name);
        const missingTables = essentialTables.filter(t => !tableNames.includes(t));
        
        if (missingTables.length === 0) {
          health.checks.push({
            name: 'Essential Tables',
            status: 'pass',
            message: `All essential tables present (${tableNames.length} total tables)`
          });
        } else {
          health.checks.push({
            name: 'Essential Tables',
            status: 'warn',
            message: `Missing tables: ${missingTables.join(', ')}`
          });
        }
      }

      db.close();
      res.json(health);
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getDatabaseInfo,
  getTableDetails,
  executeQuery,
  exportDatabase,
  healthCheck
};
