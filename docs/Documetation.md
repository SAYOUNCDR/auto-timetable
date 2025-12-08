# TimeTable Management & Generation System

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Scheduler Core](#scheduler-core)
- [Frontend Structure](#frontend-structure)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)

---

## 🎯 Project Overview

The **TimeTable Management & Generation System** is an intelligent web application designed to automate the creation and management of academic timetables using constraint-based scheduling algorithms. The system uses AI-powered optimization to handle complex scheduling requirements while respecting faculty availability, room capacity, and curriculum constraints.

### Key Objectives

- Automate timetable generation for educational institutions
- Minimize scheduling conflicts and resource clashes
- Respect faculty availability and workload constraints
- Optimize room allocation based on capacity and type
- Provide role-based access control (Admin, Faculty, Student)

**Author:** Sayoun Parui  
**License:** MIT  
**Version:** 1.0.0

---

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication system
- Role-based access control (Admin, Faculty, Student)
- Secure password hashing with bcrypt
- Protected API routes with middleware

### 👨‍💼 Admin Features

- Create and manage faculty accounts
- Create and manage student accounts
- Define batches/groups with year and strength
- Configure subjects with session requirements
- Manage classrooms and laboratories
- Generate automated timetables
- View and export schedules

### 👨‍🏫 Faculty Features

- View personal teaching schedule
- Set unavailable time slots
- Define qualified subjects
- Specify maximum classes per day
- Update profile information

### 👨‍🎓 Student Features

- View batch timetable
- Access subject information
- Check room assignments
- View faculty details

### 🤖 AI-Powered Scheduling

- Constraint Programming using Google OR-Tools
- Handles complex constraints:
  - No faculty double-booking
  - No student group conflicts
  - Room capacity validation
  - Lab vs. classroom requirements
  - Faculty unavailability slots
  - Consecutive slot allocation for labs
  - Maximum classes per day limits

---

## 🛠 Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB with Mongoose 9.0.0
- **Authentication:** JWT (jsonwebtoken 9.0.3)
- **Password Hashing:** bcrypt 6.0.0
- **HTTP Client:** Axios 1.13.2
- **Dev Tools:** Nodemon 3.1.11

### Frontend

- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 4.1.17
- **Animations:** Motion 12.23.25
- **Icons:** Lucide React 0.555.0
- **Language:** JavaScript (ES6+)

### Scheduler Core (AI Engine)

- **Language:** Python 3.x
- **Framework:** FastAPI
- **Solver:** Google OR-Tools (Constraint Programming)
- **Server:** Uvicorn

### Development Tools

- **Version Control:** Git
- **Code Quality:** ESLint
- **API Testing:** REST Client / Postman

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Admin   │  │ Faculty  │  │ Student  │  │ Landing  │   │
│  │  Panel   │  │   View   │  │   View   │  │   Page   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │                  Route Layer                       │     │
│  │  /api/auth  /api/admin  /api/dev  /api/timetable │     │
│  └────────────────────┬───────────────────────────────┘     │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────┐     │
│  │              Controller Layer                      │     │
│  │  Authentication  │  Admin Logic  │  Timetable     │     │
│  └────────────────────┬───────────────────────────────┘     │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────┐     │
│  │               Model Layer (Mongoose)               │     │
│  │  Admin │ Faculty │ Student │ Batch │ Subject      │     │
│  │  Classroom │ Timetable                             │     │
│  └────────────────────┬───────────────────────────────┘     │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────┐           ┌──────────────────┐
              │   MongoDB       │           │  Scheduler Core  │
              │   Database      │           │  (FastAPI/Python)│
              └─────────────────┘           │                  │
                                            │  Google OR-Tools │
                                            └──────────────────┘
```

### Project Directory Structure

```
TimeTable Project/
│
├── backend/                      # Node.js Express Backend
│   ├── config/
│   │   └── connection.js        # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js   # Admin business logic
│   │   ├── authController.js    # Authentication logic
│   │   ├── devController.js     # Developer utilities
│   │   └── timetableController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── devMiddleware.js     # Dev API key check
│   │   └── roleMiddleware.js    # Role-based access
│   ├── models/
│   │   ├── admin.model.js
│   │   ├── faculty.model.js
│   │   ├── student.model.js
│   │   ├── batch.model.js
│   │   ├── subject.model.js
│   │   ├── class.model.js
│   │   └── timetable.model.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── devRoutes.js
│   │   └── timetableRoutes.js
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   ├── package.json
│   └── .env                     # Environment variables
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Layout components
│   │   │   ├── pages/           # Page components
│   │   │   ├── TimetableGrid/   # Timetable display
│   │   │   └── ui/              # Reusable UI components
│   │   │       ├── Button.jsx
│   │   │       ├── Forms.jsx
│   │   │       └── Navbar.jsx
│   │   ├── App.jsx              # Root component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── scheduler_core/               # Python AI Scheduler
│   ├── main.py                  # FastAPI server
│   ├── logic.py                 # Scheduling algorithm
│   ├── mock_input.json          # Test data
│   ├── schema.md                # Input/output format
│   ├── requirements.txt
│   └── venv/                    # Python virtual environment
│
└── docs/
    ├── README.md
    └── Documentation.md         # This file
```

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/SAYOUNCDR/auto-timetable.git
cd TimeTable-Project
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables (see Environment Variables section)
# Edit .env with your values

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 4: Scheduler Core Setup

```bash
cd scheduler_core

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

The scheduler API will start on `http://localhost:8000`

---

## 🗄 Database Schema

### Admin Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  hashedPassword: String (required),
  role: String (default: "admin"),
  timestamps: true
}
```

### Faculty Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  hashedPassword: String (required),
  role: String (default: "faculty"),
  maxClassesPerDay: Number (required),
  qualifiedSubjects: [ObjectId] (ref: "Subject"),
  unavailableTimeSlots: [[Number]] (format: [[day, slot]]),
  timestamps: true
}
```

**unavailableTimeSlots Format:**

- `day`: 0-6 (0=Monday, 6=Sunday)
- `slot`: 0-7 (0=9AM, 7=4PM)
- Example: `[[0, 0], [2, 7]]` = Unavailable Monday 9AM and Wednesday 4PM

### Student Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  hashedPassword: String (required),
  role: String (default: "student"),
  batch: ObjectId (required, ref: "Batch"),
  timestamps: true
}
```

### Batch Model

```javascript
{
  batchName: String (required, unique),
  strength: Number (required),
  yearOfStudy: Number (required),
  subjects: [ObjectId] (ref: "Subject"),
  timestamps: true
}
```

### Subject Model

```javascript
{
  subjectCode: String (required, unique),
  subjectName: String (required),
  sessionsPerWeek: Number (required),
  type: String (enum: ["Theory", "Practical"]),
  requiredRoomType: String (enum: ["Classroom", "Laboratory"]),
  batch: ObjectId (required, ref: "Batch"),
  timestamps: true
}
```

### Classroom Model

```javascript
{
  className: String (required, unique),
  capacity: Number (required),
  type: String (enum: ["Classroom", "Laboratory"]),
  timestamps: true
}
```

### Timetable Model

```javascript
{
  day: Number (required, 0-6),
  slot: Number (required, 0-7),
  room: ObjectId (required, ref: "Classroom"),
  faculty: ObjectId (required, ref: "Faculty"),
  subject: ObjectId (required, ref: "Subject"),
  batch: ObjectId (required, ref: "Batch"),
  semester: String,
  timestamps: true
}
```

---

## 📡 API Documentation

### Base URL

```
Backend: http://localhost:5000/api
Scheduler: http://localhost:8000
```

### Authentication Endpoints

#### POST `/api/auth/login`

Login for all user types (Admin/Faculty/Student)

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

#### POST `/api/auth/logout`

Logout user (invalidates token)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

### Developer Endpoints

#### POST `/api/dev/create-admin`

Create first admin account (protected by DEV_API_KEY)

**Headers:**

```
x-dev-key: <DEV_API_KEY>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securepassword"
}
```

### Admin Endpoints (Requires Admin Role)

#### POST `/api/admin/create-faculty`

Create faculty account

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**

```json
{
  "name": "Dr. John Doe",
  "email": "john@university.edu",
  "password": "password123",
  "maxClassesPerDay": 4,
  "qualifiedSubjects": ["subject_id_1", "subject_id_2"],
  "unavailableTimeSlots": [
    [0, 0],
    [4, 7]
  ]
}
```

#### POST `/api/admin/create-student`

Create student account

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@student.edu",
  "password": "password123",
  "batch": "batch_id"
}
```

