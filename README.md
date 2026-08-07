# Cop Companion

Cop Companion is a comprehensive Crime Record Management System designed to facilitate the efficient tracking, recording, and management of crime-related data. The platform enables police officers and victims to interact with a centralized database of cases, FIRs (First Information Reports), evidence, and arrest records. The system provides role-based access, allowing tailored views and actions for different user types.

## Technological Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Tanstack React Query, React Router, Axios (with JWT interceptors)
- **Backend**: Node.js, Express, Sequelize (MySQL), Zod for validation
- **Database**: MySQL (compatible with TiDB Cloud or Railway)
- **Security & Authentication**: JWT (`jsonwebtoken`), password hashing (`bcryptjs`), CORS

## Prerequisites

- Node.js (v18+)
- MySQL Server (or a hosted MySQL-compatible provider such as TiDB Cloud or Railway)
- npm

## Setup Instructions

### 1. Database Setup
Create a new MySQL database for the application:
```sql
CREATE DATABASE cop_companion;
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your MySQL credentials, JWT secret, and API port. For hosted deployments, you can use `DATABASE_URL` or individual `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` variables.
5. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd src
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Architecture

The application follows a standard **Client-Server Architecture**. The backend is built as a **Modular Monolith** with a layered design for clean separation of concerns, high maintainability, and testable business logic.

### Client Tier (Frontend)
- A Single Page Application (SPA) built with React and Vite.
- Handles the presentation layer, UI state, and client-side form validation.
- Communicates with the backend REST API securely using JWTs stored in local storage.

### Application Tier (Backend REST API)
- Built on Express.js, providing a robust and scalable API.
- Organized into modular routes (e.g., `/api/auth`, `/api/officer`, `/api/victim`).
- Handles core business logic, middleware for token verification, and centralized error handling.

### Domain Modules
The `backend/src/modules` directory is organized into distinct domain boundaries (e.g., `case`, `officer`, `criminal`, `victim`, `auth`). Each module contains exactly one entity and encapsulates its own:
- **Routes (`*.routes.js`)**: Defines API endpoints and applies middleware.
- **Controller (`*.controller.js`)**: A thin layer that parses HTTP requests, delegates work to the service layer, and formats HTTP responses.
- **Service (`*.service.js`)**: The core business logic layer. Purely handles data manipulation and cross-module interactions without knowing about HTTP `req`/`res` objects.
- **Model (`*.model.js`)**: Sequelize ORM definitions mapping to database tables.
- **Schema (`*.schema.js`)**: Zod validation schemas to ensure runtime type safety for incoming requests.

### Shared Infrastructure
Cross-cutting concerns are housed in `backend/src/shared`:
- **Database**: Global database connections and Sequelize model associations (`associations.js`). The configuration supports graceful fallbacks and TLS/SSL enforcement for cloud providers such as TiDB Cloud.
- **Middleware**: Reusable middleware for authentication, error handling, and request validation.
- **Utils**: Shared helpers like token generation and password hashing.

### Data Tier (Database)
- A relational MySQL database schema.
- Sequelize ORM handles data modeling, relationships, and queries.

### Deployment Strategy
- The frontend is built as static assets and deployed to a CDN/hosting provider.
- The backend is configured for PaaS deployment (e.g., Render, Railway), reading connection strings dynamically via `process.env.DATABASE_URL` or standard database host variables.

## Key Features
- **Secure Architecture**: API validation using Zod.
- **Modular Monolith**: Domain-driven design with an explicit service layer.
- **Role-based Access Control**: Isolated routes for Officer, Chief, Admin, Victim, and Criminal. The `Chief` (Senior Officer) role has elevated privileges to oversee and assign cases to officers.
- **Case Management**: Create, update, view, and close crime cases.
- **FIR Management**: Log First Information Reports linking victims to specific cases.
- **Evidence Tracking**: Digital logging of evidence types and descriptions tied to cases.
- **Arrest Records**: Log arrests linked to criminal profiles and associated cases.
- **Police Station Directory**: Manage station details and allocate officers.
- **Dashboard Analytics**: Aggregated metrics for officers to monitor open cases, recent arrests, and station statistics.
- **Performant UI**: Fast, debounced data fetching using Tanstack React Query.
