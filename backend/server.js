const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connection");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load environment variables
dotenv.config();


// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// Connect to MongoDB
connectDB();

// Basic test route
app.get("/", (req, res) => {
  res.send("Auto Timetable API is running...");
});

app.post("/api/test", (req, res) => {
  const { message } = req.body;
  res.json({ receivedMessage: message });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