#### POST `/api/admin/create-batch`

Create student batch/group

**Request Body:**

```json
{
  "batchName": "CSE 2024 A",
  "strength": 60,
  "yearOfStudy": 2,
  "subjects": ["subject_id_1", "subject_id_2"]
}
```

#### POST `/api/admin/create-subject`

Create subject

**Request Body:**

```json
{
  "subjectCode": "CS101",
  "subjectName": "Introduction to Computer Science",
  "sessionsPerWeek": 3,
  "type": "Theory",
  "requiredRoomType": "Classroom",
  "batch": "batch_id"
}
```

#### POST `/api/admin/create-classroom`

Create classroom/laboratory

**Request Body:**

```json
{
  "className": "Room 101",
  "capacity": 60,
  "type": "Classroom"
}
```

#### GET `/api/admin/faculty`

Get all faculty members

#### GET `/api/admin/students`

Get all students

#### GET `/api/admin/batches`

Get all batches

#### GET `/api/admin/subjects`

Get all subjects

#### GET `/api/admin/classrooms`

Get all classrooms

### Timetable Endpoints

#### POST `/api/timetable/generate`

Generate timetable using AI scheduler

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**

```json
{
  "semester": "Fall 2024",
  "metadata": {
    "days_per_week": 5,
    "slots_per_day": 8,
    "slot_duration_min": 60
  }
}
```

