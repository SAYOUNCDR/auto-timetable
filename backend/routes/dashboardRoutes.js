const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

// Admin Dashboard Stats
router.get("/admin/data", verifyToken, verifyAdmin, dashboardController.getAdminStats);

// Student Dashboard Data
router.get("/student/data", verifyToken, dashboardController.getStudentDashboardData);

// Faculty Dashboard Data
router.get("/faculty/data", verifyToken, dashboardController.getFacultyDashboardData);

module.exports = router;