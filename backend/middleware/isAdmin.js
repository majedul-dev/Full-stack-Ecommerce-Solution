// middleware/isAdmin.js
const User = require('../models/userModel');

const isAdmin = async (req, res, next) => {
  try {
    // Check if user ID is available in the request (from previous auth middleware)
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: 'Unauthorized: No user ID found in request',
      });
    }

    // Find the user in database
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'User not found',
      });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: true,
        message: 'Forbidden: Admin access required',
      });
    }

    // If everything is okay, attach user object to request and proceed
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      success: false,
      error: true,
      message: 'Internal server error during admin verification',
    });
  }
};

module.exports = isAdmin;