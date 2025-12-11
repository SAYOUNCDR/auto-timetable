const Student = require("../models/student.model");
const Faculty = require("../models/faculty.model");
const Batch = require("../models/batch.model");
const Classroom = require("../models/class.model");
const Subject = require("../models/subject.model");
const Timetable = require("../models/timetable.model");

exports.getAdminStats = async (req, res) => {
  try {
    const [
      studentCount,
      facultyCount,
      batchCount,
      roomCount,
      subjectCount,
      timetable,
    ] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Batch.countDocuments(),
      Classroom.countDocuments(),
      Subject.countDocuments(),
      Timetable.countDocuments(),
    ]);

    res.status(200).json({
      students: studentCount,
      faculty: facultyCount,
      batches: batchCount,
      rooms: roomCount,
      subjects: subjectCount,
      timetableEntries: timetable,
      // We'll add more stats like "conflicts detected" here later
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats", error });
  }
};

// ...existing code...
exports.getStudentDashboardData = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Fetch Student with Batch details
    const student = await Student.findById(studentId)
      .populate("batch", "batchName yearOfStudy")
      .select("-password"); // Exclude password

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Fetch all Subjects for this Batch
    // We need to find subjects where the 'batch' field matches the student's batch ID
    // Note: Your Subject model has a 'batch' field (ObjectId)
    const subjects = await Subject.find({ batch: student.batch._id });

    // 3. Fetch Assigned Teachers from Timetable
    // We want to know: For Subject X and Batch Y, who is the teacher?
    // We can aggregate this from the Timetable collection to get unique (Subject, Teacher) pairs
    const timetableEntries = await Timetable.find({ batch: student.batch._id })
      .populate("faculty", "name email")
      .populate("subject", "_id");

    // Create a map of Subject ID -> Teacher Details
    const subjectTeacherMap = {};
    timetableEntries.forEach((entry) => {
      if (entry.subject && entry.faculty) {
        subjectTeacherMap[entry.subject._id.toString()] = entry.faculty;
      }
    });

    // 4. Combine Data
    const subjectsWithTeachers = subjects.map((subject) => {
      const assignedTeacher = subjectTeacherMap[subject._id.toString()];
      return {
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        type: subject.type,
        sessionsPerWeek: subject.sessionsPerWeek,
        assignedTeacher: assignedTeacher
          ? {
              name: assignedTeacher.name,
              email: assignedTeacher.email,
            }
          : "Not Assigned Yet", // Or null
      };
    });

    res.status(200).json({
      studentProfile: {
        name: student.name,
        email: student.email,
        batch: student.batch.batchName,
        year: student.batch.yearOfStudy,
      },
      subjects: subjectsWithTeachers,
    });
  } catch (error) {
    console.error("Error fetching student dashboard data:", error);
    res
      .status(500)
      .json({ message: "Error fetching student dashboard data", error });
  }
};

// ...existing code...
exports.getFacultyDashboardData = async (req, res) => {
  try {
    const facultyId = req.user.id;

    // 1. Fetch Faculty Profile
    const faculty = await Faculty.findById(facultyId)
      .populate("qualifiedSubjects", "subjectName subjectCode")
      .select("-password");

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // 2. Get Today's Schedule
    const today = new Date().getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDayName = days[today];

    // Our system: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri
    // JS system: 1=Mon, ..., 5=Fri. So we subtract 1.
    let dayIndex = today - 1;

    let todaysClasses = [];
    if (dayIndex >= 0 && dayIndex <= 4) {
      todaysClasses = await Timetable.find({
        faculty: facultyId,
        day: dayIndex,
      })
        .populate("subject", "subjectName subjectCode type")
        .populate("batch", "batchName")
        .populate("room", "className type")
        .sort({ slot: 1 }); // Sort by time slot
    }

    // 3. Calculate Workload Stats
    // Count total slots assigned in the entire timetable
    const totalWeeklySlots = await Timetable.countDocuments({
      faculty: facultyId,
    });

    // Get unique batches they teach
    const uniqueBatches = await Timetable.distinct("batch", {
      faculty: facultyId,
    });

    // Get unique subjects they teach (from Timetable, not just qualified)
    const uniqueSubjects = await Timetable.distinct("subject", {
      faculty: facultyId,
    });

    res.status(200).json({
      meta: {
        date: new Date().toISOString().split("T")[0],
        day: currentDayName,
        isWeekend: today === 0 || today === 6,
      },
      profile: {
        name: faculty.name,
        email: faculty.email,
        maxClassesPerDay: faculty.maxClassesPerDay,
      },
      stats: {
        weeklyClasses: totalWeeklySlots,
        totalBatches: uniqueBatches.length,
        activeSubjects: uniqueSubjects.length,
      },
      todaysSchedule: todaysClasses.map((entry) => ({
        slot: entry.slot,
        time: formatTimeSlot(entry.slot),
        subject: entry.subject ? entry.subject.subjectName : "Unknown Subject",
        code: entry.subject ? entry.subject.subjectCode : "N/A",
        type: entry.subject ? entry.subject.type : "N/A",
        batch: entry.batch ? entry.batch.batchName : "Unknown Batch",
        room: entry.room ? entry.room.className : "TBD",
      })),
      qualifiedSubjects: faculty.qualifiedSubjects,
    });
  } catch (error) {
    console.error("Error fetching faculty dashboard data:", error);
    res
      .status(500)
      .json({ message: "Error fetching faculty dashboard data", error });
  }
};

// Helper function for time formatting (same as in admin view)
function formatTimeSlot(slotIndex) {
  const startHour = 9 + slotIndex; // 9 AM start
  const endHour = startHour + 1;

  const format = (h) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:00 ${ampm}`;
  };

  return `${format(startHour)} - ${format(endHour)}`;
}
