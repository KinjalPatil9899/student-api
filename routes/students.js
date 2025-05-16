var express = require('express');
var router = express.Router();

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/students');

// GET all students listing
router.get('/', getAllStudents);

// GET student by ID
router.get('/:studentId', getStudentById);

// POST new student
router.post('/', createStudent);

// PUT update student
router.put('/:studentId', updateStudent);

// DELETE student
router.delete('/:studentId', deleteStudent);

module.exports = router;
