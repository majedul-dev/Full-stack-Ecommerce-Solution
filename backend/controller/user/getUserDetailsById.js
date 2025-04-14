const User = require('../../models/userModel');
const mongoose = require('mongoose');

const getUserDetailsById = async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }
    const requestingUser = await User.findById(requestingUserId);
    
    if (!requestingUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    if (requestingUser._id.toString() !== userId && requestingUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only admins can access other users data',
      });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "User details retrieved successfully",
      data: user,
    });

  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "An unexpected error occurred",
    });
  }
};

module.exports = getUserDetailsById;