const express = require('express');
const router = express.Router();
const pool = require('../config/db').pool;

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

module.exports = router;
