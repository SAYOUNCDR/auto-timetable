# TimeTable Project - Implementation Tasks

## 🎯 Core Integration Task: Python Scheduler Microservice

### Overview

The timetable generation system requires integration between the Express.js backend and the Python FastAPI scheduler microservice. The workflow involves fetching data from MongoDB, transforming it into the required format, sending it to the Python service, receiving the generated schedule, and storing it back in the database for access by all user roles.

---

## 📋 Task Breakdown

### Task 1: Data Curation Layer (Express Backend)

**Objective:** Fetch all necessary data from MongoDB and transform it into the format expected by the Python scheduler.

**Implementation Steps:**

1. **Fetch Data from MongoDB Models:**

   - Get all `Batch` documents with populated `subjects` field
   - Get all `Faculty` documents with `qualifiedSubjects` and `unavailableTimeSlots`
   - Get all `Classroom` documents
   - Get all `Subject` documents

2. **Transform Data to Scheduler Input Format:**

   **Metadata Section:**

   ```javascript
   {
     "days_per_week": 5,
     "slots_per_day": 8,
     "slot_duration_min": 60
   }
   ```

   **Resources Section:**

   - **Rooms:** Map `Classroom` model to:

     ```javascript
     {
       "id": classroom._id,
       "capacity": classroom.capacity,
       "type": classroom.type // "Classroom" -> "lecture_hall", "Laboratory" -> "computer_lab"
     }
     ```

   - **Teachers:** Map `Faculty` model to:

     ```javascript
     {
       "id": faculty._id,
       "name": faculty.name,
       "qualified_courses": faculty.qualifiedSubjects.map(s => s._id),
       "unavailable_slots": faculty.unavailableTimeSlots // [[day, slot]]
     }
     ```

   - **Courses:** Map `Subject` model to:

     ```javascript
     {
       "id": subject._id,
       "name": subject.subjectName
     }
     ```

   - **Groups:** Map `Batch` model to:
     ```javascript
     {
       "id": batch._id,
       "name": batch.batchName,
       "student_count": batch.strength
     }
     ```

   **Requirements Section:**

   - For each subject in each batch, create requirement objects:
     ```javascript
     {
       "group_id": batch._id,
       "course_id": subject._id,
       "teacher_id": assignedFaculty._id, // Find faculty qualified for this subject
       "sessions_per_week": subject.sessionsPerWeek,
       "duration_slots": subject.type === "Practical" ? 3 : 1,
       "requires_lab": subject.requiredRoomType === "Laboratory"
     }
     ```

3. **Create Helper Functions:**

   ```javascript
   // In timetableController.js

   async function curateTimetablePayload() {
     // Fetch all data
     const batches = await Batch.find().populate("subjects");
     const faculties = await Faculty.find().populate("qualifiedSubjects");
     const classrooms = await Classroom.find();
     const subjects = await Subject.find();

     // Transform to scheduler format
     const payload = {
       metadata: {
         days_per_week: 5,
         slots_per_day: 8,
         slot_duration_min: 60,
       },
       resources: {
         rooms: transformRooms(classrooms),
         teachers: transformTeachers(faculties),
         courses: transformCourses(subjects),
         groups: transformGroups(batches),
       },
       requirements: buildRequirements(batches, faculties),
     };

     return payload;
   }
   ```

---

### Task 2: Python Microservice Communication

**Objective:** Send the curated payload to the Python FastAPI scheduler and receive the generated schedule.

**Implementation:**

1. **Install Axios (Already installed)**

2. **Create HTTP Request to Python Service:**

   ```javascript
   const axios = require("axios");

   async function callSchedulerService(payload) {
     try {
       const response = await axios.post(
         "http://localhost:8000/generate",
         payload,
         {
           headers: { "Content-Type": "application/json" },
           timeout: 30000, // 30 second timeout
         }
       );

       return response.data; // { status: "success", schedule: [...] }
     } catch (error) {
       if (error.response) {
         throw new Error(`Scheduler Error: ${error.response.data.detail}`);
       }
       throw new Error(`Scheduler Service Unavailable: ${error.message}`);
     }
   }
   ```

3. **Environment Variable:**
   Add to `.env`:
   ```env
   SCHEDULER_SERVICE_URL=http://localhost:8000
   ```

---

### Task 3: Store Schedule in Database

**Objective:** Transform the Python service response and store it in the MongoDB `Timetable` collection.

**Implementation:**

