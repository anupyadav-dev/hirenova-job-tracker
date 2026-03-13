# hirenova-job-tracker

HireNova is a full-stack job tracker platform where users can track job applications, recruiters can post jobs, and admins can manage the system.

Tech Stack:

- React
- Node.js
- Express
- MongoDB

## System Architecture

HireNova follows a REST-based architecture.

Entities:

- Users
- Companies
- Jobs
- Applications
- Saved Jobs

Roles:

- User
- Recruiter
- Admin

## Backend Folder Structure

src
├── config
├── controllers
├── middleware
├── models
├── routes
├── services
├── utils
└── app.js

server.js
.env
package.json

## Backend Setup

Backend built using Node.js and Express.

Features:

- Express server
- MongoDB connection using Mongoose
- Environment variables
- Logging middleware
