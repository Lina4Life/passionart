/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('=== CHECKING BOTH DATABASE FILES ===\n');

// Check config/database.db
console.log('1. CONFIG/DATABASE.DB:');
const configDb = new sqlite3.Database('./config/database.db', (err) => {
  if (err) {
    console.log('   Error: Could not open config/database.db:', err.message);
    checkDataDb();
  } else {
    console.log('   ✅ Connected to config/database.db');
    
    configDb.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        console.log('   Error getting tables:', err.message);
      } else {
        console.log('   Tables:', tables.map(t => t.name).join(', ') || 'No tables');
        
        if (tables.find(t => t.name === 'artworks')) {
          configDb.all('SELECT COUNT(*) as count FROM artworks', (err, result) => {
            if (err) {
              console.log('   Error counting artworks:', err.message);
            } else {
              console.log('   Artworks count:', result[0].count);
            }
            configDb.close();
            checkDataDb();
          });
        } else {
          configDb.close();
          checkDataDb();
        }
      }
    });
  }
});

function checkDataDb() {
  console.log('\n2. DATA/PASSIONART.DB:');
  const dataDb = new sqlite3.Database('./data/passionart.db', (err) => {
    if (err) {
      console.log('   Error: Could not open data/passionart.db:', err.message);
      checkWhichDbControllerUses();
    } else {
      console.log('   ✅ Connected to data/passionart.db');
      
      dataDb.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
          console.log('   Error getting tables:', err.message);
        } else {
          console.log('   Tables:', tables.map(t => t.name).join(', ') || 'No tables');
          
          if (tables.find(t => t.name === 'artworks')) {
            dataDb.all('SELECT COUNT(*) as count FROM artworks', (err, result) => {
              if (err) {
                console.log('   Error counting artworks:', err.message);
              } else {
                console.log('   Artworks count:', result[0].count);
                
                // Show structure differences
                dataDb.all('PRAGMA table_info(artworks)', (err, columns) => {
                  if (err) {
                    console.log('   Error getting columns:', err.message);
                  } else {
                    console.log('   Artworks columns:', columns.map(c => c.name).join(', '));
                  }
                  dataDb.close();
                  checkWhichDbControllerUses();
                });
              }
            });
          } else {
            dataDb.close();
            checkWhichDbControllerUses();
          }
        }
      });
    }
  });
}

function checkWhichDbControllerUses() {
  console.log('\n3. CHECKING CONTROLLER DATABASE PATH:');
  const fs = require('fs');
  
  try {
    const controllerContent = fs.readFileSync('./controllers/artworks.controller.js', 'utf8');
    const dbPathMatch = controllerContent.match(/const dbPath = path\.join\(__dirname, '([^']+)'\)/);
    
    if (dbPathMatch) {
      console.log('   Controller uses:', dbPathMatch[1]);
    } else {
      console.log('   Could not find database path in controller');
    }
  } catch (err) {
    console.log('   Error reading controller:', err.message);
  }
  
  console.log('\n=== SUMMARY ===');
  console.log('The controller and sample data script may be using different database files!');
  console.log('This could explain why the featured artworks are not showing up correctly.');
}
