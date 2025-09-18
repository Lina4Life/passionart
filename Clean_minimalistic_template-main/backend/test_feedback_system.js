/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
console.log('🧪 Testing Feedback System...');

// Test 1: Check if feedback table exists
const db = require('./config/database');

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='feedback'", (err, row) => {
  if (err) {
    console.error('❌ Error checking feedback table:', err);
    return;
  }
  
  if (row) {
    console.log('✅ Feedback table exists');
    
    // Test 2: Check table structure
    db.all("PRAGMA table_info(feedback)", (err, columns) => {
      if (err) {
        console.error('❌ Error getting table info:', err);
        return;
      }
      
      console.log('📋 Feedback table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.name}: ${col.type}`);
      });
      
      // Test 3: Insert sample feedback
      const insertSql = `
        INSERT INTO feedback (user_id, user_email, user_name, issue, feedback, status, created_at)
        VALUES (1, 'test@example.com', 'Test User', 'Website Issue', 'The website is working great but I noticed a small issue with the navigation.', 'pending', datetime('now'))
      `;
      
      db.run(insertSql, function(err) {
        if (err) {
          console.error('❌ Error inserting sample feedback:', err);
        } else {
          console.log('✅ Sample feedback inserted with ID:', this.lastID);
          
          // Test 4: Fetch feedback
          db.all("SELECT * FROM feedback", (err, feedback) => {
            if (err) {
              console.error('❌ Error fetching feedback:', err);
            } else {
              console.log('📝 Current feedback in database:');
              feedback.forEach(item => {
                console.log(`  ID: ${item.id}, Issue: ${item.issue}, Status: ${item.status}`);
              });
            }
            
            // Close database
            db.close();
            console.log('🎉 Feedback system test completed!');
          });
        }
      });
    });
  } else {
    console.log('❌ Feedback table does not exist');
    db.close();
  }
});
