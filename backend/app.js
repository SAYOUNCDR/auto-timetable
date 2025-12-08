const express = require("express");
const app = express();
const cors = require("cors");

// Route files
const devRoutes = require("./routes/devRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const timetableRoutes = require("./routes/timetableRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/dev", devRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/timetable", timetableRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Ok server is healthy and running fine" });
});

module.exports = app;
