// server/routes/studentPortal.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get student portal data (grades + attendance + profile)
router.get('/portal', async (req, res) => {
  try {
    // Get student from token or session (assuming you have auth middleware)
    // For now, we'll assume student ID from query or body — in real app use JWT
    const studentId = req.query.studentId || req.user?.id;

    if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

    const [[student]] = await pool.query(`
      SELECT id, lrn, full_name AS fullName, grade_level AS gradeLevel, section, average, qr_code AS qrCode
      FROM students WHERE id = ?
    `, [studentId]);

    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Get grades
    const [grades] = await pool.query(`
      SELECT subject, q1, q2, q3, q4, 
             ROUND(
               (COALESCE(q1, 0) + COALESCE(q2, 0) + COALESCE(q3, 0) + COALESCE(q4, 0)) / 
               NULLIF((q1 IS NOT NULL) + (q2 IS NOT NULL) + (q3 IS NOT NULL) + (q4 IS NOT NULL), 0), 2
             ) AS average
      FROM grades WHERE student_id = ?
    `, [studentId]);

    // You can add attendance & schedule later
    // For now, mock them or create tables

    res.json({
      profile: {
        fullName: student.fullName,
        lrn: student.lrn,
        gradeLevel: student.gradeLevel,
        section: student.section,
        finalAverage: student.average || 0
      },
      grades: grades.map(g => ({
        subject: g.subject,
        q1: g.q1,
        q2: g.q2,
        q3: g.q3,
        q4: g.q4,
        average: g.average,
        remarks: g.average ? 
          (g.average >= 90 ? 'Outstanding' :
           g.average >= 85 ? 'Very Satisfactory' :
           g.average >= 80 ? 'Satisfactory' :
           g.average >= 75 ? 'Fairly Satisfactory' : 'Did Not Meet Expectations')
          : 'Pending'
      })),
      // attendance: [...],  // add later
      // schedule: [...]     // add later
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load portal' });
  }
});

module.exports = router;