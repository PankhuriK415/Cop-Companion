# 🚔 Crime Record Management System — Backend API

A production-ready REST API backend built with **Node.js**, **Express.js**, **MySQL**, **JWT Authentication**, and **Role-Based Access Control (RBAC)**.

---

## 📁 Project Structure

```
project/
├── config/
│   └── db.js                    # MySQL connection pool (mysql2)
├── controllers/
│   ├── authController.js        # Login, JWT issue, login_log
│   ├── officerController.js     # Full CRUD for all entities
│   ├── victimController.js      # Victim self-data view
│   └── criminalController.js    # Criminal case status view
├── middleware/
│   ├── authMiddleware.js        # verifyToken + authorizeRoles
│   └── errorMiddleware.js       # Centralized error + 404 handler
├── routes/
│   ├── authRoutes.js            # POST /api/auth/login
│   ├── officerRoutes.js         # All officer CRUD routes
│   ├── victimRoutes.js          # GET /api/victim/data
│   └── criminalRoutes.js        # GET /api/criminal/status
├── utils/
│   ├── generateToken.js         # JWT token generator
│   └── hashPassword.js          # CLI bcrypt hash utility
├── app.js                       # Express app setup + route mounting
├── server.js                    # HTTP server + graceful shutdown
├── schema.sql                   # Full DB schema + seed data
├── .env                         # Environment variables
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
```bash
cd project
npm install
```

### 2. Configure Environment
Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=crime_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h
```

### 3. Set Up the Database
```bash
mysql -u root -p < schema.sql
```

This will:
- Create the `crime_db` database
- Create all 10 tables with proper foreign keys
- Insert seed data (stations, officers, criminals, victims, cases, FIRs, evidence, arrests)
- Insert 3 login accounts (password for all: `Password@123`)

### 4. Start the Server
```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

Server runs at: `http://localhost:5000`

---

## 🔐 Authentication

### POST `/api/auth/login`

**Request Body:**
```json
{
  "username": "officer_sharma",
  "password": "Password@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "login_id": 1,
    "username": "officer_sharma",
    "role": "officer",
    "user_id": 1
  }
}
```

**Seed Accounts:**

| Username         | Password      | Role     |
|------------------|---------------|----------|
| officer_sharma   | Password@123  | officer  |
| victim_amit      | Password@123  | victim   |
| criminal_rajan   | Password@123  | criminal |

**Using the token:**  
Add to all protected requests:
```
Authorization: Bearer <token>
```

---

## 📡 API Routes

### 🔓 Public Routes
| Method | Route              | Description        |
|--------|--------------------|--------------------|
| POST   | `/api/auth/login`  | Login & get token  |
| GET    | `/health`          | Health check       |

---

### 👮 Officer Routes — `Authorization: Bearer <officer_token>`

#### Aggregate
| Method | Route                    | Description               |
|--------|--------------------------|---------------------------|
| GET    | `/api/officer/all-data`  | Join of all major tables  |

#### Cases
| Method | Route                    | Query Params                        |
|--------|--------------------------|-------------------------------------|
| GET    | `/api/officer/cases`     | `?page=1&limit=10&status=Open&search=robbery` |
| GET    | `/api/officer/cases/:id` |                                     |
| POST   | `/api/officer/cases`     |                                     |
| PUT    | `/api/officer/cases/:id` |                                     |
| DELETE | `/api/officer/cases/:id` |                                     |

**POST /cases body:**
```json
{
  "Case_Date": "2024-05-01",
  "Case_Status": "Open",
  "Description": "Robbery at main market",
  "Station_ID": 1,
  "Officer_ID": 1
}
```

#### Criminals
| Method | Route                       | Query Params           |
|--------|-----------------------------|------------------------|
| GET    | `/api/officer/criminals`    | `?page=1&limit=10&search=rajan` |
| GET    | `/api/officer/criminals/:id`|                        |
| POST   | `/api/officer/criminals`    |                        |
| PUT    | `/api/officer/criminals/:id`|                        |
| DELETE | `/api/officer/criminals/:id`|                        |

**POST /criminals body:**
```json
{
  "Criminal_Name": "John Doe",
  "Gender": "Male",
  "DOB": "1990-01-01",
  "Address": "123 Crime Street"
}
```

#### Victims
| Method | Route                     |
|--------|---------------------------|
| GET    | `/api/officer/victims`    |
| GET    | `/api/officer/victims/:id`|
| POST   | `/api/officer/victims`    |
| PUT    | `/api/officer/victims/:id`|
| DELETE | `/api/officer/victims/:id`|

#### Evidence
| Method | Route                      | Query Params        |
|--------|----------------------------|---------------------|
| GET    | `/api/officer/evidence`    | `?case_id=1&page=1` |
| GET    | `/api/officer/evidence/:id`|                     |
| POST   | `/api/officer/evidence`    |                     |
| PUT    | `/api/officer/evidence/:id`|                     |
| DELETE | `/api/officer/evidence/:id`|                     |

