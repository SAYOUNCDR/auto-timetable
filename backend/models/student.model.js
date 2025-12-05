const { Schema, model } = require('mongoose');

const studentSchema = new Schema({
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
});

const Student = model('Student', studentSchema);
module.exports = Student;