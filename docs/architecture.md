# System Architecture – Multi-Tenant SaaS Application

## 1. Overview

This project follows a **multi-tenant SaaS architecture** designed to support multiple organizations (tenants) within a single application while ensuring **strict data isolation, security, and scalability**.

The system is built using a **3-tier architecture** consisting of a Frontend, Backend API, and Database, all containerized using Docker.

---

## 2. High-Level Architecture
┌──────────────┐        HTTP/HTTPS        ┌──────────────┐
│   Frontend   │ ─────────────────────▶ │   Backend    │
│  (React.js)  │                         │ (Node.js API)│
└──────────────┘                         └──────┬───────┘
│
│ SQL Queries
▼
┌──────────────────┐
│   PostgreSQL DB   │
│ (Multi-Tenant)   │
└──────────────────┘
---

## 3. Frontend Architecture

### Technology
- React.js
- React Router
- Axios
- Tailwind CSS

### Responsibilities
- User authentication (login)
- Role-based UI rendering
- Project and task management UI
- Communicates with backend via REST APIs
- Stores JWT token securely in browser storage

### Key Characteristics
- Single Page Application (SPA)
- Responsive design
- API-driven UI
- No direct database access

---

## 4. Backend Architecture

### Technology
- Node.js
- Express.js
- JWT Authentication
- PostgreSQL client (`pg`)
- bcrypt for password hashing

### Responsibilities
- Authentication and authorization
- Tenant identification via subdomain
- Role-based access control
- Business logic for users, projects, and tasks
- Database migrations and seed execution
- Health check endpoint

### Key Layers
- Routes layer (API endpoints)
- Controllers (business logic)
- Middleware (auth, tenant isolation)
- Database access layer

---

## 5. Database Architecture

### Technology
- PostgreSQL 15

### Design Approach
- **Single shared database**
- Tenant isolation enforced using `tenant_id`
- All tenant-specific tables reference `tenant_id`

### Core Tables
- tenants
- users
- projects
- tasks
- audit_logs

### Tenant Isolation Strategy
- Every query filters by `tenant_id`
- Auth middleware injects tenant context
- Prevents cross-tenant data access

---

## 6. Authentication & Authorization Flow

1. User logs in using email, password, and tenant subdomain
2. Backend validates credentials and tenant status
3. JWT token is generated with:
   - userId
   - tenantId
   - role
4. Token is sent to frontend
5. Frontend attaches token to all API requests
6. Backend middleware validates token and enforces access rules

---

## 7. Role-Based Access Control (RBAC)

### Supported Roles
- **super_admin**
- **tenant_admin**
- **user**

### Access Rules
- super_admin: system-wide access
- tenant_admin: manage users, projects, and tasks within tenant
- user: access assigned projects and tasks only

RBAC is enforced at:
- API level (middleware & controllers)
- UI level (conditional rendering)

---

## 8. Docker & Deployment Architecture

### Containerized Services
- Frontend container (React)
- Backend container (Node.js API)
- Database container (PostgreSQL)

### Docker Compose
- Orchestrates all services
- Defines networking between containers
- Ensures correct startup order
- Supports health checks

### Ports
- Frontend: `3000`
- Backend: `5000`
- Database: `5432`

---

## 9. Health Check Strategy

The backend exposes a health endpoint:
GET /api/health
### Health Check Verifies:
- Backend server availability
- Database connectivity
- Application readiness

Used by:
- Docker health checks
- Deployment verification
- Monitoring tools

---

## 10. Scalability & Future Enhancements

The architecture supports:
- Horizontal scaling of backend services
- Adding caching layers (Redis)
- Microservices migration
- CI/CD integration
- Cloud deployment (AWS, Azure, GCP)

---

## 11. Summary

This architecture ensures:
- Secure multi-tenant isolation
- Clean separation of concerns
- Production readiness
- Maintainability and scalability

The system is suitable for real-world SaaS platforms and enterprise-grade applications.