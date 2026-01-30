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

### POST /auth/register-tenant
**Auth**: Public

**Request Body**
```json
{
  "email": "admin@company.com",
  "password": "SecurePass@123",
  "fullName": "Admin Name",
  "tenantName": "Company Name",
  "tenantSubdomain": "company"
}
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "uuid",
      "email": "admin@company.com",
      "role": "tenant_admin"
    }
  }
}
```

---

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
    "token": "jwt_token",
    "user": {
      "id": "uuid",
      "email": "admin@demo.com",
      "role": "tenant_admin"
    }
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
      "name": "Demo Company",
      "subdomain": "demo"
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

## Tenant Management APIs

### GET /tenants/:tenantId
**Auth**: Required (Tenant Admin)

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Demo Company",
    "subdomain": "demo",
    "subscriptionPlan": "pro",
    "isActive": true,
    "createdAt": "2026-01-30T10:00:00Z"
  }
}
```

---

### PUT /tenants/:tenantId
**Auth**: Required (Tenant Admin)

**Request Body**
```json
{
  "name": "Updated Company Name",
  "subscriptionPlan": "enterprise"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Company Name",
    "subdomain": "demo",
    "subscriptionPlan": "enterprise"
  }
}
```

---

### GET /tenants/:tenantId/users
**Auth**: Required (Tenant Admin)

**Query Parameters**:
- `page`: Pagination page (default: 1)
- `limit`: Results per page (default: 20)

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@demo.com",
      "fullName": "User Name",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-01-30T10:00:00Z"
    }
  ]
}
```

---

## User Management APIs

### POST /tenants/:tenantId/users
**Auth**: Required (Tenant Admin)

**Request Body**
```json
{
  "email": "newuser@demo.com",
  "password": "SecurePass@123",
  "fullName": "New User",
  "role": "user"
}
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@demo.com",
    "fullName": "New User",
    "role": "user",
    "isActive": true
  }
}
```

---

### GET /tenants/:tenantId/users
**Auth**: Required (Tenant Admin)

**Response** (see above - Tenant Users endpoint)

---

### PUT /users/:userId
**Auth**: Required (Tenant Admin or User's own profile)

**Request Body**
```json
{
  "fullName": "Updated Name",
  "isActive": true
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@demo.com",
    "fullName": "Updated Name",
    "role": "user",
    "isActive": true
  }
}
```

---

### DELETE /users/:userId
**Auth**: Required (Tenant Admin)

**Response**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Project Management APIs

### POST /projects
**Auth**: Required

**Request Body**
```json
{
  "name": "Website Redesign",
  "description": "Complete UI overhaul for website",
  "status": "active"
}
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Website Redesign",
    "description": "Complete UI overhaul for website",
    "status": "active",
    "createdBy": "uuid",
    "createdAt": "2026-01-30T10:00:00Z"
  }
}
```

---

### GET /projects
**Auth**: Required

**Query Parameters**:
- `status`: Filter by status (active, archived, completed)
- `page`: Pagination page
- `limit`: Results per page

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Website Redesign",
      "description": "Complete UI overhaul",
      "status": "active",
      "createdBy": "uuid",
      "createdAt": "2026-01-30T10:00:00Z"
    }
  ]
}
```

---

### PUT /projects/:projectId
**Auth**: Required

**Request Body**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "active"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Project Name",
    "description": "Updated description",
    "status": "active"
  }
}
```

---

### DELETE /projects/:projectId
**Auth**: Required

**Response**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## Task Management APIs

### POST /projects/:projectId/tasks
**Auth**: Required

**Request Body**
```json
{
  "title": "Design Homepage",
  "description": "Create mockups and prototypes",
  "status": "todo",
  "assignedTo": "uuid"
}
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "title": "Design Homepage",
    "description": "Create mockups and prototypes",
    "status": "todo",
    "assignedTo": "uuid",
    "createdBy": "uuid",
    "createdAt": "2026-01-30T10:00:00Z"
  }
}
```

---

### GET /projects/:projectId/tasks
**Auth**: Required

**Query Parameters**:
- `status`: Filter by status (todo, in_progress, completed)
- `assignedTo`: Filter by assignee
- `page`: Pagination page
- `limit`: Results per page

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "title": "Design Homepage",
      "description": "Create mockups and prototypes",
      "status": "todo",
      "assignedTo": "uuid",
      "createdAt": "2026-01-30T10:00:00Z"
    }
  ]
}
```

---

### PUT /tasks/:taskId
**Auth**: Required

**Request Body**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "assignedTo": "uuid"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated Title",
    "description": "Updated description",
    "status": "todo",
    "assignedTo": "uuid"
  }
}
```

---

### PATCH /tasks/:taskId/status
**Auth**: Required

**Request Body**
```json
{
  "status": "completed"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Design Homepage",
    "status": "completed",
    "updatedAt": "2026-01-30T11:00:00Z"
  }
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
  "database": "connected",
  "uptime": 3600
}
```

---

## Error Responses

All APIs may return error responses:
```json
{
  "success": false,
  "error": "Error message describing the issue",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Server Error

---

## Best Practices

1. Always include JWT token in Authorization header
2. Validate input on client side before API calls
3. Implement proper error handling for failed requests
4. Use pagination for list endpoints (page, limit parameters)
5. Store JWT tokens securely (HTTP-only cookies recommended)
6. Implement token refresh mechanism for long sessions
7. Log sensitive operations for audit trails

---

**Endpoint Count**: 19 total endpoints  
**Last Updated**: January 30, 2026
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