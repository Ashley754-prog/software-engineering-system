const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const saltRounds = 10;

// Teacher login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [teachers] = await pool.query(
      'SELECT * FROM teachers WHERE email = ?',
      [email]
    );

    if (teachers.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const teacher = teachers[0];

    // Check verification status
    if (teacher.verification_status !== 'approved') {
      if (teacher.verification_status === 'pending') {
        return res.status(403).json({ 
          error: 'Account pending verification. Please wait for admin approval.' 
        });
      } else if (teacher.verification_status === 'rejected') {
        return res.status(403).json({ 
          error: 'Account rejected. Please contact administrator.' 
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...teacherData } = teacher;

    res.json({
      message: 'Login successful',
      teacher: {
        id: teacherData.id,
        username: teacherData.username,
        firstName: teacherData.first_name,
        lastName: teacherData.last_name,
        email: teacherData.email,
        role: teacherData.role,
        department: teacherData.department,
        position: teacherData.position,
        subjects: teacherData.subjects,
        bio: teacherData.bio,
        profilePic: teacherData.profile_pic,
        verificationStatus: teacherData.verification_status
      }
    });
  } catch (err) {
    console.error('Teacher login error:', err);
    res.status(500).json({ 
      error: 'Login failed', 
      details: err.message 
    });
  }
});

// Create Teacher/Admin Account
router.post('/', async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      role
    } = req.body;

    // Create teachers table if it doesn't exist (do this first!)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('teacher', 'admin') NOT NULL,
        verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        department VARCHAR(100) DEFAULT 'WMSU-ILS Department',
        position VARCHAR(100) DEFAULT 'Teacher',
        subjects TEXT,
        bio TEXT,
        profile_pic LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add verification_status column if it doesn't exist (for existing tables)
    await pool.query(`
      ALTER TABLE teachers 
      ADD COLUMN IF NOT EXISTS verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
    `);

    // Validation
    if (!username || !firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['teacher', 'admin'].includes(role.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid role. Must be teacher or admin' });
    }

    // Check if username already exists
    const [usernameExists] = await pool.query(
      'SELECT 1 FROM teachers WHERE username = ?', 
      [username]
    );
    if (usernameExists.length) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const [emailExists] = await pool.query(
      'SELECT 1 FROM teachers WHERE email = ?', 
      [email]
    );
    if (emailExists.length) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new teacher/admin
    const [result] = await pool.query(
      `INSERT INTO teachers (username, first_name, last_name, email, password, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, firstName, lastName, email, hashedPassword, role.toLowerCase()]
    );

    // Get the created record
    const [[newTeacher]] = await pool.query(
      'SELECT id, username, first_name, last_name, email, role, created_at FROM teachers WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
      teacher: {
        id: newTeacher.id,
        username: newTeacher.username,
        firstName: newTeacher.first_name,
        lastName: newTeacher.last_name,
        email: newTeacher.email,
        role: newTeacher.role,
        createdAt: newTeacher.created_at
      }
    });

  } catch (err) {
    console.error('Create teacher error:', err);
    res.status(500).json({ 
      error: 'Failed to create account', 
      details: err.message 
    });
  }
});

// Get current teacher profile
router.get('/me', async (req, res) => {
  try {
    // For now, we'll need to get the teacher ID from the request
    // In a real app, this would come from JWT token authentication
    const teacherId = req.query.id || req.user?.id;
    
    console.log('GET teacher request - Teacher ID:', teacherId);
    
    if (!teacherId) {
      return res.status(400).json({ error: 'Teacher ID required' });
    }

    // First, ensure table has all required columns
    await pool.query(`
      ALTER TABLE teachers 
      ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'WMSU-ILS Department',
      ADD COLUMN IF NOT EXISTS position VARCHAR(100) DEFAULT 'Teacher',
      ADD COLUMN IF NOT EXISTS subjects TEXT,
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS profile_pic LONGTEXT
    `);

    const [[teacher]] = await pool.query(
      'SELECT id, username, first_name, last_name, email, role, department, position, subjects, bio, profile_pic, created_at FROM teachers WHERE id = ?',
      [teacherId]
    );

    console.log('GET teacher result:', teacher);

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const response = {
      user: {
        id: teacher.id,
        username: teacher.username,
        firstName: teacher.first_name,
        lastName: teacher.last_name,
        email: teacher.email,
        role: teacher.role,
        department: teacher.department,
        position: teacher.position,
        subjects: teacher.subjects,
        bio: teacher.bio,
        profilePic: teacher.profile_pic,
        createdAt: teacher.created_at
      }
    };

    console.log('GET teacher response:', response);

    res.json(response);

  } catch (err) {
    console.error('Get teacher error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch teacher data', 
      details: err.message 
    });
  }
});

// Update teacher profile
router.patch('/me', async (req, res) => {
  try {
    const teacherId = req.query.id || req.user?.id;
    const updates = req.body;

    console.log('Update request - Teacher ID:', teacherId);
    console.log('Update request - Updates keys:', Object.keys(updates));
    
    // Log the size of profile_pic if present
    if (updates.profile_pic) {
      console.log('Profile pic size:', updates.profile_pic.length, 'characters');
    }

    if (!teacherId) {
      return res.status(400).json({ error: 'Teacher ID required' });
    }

    // First, ensure table has all required columns
    await pool.query(`
      ALTER TABLE teachers 
      ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'WMSU-ILS Department',
      ADD COLUMN IF NOT EXISTS position VARCHAR(100) DEFAULT 'Teacher',
      ADD COLUMN IF NOT EXISTS subjects TEXT,
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS profile_pic LONGTEXT
    `);

    // Check if teacher exists
    const [[existingTeacher]] = await pool.query(
      'SELECT id FROM teachers WHERE id = ?',
      [teacherId]
    );

    console.log('Existing teacher:', existingTeacher);

    if (!existingTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Build dynamic update query
    const allowedFields = ['username', 'first_name', 'last_name', 'email', 'department', 'position', 'subjects', 'bio', 'profile_pic'];
    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    console.log('Update fields:', updateFields);
    console.log('Update values count:', updateValues.length);

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateValues.push(teacherId);

    const updateQuery = `UPDATE teachers SET ${updateFields.join(', ')} WHERE id = ?`;
    console.log('Update query:', updateQuery);
    
    await pool.query(updateQuery, updateValues);

    // Get updated teacher data
    const [[updatedTeacher]] = await pool.query(
      'SELECT id, username, first_name, last_name, email, role, department, position, subjects, bio, profile_pic, created_at FROM teachers WHERE id = ?',
      [teacherId]
    );

    console.log('Updated teacher successfully');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedTeacher.id,
        username: updatedTeacher.username,
        firstName: updatedTeacher.first_name,
        lastName: updatedTeacher.last_name,
        email: updatedTeacher.email,
        role: updatedTeacher.role,
        department: updatedTeacher.department,
        position: updatedTeacher.position,
        subjects: updatedTeacher.subjects,
        bio: updatedTeacher.bio,
        profilePic: updatedTeacher.profile_pic,
        createdAt: updatedTeacher.created_at
      }
    });

  } catch (err) {
    console.error('Update teacher error:', err);
    res.status(500).json({ 
      error: 'Failed to update teacher data', 
      details: err.message 
    });
  }
});

// Get all teachers (for debugging)
router.get('/', async (req, res) => {
  try {
    const [teachers] = await pool.query(
      'SELECT id, username, first_name, last_name, email, role FROM teachers'
    );
    res.json({ teachers });
  } catch (err) {
    console.error('Get teachers error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch teachers', 
      details: err.message 
    });
  }
});

// Get teachers count
router.get('/count', async (req, res) => {
  try {
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM teachers');
    res.json({ count });
  } catch (err) {
    console.error('Get teachers count error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch teachers count', 
      details: err.message 
    });
  }
});

// Get pending teachers
router.get('/pending', async (req, res) => {
  try {
    const [teachers] = await pool.query(`
      SELECT id, username, first_name, last_name, email, role, created_at 
      FROM teachers 
      WHERE verification_status = 'pending'
      ORDER BY created_at DESC
    `);
    res.json({ teachers });
  } catch (err) {
    console.error('Get pending teachers error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch pending teachers', 
      details: err.message 
    });
  }
});

// Get approved teachers
router.get('/approved', async (req, res) => {
  try {
    const [teachers] = await pool.query(`
      SELECT id, username, first_name, last_name, email, role, department, position, created_at 
      FROM teachers 
      WHERE verification_status = 'approved'
      ORDER BY created_at DESC
    `);
    res.json({ teachers });
  } catch (err) {
    console.error('Get approved teachers error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch approved teachers', 
      details: err.message 
    });
  }
});

// Approve teacher
router.patch('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(`
      UPDATE teachers 
      SET verification_status = 'approved', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [id]);
    
    res.json({ message: 'Teacher approved successfully' });
  } catch (err) {
    console.error('Approve teacher error:', err);
    res.status(500).json({ 
      error: 'Failed to approve teacher', 
      details: err.message 
    });
  }
});

// Reject teacher
router.patch('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(`
      UPDATE teachers 
      SET verification_status = 'rejected', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [id]);
    
    res.json({ message: 'Teacher rejected successfully' });
  } catch (err) {
    console.error('Reject teacher error:', err);
    res.status(500).json({ 
      error: 'Failed to reject teacher', 
      details: err.message 
    });
  }
});

module.exports = router;
