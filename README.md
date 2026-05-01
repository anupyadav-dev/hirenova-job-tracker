# 🚀 HireNova – Scalable Job Portal & Job Tracking Platform

HireNova is a **full-stack MERN Job Portal** that connects job seekers and recruiters through a secure, scalable, and production-ready platform.

It is designed with **real-world backend architecture, role-based access control, and performance-focused features**, making it more than just a basic CRUD application.

---

## 🌟 Key Highlights

- 🔐 Secure Authentication using JWT & Password Hashing
- 🧠 Role-Based Access Control (User, Recruiter, Admin)
- 🏗️ Production-level layered backend architecture
- ⚡ Optimized APIs with filtering, search & pagination
- 💼 Complete job & application management system
- 📊 Admin & Recruiter dashboards
- 🔄 Full frontend-backend integration (MERN)

---

## 🛠️ Tech Stack

### 💻 Frontend

- React.js
- Tailwind CSS

### ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

### 🧰 Tools

- Git & GitHub
- Postman

---

## 🏗️ Architecture (Scalable Design)

The backend follows a **layered architecture pattern**:

Route → Controller → Service → Model → Database

### ✅ Benefits:

- Clean and maintainable codebase
- Easy scalability
- Better debugging and testing

---

## 🔐 Authentication & Authorization

- User Registration & Login
- Secure password hashing
- JWT-based authentication
- Role-Based Access Control (RBAC)

### 👥 Roles:

- User (Job Seeker)
- Recruiter
- Admin

---

## 💼 Features

### 👤 User (Job Seeker)

- Browse all jobs
- Advanced job search
- Apply for jobs
- Track applications

---

### 🧑‍💼 Recruiter

- Create and manage job postings
- View applicants
- Manage job listings

---

### 🛡️ Admin

- Manage users
- Manage job listings
- Platform-level control

---

## 🔍 Advanced Features

- 🔎 Job Search (keyword-based)
- 🎯 Filtering (role, location, etc.)
- 📄 Pagination for performance optimization
- 🔐 Secure API handling & validation

---

## 📁 Project Structure

```
src/
 ├── controllers     # Handles request/response
 ├── services        # Business logic layer
 ├── models          # Database schemas
 ├── routes          # API routes
 ├── middleware      # Auth & validation
 ├── utils           # Helper functions
 └── config          # Database & environment setup
```

---

## 🔗 API Endpoints

### 🔐 Auth APIs

POST /api/auth/register
POST /api/auth/login

---

### 💼 Job APIs

GET /api/jobs
GET /api/jobs/:id
POST /api/jobs
DELETE /api/jobs/:id

---

### 📄 Application APIs

POST /api/applications/apply/:jobId
GET /api/applications/my-applications
GET /api/applications/job/:jobId

---

## 🗄️ Database Design

User → creates → Job
User → applies → Job via Application

---

## 🚀 Project Status

| Module     | Status         |
| ---------- | -------------- |
| Backend    | ✅ Completed   |
| Frontend   | ✅ Completed   |
| UI/UX      | 🎨 Polishing   |
| Deployment | 🔜 Coming Soon |

---

## 🌐 Future Improvements

- UI/UX Enhancements
- Performance Optimization (Caching, etc.)
- Deployment on Cloud (AWS / Render)

---

## 📸 Screenshots

> (Add UI screenshots here after polishing to boost impact)

---

## 👨‍💻 Author

**Anup Yadav**
Full Stack Developer (MERN)

🔗 LinkedIn: https://www.linkedin.com/in/anup2002/
🔗 GitHub: https://github.com/anupyadav-dev

---
