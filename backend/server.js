const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017", { dbName: "timetable" })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Timetable API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
