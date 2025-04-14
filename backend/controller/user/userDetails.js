const userModel = require("../../models/userModel");

async function userDetailsController(req, res) {
  try {
    // Validate if userId exists in the request
    if (!req.userId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "User ID is required",
      });
    }

    // Fetch user details by ID, excluding sensitive fields
    const user = await userModel.findById(req.userId).select("-password -__v");

    // If user is not found
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    // Respond with user details
    res.status(200).json({
      success: true,
      error: false,
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      success: false,
      error: true,
      message: err.message || "An unexpected error occurred",
    });
  }
}

module.exports = userDetailsController;
