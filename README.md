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

## Key Features
- **Secure Architecture**: API validation using Zod.
- **Role-based Access Control**: Officer and Admin isolated routes.
- **Performant UI**: Fast, debounced data fetching using Tanstack React Query.
