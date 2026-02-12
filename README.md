# ReferClub — Candidate Referral Management System

ReferClub is a full-stack web application that enables authenticated users to refer candidates, manage hiring stages, upload resumes to cloud storage, and monitor referral metrics through a clean, responsive dashboard.


---

## 🌐 Live Deployment

* **Frontend:** [https://refercandidates.netlify.app/](https://refercandidates.netlify.app/)
* **Backend API:** [https://candidate-referal-systemq.onrender.com](https://candidate-referal-systemq.onrender.com)

---

# 🚀 Key Highlights (Recruiter Overview)

* JWT-based authentication (Login & Signup)
* Protected REST APIs using Bearer tokens
* Full CRUD operations for candidates
* Resume upload to Cloudinary (PDF support)
* Search & filter functionality
* Status workflow management (Pending → Reviewed → Hired)
* Metrics dashboard with real-time updates
* Deployed frontend & backend
* Clean MVC backend structure

This project reflects end-to-end implementation from database schema to UI rendering.

---

# 🏗 System Architecture

## Frontend

* React (Vite)
* Axios for API communication
* Toast-based error handling
* Responsive UI using modern CSS

## Backend

* Node.js + Express
* MongoDB Atlas (Mongoose ODM)
* JWT Authentication
* Centralized error handling middleware
* File upload handling (Multer + Cloudinary)

## Cloud Storage

* Cloudinary (secure PDF resume uploads)

## Deployment

* Netlify (Frontend)
* Render (Backend)

---

# 📊 Core Features

## 🔐 Authentication

* User Registration
* User Login
* JWT token issuance
* Protected API routes
* Logout via token removal

Authentication flow:

1. User registers or logs in.
2. Server issues JWT.
3. Frontend stores token.
4. Token is sent via `Authorization: Bearer <token>` header.

---

## 👥 Candidate Management

### Create Candidate

* Name
* Email (validated)
* Phone (10–15 digit validation)
* Job Title
* Resume (PDF only)

Resumes are uploaded to Cloudinary using streaming upload.

---

### View Candidates

* Displays all candidates referred by the authenticated user
* Search by name or job title
* Filter by status
* Sorted by most recent

---

### Update Status Workflow

Candidates move through stages:

* Pending
* Reviewed
* Hired

Status updates are persisted in MongoDB.

---

## 📈 Metrics Dashboard

* Total Referred
* Pending Count
* Reviewed Count
* Hired Count

Counts are calculated dynamically via backend aggregation logic.

---

# 🔌 REST API Endpoints

## Auth

### Register

```
POST /api/auth/signup
```

### Login

```
POST /api/auth/login
```

---

## Candidates (Authenticated)

### Create

```
POST /api/candidates
```

### List (Search + Filter)

```
GET /api/candidates?search=&status_filter=
```

### Update Status

```
PUT /api/candidates/:id/status
```

### Delete

```
DELETE /api/candidates/:id
```

### Stats

```
GET /api/candidates/stats
```

---

# 🗂 Project Structure

## Frontend

```
/frontend
  /public
    _redirects
  /src
    App.js
    index.js
    index.css
    /pages
      Auth.jsx
      Dashboard.jsx
```

## Backend

```
/backend
  server.js
  /config
    database.js
    cloudinary.js
  /models
    Candidate.js
    User.js
  /routes
    authRoutes.js
    candidateRoutes.js
  /controllers
    authController.js
    candidateController.js
  /middleware
    auth.js
    upload.js
  /utils
    generateId.js
    validators.js
```

Backend follows MVC layering:

* Routes → Controllers → Models
* Dedicated middleware for authentication and uploads
* Centralized error handling

---

# 🛡 Error Handling Strategy

Backend:

* Centralized error middleware
* Proper HTTP status codes (400 / 401 / 404 / 500)

Frontend:

* Toast notifications for API failures
* Loading states handled using `finally`

---

# ⚙ Environment Variables

## Frontend

```
VITE_BACKEND_URL=https://candidate-referal-systemq.onrender.com
```

## Backend

```
PORT=5000
MONGO_URL=<mongodb-connection-string>
DB_NAME=candidate-referal
CORS_ORIGINS=*
JWT_SECRET=<secret>
JWT_ALGORITHM=HS256

CLOUDINARY_CLOUD_NAME=<cloud>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```

---

# 🧪 Local Development

## Backend

```
cd backend
npm install
npm start
```

## Frontend

```
cd frontend
npm install
npm run dev
```

---

# 📦 Deployment Notes

* Backend hosted on Render (free tier may experience cold start delays).
* Frontend deployed on Netlify with SPA routing support.
* All environment variables configured in respective dashboards.

---

# 🎯 What This Project Demonstrates

* Secure authentication implementation
* RESTful API design
* MongoDB schema modeling
* Cloud file upload handling
* Full CRUD functionality
* State management in React
* Production deployment workflow
* Environment configuration handling



---

# 🙌 Author

Built by Shivam Shrivastava.

Database: MongoDB Atlas
Cloud Storage: Cloudinary
Deployment: Netlify & Render
