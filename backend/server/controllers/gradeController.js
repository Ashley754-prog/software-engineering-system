// server/controllers/gradeController.js
const pool = require('../config/db');

const updateGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const { grades, average } = req.body;

    // Check if student exists
    const [studentCheck] = await pool.query('SELECT 1 FROM students WHERE id = ?', [id]);
    if (studentCheck.length === 0) return res.status(404).json({ error: 'Student not found' });

    await pool.query('DELETE FROM grades WHERE student_id = ?', [id]);

    for (const [subject, q] of Object.entries(grades)) {
      await pool.query(
        `INSERT INTO grades (student_id, subject, q1, q2, q3, q4)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, subject, q.q1 || null, q.q2 || null, q.q3 || null, q.q4 || null]
      );
    }

    await pool.query('UPDATE students SET average = ? WHERE id = ?', [average || null, id]);

    // Fetch the updated student with grades to return
    const [updatedStudentRows] = await pool.query(
      'SELECT id, full_name, lrn, grade_level, section, average FROM students WHERE id = ?', 
      [id]
    );
    
    if (updatedStudentRows.length === 0) {
      return res.status(404).json({ error: 'Student not found after update' });
    }
    
    const updatedStudent = updatedStudentRows[0];
    
    const [gradeRows] = await pool.query(
      'SELECT subject, q1, q2, q3, q4 FROM grades WHERE student_id = ?', 
      [id]
    );
    
    // Build grades object
    const studentGrades = {};
    gradeRows.forEach(row => {
      studentGrades[row.subject] = {
        q1: row.q1,
        q2: row.q2,
        q3: row.q3,
        q4: row.q4,
      };
    });

    // Return the updated student with grades
    res.json({
      id: updatedStudent.id,
      fullName: updatedStudent.full_name,
      lrn: updatedStudent.lrn,
      gradeLevel: updatedStudent.grade_level,
      section: updatedStudent.section,
      average: updatedStudent.average,
      grades: studentGrades,
      message: 'Grades updated'
    });
  } catch (err) {
    console.error('Error in updateGrades:', err);
    res.status(500).json({ error: 'Failed to save grades', details: err.message });
  }
};

// Get a single student with their grades
const getStudentWithGrades = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get student info
    const [studentRows] = await pool.query(
      'SELECT id, full_name, lrn, grade_level, section, average FROM students WHERE id = ?', 
      [id]
    );
    
    if (studentRows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const student = studentRows[0];

    // Get student's grades
    const [gradeRows] = await pool.query(
      'SELECT subject, q1, q2, q3, q4 FROM grades WHERE student_id = ?', 
      [id]
    );
    
    // Build grades object - return null for empty grades
    const grades = {};
    gradeRows.forEach(row => {
      grades[row.subject] = {
        q1: row.q1,
        q2: row.q2,
        q3: row.q3,
        q4: row.q4,
      };
    });

    // Return student with grades
    res.json({
      id: student.id,
      fullName: student.full_name,
      lrn: student.lrn,
      gradeLevel: student.grade_level,
      section: student.section,
      average: student.average,
      grades: grades
    });
  } catch (err) {
    console.error('Error in getStudentWithGrades:', err);
    res.status(500).json({ error: 'Failed to load student', details: err.message });
  }
};

const getStudentGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT subject, q1, q2, q3, q4 FROM grades WHERE student_id = ?', [id]);
    const result = {};
    rows.forEach(r => {
      result[r.subject] = {
        q1: r.q1 || 0,
        q2: r.q2 || 0,
        q3: r.q3 || 0,
        q4: r.q4 || 0,
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// THIS IS THE UNIVERSAL VERSION (works on MySQL 5.7 and 8.0)
const getStudentsWithGrades = async (req, res) => {
  try {
    // First get all students
    const [students] = await pool.query(`
      SELECT id, full_name, lrn, grade_level, section, average 
      FROM students 
      ORDER BY average DESC
    `);

    // Then get all grades in one query
    const [gradeRows] = await pool.query(`
      SELECT student_id, subject, q1, q2, q3, q4 
      FROM grades 
      WHERE student_id IN (${students.map(s => s.id).join(',') || 0})
    `);

    // Build grades object manually
    const gradesMap = {};
    gradeRows.forEach(row => {
      if (!gradesMap[row.student_id]) gradesMap[row.student_id] = {};
      gradesMap[row.student_id][row.subject] = {
        q1: row.q1 || 0,
        q2: row.q2 || 0,
        q3: row.q3 || 0,
        q4: row.q4 || 0,
      };
    });

    // Combine
    const result = students.map(student => ({
      id: student.id,
      fullName: student.full_name,
      lrn: student.lrn,
      gradeLevel: student.grade_level,
      section: student.section,
      average: parseFloat(student.average || 0),
      grades: gradesMap[student.id] || {}
    }));

    res.json(result);
  } catch (err) {
    console.error('Error in getStudentsWithGrades:', err);
    res.status(500).json({ error: 'Failed to load students', details: err.message });
  }
};

module.exports = { updateGrades, getStudentWithGrades, getStudentGrades, getStudentsWithGrades };