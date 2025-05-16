const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  students: [
    {
      studentId: mongoose.Schema.Types.ObjectId,
      name: String,
      rollNo: String,
      present: Boolean
    }
  ]
});

module.exports = mongoose.model('Attendance', attendanceSchema);
