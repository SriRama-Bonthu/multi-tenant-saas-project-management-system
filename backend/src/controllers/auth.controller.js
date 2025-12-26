const bcrypt = require('bcrypt');
const pool = require('../db');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;

  if (!email || !password || !tenantSubdomain) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and tenantSubdomain are required'
    });
  }

  try {
    // 1. Find tenant
    const tenantResult = await pool.query(
      'SELECT * FROM tenants WHERE subdomain = $1',
      [tenantSubdomain]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    const tenant = tenantResult.rows[0];

    if (tenant.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Tenant is not active'
      });
    }

    // 2. Find user inside tenant
    const userResult = await pool.query(
      `SELECT id, email, password_hash, full_name, role, is_active
       FROM users
       WHERE email = $1 AND tenant_id = $2`,
      [email, tenant.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account inactive'
      });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 4. Generate token
    const token = generateToken({
      userId: user.id,
      tenantId: tenant.id,
      role: user.role
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId: tenant.id
        },
        token,
        expiresIn: 86400
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getMe = async (req, res) => {
  try {
    const { userId, tenantId, role } = req.user;

    // Fetch user
    const userResult = await pool.query(
      `SELECT id, email, full_name, role, is_active
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let tenant = null;

    // Super admin has no tenant
    if (role !== 'super_admin') {
      const tenantResult = await pool.query(
        `SELECT id, name, subdomain, subscription_plan, max_users, max_projects
         FROM tenants
         WHERE id = $1`,
        [tenantId]
      );

      tenant = tenantResult.rows[0];
    }

    return res.status(200).json({
      success: true,
      data: {
        id: userResult.rows[0].id,
        email: userResult.rows[0].email,
        fullName: userResult.rows[0].full_name,
        role: userResult.rows[0].role,
        isActive: userResult.rows[0].is_active,
        tenant
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  login,
  getMe
};
