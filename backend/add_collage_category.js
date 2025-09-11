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

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
});

// Function to add Collage category
function addCollageCategory() {
  console.log('=== ADDING COLLAGE CATEGORY ===');
  
  // First, let's check current categories
  db.all("SELECT name, slug, description FROM categories", (err, rows) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return;
    }
    
    console.log('\nCurrent categories:');
    rows.forEach(row => {
      console.log(`- ${row.name} (${row.slug}): ${row.description}`);
    });
    
    // Check if Collage already exists
    const collageExists = rows.some(row => row.name.toLowerCase() === 'collage');
    
    if (collageExists) {
      console.log('\n❌ Collage category already exists!');
      db.close();
      return;
    }
    
    // Add the Collage category
    const insertQuery = `
      INSERT INTO categories (name, slug, description) 
      VALUES (?, ?, ?)
    `;
    
    db.run(insertQuery, ['Collage', 'collage', 'Mixed media artworks using collage techniques'], function(err) {
      if (err) {
        console.error('Error inserting Collage category:', err);
      } else {
        console.log('\n✅ Successfully added Collage category!');
        console.log(`   ID: ${this.lastID}`);
        console.log('   Name: Collage');
        console.log('   Slug: collage');
        console.log('   Description: Mixed media artworks using collage techniques');
      }
      
      // Show updated categories
      console.log('\n=== UPDATED CATEGORIES ===');
      db.all("SELECT name, slug, description FROM categories ORDER BY name", (err, updatedRows) => {
        if (err) {
          console.error('Error fetching updated categories:', err);
        } else {
          updatedRows.forEach(row => {
            console.log(`- ${row.name} (${row.slug}): ${row.description}`);
          });
        }
        
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('\n🎉 Database updated successfully! Collage category is now available.');
          }
        });
      });
    });
  });
}

// Run the function
addCollageCategory();
