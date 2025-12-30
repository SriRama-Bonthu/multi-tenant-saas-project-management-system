# Multi-Tenant SaaS Project Management System

## 📌 Project Overview

This project is a **production-ready Multi-Tenant SaaS application** that allows multiple organizations (tenants) to manage users, projects, and tasks securely with complete data isolation.

Each tenant is identified using a **unique subdomain**, and users authenticate using **JWT-based authentication** with role-based access control.

The application is fully containerized using **Docker** and is designed following real-world SaaS architecture principles.

---
## Project URL(Frontend):[http://localhost:3000](https://multi-tenant-saas-project-management-system-m1u9tqbzs.vercel.app/)

## 🎯 Key Features

- Multi-tenant architecture with strict tenant isolation
- Subdomain-based tenant identification
- JWT authentication and authorization
- Role-based access control (super_admin, tenant_admin, user)
- User management (create, update, deactivate)
- Project creation and management
- Task management with status tracking (todo, in_progress, completed)
- Secure password hashing using bcrypt
- RESTful API design
- Dockerized backend, frontend, and database
- Health check endpoint for monitoring

---

## 🛠️ Technology Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt

### Database
- PostgreSQL 15

### DevOps
- Docker
- Docker Compose

---

## 🧱 System Architecture

The application follows a **3-tier architecture**:

1. **Frontend**
   - React SPA
   - Runs on port `3000`
2. **Backend**
   - Node.js + Express REST API
   - Runs on port `5000`
3. **Database**
   - PostgreSQL
   - Runs on port `5432`

All services communicate through a Docker network using service names.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- Git

---

### Run with Docker (Recommended)

```bash
docker compose up -d --build
