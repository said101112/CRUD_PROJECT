# Mini Project Management System

A full-stack application for managing projects with CRUD operations, status tracking, and automated tests.

## Tech Stack
- **Frontend**: Vue.js 3, Vite, Vitest, Cypress
- **Backend**: Express.js, PostgreSQL, Jest
- **Database**: PostgreSQL
- **Security**: Parameterized queries, input validation, helmet, cors

## Project Structure
- `backend/`: Express API and Jest tests
- `frontend/`: Vue application, Vitest and Cypress tests

## Setup
1. Clone the repository
2. Run database: `docker-compose up -d`
3. Install dependencies in both `backend` and `frontend` folders: `npm install`
4. Run backend: `cd backend && npm run dev`
5. Run frontend: `cd frontend && npm run dev`
