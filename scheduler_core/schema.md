
### 1\. Conceptual Model (Entity Relationships)

Before looking at the code, team needs to understand how these entities interact. The `Requirement` object is the "glue" that binds a Student Group, a Teacher, and a Course together into a schedulable event.

-----

### 2\. The JSON Schema Structure



#### Root Object

The payload must contain three main keys: `metadata`, `resources`, and `requirements`.

```json
{
  "metadata": {
    "days_per_week": 5,       // Integer: Total teaching days (e.g., 5 for Mon-Fri)
    "slots_per_day": 8,       // Integer: Total slots per day (e.g., 8 hours)
    "slot_duration_min": 60   // Integer: Duration of one slot in minutes (Visual only)
  },
  
  "resources": {
    "rooms":    [ /* Array of Room Objects */ ],
    "teachers": [ /* Array of Teacher Objects */ ],
    "courses":  [ /* Array of Course Objects */ ],
    "groups":   [ /* Array of Student Group Objects */ ]
  },

  "requirements": [ /* Array of Scheduling Request Objects */ ]
}
```

-----

### 3\. Detailed Field Definitions

#### A. Resources: Rooms

Defines the physical spaces available.

```json
{
  "id": "R_101",          // String (Unique): The key used to reference this room.
  "capacity": 60,         // Integer: Max students allowed.
  "type": "lecture_hall"  // String: "lecture_hall" or "computer_lab" (Used for matching).
}
```

#### B. Resources: Teachers

Defines faculty members and their constraints.

```json
{
  "id": "T_SMITH",        // String (Unique).
  "name": "Prof. Smith",  // String: Display name.
  "qualified_courses": [  // Array<String>: List of Course IDs this teacher can teach.
    "MATH101", 
    "CS_102"
  ],
  "unavailable_slots": [  // Array<[Day, Slot]>: Time blocks the teacher CANNOT work.
    [0, 0],               // Cannot work Monday (Day 0) at 9AM (Slot 0)
    [2, 7]                // Cannot work Wednesday (Day 2) at 4PM (Slot 7)
  ]
}
```

#### C. Resources: Student Groups

Defines a batch of students who move together (e.g., "Semester 3 - Section A").

```json
{
  "id": "BATCH_A",        // String (Unique).
  "name": "Year 2 Sec A", // String: Display name.
  "student_count": 50     // Integer: Used to ensure Room Capacity >= Group Size.
}
```

#### D. Requirements ( The Workload )

This is the most critical part. It tells the AI **what** needs to be scheduled.

```json
{
  "group_id": "BATCH_A",     // String: Reference to a Group ID.
  "course_id": "MATH101",    // String: Reference to a Course ID.
  "teacher_id": "T_SMITH",   // String: Reference to a Teacher ID.
  
  "sessions_per_week": 3,    // Integer: How many DISTINCT sessions to schedule.
                             // Example: If 3, the AI creates 3 separate events.

  "duration_slots": 1,       // Integer: Length of ONE session.
                             // 1 = Standard Lecture (1 hour)
                             // 3 = Lab Session (3 consecutive hours)

  "requires_lab": false      // Boolean: If true, AI only assigns rooms with type="computer_lab".
}
```

-----

### 4\. Full Example Payload (Copy-Paste for Team)

This example includes a **Lecture** (1 hr) and a **Lab** (3 hrs contiguous) to demonstrate complex logic.

```json
{
  "metadata": {
    "days_per_week": 5,
    "slots_per_day": 8,
    "slot_duration_min": 60
  },
  "resources": {
    "rooms": [
      { "id": "HALL_A", "capacity": 60, "type": "lecture" },
      { "id": "LAB_1", "capacity": 30, "type": "lab" }
    ],
    "teachers": [
      { 
        "id": "T_DOE", 
        "name": "John Doe", 
        "qualified_courses": ["CS101", "CS101_LAB"], 
        "unavailable_slots": [[4, 6], [4, 7]] 
      }
    ],
    "courses": [
      { "id": "CS101", "name": "Intro to CS" },
      { "id": "CS101_LAB", "name": "CS Lab" }
    ],
    "groups": [
      { "id": "G1", "name": "Group 1", "student_count": 40 }
    ]
  },
  "requirements": [
    {
      "group_id": "G1",
      "course_id": "CS101",
      "teacher_id": "T_DOE",
      "sessions_per_week": 3,
      "duration_slots": 1,
      "requires_lab": false
    },
    {
      "group_id": "G1",
      "course_id": "CS101_LAB",
      "teacher_id": "T_DOE",
      "sessions_per_week": 1,
      "duration_slots": 3,
      "requires_lab": true
    }
  ]
}
```

### 5\. Expected Output Format

Your team should also know what the AI returns.

```json
{
  "status": "success",
  "schedule": [
    {
      "day": 0,               // Integer: 0 = Monday
      "slot": 2,              // Integer: 2 = 11:00 AM (if start is 9:00)
      "room_id": "HALL_A",
      "teacher_id": "T_DOE",
      "course_id": "CS101",
      "group_id": "G1",
      "is_start": true        // Boolean: Helpful for UI rendering of multi-slot blocks
    },
    // ... more events
  ]
}
```