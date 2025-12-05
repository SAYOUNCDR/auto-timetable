const { Schema, model } = require("mongoose");
const subjectSchema = new Schema({
  subjectCode: {
    type: String,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  sessionsPerWeek: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Theory", "Practical"],
  },
});

const Subject = model("Subject", subjectSchema);
module.exports = Subject;
