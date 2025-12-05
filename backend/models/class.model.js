const e = require("express");
const { Schema, model } = require("mongoose");

const classSchema = new Schema({
  className: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Classroom", "Laboratory"],
  },
});

const Class = model("Class", classSchema);

module.exports = Class;
