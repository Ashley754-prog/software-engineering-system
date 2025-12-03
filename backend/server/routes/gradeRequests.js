// server/routes/gradeRequests.js
const express = require('express');
const router = express.Router();
const {
  createGradeRequest,
  getGradeRequests,
  updateGradeRequest,
  getNotifications,
  markNotificationRead
} = require('../controllers/gradeRequestController');

router.post('/', createGradeRequest);
router.get('/', getGradeRequests);
router.put('/:id', updateGradeRequest);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
