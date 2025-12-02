// server/routes/students.js
const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentByEmail
} = require('../controllers/studentController');

router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/by-email', getStudentByEmail);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;