**Response:**

```json
{
  "status": "success",
  "schedule": [
    {
      "day": 0,
      "slot": 2,
      "room_id": "classroom_id",
      "teacher_id": "faculty_id",
      "course_id": "subject_id",
      "group_id": "batch_id",
      "is_start": true
    }
  ]
}
```

#### GET `/api/timetable/batch/:batchId`

Get timetable for specific batch

#### GET `/api/timetable/faculty/:facultyId`

Get timetable for specific faculty

#### GET `/api/timetable/room/:roomId`

Get timetable for specific room

---

## 🤖 Scheduler Core

### Overview

The scheduler core is a Python-based AI service that uses Google OR-Tools Constraint Programming to solve complex timetable scheduling problems.

### Algorithm Features

- **Constraint Satisfaction Problem (CSP) Solver**
- **Hard Constraints:**
  - No faculty teaching multiple classes at same time
  - No student group in multiple classes simultaneously
  - No room double-booking
  - Room capacity must exceed group size
  - Lab sessions require lab-type rooms
  - Respect faculty unavailable slots
- **Soft Constraints (Optimization):**
  - Minimize gaps in faculty schedule
  - Balance workload across days
  - Prefer morning slots for theory classes

### Input Format

The scheduler accepts JSON with three main sections:

#### 1. Metadata

```json
{
  "metadata": {
    "days_per_week": 5,
    "slots_per_day": 8,
    "slot_duration_min": 60
  }
}
```

#### 2. Resources

```json
{
  "resources": {
    "rooms": [
      {
        "id": "R_101",
        "capacity": 60,
        "type": "lecture_hall"
      }
    ],
    "teachers": [
      {
        "id": "T_SMITH",
        "name": "Prof. Smith",
        "qualified_courses": ["CS101"],
        "unavailable_slots": [[0, 0]]
      }
    ],
    "courses": [
      {
        "id": "CS101",
        "name": "Intro to CS"
      }
    ],
    "groups": [
      {
        "id": "BATCH_A",
        "name": "CSE 2024 A",
        "student_count": 50
      }
    ]
  }
}
```

#### 3. Requirements

```json
{
  "requirements": [
    {
      "group_id": "BATCH_A",
      "course_id": "CS101",
      "teacher_id": "T_SMITH",
      "sessions_per_week": 3,
      "duration_slots": 1,
      "requires_lab": false
    }
  ]
}
```

### Output Format

```json
{
  "status": "success",
  "schedule": [
    {
      "day": 0,
      "slot": 2,
      "room_id": "R_101",
      "teacher_id": "T_SMITH",
      "course_id": "CS101",
      "group_id": "BATCH_A",
      "is_start": true
    }
  ]
}
```

### Running the Scheduler

```bash
# Navigate to scheduler_core
cd scheduler_core

# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start the server
uvicorn main:app --reload --port 8000
```

### API Endpoint

**POST** `http://localhost:8000/generate`

