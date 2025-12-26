const pool = require('../db');

const listUsers = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const result = await pool.query(
      `SELECT id, email, full_name, role, is_active, created_at
       FROM users
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [tenantId]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
const bcrypt = require('bcrypt');
const { logAudit } = require('../utils/audit');

const addUser = async (req, res) => {
  const { email, password, fullName, role = 'user' } = req.body;
  const tenantId = req.tenantId;

  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      message: 'email, password, and fullName are required'
    });
  }

  try {
    // 1. Check subscription limit
    const tenantRes = await pool.query(
      `SELECT max_users FROM tenants WHERE id = $1`,
      [tenantId]
    );

    const maxUsers = tenantRes.rows[0].max_users;

    const countRes = await pool.query(
      `SELECT COUNT(*) FROM users WHERE tenant_id = $1`,
      [tenantId]
    );

    if (Number(countRes.rows[0].count) >= maxUsers) {
      return res.status(403).json({
        success: false,
        message: 'User limit reached for your subscription'
      });
    }

    // 2. Hash password
    const hash = await bcrypt.hash(password, 10);

    // 3. Insert user
    const insertRes = await pool.query(
      `INSERT INTO users
       (id, tenant_id, email, password_hash, full_name, role, is_active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW())
       RETURNING id, email, full_name, role, is_active, created_at`,
      [tenantId, email, hash, fullName, role]
    );

    const newUser = insertRes.rows[0];

    // 4. Audit log
    await logAudit({
      tenantId,
      userId: req.user.userId,
      action: 'CREATE_USER',
      entityType: 'user',
      entityId: newUser.id,
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists in this tenant'
      });
    }
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { fullName, role, isActive } = req.body;
  const tenantId = req.tenantId;

  try {
    // Fetch user
    const userRes = await pool.query(
      `SELECT id, role FROM users WHERE id = $1 AND tenant_id = $2`,
      [userId, tenantId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const targetUser = userRes.rows[0];

    // Self-update rule
    const isSelf = req.user.userId === userId;

    if (!isSelf && req.user.role !== 'tenant_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (role || isActive !== undefined) {
      if (req.user.role !== 'tenant_admin') {
        return res.status(403).json({
          success: false,
          message: 'Only tenant admin can update role or status'
        });
      }
    }

    const result = await pool.query(
      `UPDATE users
       SET
         full_name = COALESCE($1, full_name),
         role = COALESCE($2, role),
         is_active = COALESCE($3, is_active),
         updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, full_name, role, is_active, updated_at`,
      [fullName, role, isActive, userId]
    );

    await logAudit({
      tenantId,
      userId: req.user.userId,
      action: 'UPDATE_USER',
      entityType: 'user',
      entityId: userId,
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const tenantId = req.tenantId;
  const currentUserId = req.user.userId;

  // Prevent tenant admin from deleting themselves
  if (userId === currentUserId) {
    return res.status(403).json({
      success: false,
      message: 'Cannot delete yourself'
    });
  }

  try {
    // Delete user only if belongs to same tenant
    const result = await pool.query(
      `DELETE FROM users 
       WHERE id = $1 AND tenant_id = $2
       RETURNING id`,
      [userId, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Audit log
    await logAudit({
      tenantId,
      userId: currentUserId,
      action: 'DELETE_USER',
      entityType: 'user',
      entityId: userId,
      ipAddress: req.ip
    });

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


module.exports = { listUsers, addUser ,updateUser,deleteUser};


