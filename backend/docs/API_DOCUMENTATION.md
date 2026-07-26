# Aroma Backend API Documentation

## Project Overview

**Aroma** is an AI-powered assessment and hiring platform that enables organizations to create assessments, evaluate candidates automatically, and provide detailed analytics through a secure role-based system.

---

# Base URL

Development

```
http://127.0.0.1:8001
```

Swagger

```
http://127.0.0.1:8001/docs
```

---

# Authentication

The backend uses **JWT (JSON Web Token)** authentication.

After logging in, every protected request must include:

```
Authorization: Bearer <access_token>
```

---

# User Roles

## Admin

Can:

* Register/Login
* Create Questions
* Edit Questions
* Delete Questions
* Create Assessments
* Edit Assessments
* Delete Assessments
* View Dashboard
* View Analytics
* View Leaderboard
* Export Results

---

## Student

Can:

* Register/Login
* View Dashboard
* Start Assessment
* Resume Assessment
* Autosave Answers
* Submit Assessment
* View Results
* View Leaderboard

---

# API Modules

## Authentication

| Endpoint  | Method | Access |
| --------- | ------ | ------ |
| /register | POST   | Public |
| /login    | POST   | Public |

---

## Questions

| Endpoint                 | Method | Access |
| ------------------------ | ------ | ------ |
| /questions               | POST   | Admin  |
| /questions               | GET    | Public |
| /questions/{id}          | GET    | Public |
| /questions/{id}          | PUT    | Admin  |
| /questions/{id}          | DELETE | Admin  |
| /questions/search        | GET    | Public |
| /questions/page          | GET    | Public |
| /questions/topic/{topic} | GET    | Public |
| /questions/type/{type}   | GET    | Public |

---

## Assessments

| Endpoint            | Method | Access |
| ------------------- | ------ | ------ |
| /assessments        | POST   | Admin  |
| /assessments        | GET    | Public |
| /assessments/{id}   | GET    | Public |
| /assessments/{id}   | PUT    | Admin  |
| /assessments/{id}   | DELETE | Admin  |
| /assessments/search | GET    | Public |
| /assessments/page   | GET    | Public |

---

## Student Assessment

| Endpoint                            | Method | Access  |
| ----------------------------------- | ------ | ------- |
| /student/dashboard                  | GET    | Student |
| /student/assessment/{assessment_id} | GET    | Student |
| /student/assessment/start           | POST   | Student |
| /student/autosave                   | POST   | Student |
| /student/submit                     | POST   | Student |

---

## Results

| Endpoint         | Method | Access  |
| ---------------- | ------ | ------- |
| /student/results | GET    | Student |
| /leaderboard     | GET    | Public  |
| /admin/results   | GET    | Admin   |

---

## Analytics

| Endpoint                                    | Method | Access |
| ------------------------------------------- | ------ | ------ |
| /admin/dashboard                            | GET    | Admin  |
| /admin/assessment/{assessment_id}/analytics | GET    | Admin  |

---

## Judge0

| Endpoint     | Method | Access  |
| ------------ | ------ | ------- |
| /submit-code | POST   | Student |

---

# Frontend Screen Mapping

## Authentication

### Login Page

API

```
POST /login
```

---

### Register Page

API

```
POST /register
```

---

## Student Dashboard

Displays:

* Active Assessments
* Completed Assessments
* Previous Scores
* Statistics

API

```
GET /student/dashboard
```

---

## Assessment Page

Displays:

* Assessment Details
* Questions
* Timer
* Navigation
* Submit Button

APIs

```
GET /student/assessment/{assessment_id}

POST /student/autosave

POST /student/submit
```

---

## Results Page

Displays

* Score
* Percentage
* Pass / Fail
* Correct Answers
* Wrong Answers

API

```
GET /student/results
```

---

## Leaderboard

Displays

* Rank
* Student Name
* Average Score
* Attempts

API

```
GET /leaderboard
```

---

## Admin Dashboard

Displays

* Total Students
* Total Questions
* Total Assessments
* Total Attempts
* Analytics

API

```
GET /admin/dashboard
```

---

## Question Management

Admin can

* Create
* Update
* Delete
* Search

APIs

```
POST /questions

GET /questions

PUT /questions/{id}

DELETE /questions/{id}

GET /questions/search

GET /questions/page
```

---

## Assessment Management

Admin can

* Create
* Update
* Delete
* Search

APIs

```
POST /assessments

GET /assessments

PUT /assessments/{id}

DELETE /assessments/{id}

GET /assessments/search

GET /assessments/page
```

---

# Authentication Flow

```
Register

↓

Login

↓

Receive JWT Token

↓

Store Token

↓

Send Token

Authorization: Bearer <token>

↓

Access Protected APIs
```

---

# Student Flow

```
Login

↓

Dashboard

↓

Assessment List

↓

Open Assessment

↓

Start Assessment

↓

Autosave

↓

Submit

↓

Result

↓

Leaderboard
```

---

# Admin Flow

```
Login

↓

Dashboard

↓

Manage Questions

↓

Manage Assessments

↓

Analytics

↓

Leaderboard

↓

Export Results
```

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

# Technology Stack

Backend

* FastAPI
* MongoDB Atlas
* JWT Authentication
* Pydantic
* Judge0 API
* Python

Frontend

* React / Next.js

Deployment

* Uvicorn
* MongoDB Atlas

---

# Notes

* All protected APIs require a valid JWT token.
* Admin-only APIs cannot be accessed by students.
* Students can only attempt assessments assigned to them.
* Coding questions are evaluated using Judge0.
* MCQ/MSQ questions are evaluated automatically by the backend.
* Assessment timing, autosave, and submission are managed on the server.
