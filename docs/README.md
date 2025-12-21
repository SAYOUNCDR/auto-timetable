# Timetable Management & Generation - Quick Docs

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white)

## Landing page
<img width="1308" height="677" alt="image" src="https://github.com/user-attachments/assets/7231f9c7-e979-4566-8b92-a16065fe8de9" />



## Admin View

<img width="3600" height="2025" alt="LogTime" src="https://github.com/user-attachments/assets/7ba7dbeb-8138-4d05-a571-cc5708345326" />

<img width="3600" height="2025" alt="AdminDashboard" src="https://github.com/user-attachments/assets/ea3338da-5f4d-43e4-ba4e-53e1ea632562" />

<img width="3600" height="2025" alt="Datamanagement" src="https://github.com/user-attachments/assets/74470195-b2e5-4151-b995-0fa861b028e7" />

<img width="3600" height="2025" alt="Generator" src="https://github.com/user-attachments/assets/154c7208-eb45-4945-8624-37ac56f4bc0a" />

<img width="3600" height="2025" alt="Timet" src="https://github.com/user-attachments/assets/f140e2a5-a150-41ad-8b57-05ad7266c1ae" />

## Faculty View
<img width="1322" height="673" alt="image" src="https://github.com/user-attachments/assets/9743a986-db22-4e8c-bf4a-cdc294d9ece5" />

## Student View
<img width="1323" height="677" alt="image" src="https://github.com/user-attachments/assets/04fdc96c-5b62-4906-a3c5-483121ad0c5e" />



## 📚 Documentation

### Project Visual Guide
[![Visualize in MapMyRepo](https://mapmyrepo.vasudev.live/badge.svg)](https://mapmyrepo.vasudev.live/?user=SAYOUNCDR&repo=auto-timetable)

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
