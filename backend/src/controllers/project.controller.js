const db = require('../db');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // 1️⃣ validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }
    console.log('REQ.USER 👉', req.user);

    // 2️⃣ get values from token
    const tenantId = req.user.tenantId;
    const createdBy = req.user.userId;

    // 3️⃣ insert project
    const result = await db.query(
      `INSERT INTO projects (tenant_id, name, description, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [tenantId, name, description || null, createdBy]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
const listProjects = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const result = await db.query(
      `SELECT 
         p.id,
         p.name,
         p.description,
         p.status,
         p.created_at,
         u.full_name AS created_by
       FROM projects p
       JOIN users u ON u.id = p.created_by
       WHERE p.tenant_id = $1
       ORDER BY p.created_at DESC`,
      [tenantId]
    );

    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
};
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, status } = req.body;
    const { tenantId, userId, role } = req.user;

    // Fetch project
    const projectRes = await db.query(
      `SELECT * FROM projects WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    if (projectRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projectRes.rows[0];

    // Authorization
    if (role !== 'tenant_admin' && project.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const updated = await db.query(
      `UPDATE projects
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, description, status`,
      [name, description, status, projectId]
    );

    return res.json({
      success: true,
      message: 'Project updated',
      data: updated.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
};
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tenantId, userId, role } = req.user;

    const projectRes = await db.query(
      `SELECT * FROM projects WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    if (projectRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projectRes.rows[0];

    if (role !== 'tenant_admin' && project.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await db.query(
      `DELETE FROM projects WHERE id = $1`,
      [projectId]
    );

    return res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
};


module.exports = { createProject,listProjects,updateProject,deleteProject};
