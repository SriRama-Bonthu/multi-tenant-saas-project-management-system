require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/db');
const { v4: uuidv4 } = require('uuid');

(async () => {
  // 1. Get tenant ID
  const tenantRes = await pool.query(
    "SELECT id FROM tenants WHERE subdomain = 'demo'"
  );

  if (tenantRes.rows.length === 0) {
    console.log('Tenant demo not found');
    process.exit(1);
  }

  const tenantId = tenantRes.rows[0].id;

  // 2. Hash password
  const hash = await bcrypt.hash('Demo@123', 10);

  // 3. Insert user
  await pool.query(
    `
    INSERT INTO users (
      id,
      tenant_id,
      email,
      password_hash,
      full_name,
      role,
      is_active,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
    ON CONFLICT (tenant_id, email) DO NOTHING
    `,
    [
      uuidv4(),
      tenantId,
      'admin@demo.com',
      hash,
      'Demo Admin',
      'tenant_admin'
    ]
  );

  console.log('Demo admin user created');
  process.exit(0);
})();