#### Arrests
| Method | Route                     |
|--------|---------------------------|
| GET    | `/api/officer/arrests`    |
| GET    | `/api/officer/arrests/:id`|
| POST   | `/api/officer/arrests`    |
| PUT    | `/api/officer/arrests/:id`|
| DELETE | `/api/officer/arrests/:id`|

#### FIRs ⚠️ UPDATE BLOCKED
| Method | Route                  | Notes                  |
|--------|------------------------|------------------------|
| GET    | `/api/officer/firs`    |                        |
| GET    | `/api/officer/firs/:id`|                        |
| POST   | `/api/officer/firs`    |                        |
| PUT    | `/api/officer/firs/:id`| ❌ Returns 403         |
| PATCH  | `/api/officer/firs/:id`| ❌ Returns 403         |
| DELETE | `/api/officer/firs/:id`|                        |

#### Police Stations
| Method | Route                      |
|--------|----------------------------|
| GET    | `/api/officer/stations`    |
| GET    | `/api/officer/stations/:id`|
| POST   | `/api/officer/stations`    |
| PUT    | `/api/officer/stations/:id`|
| DELETE | `/api/officer/stations/:id`|

#### Officers
| Method | Route                      |
|--------|----------------------------|
| GET    | `/api/officer/officers`    |
| GET    | `/api/officer/officers/:id`|
| POST   | `/api/officer/officers`    |
| PUT    | `/api/officer/officers/:id`|
| DELETE | `/api/officer/officers/:id`|

---

### 🧍 Victim Routes — `Authorization: Bearer <victim_token>`

| Method | Route              | Description                                    |
|--------|--------------------|------------------------------------------------|
| GET    | `/api/victim/data` | Returns own FIR + case + evidence (joined)    |

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "victim": {
      "Victim_ID": 1,
      "Victim_Name": "Amit Gupta",
      "Gender": "Male",
      "Phone": "9000000001",
      "Address": "10 Peaceful St"
    },
    "cases": [
      {
        "FIR_No": 1,
        "FIR_Date": "2024-01-10",
        "Case_ID": 1,
        "Case_Status": "Open",
        "Case_Description": "Armed robbery near central market",
        "Station_Name": "Central Police Station",
        "evidence": [
          { "Evidence_ID": 1, "Evidence_Type": "CCTV Footage", "Evidence_Description": "..." },
          { "Evidence_ID": 2, "Evidence_Type": "Weapon", "Evidence_Description": "..." }
        ]
      }
    ]
  }
}
```

---

### 🧑‍⚖️ Criminal Routes — `Authorization: Bearer <criminal_token>`

| Method | Route                  | Description                     |
|--------|------------------------|---------------------------------|
| GET    | `/api/criminal/status` | Returns own case IDs + statuses |

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "Criminal_ID": 1,
    "Criminal_Name": "Rajan Mehta",
    "cases": [
      {
        "Arrest_ID": 1,
        "Arrest_Date": "2024-01-15",
        "Case_ID": 1,
        "Case_Status": "Open",
        "Case_Description": "Armed robbery near central market"
      }
    ]
  }
}
```

---

## 🛡️ Security Features

| Feature                  | Implementation                              |
|--------------------------|---------------------------------------------|
| Password hashing         | `bcryptjs` with salt rounds = 10            |
| JWT authentication       | `jsonwebtoken`, secret in `.env`            |
| Role-based access        | `authorizeRoles(['officer'])` middleware    |
| SQL injection prevention | Parameterized queries via `mysql2`          |
| Route protection         | `verifyToken` middleware on all private routes |
| FIR update block         | Hard-blocked at controller level (403)      |
| Security headers         | `X-Content-Type-Options`, `X-Frame-Options` |

---

## 📄 Pagination

All list endpoints support pagination:

```
GET /api/officer/cases?page=2&limit=5
```

Response includes:
```json
{
  "total": 42,
  "page": 2,
  "limit": 5,
  "data": [...]
}
```

---

## 🔍 Search & Filter

```
GET /api/officer/cases?search=robbery&status=Open
GET /api/officer/criminals?search=rajan
GET /api/officer/evidence?case_id=1
```

---

## 🔧 Utility: Hash a Password

```bash
node utils/hashPassword.js "MyNewPassword123"
```

---

## 📦 Dependencies

| Package           | Purpose                        |
|-------------------|--------------------------------|
| express           | Web framework                  |
| mysql2            | MySQL driver with promise API  |
| bcryptjs          | Password hashing               |
| jsonwebtoken      | JWT creation & verification    |
| dotenv            | Environment variable loader    |
| express-validator | Input validation (extendable)  |
| nodemon (dev)     | Auto-restart on file change    |
