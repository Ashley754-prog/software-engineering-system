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
router.get('/count', async (req, res) => {
  try {
    const pool = require('../config/db').pool;
    console.log('Fetching students count...');
    
    // First, let's check if the table exists and get a raw count
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM students');
    console.log('Students count result:', count);
    
    // Also get the actual student records for debugging
    const [students] = await pool.query('SELECT id, lrn, first_name, last_name FROM students LIMIT 5');
    console.log('Sample students:', students);
    
    res.json({ count });
  } catch (err) {
    console.error('Get students count error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch students count', 
      details: err.message 
    });
  }
});
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;