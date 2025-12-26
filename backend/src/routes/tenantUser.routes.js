const express = require('express');
const router = express.Router();

const { listUsers, addUser } = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const tenantIsolation = require('../middleware/tenant.middleware');
const allowRoles = require('../middleware/role.middleware');

router.get(
  '/:tenantId/users',
  auth,
  tenantIsolation,
  listUsers
);

router.post(
  '/:tenantId/users',
  auth,
  tenantIsolation,
  allowRoles('tenant_admin'),
  addUser
);

module.exports = router;
