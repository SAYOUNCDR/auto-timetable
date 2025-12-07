const { Schema, model, mongo } = require("mongoose");

const facultySchema = new Schema(
  {
    name: {
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
    role: {
      type: String,
      default: "faculty",
    },
    maxClassesPerDay: {
      type: Number,
      required: true,
    },
    qualifiedSubjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    unavailableTimeSlots: {
      type: [[Number]],
      default: [],
    },
  },
  { timestamps: true }
);

const Faculty = model("Faculty", facultySchema);
module.exports = Faculty;
