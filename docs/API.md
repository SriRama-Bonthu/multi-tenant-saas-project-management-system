## API Documentation – Multi-Tenant SaaS Platform

### Base URL
```
http://localhost:5000/api
```

All secured APIs require JWT authentication using the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication APIs

### POST /auth/login
**Auth**: Public

**Request Body**
```json
{
  "email": "admin@demo.com",
  "password": "Demo@123",
  "tenantSubdomain": "demo"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token"
  }
}
```

---

### GET /auth/me
**Auth**: Required

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Demo Admin",
    "email": "admin@demo.com",
    "role": "tenant_admin",
    "tenant": {
      "id": "uuid",
      "name": "Demo Company"
    }
  }
}
```

---

### POST /auth/logout
**Auth**: Required

**Response**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Tenant APIs

### GET /tenants/:tenantId
**Auth**: Required

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Demo Company",
    "subdomain": "demo",
    "subscriptionPlan": "pro"
  }
}
```

---

### GET /tenants/:tenantId/users
**Auth**: Tenant Admin

**Response**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@demo.com",
        "role": "user",
        "isActive": true
      }
    ]
  }
}
```

---

## User APIs

### POST /tenants/:tenantId/users
**Auth**: Tenant Admin

**Request Body**
```json
{
  "email": "user@demo.com",
  "password": "User@123",
  "fullName": "Demo User",
  "role": "user"
}
```

---

### PUT /users/:userId
**Auth**: Tenant Admin

**Request Body**
```json
{
  "fullName": "Updated Name",
  "isActive": true
}
```

---

### DELETE /users/:userId
**Auth**: Tenant Admin

---

## Project APIs

### POST /projects
**Auth**: Required

**Request Body**
```json
{
  "name": "Website Redesign",
  "description": "UI update project"
}
```

---

### GET /projects
**Auth**: Required

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Website Redesign",
      "status": "active"
    }
  ]
}
```

---

### DELETE /projects/:projectId
**Auth**: Tenant Admin

---

## Task APIs

### POST /projects/:projectId/tasks
**Auth**: Required

**Request Body**
```json
{
  "title": "Design Landing Page",
  "priority": "medium"
}
```

---

### GET /projects/:projectId/tasks
**Auth**: Required

---

### PATCH /tasks/:taskId/status
**Auth**: Required

**Request Body**
```json
{
  "status": "completed"
}
```

---

## Health Check

### GET /health
**Auth**: Public

**Response**
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## Error Responses

All APIs may return error responses in the following format:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Best Practices

1. Always include tenant context in authenticated requests
2. Validate all input data before processing
3. Use proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
4. Implement proper error handling on the client side
5. Store JWT tokens securely (httpOnly cookies or secure storage)
6. Implement token refresh mechanisms for long-lived sessions
7. Log all tenant-admin actions for audit trails
8. Use pagination for list endpoints (to be implemented)
9. Implement request/response compression for large payloads
10. Version your API endpoints for backward compatibility

---

## Implementation Checklist

- [ ] Tenant isolation middleware
- [ ] JWT token generation and validation
- [ ] Password hashing and validation
- [ ] Role-based access control
- [ ] Rate limiting per tenant
- [ ] Audit logging
- [ ] Input validation
- [ ] Error handling
- [ ] Database migrations
- [ ] API documentation
- [ ] Unit and integration tests
- [ ] Security headers
- [ ] CORS configuration
- [ ] Environment configuration
- [ ] Health check endpoints