1. **Transform Scheduler Output:**

   ```javascript
   async function storeTimetableInDB(scheduleData, semester) {
     const timetableEntries = scheduleData.schedule.map((entry) => ({
       day: entry.day,
       slot: entry.slot,
       room: entry.room_id,
       faculty: entry.teacher_id,
       subject: entry.course_id,
       batch: entry.group_id,
       semester: semester,
     }));

     // Delete existing timetable for this semester
     await Timetable.deleteMany({ semester });

     // Insert new timetable
     await Timetable.insertMany(timetableEntries);

     return timetableEntries;
   }
   ```

2. **Complete Controller Method:**
   ```javascript
   exports.generateTimetable = async (req, res) => {
     try {
       const { semester } = req.body;

       // Step 1: Curate MongoDB data
       console.log("Curating timetable payload...");
       const payload = await curateTimetablePayload();

       // Step 2: Call Python microservice
       console.log("Calling scheduler microservice...");
       const scheduleResult = await callSchedulerService(payload);

       if (scheduleResult.status !== "success") {
         return res.status(400).json({
           message: "Schedule generation failed",
           error: scheduleResult.error,
         });
       }

       // Step 3: Store in MongoDB
       console.log("Storing timetable in database...");
       const timetable = await storeTimetableInDB(scheduleResult, semester);

       res.status(201).json({
         message: "Timetable generated successfully",
         count: timetable.length,
         semester: semester,
       });
     } catch (error) {
       console.error("Timetable Generation Error:", error);
       res.status(500).json({
         message: "Failed to generate timetable",
         error: error.message,
       });
     }
   };
   ```

---

### Task 4: View Endpoints for All User Roles

**Objective:** Create API endpoints for Admin, Faculty, and Students to view the generated timetable.

#### 4.1 Admin View (Full Timetable)

```javascript
// GET /api/timetable/view/all
exports.viewFullTimetable = async (req, res) => {
  try {
    const { semester } = req.query;

    const timetable = await Timetable.find({ semester })
      .populate("room", "className capacity type")
      .populate("faculty", "name email")
      .populate("subject", "subjectCode subjectName type")
      .populate("batch", "batchName strength")
      .sort({ day: 1, slot: 1 });

    res.json({
      message: "Full timetable retrieved",
      count: timetable.length,
      timetable: timetable,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching timetable", error: error.message });
  }
};
```

#### 4.2 Faculty View (Personal Schedule)

```javascript
// GET /api/timetable/view/faculty/:facultyId
exports.viewFacultyTimetable = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { semester } = req.query;

    const timetable = await Timetable.find({
      faculty: facultyId,
      semester: semester,
    })
      .populate("room", "className type")
      .populate("subject", "subjectCode subjectName")
      .populate("batch", "batchName")
      .sort({ day: 1, slot: 1 });

    res.json({
      message: "Faculty timetable retrieved",
      count: timetable.length,
      timetable: timetable,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching faculty timetable",
        error: error.message,
      });
  }
};
```

#### 4.3 Student View (Batch Schedule)

```javascript
// GET /api/timetable/view/batch/:batchId
exports.viewBatchTimetable = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { semester } = req.query;

    const timetable = await Timetable.find({
      batch: batchId,
      semester: semester,
    })
      .populate("room", "className type")
      .populate("faculty", "name")
      .populate("subject", "subjectCode subjectName type")
      .sort({ day: 1, slot: 1 });

    res.json({
      message: "Batch timetable retrieved",
      count: timetable.length,
      timetable: timetable,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching batch timetable",
        error: error.message,
      });
  }
};
```

#### 4.4 Room View (Room Schedule)

```javascript
// GET /api/timetable/view/room/:roomId
exports.viewRoomTimetable = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { semester } = req.query;

    const timetable = await Timetable.find({
      room: roomId,
      semester: semester,
    })
      .populate("faculty", "name")
      .populate("subject", "subjectCode subjectName")
      .populate("batch", "batchName")
      .sort({ day: 1, slot: 1 });

    res.json({
      message: "Room timetable retrieved",
      count: timetable.length,
      timetable: timetable,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching room timetable", error: error.message });
  }
};
```

---

### Task 5: Update Routes

**File:** `routes/timetableRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetableController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { verifyAdmin } = require("../middlewares/roleMiddleware");

// Generate timetable (Admin only)
router.post(
  "/generate",
  verifyToken,
  verifyAdmin,
  timetableController.generateTimetable
);

// View endpoints
router.get(
  "/view/all",
  verifyToken,
  verifyAdmin,
  timetableController.viewFullTimetable
);
router.get(
  "/view/faculty/:facultyId",
  verifyToken,
  timetableController.viewFacultyTimetable
);
router.get(
  "/view/batch/:batchId",
  verifyToken,
  timetableController.viewBatchTimetable
);
router.get(
  "/view/room/:roomId",
  verifyToken,
  timetableController.viewRoomTimetable
);

module.exports = router;
```

