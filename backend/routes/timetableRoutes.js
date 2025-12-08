const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const timetableController = require("../controllers/timetableController");

// 1. Generate (Admin Only) - Triggers Python
router.post(
  "/generate",
  verifyToken,
  verifyAdmin,
  timetableController.generateTimetable
);

// 2. View All (Admin Only)
router.get(
  "/all",
  verifyToken,
  verifyAdmin,
  timetableController.getAllTimetable
);

// 3. View My Schedule (Teacher/Faculty)
// Note: You need to ensure your authMiddleware adds 'role' to req.user
router.get(
  "/teacher",
  verifyToken,
  (req, res, next) => {
    if (req.user.role !== "faculty")
      return res.status(403).json({ message: "Faculty only" });
    next();
  },
  timetableController.getMyTimetable
);

// 4. View My Schedule (Student)
router.get(
  "/student",
  verifyToken,
  (req, res, next) => {
    if (req.user.role !== "student")
      return res.status(403).json({ message: "Students only" });
    next();
  },
  timetableController.getStudentTimetable
);

module.exports = router;
