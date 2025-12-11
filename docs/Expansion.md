# 🚀 Next Phase Implementation Roadmap

**Smart Classroom & Timetable Scheduler**

This document outlines the next milestones to evolve the current production-grade TimeTable Management System into a full-fledged Smart Classroom Platform — focusing on advanced functionality, scalability, and intelligence.

---

## 🧭 OVERVIEW

### Current Milestone Achieved

✅ **Stable Core**:

- Secure Dual-Token Auth (Access + Refresh)
- HttpOnly Cookie-based refresh system
- Full Role-Based Access Control (RBAC)
- Microservice architecture (Node.js + FastAPI + OR-Tools)
- MVC separation + clean route/controller structure
- Seeded relational data (Faculty, Students, Batches, Timetables)
- Admin Dashboard visualization (backend view)
- API Documentation, Contribution Guide, License
- Frontend base setup (React 19 + Vite + Tailwind)

---

## 📋 RECOMMENDED IMPLEMENTATION SEQUENCE

1.  **Finish Phase 1 Backend**: Implement the missing "Dashboard Stats" API.
2.  **Phase 1 Frontend**: Build the React Admin, Teacher, and Student dashboards consuming existing APIs.
3.  **Phase 2 Full Stack**: Implement Real-Time Notifications (Socket.IO + Frontend).
4.  **Phase 3 Full Stack**: Implement Attendance Module.
5.  **Phase 4 Full Stack**: Implement Assignments Module.

---

## 🧱 PHASE 1: Role-Based Dashboards (Frontend + API Integration)

### 🎯 Objective

Deliver **distinct dashboards** for Admin, Teacher, and Student roles, integrated with the backend APIs.

### 🧩 Tasks

- **Admin Dashboard**

  - [x] **Backend**: API to fetch all timetables (`GET /api/timetable/all`).
  - [x] **Backend**: API to generate timetable (`POST /api/timetable/generate`).
  - [ ] **Backend**: API for dashboard stats (total teachers, students, subjects, etc.).
  - [ ] **Frontend**: Fetch and display all timetables, batches, teachers, and subjects.
  - [ ] **Frontend**: Add stats cards.
  - [ ] **Frontend**: Add “Generate Timetable” and “Regenerate” buttons.

- **Teacher Dashboard**

  - [x] **Backend**: API to fetch timetable filtered by `teacherId` (`GET /api/timetable/teacher`).
  - [ ] **Frontend**: Display daily and weekly schedule.
  - [ ] **Frontend**: Add attendance marking functionality (UI only initially).

- **Student Dashboard**

  - [x] **Backend**: API to fetch timetable filtered by `batchId` (`GET /api/timetable/student`).
  - [ ] **Frontend**: Display personal schedule in calendar layout.
  - [ ] **Frontend**: Add upcoming class reminder (client-side timer).

- **Common Components**
  - [ ] **Frontend**: Navbar with dynamic options per role.
  - [ ] **Frontend**: Global loader + error handling components.

---

## 🔔 PHASE 2: Real-Time Notification System

### 🎯 Objective

Introduce a live notification mechanism for timetable updates, announcements, and attendance actions.

### 🧩 Tasks

- [ ] **Backend**: Integrate **Socket.IO** (Node.js).
- [ ] **Backend**: Create `notifications` model:
  ```javascript
  {
    message: String,
    type: 'info' | 'timetable' | 'announcement' | 'attendance',
    role: 'teacher' | 'student' | 'admin',
    receiverId: ObjectId,
    isRead: Boolean,
    timestamp: Date
  }
  ```
- [ ] **Backend**: Emit notifications on timetable generation, attendance, announcements.
- [ ] **Frontend**: Implement notification bell and real-time update badge.

---

## 🕓 PHASE 3: Attendance Management Module

### 🎯 Objective

Empower teachers to mark attendance directly from their timetable interface and enable analytics for admin/students.

### 🧩 Tasks

- [ ] **Backend**: Create `attendance` model:
  ```javascript
  {
    date: Date,
    batchId: ObjectId,
    subjectId: ObjectId,
    teacherId: ObjectId,
    studentRecords: [{ studentId: ObjectId, status: 'Present' | 'Absent' }]
  }
  ```
- [ ] **Backend**: Create APIs (`POST /attendance/mark`, `GET /attendance/batch/:id`, `GET /attendance/student/:id`).
- [ ] **Frontend**: Add “Mark Attendance” modal in Teacher Dashboard.
- [ ] **Frontend**: Show attendance percentage in Admin/Student Dashboards.

---

## 📚 PHASE 4: Assignment & Resource Sharing Module

### 🎯 Objective

Introduce a learning-support system where teachers can upload materials and assignments.

### 🧩 Tasks

- [ ] **Backend**: Create `assignments` model.
- [ ] **Backend**: Create APIs (`POST /assignments`, `GET /assignments/:batchId`).
- [ ] **Frontend**: Teacher upload UI and Student view/submit UI.

