/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const fs = require('fs');
const path = require('path');

// Simple JSON file-based storage for development
class SimpleStorage {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  getFilePath(table) {
    return path.join(this.dataDir, `${table}.json`);
  }

  read(table) {
    try {
      const filePath = this.getFilePath(table);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${table}:`, error);
      return [];
    }
  }

  write(table, data) {
    try {
      const filePath = this.getFilePath(table);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${table}:`, error);
      return false;
    }
  }

  insert(table, record) {
    const data = this.read(table);
    record.id = Date.now() + Math.random(); // Simple ID generation
    record.created_at = new Date().toISOString();
    data.push(record);
    this.write(table, data);
    return record;
  }

  findAll(table) {
    return this.read(table);
  }

  findById(table, id) {
    const data = this.read(table);
    return data.find(record => record.id == id);
  }

  update(table, id, updates) {
    const data = this.read(table);
    const index = data.findIndex(record => record.id == id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() };
      this.write(table, data);
      return data[index];
    }
    return null;
  }

  delete(table, id) {
    const data = this.read(table);
    const filtered = data.filter(record => record.id != id);
    this.write(table, filtered);
    return filtered.length < data.length;
  }
}

module.exports = new SimpleStorage();
