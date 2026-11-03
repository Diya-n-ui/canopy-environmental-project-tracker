# Canopy — Environmental Impact & Project Management Platform

A full-stack environmental project tracking dashboard built with React, Tailwind CSS, Node.js, Express, MongoDB, JWT authentication, and Recharts.

**Footer credit:** Developed by Diya N

## Features

- JWT-based authentication and bcrypt password hashing
- Admin and Viewer roles
- Environmental project CRUD (create, read, update, delete)
- Project fields: name, type, location, status, trees planted, target trees, start date, end date, description
- Dashboard totals and charts calculated from API/database data
- Search and status filtering
- Responsive layout with Canopy's forest-green palette
- API validation and centralized error handling
- Optional seed script for demo admin and sample projects

## Tech stack

- Frontend: React + Vite + Tailwind CSS + Recharts + React Router
- Backend: Node.js + Express + Mongoose
- Database: MongoDB (local or Atlas)
- Authentication: JWT + bcryptjs

## Requirements

- Node.js 18+ (20+ recommended)
- npm
- MongoDB local installation or MongoDB Atlas connection string

## Run locally

### 1. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.

### 2. Install and start backend

```bash
npm install
npm run seed
npm run dev
```

API runs at `http://localhost:5000`.

Demo seed login:

- Email: `admin@canopy.local`
- Password: `CanopyDemo123!`

The seed command is optional. It creates the demo admin and sample projects only if the demo admin does not already exist.

### 3. Configure and start frontend

Open a second terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## API overview

| Method | Endpoint                 | Access        | Purpose                                |
| ------ | ------------------------ | ------------- | -------------------------------------- |
| POST   | `/api/auth/login`        | Public        | Login and receive JWT                  |
| GET    | `/api/auth/me`           | Authenticated | Current user                           |
| GET    | `/api/projects`          | Authenticated | List/search/filter projects            |
| GET    | `/api/projects/:id`      | Authenticated | Project detail                         |
| POST   | `/api/projects`          | Admin         | Create project                         |
| PUT    | `/api/projects/:id`      | Admin         | Update project                         |
| DELETE | `/api/projects/:id`      | Admin         | Delete project                         |
| GET    | `/api/dashboard/summary` | Authenticated | Database-derived KPIs and chart series |
| GET    | `/api/health`            | Public        | Health check                           |

## Role behavior

- Admin can create, edit, and delete projects.
- Viewer can see the dashboard and project list but cannot mutate records.
- The seeded demo account is an Admin.

## Project structure

```text
Canopy/
├── client/       # React UI
└── server/       # Express API + MongoDB models
```

## Notes for submission

- Change the seeded demo password and JWT secret before any public deployment.
- The app is designed for local development. Hosting and live deployment are separate steps.
- Before submitting, test login, project create/update/delete, invalid inputs, and viewer restrictions.
- Be prepared to explain the code and disclose AI assistance according to the assignment instructions.
