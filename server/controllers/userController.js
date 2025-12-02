// server/controllers/userController.js
const User = require('../models/User');
const { signToken } = require('../utils/auth');

exports.signup = async (req, res) => {
  try {
    const { email, password, confirmPassword, ...userData } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match',
      });
    }

    const user = await User.create({
      ...userData,
      email,
      password,
      role: userData.role || 'student',
    });

    const token = signToken(user.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user data',
    });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'username', 'email', 'department', 'position', 'subjects', 'bio', 'profilePic'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.updateById(req.user.id, updates);

    if (!updatedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};