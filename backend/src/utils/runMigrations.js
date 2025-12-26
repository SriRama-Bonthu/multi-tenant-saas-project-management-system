const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function runMigrations() {
  const migrationsPath = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsPath).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsPath, file)).toString();
    await pool.query(sql);
    console.log(`Migration executed: ${file}`);
  }
}

module.exports = runMigrations;
