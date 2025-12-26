const express = require('express');
const router = express.Router();

const { updateUser, deleteUser } = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const tenantIsolation = require('../middleware/tenant.middleware');
const allowRoles = require('../middleware/role.middleware');

router.put(
  '/:userId',
  auth,
  tenantIsolation,
  updateUser
);

router.delete(
  '/:userId',
  auth,
  tenantIsolation,
  allowRoles('tenant_admin'),
  deleteUser
);

module.exports = router;
