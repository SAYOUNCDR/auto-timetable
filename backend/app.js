const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Route files
const devRoutes = require("./routes/devRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(cookieParser()); // To parse cookies
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
  })
);

const path = require("path"); // this will be reomve later when frontend is ready

// Routes
app.use("/api/dev", devRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve the simple admin view - this is temporary until frontend is ready
app.get("/view/admin-timetable", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin_timetable.html"));
});

app.get("/", (req, res) => {
  res.json({ message: "Backend is healthy and running fine" });
});

module.exports = app;