---

## 🔄 Complete Workflow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Admin Triggers Timetable Generation                          │
│    POST /api/timetable/generate                                  │
│    Body: { "semester": "Fall 2024" }                            │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Express Backend: Data Curation                               │
│    • Fetch: Batches, Faculty, Classrooms, Subjects             │
│    • Transform: MongoDB models → Scheduler input format         │
│    • Build: metadata, resources, requirements                   │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. HTTP Request to Python Microservice                          │
│    POST http://localhost:8000/generate                          │
│    Payload: { metadata, resources, requirements }               │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Python FastAPI: Schedule Generation (OR-Tools)               │
│    • Parse input data                                            │
│    • Apply constraints                                           │
│    • Solve CSP problem                                           │
│    • Return: { status: "success", schedule: [...] }            │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Express Backend: Store Results                               │
│    • Transform: Scheduler output → Timetable model format       │
│    • Delete: Old semester timetable                             │
│    • Insert: New timetable entries                              │
│    • Response: Success message                                   │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Users View Timetable                                          │
│    • Admin: GET /api/timetable/view/all?semester=Fall2024      │
│    • Faculty: GET /api/timetable/view/faculty/:id               │
│    • Student: GET /api/timetable/view/batch/:id                 │
│    • Room: GET /api/timetable/view/room/:id                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Checklist

### Backend (Express.js)

- [ ] Create data curation function (`curateTimetablePayload`)
- [ ] Create transformation helper functions:
  - [ ] `transformRooms(classrooms)`
  - [ ] `transformTeachers(faculties)`
  - [ ] `transformCourses(subjects)`
  - [ ] `transformGroups(batches)`
  - [ ] `buildRequirements(batches, faculties)`
- [ ] Create Python service caller (`callSchedulerService`)
- [ ] Create database storage function (`storeTimetableInDB`)
- [ ] Implement `generateTimetable` controller
- [ ] Implement view controllers:
  - [ ] `viewFullTimetable` (Admin)
  - [ ] `viewFacultyTimetable` (Faculty)
  - [ ] `viewBatchTimetable` (Student)
  - [ ] `viewRoomTimetable` (Admin)
- [ ] Update `timetableRoutes.js`
- [ ] Add `SCHEDULER_SERVICE_URL` to `.env`
- [ ] Test with mock data

### Python Microservice

- [ ] Ensure FastAPI service is running
- [ ] Verify `/generate` endpoint works
- [ ] Test with sample payload
- [ ] Handle error responses

### Testing

- [ ] Test complete workflow end-to-end
- [ ] Test error scenarios (service down, invalid data)
- [ ] Test with multiple batches and faculties
- [ ] Verify constraints are respected
- [ ] Test view endpoints for all roles

### Frontend (Future)

- [ ] Create timetable generation UI (Admin)
- [ ] Create timetable view component
- [ ] Display schedule in grid format
- [ ] Filter by week/day
- [ ] Export to PDF/Excel

---

## 🚨 Error Handling

### Common Issues and Solutions

1. **Python Service Unavailable**

   - Error: `ECONNREFUSED`
   - Solution: Ensure `uvicorn main:app` is running on port 8000

2. **No Solution Found**

   - Error: `400: No solution found (Constraints too tight)`
   - Solution: Check room capacities, faculty availability, reduce sessions

3. **Invalid Data Format**

   - Error: `422 Unprocessable Entity`
   - Solution: Validate payload structure matches schema

4. **Database Connection Issues**
   - Error: `MongoError`
   - Solution: Check MongoDB connection, verify models are populated

---

## 📝 Testing Example

```bash
# 1. Start Python service
cd scheduler_core
uvicorn main:app --reload

# 2. Start Express backend
cd backend
npm run dev

# 3. Create admin and login (get JWT token)

# 4. Generate timetable
curl -X POST http://localhost:5000/api/timetable/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "semester": "Fall 2024"
  }'

# 5. View as admin
curl http://localhost:5000/api/timetable/view/all?semester=Fall2024 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 6. View as faculty
curl http://localhost:5000/api/timetable/view/faculty/FACULTY_ID?semester=Fall2024 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 7. View as student
curl http://localhost:5000/api/timetable/view/batch/BATCH_ID?semester=Fall2024 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 Priority Order

1. **High Priority:**

   - Data curation layer
   - Python service integration
   - Database storage
   - Basic view endpoints

2. **Medium Priority:**

   - Error handling improvements
   - Input validation
   - Logging

3. **Low Priority:**
   - Performance optimization
   - Caching
   - Advanced filtering

---

**Last Updated:** December 8, 2025  
**Status:** Implementation Pending
