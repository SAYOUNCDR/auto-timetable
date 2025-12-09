const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Endpoint: POST /api/auth/login
router.post("/login", authController.login);

// Endpoint: POST /api/auth/refresh
router.post("/refresh", authController.refresh);

// Endpoint: POST /api/auth/logout
router.post("/logout", authController.logout);

module.exports = router;
