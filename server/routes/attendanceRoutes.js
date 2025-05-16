const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const router = express.Router();

// Save attendance
router.post('/attendance', async (req, res) => {
  try {
    const { date, className, section, students } = req.body;

    const attendance = new Attendance({
      date,
      className,
      section,
      students
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});

// Add student
router.post('/student', async (req, res) => {
  try {
    const { name, rollNo, className, section } = req.body;
    const newStudent = new Student({ name, rollNo, className, section });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Get all students grouped by class & section
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    const grouped = {};

    students.forEach(({ className, section, ...rest }) => {
      if (!grouped[className]) grouped[className] = {};
      if (!grouped[className][section]) grouped[className][section] = [];
      grouped[className][section].push(rest);
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

module.exports = router;
