# Task Manager – Collaborative Project Management Platform

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)
## Overview

Task Manager is a full-featured **collaborative task management web application** that enables teams to efficiently manage projects within shared workspaces.  
The platform supports **user authentication**, **role-based task assignment**, **deadlines**, **priority management**, and **multiple task visualization modes** including Table and Kanban views.

It is designed with scalability, productivity, and clean user experience in mind.

---

## Key Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication with secure cookie storage
- Protected routes and role-based access control

### Workspace Management
- Create, update, and delete workspaces
- Invite members via shareable join links
- Collaborate with multiple users inside a workspace

### Project & Task Management
- Create multiple projects per workspace
- Add, edit, and delete tasks
- Assign tasks to specific users
- Set task deadlines and priority levels

### Task Visualization
- Table view with pagination and filtering
- Kanban board view categorized by task status (Todo, In Progress, Done)

### Filtering & Sorting
- Filter tasks by status, priority, or assignee
- Paginated task lists for improved performance and usability

---

## Technology Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Frontend     | React.js, Tailwind CSS      |
| Backend      | Node.js, Express.js         |
| Database     | MongoDB                     |
| Authentication | JWT, Cookies              |
| Deployment   | Vercel / Render / MongoDB Atlas |

---

## User Interface Preview

## Demo Video
https://drive.google.com/file/d/1qaDR-ATMvSiCOA5IoSYKTgQWrIazBYZQ/view?usp=sharing

### Authentication Pages

<p align="center">
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20122727.png?raw=true" width="45%" />
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20122746.png?raw=true" width="45%" />
</p>

---

### Dashboard & Workspace Views

<p align="center">
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20122805.png?raw=true" width="45%" />
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20123035.png?raw=true" width="45%" />
</p>

---

### Task Management – Table View

<p align="center">
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20122830.png?raw=true" width="45%" />
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20122843.png?raw=true" width="45%" />
</p>

<p align="center">
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20122911.png?raw=true" width="45%" />
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20122957.png?raw=true" width="45%" />
</p>

---

### Kanban Board View

<p align="center">
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20122939.png?raw=true" width="70%" />
</p>

---

### Project & Task Creation

<p align="center">
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20123013.png?raw=true" width="45%" />
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20123023.png?raw=true" width="45%" />
</p>

---

### Workspace & Task Editing

<p align="center">
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20123047.png?raw=true" width="45%" />
  <img src="https://github.com/guru963/task-manager/blob/main/img/Screenshot%202025-06-28%20123104.png?raw=true" width="45%" />
</p>

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/guru963/task-manager.git
cd task-manager
```

### Frontend Setup
```bash
cd task
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npx nodemon
```

## Environment Variables

The backend requires the following environment variables.
Create a `.env` file in the backend directory using the template below:

```bash
MONGODB_URL=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

---
## Future Improvements

- Notifications and activity logs  
- Task dependencies and subtasks  
- Improved mobile responsiveness  
- Real-time collaboration features  

---

## License

This project is licensed under the MIT License.

---

## Author

**Guru Divya Darshini U**  
Full Stack Web Developer  
React | Node.js | MongoDB | System Design

