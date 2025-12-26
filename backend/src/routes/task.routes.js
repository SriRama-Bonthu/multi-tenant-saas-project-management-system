const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createTask,listTasks,updateTask,updateTaskStatus } = require('../controllers/task.controller');
const { updateProject } = require('../controllers/project.controller');

router.post('/projects/:projectId/tasks', authMiddleware, createTask);
router.get('/projects/:projectId/tasks',authMiddleware,listTasks);
router.put('/tasks/:taskId',authMiddleware,updateTask)
router.patch('/tasks/:taskId/status',authMiddleware,updateTaskStatus)
module.exports = router;
