// const userModel = require("../../models/userModel");

// async function allUsers(req, res) {
//     try {
//         // Ensure that the authenticated user is an ADMIN
//         const currentUser = await userModel.findById(req.userId);
        
//         if (currentUser.role !== 'admin') {
//             return res.status(403).json({
//                 message: "Access forbidden. Only admins can view all users.",
//                 error: true,
//                 success: false,
//             });
//         }

//         // Pagination parameters
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         // Validation for pagination parameters
//         if (page <= 0 || limit <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 error: true,
//                 message: "Page and limit must be greater than 0",
//             });
//         }

//         // Use aggregation to get paginated results
//         const users = await userModel.aggregate([
//             { $skip: (page - 1) * limit }, // Skip users based on the current page
//             { $limit: limit }, // Limit the number of users per page
//             { $project: { password: 0 } }, // Optional: Exclude sensitive fields (e.g., password)
//         ]);

//         // Get the total count of users to calculate the total number of pages
//         const totalCount = await userModel.countDocuments();

//         // Calculate total pages
//         const totalPages = Math.ceil(totalCount / limit);

//         res.json({
//             message: "All users",
//             data: users,
//             pagination: {
//                 totalCount,
//                 totalPages,
//                 currentPage: page,
//                 perPage: limit,
//             },
//             success: true,
//             error: false,
//         });
//     } catch (err) {
//         console.error(err); // Log the error for debugging

//         res.status(400).json({
//             message: err.message || err,
//             error: true,
//             success: false,
//         });
//     }
// }

// module.exports = allUsers;

const userModel = require("../../models/userModel");
const mongoose = require("mongoose");

const allUsers = async (req, res) => {
    try {
        // Ensure that the authenticated user is an ADMIN
        const currentUser = await userModel.findById(req.userId);
        
        if (currentUser.role !== 'admin') {
            return res.status(403).json({
                message: "Access forbidden. Only admins can view all users.",
                error: true,
                success: false,
            });
        }

        // Extract parameters from the request
        const { 
            page = 1, 
            limit = 10, 
            role, 
            status, 
            sortBy = 'createdAt', 
            sortOrder = -1, 
            search,
        } = req.query;

        // Build the filter object dynamically based on query parameters
        let filter = {};

        // Search functionality
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } },
                { 'address.state': { $regex: search, $options: 'i' } },
                { 'address.country': { $regex: search, $options: 'i' } }
            ];

            // Check if search query is a valid ObjectId
            if (mongoose.Types.ObjectId.isValid(search)) {
                filter.$or.push({ _id: new mongoose.Types.ObjectId(search) });
            }
        }

        // Role filter
        if (role) {
            filter.role = { $regex: new RegExp(role, 'i') };
        }

        // Status filter
        if (status) {
            filter.status = { $regex: new RegExp(status, 'i') };
        }

        // Set up pagination and sorting
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: parseInt(sortOrder) };

        // Fetch users with filters, pagination, and sorting
        const users = await userModel.find(filter)
            .select('-password -__v') // Exclude sensitive fields
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort)
            .lean(); // Convert to plain JavaScript objects

        // Get total count for pagination
        const totalUsers = await userModel.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(totalUsers / limit);

        // Return response with users and pagination info
        res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            error: false,
            data: users,
            pagination: {
                page: parseInt(page),
                totalPages,
                totalUsers,
                limit: parseInt(limit),
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: err.message || "Error fetching users",
            error: true,
            success: false
        });
    }
};

module.exports = allUsers;
