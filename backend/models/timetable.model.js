const mongoose = require("mongoose");
const Faculty = require("./faculty.model");
const Batch = require("./batch.model");

const timetableSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true }, // 0=Mon, 1=Tue...
    slot: { type: Number, required: true }, // 0=9am 1=10am...

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    semester: { type: String },
  },
  { timestamps: true }
);

const Timetable = mongoose.model("Timetable", timetableSchema);
module.exports = Timetable;
