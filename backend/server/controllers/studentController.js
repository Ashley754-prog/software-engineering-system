// server/controllers/studentController.js
const pool = require('../config/db');
const QRCode = require('qrcode');

const formatStudent = (student) => ({
  id: student.id,
  lrn: student.lrn,
  firstName: student.first_name,
  middleName: student.middle_name,
  lastName: student.last_name,
  fullName: student.full_name,
  age: student.age,
  sex: student.sex,
  gradeLevel: student.grade_level,
  section: student.section,
  contact: student.contact,
  wmsuEmail: student.wmsu_email,
  qrCode: student.qr_code,
  profilePic: student.profile_pic,
  status: student.status,
  attendance: student.attendance,
  average: student.average,
  createdBy: student.created_by,
  createdAt: student.created_at,
  updatedAt: student.updated_at
});

const createStudent = async (req, res) => {
  try {
    const {
      lrn, firstName, middleName, lastName, age, sex,
      gradeLevel, section, contact, wmsuEmail, password, profilePic
    } = req.body;

    if (!lrn || !firstName || !lastName || !wmsuEmail || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [lrnExists] = await pool.query('SELECT 1 FROM students WHERE lrn = ?', [lrn]);
    if (lrnExists.length) return res.status(409).json({ error: 'LRN already exists' });

    const [emailExists] = await pool.query('SELECT 1 FROM students WHERE wmsu_email = ?', [wmsuEmail]);
    if (emailExists.length) return res.status(409).json({ error: 'Email already exists' });

    const fullName = `${firstName} ${middleName || ''} ${lastName}`.trim();
    const qrData = JSON.stringify({ lrn, name: fullName, gradeLevel, section, email: wmsuEmail });
    const qrCode = await QRCode.toDataURL(qrData, { width: 300, margin: 2 });

    await pool.query(
      `INSERT INTO students (lrn, first_name, middle_name, last_name, full_name, age, sex, grade_level, section, contact, wmsu_email, password, profile_pic, qr_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [lrn, firstName, middleName || '', lastName, fullName, age || null, sex, gradeLevel, section, contact, wmsuEmail, password, profilePic || null, qrCode]
    );

    const [[newStudent]] = await pool.query('SELECT * FROM students WHERE lrn = ?', [lrn]);
    res.status(201).json({ message: 'Student created successfully', student: formatStudent(newStudent) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create student', details: err.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { gradeLevel, section, status } = req.query;
    let sql = 'SELECT * FROM students WHERE 1=1';
    const params = [];

    if (gradeLevel) { sql += ' AND grade_level = ?'; params.push(gradeLevel); }
    if (section) { sql += ' AND section = ?'; params.push(section); }
    if (status) { sql += ' AND status = ?'; params.push(status); }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows.map(formatStudent));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students', details: err.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(formatStudent(rows[0]));
  } catch (err) {
    console.error('getStudentById error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];

    const [existing] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Student not found' });
    const student = existing[0];

    const fields = {
      firstName: 'first_name',
      middleName: 'middle_name',
      lastName: 'last_name',
      age: 'age',
      sex: 'sex',
      gradeLevel: 'grade_level',
      section: 'section',
      contact: 'contact',
      wmsuEmail: 'wmsu_email',
      status: 'status',
      attendance: 'attendance',
      average: 'average',
      profilePic: 'profile_pic',
      qrCode: 'qr_code'
    };

    for (const [key, dbKey] of Object.entries(fields)) {
      if (req.body[key] !== undefined) {
        updates.push(`${dbKey} = ?`);
        values.push(req.body[key] === '' && key.includes('Pic') ? null : req.body[key]);
      }
    }

    // Rebuild full_name if name changed
    if (req.body.firstName || req.body.middleName || req.body.lastName) {
      const f = req.body.firstName ?? student.first_name;
      const m = req.body.middleName ?? student.middle_name;
      const l = req.body.lastName ?? student.last_name;
      updates.push('full_name = ?');
      values.push(`${f} ${m} ${l}`.trim());
    }

    if (!updates.length) return res.status(400).json({ error: 'No fields to update' });

    values.push(id);
    await pool.query(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`, values);

    const [[updated]] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    res.json({ message: 'Student updated successfully', student: formatStudent(updated) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student', details: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete', details: err.message });
  }
};

const getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const [rows] = await pool.query('SELECT * FROM students WHERE wmsu_email = ?', [email]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(formatStudent(rows[0]));
  } catch (err) {
    console.error('getStudentByEmail error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, getStudentByEmail };