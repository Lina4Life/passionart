/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('./data/passionart.db');

let sqlOutput = `-- PassionArt Database Export
-- Generated on ${new Date().toISOString()}
-- 

`;

// Get all table schemas
db.serialize(() => {
  // Get table list
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error getting tables:', err);
      return;
    }

    let processedTables = 0;
    const totalTables = tables.length;

    tables.forEach(table => {
      const tableName = table.name;
      
      // Skip sqlite internal tables
      if (tableName.startsWith('sqlite_')) {
        processedTables++;
        if (processedTables === totalTables) {
          finishExport();
        }
        return;
      }

      // Get table schema
      db.get(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, schema) => {
        if (err) {
          console.error(`Error getting schema for ${tableName}:`, err);
          return;
        }

        sqlOutput += `-- Table: ${tableName}\n`;
        sqlOutput += `DROP TABLE IF EXISTS ${tableName};\n`;
        sqlOutput += `${schema.sql};\n\n`;

        // Get table data
        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
          if (err) {
            console.error(`Error getting data for ${tableName}:`, err);
            return;
          }

          if (rows.length > 0) {
            sqlOutput += `-- Data for table: ${tableName}\n`;
            
            rows.forEach(row => {
              const columns = Object.keys(row);
              const values = columns.map(col => {
                const val = row[col];
                if (val === null) return 'NULL';
                if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                return val;
              });
              
              sqlOutput += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
            });
            sqlOutput += `\n`;
          }

          processedTables++;
          if (processedTables === totalTables) {
            finishExport();
          }
        });
      });
    });

    function finishExport() {
      // Write to file
      fs.writeFileSync('./passionart_export.sql', sqlOutput);
      console.log('Database export completed: passionart_export.sql');
      console.log('File size:', fs.statSync('./passionart_export.sql').size, 'bytes');
      
      // Also display the content
      console.log('\n=== SQL EXPORT CONTENT ===\n');
      console.log(sqlOutput);
      
      db.close();
    }
  });
});