Test with curl:

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d @mock_input.json
```

---

## 🎨 Frontend Structure

### Component Organization

```
src/components/
├── layout/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── Sidebar.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── AdminDashboard.jsx
│   ├── FacultyDashboard.jsx
│   └── StudentDashboard.jsx
├── TimetableGrid/
│   ├── WeekView.jsx
│   ├── DayView.jsx
│   └── ClassCard.jsx
└── ui/
    ├── Button.jsx
    ├── Forms.jsx
    ├── Navbar.jsx
    └── Modal.jsx
```

### Styling System

The project uses **Tailwind CSS** with custom configurations:

**Color Palette:**

- Primary: Yellow theme (`#fbbf24`, `#fef3c7`)
- Gradients: `from-yellow-200 to-yellow-400`
- Shadows: Custom yellow-tinted shadows
- Selection: Light yellow background (`#fef3c7`)

**Key Design Elements:**

- Micro-interactions using Motion.dev
- Lucide React icons
- Responsive grid layouts
- Smooth animations and transitions
- Gradient backgrounds and borders

### State Management

- React Hooks (useState, useEffect)
- Context API for authentication state
- Local state for component-specific data

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/timetable_db
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/timetable_db

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key_here_min_32_chars

# Developer API Key (for creating first admin)
DEV_API_KEY=your_dev_api_key_here

# CORS Origin
CORS_ORIGIN=http://localhost:5173

# Scheduler Core URL
SCHEDULER_URL=http://localhost:8000
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SCHEDULER_URL=http://localhost:8000
```

### Security Best Practices

1. **Never commit `.env` files** to version control
2. Use `.env.example` as a template
3. Generate strong JWT secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
4. Rotate DEV_API_KEY after initial setup
5. Use environment-specific variables for production

---

## 📖 Usage Guide

### Initial Setup Workflow

#### 1. Create First Admin

```bash
curl -X POST http://localhost:5000/api/dev/create-admin \
  -H "Content-Type: application/json" \
  -H "x-dev-key: your_dev_key" \
  -d '{
    "name": "System Admin",
    "email": "admin@university.edu",
    "password": "SecurePass123"
  }'
```

#### 2. Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "SecurePass123",
    "role": "admin"
  }'
```

Save the returned JWT token.

#### 3. Create Resources

**Create Classrooms:**

```bash
curl -X POST http://localhost:5000/api/admin/create-classroom \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "className": "Room 101",
    "capacity": 60,
    "type": "Classroom"
  }'
```

**Create Batch:**

```bash
curl -X POST http://localhost:5000/api/admin/create-batch \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "batchName": "CSE 2024 A",
    "strength": 55,
    "yearOfStudy": 2,
    "subjects": []
  }'
```

**Create Faculty:**

```bash
curl -X POST http://localhost:5000/api/admin/create-faculty \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith",
    "email": "smith@university.edu",
    "password": "password123",
    "maxClassesPerDay": 4,
    "qualifiedSubjects": [],
    "unavailableTimeSlots": []
  }'
```

**Create Subject:**

```bash
curl -X POST http://localhost:5000/api/admin/create-subject \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subjectCode": "CS101",
    "subjectName": "Programming Basics",
    "sessionsPerWeek": 3,
    "type": "Theory",
    "requiredRoomType": "Classroom",
    "batch": "<batch_id>"
  }'
```

#### 4. Generate Timetable

```bash
curl -X POST http://localhost:5000/api/timetable/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "semester": "Fall 2024",
    "metadata": {
      "days_per_week": 5,
      "slots_per_day": 8,
      "slot_duration_min": 60
    }
  }'
```

### Common Operations

#### View Faculty Timetable

```bash
curl http://localhost:5000/api/timetable/faculty/<faculty_id> \
  -H "Authorization: Bearer <token>"
```

#### View Batch Timetable

```bash
curl http://localhost:5000/api/timetable/batch/<batch_id> \
  -H "Authorization: Bearer <token>"
```

#### Update Faculty Unavailability

