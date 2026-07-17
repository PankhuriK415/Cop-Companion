# Cop-Companion

## Project Description
Cop-Companion is a comprehensive Crime Record Management System designed to facilitate the efficient tracking, recording, and management of crime-related data. The platform enables police officers and victims to interact with a centralized database of cases, FIRs (First Information Reports), evidence, and arrest records. The system provides role-based access, allowing tailored views and actions for different user types.

## Technical Requirements
- **Node.js**: v18+ recommended.
- **Package Manager**: npm or yarn.
- **Database**: MySQL (Compatible with TiDB Cloud or Railway).
- **Environment Variables**: Proper `.env` configurations for database connections, JWT secrets, and API ports.

## Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios (configured with interceptors for JWT injection)

### Backend
- **Framework**: Node.js with Express.js
- **Language**: JavaScript
- **Database ORM**: Sequelize
- **Database**: MySQL (optimized for TiDB Cloud with TLS support)
- **Security & Authentication**: 
  - `jsonwebtoken` (JWT) for stateless session management.
  - `bcryptjs` for secure password hashing.
  - `cors` and basic security headers.

## Functional Requirements
- **Role-Based Access Control (RBAC)**: Distinct permissions for Officers, Victims, and Criminals.
- **Case Management**: Create, update, view, and close crime cases.
- **FIR Management**: Log First Information Reports linking victims to specific cases.
- **Evidence Tracking**: Digital logging of evidence types and descriptions tied to cases.
- **Arrest Records**: Log arrests linked to criminal profiles and associated cases.
- **Police Station Directory**: Manage station details and allocate officers.
- **Dashboard Analytics**: Aggregated metrics for officers to monitor open cases, recent arrests, and station statistics.

## Architecture

The application follows a standard **Client-Server Architecture**:

1. **Client Tier (Frontend)**:
   - A Single Page Application (SPA) built with React and Vite.
   - Handles the presentation layer, UI state, and client-side form validation.
   - Communicates with the backend REST API securely using JWTs stored in local storage.

2. **Application Tier (Backend REST API)**:
   - Built on Express.js, providing a robust and scalable API.
   - Organized into modular routes (e.g., `/api/auth`, `/api/officer`, `/api/victim`).
   - Handles core business logic, middleware for token verification (`authMiddleware`), and centralized error handling (`errorMiddleware`).

3. **Data Tier (Database)**:
   - A relational MySQL database schema.
   - Sequelize ORM handles data modeling, relationships, and queries.
   - The database configuration natively supports graceful fallbacks and TLS/SSL enforcement for cloud providers (like TiDB Cloud).

4. **Deployment Strategy**:
   - The frontend is built as static assets and deployed to a CDN/Hosting provider.
   - The backend is configured for PaaS deployment (e.g., Render, Railway), reading connection strings dynamically via `process.env.DATABASE_URL` or standard database host variables.