---

## 📅 PHASE 5: Timetable Intelligence & Optimization

### 🎯 Objective

Enhance the scheduling engine to adapt dynamically to changes, optimize time/space utilization, and support complex institutional structures.

### 🧩 Tasks

- [ ] **Advanced Scheduling Constraints**:
  - **Multi-Shift Support**: Update `Batch` model to include `shift` (Morning/Evening) and filter slots accordingly.
  - **Multi-Department Support**: Add `Department` model and link Batches/Faculty to ensure resource isolation where needed.
- [ ] **Smart Generation Features**:
  - **Multiple Options**: Update Python service to return top 3 valid schedules instead of just one.
  - **Conflict Suggestions**: If generation fails, return "partial solutions" or suggest specific constraint relaxations (e.g., "Teacher X is the bottleneck").
- [ ] **Backend**: Update `POST /generate` to handle "draft" responses.
- [ ] **Frontend**: UI to compare multiple generated options side-by-side.

---

## 🧾 PHASE 6: Approval Workflow & Versioning

### 🎯 Objective

Implement a formal review process where timetables must be approved by authorities before becoming active.

### 🧩 Tasks

- [ ] **Approval Workflow**:
  - Add `status` field to Timetable (`Draft`, `Pending_Approval`, `Published`).
  - Create `POST /timetable/submit-for-review` and `POST /timetable/approve`.
  - **Role-Based Actions**: Only Admins/HODs can "Approve".
- [ ] **Versioning**:
  - Create `timetable_history` model to archive previous approved versions.
  - API to restore previous versions (`POST /timetable/restore/:version`).
- [ ] **Frontend**:
  - "Review Queue" for Admins.
  - Visual diff tool to see changes between Draft and Current Live version.

---

## 📊 PHASE 7: Data Analytics & Visualization

### 🎯 Objective

Provide actionable insights into usage, attendance, and scheduling metrics.

### 🧩 Tasks

- [ ] **Backend**: Create aggregation routes (`/analytics/teacher-load`, etc.).
- [ ] **Frontend**: Implement charts (Recharts) for workload, subject frequency, attendance.

---

## 🌐 PHASE 8: Calendar & External Integrations

### 🎯 Objective

Make the platform interoperable with calendar tools and external systems.

### 🧩 Tasks

- [ ] **Backend**: Google Calendar API Integration.
- [ ] **Backend**: iCal (.ics) file export.
- [ ] **Backend**: Email notifications (Nodemailer).

---

## 🧰 PHASE 9: System & Infrastructure Improvements

### 🎯 Objective

Enhance system reliability, scalability, and maintainability.

### 🧩 Tasks

- [ ] **DevOps**: Docker Compose environment (Frontend + Backend + FastAPI + DB).
- [ ] **DevOps**: Nginx reverse proxy & HTTPS.
- [ ] **Backend**: Add request logging middleware (Morgan/Winston).
- [ ] **Testing**: Setup Jest unit testing.
- [ ] **CI/CD**: Implement GitHub Actions.

---

## 📘 PHASE 10: Documentation & Presentation Polish

### 🎯 Objective

Make the project fully presentation and open-source ready.

### 🧩 Tasks

- [ ] **Docs**: Update README.md with architecture diagrams.
- [ ] **Docs**: Add API examples (curl/Postman).
- [ ] **Demo**: Create demo dataset and record video.

---

## ✅ PRIORITY TRACKER

| Phase | Feature                 | Priority    | Status         |
| :---- | :---------------------- | :---------- | :------------- |
| 1     | Role-Based Dashboards   | 🔥 High     | 🚧 In Progress |
| 2     | Real-Time Notifications | 🔥 High     | ⏳ Pending     |
| 3     | Attendance Module       | ⚙️ Medium   | 🔜 Planned     |
| 4     | Assignments/Resources   | ⚙️ Medium   | 🔜 Planned     |
| 5     | Timetable Optimization  | ⚡ High     | 🔜 Planned     |
| 6     | Versioning & Logs       | ⚙️ Medium   | 🔜 Planned     |
| 7     | Analytics & Charts      | ⚙️ Medium   | 🔜 Planned     |
| 8     | Calendar Integration    | 💡 Low      | 🔜 Planned     |
| 9     | Infrastructure & CI/CD  | ⚡ High     | 🔜 Planned     |
| 10    | Documentation & Demo    | ✅ Critical | 🔜 Planned     |

---

## 💬 Notes

- Maintain strict separation of concerns across Node.js and FastAPI microservices.
- Implement all new features under `/api/v2/` namespace for backward compatibility.
- Prefer `async/await` with proper error boundaries in all controllers.
- Use TypeScript refactor progressively on backend for better type safety.

### 🧩 Future Stretch Goals

- AI-powered class rearrangement assistant (suggest better scheduling patterns).
- Integration with Learning Management Systems (LMS).
- Add PWA offline access for timetable viewing.
- Add Dark/Light mode toggle in frontend.
