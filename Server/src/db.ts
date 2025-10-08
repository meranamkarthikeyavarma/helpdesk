import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';

// Recreate __dirname manually for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
export const db : any = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL CHECK(priority IN ('LOW','MEDIUM','HIGH')),
      status TEXT NOT NULL CHECK(status IN ('OPEN','IN_PROGRESS','CLOSED')),
      reporter TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      ticketId TEXT NOT NULL,
      FOREIGN KEY(ticketId) REFERENCES tickets(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ Database initialized');
}

// Helper to generate IDs
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}