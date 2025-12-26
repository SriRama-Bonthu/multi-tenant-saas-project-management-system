const tenantIsolation = (req, res, next) => {
  // Super admin can access all tenants
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Tenant users MUST have tenantId
  if (!req.user.tenantId) {
    return res.status(403).json({
      success: false,
      message: 'Tenant access denied'
    });
  }

  // Attach tenantId for use in controllers
  req.tenantId = req.user.tenantId;
  next();
};

module.exports = tenantIsolation;
