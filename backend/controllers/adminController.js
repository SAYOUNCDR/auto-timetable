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

    const safeFaculty = {
      _id: faculty._id,
      name: faculty.name,
      email: faculty.email,
      maxClassesPerDay: faculty.maxClassesPerDay,
      qualifiedSubjects: faculty.qualifiedSubjects,
      unavailableTimeSlots: faculty.unavailableTimeSlots,
      role: faculty.role,
    };
    res.status(201).json(safeFaculty);
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

    const safeStudent = {
      _id: student._id,
      name: student.name,
      email: student.email,
      batch: student.batch,
      role: student.role,
    };
    res.status(201).json(safeStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json(classrooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Get all batches
exports.getAllBatches = async (req, res) => {
  try {
    // Populate subjects to show curriculum details if needed
    const batches = await Batch.find().populate("subjects");
    res.status(200).json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("batch", "batchName");
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 9. Get all faculties
exports.getAllFaculties = async (req, res) => {
  try {
    // Exclude password from the result
    const faculties = await Faculty.find()
      .select("-hashedPassword")
      .populate("qualifiedSubjects", "subjectName subjectCode");
    res.status(200).json(faculties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 10. Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-hashedPassword")
      .populate("batch", "batchName");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update controllers
// Classroom
exports.updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClassroom = await Classroom.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedClassroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.json(updatedClassroom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    // If updating password, hash it first (logic omitted for brevity, assume separate route or handle here)
    if (req.body.password) {
      req.body.hashedPassword = await bcrypt.hash(req.body.password, 10);
      delete req.body.password;
    }
    const updatedFaculty = await Faculty.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-hashedPassword");
    if (!updatedFaculty)
      return res.status(404).json({ message: "Faculty not found" });
    res.json(updatedFaculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.password) {
      req.body.hashedPassword = await bcrypt.hash(req.body.password, 10);
      delete req.body.password;
    }
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-hashedPassword");
    if (!updatedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Batch
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBatch = await Batch.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBatch)
      return res.status(404).json({ message: "Batch not found" });
    res.json(updatedBatch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSubject)
      return res.status(404).json({ message: "Subject not found" });
    res.json(updatedSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Delete controllers
exports.deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClassroom = await Classroom.findByIdAndDelete(id);
    if (!deletedClassroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.json({ message: "Classroom deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBatch = await Batch.findByIdAndDelete(id);
    if (!deletedBatch)
      return res.status(404).json({ message: "Batch not found" });
    res.json({ message: "Batch deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject)
      return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFaculty = await Faculty.findByIdAndDelete(id);
    if (!deletedFaculty)
      return res.status(404).json({ message: "Faculty not found" });
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
