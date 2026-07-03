# Cop Companion

Cop Companion is a comprehensive law enforcement management system designed to track cases, evidence, arrests, and criminals.

## Technological Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Tanstack React Query.
- **Backend**: Node.js, Express, Sequelize (MySQL), Zod for validation.
- **Database**: MySQL

## Prerequisites

- Node.js (v18+)
- MySQL Server
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
4. Update the `.env` file with your MySQL credentials.
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

The backend of Cop Companion is built using a **Modular Monolith** architecture with a layered design. This ensures a clean separation of concerns, high maintainability, and makes business logic easy to test.

### Domain Modules
The `backend/src/modules` directory is organized into distinct domain boundaries (e.g., `case`, `officer`, `criminal`, `victim`, `auth`). Each module contains exactly one entity and encapsulates its own:
- **Routes (`*.routes.js`)**: Defines API endpoints and applies middleware.
- **Controller (`*.controller.js`)**: A thin layer that parses HTTP requests, delegates work to the service layer, and formats HTTP responses.
- **Service (`*.service.js`)**: The core business logic layer. Purely handles data manipulation and cross-module interactions without knowing about HTTP `req`/`res` objects.
- **Model (`*.model.js`)**: Sequelize ORM definitions mapping to database tables.
- **Schema (`*.schema.js`)**: Zod validation schemas to ensure runtime type safety for incoming requests.

### Shared Infrastructure
Cross-cutting concerns are housed in `backend/src/shared`:
- **Database**: Global database connections and Sequelize model associations (`associations.js`).
- **Middleware**: Reusable middleware for authentication, error handling, and request validation.
- **Utils**: Shared helpers like token generation and password hashing.

## Key Features
- **Secure Architecture**: API validation using Zod.
- **Modular Monolith**: Domain-driven design with an explicit service layer.
- **Role-based Access Control**: Isolated routes for Officer, Chief, Admin, Victim, and Criminal. The `Chief` (Senior Officer) role has elevated privileges to oversee and assign cases to officers.
- **Performant UI**: Fast, debounced data fetching using Tanstack React Query.
