const { Schema, model } = require("mongoose");

const facultySchema = new Schema({
  facultyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  maxClassesPerDay: {
    type: Number,
    required: true,
  },
  qualifiedSubjects: [
    {
      type: String,
      required: true,
    },
  ],
});
