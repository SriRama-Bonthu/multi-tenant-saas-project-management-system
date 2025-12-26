const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function runSeeds() {
  const seedPath = path.join(__dirname, '../../seeds/seed.sql');
  const sql = fs.readFileSync(seedPath).toString();
  await pool.query(sql);
  console.log('Seed data inserted');
}

module.exports = runSeeds;
