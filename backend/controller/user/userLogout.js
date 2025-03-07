async function userLogout(req, res) {
    try {
      // Clear the authentication cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
  
      // Respond with success
      res.status(200).json({
        success: true,
        error: false,
        message: "Logged out successfully",
        data: [],
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
  
  module.exports = userLogout;
  