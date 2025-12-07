const Faculty = require("../models/faculty.model");
const Student = require("../models/student.model");
const Subject = require("../models/subject.model");
const Batch = require("../models/batch.model");
const Classroom = require("../models/class.model");
const bcrypt = require("bcrypt");

// 1. Create classroom
exports.createClassroom = async (req, res) => {
  try {
    const { className, capacity, type } = req.body;
    const rooom = await Classroom.create({ className, capacity, type });
    res.status(201).json({ message: "Classroom created successfully", rooom });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. Create batch
exports.createBatch = async (req, res) => {
  try {
    const { batchName, strength, yearOfStudy } = req.body;
    // Subjects are initially empty, filled when we create subjects
    const batch = await Batch.create({ batchName, strength, yearOfStudy });
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Create subject
exports.createSubject = async (req, res) => {
  try {
    const {
      subjectCode,
      subjectName,
      sessionsPerWeek,
      type,
      batchName,
      requiredRoomType,
    } = req.body;

    // Find linked batch
    const batch = await Batch.findOne({ batchName });
    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      sessionsPerWeek,
      type,
      requiredRoomType,
      batch: batch._id,
    });

    // Update batch to include this subject
    batch.subjects.push(subject._id);
    await batch.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Create faculty
exports.createFaculty = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      maxClassesPerDay,
      qualifiedSubjectCodes,
      unavailableTimeSlots,
    } = req.body;

    // Convert subject codes (e.g., ["CSE101"]) to ObjectIds
    let qualifiedSubjects = [];
    if (qualifiedSubjectCodes && qualifiedSubjectCodes.length > 0) {
      const subjects = await Subject.find({
        subjectCode: { $in: qualifiedSubjectCodes },
      });
      qualifiedSubjects = subjects.map((s) => s._id);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = await Faculty.create({
      name,
      email,
      hashedPassword,
      maxClassesPerDay,
      qualifiedSubjects,
      unavailableTimeSlots,
    });

    res.status(201).json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 5. Create student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, batchName } = req.body;

    const batch = await Batch.findOne({ batchName });
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name,
      email,
      hashedPassword,
      batch: batch._id,
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};