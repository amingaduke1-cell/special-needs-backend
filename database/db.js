const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/sne.db');

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY,
      email TEXT,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      supportType TEXT,
      message TEXT,
      createdAt TEXT
    )
  `);

  // Default admin
  db.run(`
    INSERT OR IGNORE INTO admin (id,email,password)
    VALUES (1,'admin@email.com','123456')
  `);

});

module.exports = db;