const db = require('../db');
const { randomUUID } = require('crypto');


const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const { tenantId } = req.user;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const projectRes = await db.query(
      `SELECT tenant_id FROM projects WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    if (projectRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized'
      });
    }

    const taskId = randomUUID();

    const result = await db.query(
      `INSERT INTO tasks
       (id, tenant_id, project_id, title, description, priority, assigned_to, due_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'todo')
       RETURNING *`,
      [
        taskId,
        tenantId,
        projectId,
        title,
        description || null,
        priority || 'medium',
        assignedTo || null,
        dueDate || null
      ]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
  console.error("CREATE TASK ERROR 👉", err.message);
  return res.status(500).json({
    success: false,
    message: err.message
  });
}

};

const listTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tenantId } = req.user;

    // Verify project belongs to tenant
    const projectRes = await db.query(
      `SELECT id FROM projects WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    if (projectRes.rowCount === 0) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const result = await db.query(
      `SELECT id, title, description, status, priority, due_date
       FROM tasks
       WHERE project_id = $1
       ORDER BY created_at DESC`,
      [projectId]
    );

    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, assignedTo, dueDate, status } = req.body;
    const { tenantId } = req.user;

    const taskRes = await db.query(
      `SELECT id FROM tasks WHERE id = $1 AND tenant_id = $2`,
      [taskId, tenantId]
    );

    if (taskRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const result = await db.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           priority = COALESCE($3, priority),
           assigned_to = $4,
           due_date = $5,
           status = COALESCE($6, status),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        title,
        description,
        priority,
        assignedTo || null,
        dueDate || null,
        status,
        taskId
      ]
    );

    return res.json({
      success: true,
      message: 'Task updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
};
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const { tenantId } = req.user;

    if (!['todo', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const taskRes = await db.query(
      `UPDATE tasks
       SET status = $1, updated_at = NOW()
       WHERE id = $2 AND tenant_id = $3
       RETURNING id, status, updated_at`,
      [status, taskId, tenantId]
    );

    if (taskRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    return res.json({
      success: true,
      data: taskRes.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task status'
    });
  }
};



module.exports = { createTask,listTasks,updateTask,updateTaskStatus};
