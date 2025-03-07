const userModel = require("../../models/userModel");

async function allUsers(req, res) {
    try {
        // Ensure that the authenticated user is an ADMIN
        const currentUser = await userModel.findById(req.userId);
        
        if (currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access forbidden. Only admins can view all users.",
                error: true,
                success: false,
            });
        }

        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page if not provided

        // Validation for pagination parameters
        if (page <= 0 || limit <= 0) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Page and limit must be greater than 0",
            });
        }

        // Use aggregation to get paginated results
        const users = await userModel.aggregate([
            { $skip: (page - 1) * limit }, // Skip users based on the current page
            { $limit: limit }, // Limit the number of users per page
            { $project: { password: 0 } }, // Optional: Exclude sensitive fields (e.g., password)
        ]);

        // Get the total count of users to calculate the total number of pages
        const totalCount = await userModel.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            message: "All users",
            data: users,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
            success: true,
            error: false,
        });
    } catch (err) {
        console.error(err); // Log the error for debugging

        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = allUsers;
