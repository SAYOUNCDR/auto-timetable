const axios = require("axios");
const Timetable = require("../models/timetable.model");
const Batch = require("../models/batch.model");
const Faculty = require("../models/faculty.model");
const Classroom = require("../models/class.model");
const Subject = require("../models/subject.model");
const Student = require("../models/student.model");

// Transform MongoDB Docs to Python Input Format

const preparePythonPayload = async () => {
  const batches = await Batch.find().populate("subjects");
  const faculty = await Faculty.find().populate("qualifiedSubjects");
  const rooms = await Classroom.find();

  // map rooms
  const resources_rooms = rooms.map((r) => ({
    id: r._id.toString(),
    capacity: r.capacity,
    type: r.type === "Laboratory" ? "computer_lab" : "lecture_hall",
  }));

  // map teachers
  const resources_teachers = faculty.map((f) => ({
    id: f._id.toString(),
    name: f.name,
    qualified_courses: f.qualifiedSubjects.map((s) => s._id.toString()),
    unavailable_slots: f.unavailableTimeSlots || [], // Ensure array exists
  }));

  // 4. Map Groups (Batches)
  const resources_groups = batches.map((b) => ({
    id: b._id.toString(),
    student_count: b.strength,
  }));

  // 5. Map Courses (Subjects) & Generate Requirements
  // We need to list every unique subject ID used
  const uniqueSubjectIds = new Set();
  const requirements = [];

  // Logic: Iterate every batch, look at its subjects, and assign a teacher
  for (const batch of batches) {
    for (const subject of batch.subjects) {
      uniqueSubjectIds.add(subject);

      // FIND A TEACHER: In a real app, Admin assigns this.
      // Here, we auto-assign the first Faculty qualified for this subject.
      const qualifiedTeacher = faculty.find((f) =>
        f.qualifiedSubjects.some((qs) => {
          // qs could be ObjectId or populated object, handle both
          const qsId = qs._id ? qs._id.toString() : qs.toString();
          return qsId === subject._id.toString();
        })
      );

      if (!qualifiedTeacher) {
        console.warn(
          `WARNING: No teacher found for ${subject.subjectName} in batch ${batch.batchName}`
        );
        continue; // Skip impossible requirement
      }

      requirements.push({
        group_id: batch._id.toString(),
        teacher_id: qualifiedTeacher._id.toString(),
        course_id: subject._id.toString(),
        duration_slots: subject.type === "Practical" ? 3 : 1, // 3 hours for labs, 1 for theory
        sessions_per_week: subject.sessionsPerWeek,
        requires_lab: subject.type === "Practical",
      });
    }
  }

  // Convert Set of subjects to List for Python
  const resources_courses = Array.from(uniqueSubjectIds).map((s) => ({
    id: s._id.toString(),
    name: s.subjectName,
  }));

  return {
    metadata: { days_per_week: 5, slots_per_day: 6 }, // Customize as needed
    resources: {
      rooms: resources_rooms,
      teachers: resources_teachers,
      groups: resources_groups,
      courses: resources_courses,
    },
    requirements: requirements,
  };
};

// Controller to Generate Timetable
exports.generateTimetable = async (req, res) => {
  try {
    console.log("Preparing data for AI Engine...");
    const payload = await preparePythonPayload();

    console.log("Sending data to Python Service...");
    // Call Python Microservice
    const pythonResponse = await axios.post(
      "http://localhost:8000/generate",
      payload
    );

    if (pythonResponse.data.status !== "success") {
      return res
        .status(400)
        .json({ message: "AI Engine failed to find solution" });
    }

    const generatedSchedule = pythonResponse.data.schedule;

    // Clear old timetable
    await Timetable.deleteMany({});

    // Transform Python result back to Mongoose Documents
    const newEntries = generatedSchedule.map((entry) => ({
      day: entry.day,
      slot: entry.slot,
      room: entry.room_id, // Python returns the ID string we sent
      faculty: entry.teacher_id,
      subject: entry.course_id,
      batch: entry.group_id,
    }));

    // Bulk Insert
    await Timetable.insertMany(newEntries);

    res.json({
      message: "Timetable generated and saved successfully",
      count: newEntries.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Generation failed", details: err.message });
  }
};

// Controller to Fetch Timetable

// 1. Get all (for admin)
exports.getAllTimetable = async (req, res) => {
  try {
    const table = await Timetable.find()
      .populate("room", "className")
      .populate("faculty", "name")
      .populate("subject", "subjectName subjectCode")
      .populate("batch", "batchName")
      .sort({ day: 1, slot: 1 });
    res.json(table);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch timetable", details: err.message });
  }
};

// 2. Get For Logged In Teacher
exports.getMyTimetable = async (req, res) => {
  try {
    // req.user.id comes from Auth Middleware
    const table = await Timetable.find({ faculty: req.user.id })
      .populate("room", "className")
      .populate("subject", "subjectName subjectCode")
      .populate("batch", "batchName")
      .sort({ day: 1, slot: 1 });
    res.json(table);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch timetable", details: err.message });
  }
};

// 3. Get For Logged In Student
exports.getStudentTimetable = async (req, res) => {
  try {
    const studentId = req.user.id;

    // First find which batch the student is in
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const table = await Timetable.find({ batch: student.batch })
      .populate("room", "className")
      .populate("subject", "subjectName subjectCode")
      .populate("faculty", "name")
      .sort({ day: 1, slot: 1 });

    res.json(table);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch timetable", details: err.message });
  }
};
