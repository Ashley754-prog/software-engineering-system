// server/routes/studentAuth.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const emailLower = email.toLowerCase().trim();

    const [rows] = await pool.query(
      'SELECT id, wmsu_email, password, full_name FROM students WHERE LOWER(wmsu_email) = ?',
      [emailLower]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const student = rows[0];
    const match = await bcrypt.compare(password, student.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // SUCCESS — return student info
    res.json({
      success: true,
      student: {
        id: student.id,
        email: student.wmsu_email,
        fullName: student.full_name,
        role: "student"
      }
    });

  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;