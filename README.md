# HireNova 🚀

HireNova is a Job Tracker Platform built using the MERN stack.  
It allows job seekers to find and apply for jobs, while recruiters can create and manage job postings.

This project is being built step-by-step following production-level backend architecture.

---

## Tech Stack

Frontend (Coming Soon)

- React

Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

Tools

- Postman
- Git & GitHub

---

## Backend Architecture

The backend follows a layered architecture:

Route → Controller → Service → Model → MongoDB

This separation keeps the code scalable and maintainable.

Project structure:

src
controllers  
services  
models  
routes  
middleware  
utils  
config

---

## Features Implemented

### Authentication Module

- User Registration
- User Login
- Password hashing
- JWT Authentication
- Role-based authorization

Roles supported:

- user (Job seeker)
- recruiter
- admin

---

### Job Module

Recruiters can:

- Create jobs
- Delete jobs

Users can:

- View all jobs
- View job details

---

### Application Module

Users can:

- Apply for jobs
- View their job applications

Recruiters can:

- View applicants for a job

---

## Database Design

User
↓
Job
↓
Application

User → creates → Job  
User → applies → Job through Application

---

## API Endpoints

### Auth APIs

POST /api/auth/register  
POST /api/auth/login

---

### Job APIs

GET /api/jobs  
GET /api/jobs/:id  
POST /api/jobs  
DELETE /api/jobs/:id

---

### Application APIs

POST /api/applications/apply/:jobId  
GET /api/applications/my-applications  
GET /api/applications/job/:jobId

---

## Project Status

Current Phase:
Backend Development

Completed Modules:
Auth Module  
Job Module  
Application Module

---

## Upcoming Features

- Job search
- Job filtering
- Pagination
- Dashboard statistics
- React frontend
- Deployment

---

## Author

Anup Yadav  
Full Stack Developer (MERN)

LinkedIn: (your linkedin link)
GitHub: (your github link)
