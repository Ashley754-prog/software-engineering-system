// server/controllers/gradeRequestController.js
const pool = require('../config/db');

// Create a new grade request
const createGradeRequest = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      gradeLevel,
      section,
      teacherName,
      requestType,
      reason,
      quarter,
      subject,
      status
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO grade_requests 
       (student_id, student_name, grade_level, section, teacher_name, request_type, reason, quarter, subject, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [studentId, studentName, gradeLevel, section, teacherName, requestType, reason, quarter, subject, status || 'pending']
    );

    // Create notification for admins
    await pool.query(
      `INSERT INTO notifications 
       (user_id, user_type, title, message, type, reference_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [null, 'admin', 'Grade Edit Request', 
       `${teacherName} requested to ${requestType} grades for ${studentName} (${gradeLevel}-${section}, Q${quarter})`,
       'grade_request', result.insertId]
    );

    res.status(201).json({ 
      message: 'Grade request submitted successfully',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Error creating grade request:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
};

// Get all grade requests for admins
const getGradeRequests = async (req, res) => {
  try {
    const [requests] = await pool.query(
      `SELECT * FROM grade_requests 
       ORDER BY created_at DESC`
    );

    res.json(requests);
  } catch (error) {
    console.error('Error fetching grade requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Update grade request status
const updateGradeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    await pool.query(
      `UPDATE grade_requests 
       SET status = ?, admin_notes = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, adminNotes, id]
    );

    res.json({ message: 'Request updated successfully' });
  } catch (error) {
    console.error('Error updating grade request:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
};

// Get notifications for admins
const getNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_type = 'admin' AND read = false
       ORDER BY created_at DESC`
    );

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE notifications 
       SET read = true 
       WHERE id = ?`,
      [id]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

module.exports = {
  createGradeRequest,
  getGradeRequests,
  updateGradeRequest,
  getNotifications,
  markNotificationRead
};
