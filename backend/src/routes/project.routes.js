const express = require('express');
const router = express.Router();

const { createProject,listProjects,updateProject ,deleteProject} = require('../controllers/project.controller');
const auth = require('../middleware/auth.middleware');
const tenantIsolation = require('../middleware/tenant.middleware');

router.post(
  '/',
  auth,
  tenantIsolation,
  createProject
);
router.get('/',auth,listProjects);
router.put('/:projectId',auth,updateProject)
router.delete('/:projectId',auth,deleteProject)
module.exports = router;
