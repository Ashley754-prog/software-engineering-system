// server/routes/grades.js
const express = require('express');
const router = express.Router();
const {
  updateGrades,
  getStudentWithGrades,
  getStudentGrades,
  getStudentsWithGrades
} = require('../controllers/gradeController');

router.put('/:id/grades', updateGrades);
router.get('/:id/grades', getStudentGrades); // Get specific grades for a student
router.get('/with-grades', getStudentsWithGrades); // Get all students with grades
router.get('/:id/with-grades', getStudentWithGrades); // Get single student with grades

module.exports = router;