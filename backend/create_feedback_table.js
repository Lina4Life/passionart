const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database path
const dbPath = path.join(__dirname, 'data', 'passionart.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
});

// Create feedback table
const createFeedbackTable = `
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    issue TEXT NOT NULL,
    feedback TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  )
`;

db.serialize(() => {
  // Create feedback table
  db.run(createFeedbackTable, (err) => {
    if (err) {
      console.error('âŒ Error creating feedback table:', err);
    } else {
      console.log('âœ… Feedback table created successfully');
    }
  });
  
  // Create indexes for faster queries
  db.run('CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status)', (err) => {
    if (err) {
      console.error('âŒ Error creating status index:', err);
    } else {
      console.log('âœ… Feedback status index created successfully');
    }
  });
  
  db.run('CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at)', (err) => {
    if (err) {
      console.error('âŒ Error creating created_at index:', err);
    } else {
      console.log('âœ… Feedback created_at index created successfully');
    }
  });
  
  db.run('CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id)', (err) => {
    if (err) {
      console.error('âŒ Error creating user_id index:', err);
    } else {
      console.log('âœ… Feedback user_id index created successfully');
    }
    
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  });
});

