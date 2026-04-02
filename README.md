# 🚀 HireNova – Job Portal & Job Tracker Platform

HireNova is a full-stack Job Portal platform built using the MERN stack.
It enables **job seekers to discover and apply for jobs**, while **recruiters can create and manage job postings** efficiently.

This project is designed using **production-level backend architecture** with scalability and maintainability in mind.

---

## 🧠 Key Highlights

* Role-Based Access Control (RBAC) with 3 roles: **User, Recruiter, Admin**
* Scalable layered backend architecture
* Secure authentication using **JWT + Password Hashing**
* Clean and modular code structure

---

## 🛠️ Tech Stack

### Frontend (In Progress)

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

### Tools

* Postman
* Git & GitHub

---

## 🏗️ Backend Architecture

The backend follows a **layered architecture pattern**:

Route → Controller → Service → Model → Database

This ensures:

* Clean separation of concerns
* Easy scalability
* Maintainable codebase

---

## 📁 Project Structure

```
src/
 ├── controllers
 ├── services
 ├── models
 ├── routes
 ├── middleware
 ├── utils
 └── config
```

---

## 🔐 Features Implemented

### Authentication Module

* User Registration & Login
* Password Hashing
* JWT Authentication
* Role-Based Authorization (RBAC)

### Roles Supported

* User (Job Seeker)
* Recruiter
* Admin

---

### 💼 Job Module

**Recruiters can:**

* Create jobs
* Delete jobs

**Users can:**

* View all jobs
* View job details

---

### 📄 Application Module

**Users can:**

* Apply for jobs
* View their applications

**Recruiters can:**

* View applicants for a job

---

## 🗄️ Database Design

```
User → creates → Job  
User → applies → Job via Application
```

---

## 🔗 API Endpoints

### Auth APIs

* POST /api/auth/register
* POST /api/auth/login

### Job APIs

* GET /api/jobs
* GET /api/jobs/:id
* POST /api/jobs
* DELETE /api/jobs/:id

### Application APIs

* POST /api/applications/apply/:jobId
* GET /api/applications/my-applications
* GET /api/applications/job/:jobId

---

## 🚧 Project Status

* Backend: ✅ Completed
* Frontend: 🚧 In Progress
* Deployment: 🔜 Coming Soon

---

## 🔮 Upcoming Features

* Job search
* Filtering & Pagination
* Admin Dashboard
* Recruiter Dashboard
* Full frontend integration
* Deployment

---

## 👨‍💻 Author

**Anup Yadav**
Full Stack Developer (MERN)

🔗 LinkedIn: https://www.linkedin.com/in/anup2002/
🔗 GitHub: https://github.com/anupyadav-dev
