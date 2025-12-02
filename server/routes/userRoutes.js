const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/signup', userController.signup);

// Protected routes (require authentication)
router.use(authController.protect);

// Get current user
router.get('/me', userController.getMe);

// Update current user
router.patch('/me', userController.updateMe);

module.exports = router;
