const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get classes count
router.get('/count', async (req, res) => {
  try {
    // For now, we'll count unique grade-section combinations from students table
    // In a real system, you might have a dedicated classes table
    const [[{ count }]] = await pool.query(`
      SELECT COUNT(DISTINCT CONCAT(grade_level, '-', section)) as count 
      FROM students 
      WHERE grade_level IS NOT NULL AND section IS NOT NULL
    `);
    res.json({ count });
  } catch (err) {
    console.error('Get classes count error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch classes count', 
      details: err.message 
    });
  }
});

// Enroll multiple students to a teacher's class (many-to-many)
router.post('/enroll', async (req, res) => {
  try {
    const { teacherId, studentIds } = req.body;

    if (!teacherId) {
      return res.status(400).json({ error: 'teacherId is required' });
    }
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'studentIds must be a non-empty array' });
    }

    // Prepare values for bulk insert
    const values = studentIds.map((sid) => [teacherId, sid]);

    // Ensure table exists (defensive, in case createTables has not run)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS class_enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT NOT NULL,
        student_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_teacher_student (teacher_id, student_id)
      )
    `);

    // Insert, ignoring duplicates
    const [result] = await pool.query(
      'INSERT IGNORE INTO class_enrollments (teacher_id, student_id) VALUES ?',
      [values]
    );

    res.json({
      message: 'Students enrolled successfully',
      enrolledCount: result.affectedRows || 0,
    });
  } catch (err) {
    console.error('Enroll students error:', err);
    res.status(500).json({ error: 'Failed to enroll students', details: err.message });
  }
});

// Un-enroll multiple students from a teacher's class
router.post('/unenroll', async (req, res) => {
  try {
    const { teacherId, studentIds } = req.body;

    if (!teacherId) {
      return res.status(400).json({ error: 'teacherId is required' });
    }
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'studentIds must be a non-empty array' });
    }

    // Ensure table exists (defensive)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS class_enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT NOT NULL,
        student_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_teacher_student (teacher_id, student_id)
      )
    `);

    const [result] = await pool.query(
      'DELETE FROM class_enrollments WHERE teacher_id = ? AND student_id IN (?)',
      [teacherId, studentIds]
    );

    res.json({
      message: 'Students un-enrolled successfully',
      removedCount: result.affectedRows || 0,
    });
  } catch (err) {
    console.error('Un-enroll students error:', err);
    res.status(500).json({ error: 'Failed to un-enroll students', details: err.message });
  }
});

// Get enrolled student IDs for a teacher
router.get('/my-enrollments', async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({ error: 'teacherId is required' });
    }

    // Ensure table exists (defensive)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS class_enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT NOT NULL,
        student_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_teacher_student (teacher_id, student_id)
      )
    `);

    const [rows] = await pool.query(
      'SELECT student_id FROM class_enrollments WHERE teacher_id = ?',
      [teacherId]
    );

    const studentIds = rows.map((r) => r.student_id);
    res.json({ studentIds });
  } catch (err) {
    console.error('Get enrollments error:', err);
    res.status(500).json({ error: 'Failed to fetch enrollments', details: err.message });
  }
});

module.exports = router;
