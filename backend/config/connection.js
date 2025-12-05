const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "timetable_db",
      maxPoolSize: 10, // number of concurrent connections in the pool
      serverSelectionTimeoutMS: 5000, // fail fast if DB not reachable
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB connection error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;
