# Timetable Management & Generation - Quick Docs

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white)

## 📚 Documentation

For detailed API usage, testing workflows, and data insertion guides, please refer to the **[API Documentation](./API-Documentation.md)**.

### Quick Links

- [API Reference](./API-Documentation.md#api-reference)
- [Data Seeding Guide](./API-Documentation.md#data-seeding-guide-postman)
- [Testing Workflow](./API-Documentation.md#end-to-end-testing-workflow)

---

## 🎯 Project Overview

The **TimeTable Management & Generation System** is a sophisticated full-stack application designed to automate the complex process of academic scheduling. By leveraging AI-powered constraint programming (Google OR-Tools), it generates conflict-free timetables that respect resource availability, faculty constraints, and curriculum requirements.

### Key Features

- **Automated Scheduling**: AI-driven generation of conflict-free timetables.
- **Role-Based Access**: Distinct portals for Admins, Faculty, and Students.
- **Resource Management**: Comprehensive management of Classrooms, Labs, Subjects, and Batches.
- **Constraint Handling**: Respects faculty unavailability, room capacities, and load limits.
- **Modern UI/UX**: Responsive React frontend with intuitive dashboards.

---

## 🛠 Tech Stack

| Component     | Technology                       | Description                           |
| ------------- | -------------------------------- | ------------------------------------- |
| **Frontend**  | React 19, Vite, Tailwind CSS     | Fast, responsive user interface       |
| **Backend**   | Node.js, Express 5               | RESTful API architecture              |
| **Database**  | MongoDB, Mongoose                | Flexible document storage             |
| **AI Engine** | Python, FastAPI, Google OR-Tools | Constraint satisfaction solver        |
| **Auth**      | JWT, bcrypt                      | Secure authentication & authorization |

---

## 🏗 Architecture

The system follows a microservices-inspired architecture:

1.  **Client Layer**: React SPA interacting with the Backend API.
2.  **API Layer**: Express.js server handling business logic, auth, and data persistence.
3.  **Scheduler Service**: Python FastAPI service dedicated to heavy computational scheduling tasks.
4.  **Data Layer**: MongoDB storing all institutional data and generated schedules.

---

## 🚀 Installation & Setup Guide

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB (Local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install

# Configure Environment
# Create .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# SCHEDULER_URL=http://localhost:8000

npm start
```

### 2. Scheduler Core Setup

```bash
cd scheduler_core
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
