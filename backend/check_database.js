/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'data', 'passionart.db');

console.log('🔍 Checking database at:', dbPath);
console.log('=' .repeat(80));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  
  console.log('✅ Connected to SQLite database');
  console.log('=' .repeat(80));
  
  // Get all table names
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, tables) => {
    if (err) {
      console.error('❌ Error fetching tables:', err.message);
      return;
    }
    
    console.log(`📋 Found ${tables.length} tables:`);
    tables.forEach(table => console.log(`  - ${table.name}`));
    console.log('=' .repeat(80));
    
    // Query each table for data
    let processedTables = 0;
    
    tables.forEach((table, index) => {
      const tableName = table.name;
      
      // Get table schema
      db.all(`PRAGMA table_info(${tableName})`, [], (err, columns) => {
        if (err) {
          console.error(`❌ Error getting schema for ${tableName}:`, err.message);
          return;
        }
        
        console.log(`\n📊 Table: ${tableName.toUpperCase()}`);
        console.log('-'.repeat(50));
        
        // Show columns
        console.log('Columns:');
        columns.forEach(col => {
          const pk = col.pk ? ' (PRIMARY KEY)' : '';
          const notNull = col.notnull ? ' NOT NULL' : '';
          const defaultVal = col.dflt_value ? ` DEFAULT ${col.dflt_value}` : '';
          console.log(`  ${col.name}: ${col.type}${pk}${notNull}${defaultVal}`);
        });
        
        // Get row count
        db.get(`SELECT COUNT(*) as count FROM ${tableName}`, [], (err, countResult) => {
          if (err) {
            console.error(`❌ Error counting rows in ${tableName}:`, err.message);
            return;
          }
          
          const rowCount = countResult.count;
          console.log(`\nRows: ${rowCount}`);
          
          if (rowCount > 0) {
            // Show first 10 rows of data
            db.all(`SELECT * FROM ${tableName} LIMIT 10`, [], (err, rows) => {
              if (err) {
                console.error(`❌ Error fetching data from ${tableName}:`, err.message);
                return;
              }
              
              if (rows.length > 0) {
                console.log('\nData (first 10 rows):');
                rows.forEach((row, i) => {
                  console.log(`  Row ${i + 1}:`, JSON.stringify(row, null, 2));
                });
              }
              
              processedTables++;
              if (processedTables === tables.length) {
                console.log('\n' + '=' .repeat(80));
                console.log('✅ Database analysis complete!');
                db.close();
              }
            });
          } else {
            console.log('  (No data)');
            processedTables++;
            if (processedTables === tables.length) {
              console.log('\n' + '=' .repeat(80));
              console.log('✅ Database analysis complete!');
              db.close();
            }
          }
        });
      });
    });
  });
});