```bash
curl -X PUT http://localhost:5000/api/admin/faculty/<faculty_id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "unavailableTimeSlots": [[0, 0], [2, 7]]
  }'
```

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests (if configured)
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Admin can create faculty accounts
- [ ] Admin can create student accounts
- [ ] Admin can create batches
- [ ] Admin can create subjects
- [ ] Admin can create classrooms
- [ ] Faculty login works correctly
- [ ] Student login works correctly
- [ ] Timetable generation succeeds
- [ ] No scheduling conflicts exist
- [ ] Faculty unavailability is respected
- [ ] Room capacity constraints are met
- [ ] Lab sessions assigned to lab rooms only

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Error:** `Failed to connect to the database`

**Solution:**

- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify network connectivity for Atlas

#### 2. JWT Verification Failed

**Error:** `Invalid token` or `Token expired`

**Solution:**

- Check JWT_SECRET matches in .env
- Ensure token is passed in Authorization header
- Re-login to get fresh token

#### 3. Scheduler Returns "No Solution Found"

**Error:** `400: No solution found (Constraints too tight)`

**Solution:**

- Reduce sessions per week
- Add more rooms
- Check faculty availability
- Ensure room capacity >= group strength
- Verify lab rooms exist for lab subjects

#### 4. CORS Issues

**Error:** `CORS policy blocked`

**Solution:**

- Check CORS_ORIGIN in backend .env
- Ensure frontend URL matches
- Verify CORS middleware is configured

#### 5. Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**

```bash
# Find process using port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Linux/Mac:
lsof -i :5000
kill -9 <process_id>
```

---

## 🚀 Deployment

### Production Considerations

#### Backend Deployment (e.g., Heroku, AWS, DigitalOcean)

1. **Set environment variables in production**
2. **Use production MongoDB (Atlas recommended)**
3. **Enable HTTPS**
4. **Configure CORS for production domain**
5. **Use PM2 for process management:**

```bash
npm install -g pm2
pm2 start server.js --name timetable-backend
pm2 startup
pm2 save
```

#### Frontend Deployment (e.g., Vercel, Netlify)

```bash
cd frontend
npm run build
# Deploy dist/ folder
```

Update VITE_API_BASE_URL to production backend URL.

#### Scheduler Deployment

Use Docker for Python scheduler:

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Commit with descriptive messages**
   ```bash
   git commit -m "Add: New feature description"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

### Code Style Guidelines

- Use **meaningful variable names**
- Follow **ESLint rules** for JavaScript
- Follow **PEP 8** for Python
- Write **clear comments** for complex logic
- Keep functions **small and focused**
- Use **async/await** instead of callbacks

### Commit Message Convention

- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Modify existing feature
- `Refactor:` Code restructuring
- `Docs:` Documentation changes
- `Style:` Code formatting

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Sayoun Parui

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact & Support

**Author:** Sayoun Parui  
**GitHub:** [@SAYOUNCDR](https://github.com/SAYOUNCDR)  
**Repository:** [auto-timetable](https://github.com/SAYOUNCDR/auto-timetable)

### Getting Help

- **GitHub Issues:** Report bugs or request features
- **Documentation:** Refer to this document
- **Code Comments:** Check inline documentation

---

## 🙏 Acknowledgments

- **Google OR-Tools** for constraint programming solver
- **MongoDB** for flexible database solution
- **React Team** for excellent frontend framework
- **FastAPI** for high-performance Python API
- **Tailwind CSS** for utility-first styling
- **Open Source Community** for amazing libraries

---

## 📈 Future Enhancements

### Planned Features

- [ ] Email notifications for schedule updates
- [ ] PDF/Excel export functionality
- [ ] Multi-semester management
- [ ] Faculty workload analytics
- [ ] Room utilization statistics
- [ ] Mobile responsive design improvements
- [ ] Dark mode support
- [ ] Real-time collaboration
- [ ] Automated conflict resolution suggestions
- [ ] Integration with LMS platforms

### Performance Improvements

- [ ] Caching layer (Redis)
- [ ] Database indexing optimization
- [ ] GraphQL API option
- [ ] Lazy loading for large datasets
- [ ] WebSocket for real-time updates

---

## 📊 Project Statistics

- **Total Lines of Code:** ~5000+
- **Backend APIs:** 15+
- **Frontend Components:** 20+
- **Database Models:** 7
- **Supported Constraints:** 10+
- **Average Schedule Generation:** <5 seconds

---

**Last Updated:** December 8, 2025  
**Documentation Version:** 1.0.0

---

_This documentation is maintained as part of the TimeTable Management & Generation System project. For the latest updates, please refer to the GitHub repository._
