// const userModel = require("../../models/userModel");
// const mongoose = require("mongoose");

// const allUsers = async (req, res) => {
//     try {
//         const currentUser = await userModel.findById(req.userId);
        
//         if (currentUser.role !== 'admin') {
//             return res.status(403).json({
//                 message: "Access forbidden. Only admins can view all users.",
//                 error: true,
//                 success: false,
//             });
//         }

//         const { 
//             page = 1, 
//             limit = 5,
//             role, 
//             status, 
//             sortBy = 'createdAt', 
//             sortOrder = -1, 
//             search,
//         } = req.query;

//         let filter = {};

//         if (search) {
//             filter.$or = [
//                 { name: { $regex: search, $options: 'i' } },
//                 { email: { $regex: search, $options: 'i' } },
//                 { 'address.city': { $regex: search, $options: 'i' } },
//                 { 'address.state': { $regex: search, $options: 'i' } },
//                 { 'address.country': { $regex: search, $options: 'i' } }
//             ];

//             if (mongoose.Types.ObjectId.isValid(search)) {
//                 filter.$or.push({ _id: new mongoose.Types.ObjectId(search) });
//             }
//         }

//         if (role) {
//             filter.role = { $regex: new RegExp(role, 'i') };
//         }

//         if (status) {
//             filter.status = { $regex: new RegExp(status, 'i') };
//         }

//         const skip = (page - 1) * limit;
//         const sort = { [sortBy]: parseInt(sortOrder) };

//         const users = await userModel.find(filter)
//             .select('-password -__v')
//             .skip(skip)
//             .limit(parseInt(limit))
//             .sort(sort)
//             .lean();

//         const totalUsers = await userModel.countDocuments(filter);

//         const totalPages = Math.ceil(totalUsers / limit);

//         res.status(200).json({
//             message: "Users fetched successfully",
//             success: true,
//             error: false,
//             data: users,
//             pagination: {
//                 page: parseInt(page),
//                 totalPages,
//                 totalUsers,
//                 limit: parseInt(limit),
//                 hasNextPage: page < totalPages,
//                 hasPreviousPage: page > 1
//             }
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(400).json({
//             message: err.message || "Error fetching users",
//             error: true,
//             success: false
//         });
//     }
// };

// module.exports = allUsers;


const userModel = require("../../models/userModel");
const mongoose = require("mongoose");

const allUsers = async (req, res) => {
    try {
        const currentUser = await userModel.findById(req.userId);
        
        if (currentUser.role !== 'admin') {
            return res.status(403).json({
                message: "Access forbidden. Only admins can view all users.",
                error: true,
                success: false,
            });
        }

        const { 
            page = 1, 
            limit = 5,
            role, 
            status, 
            sortBy = 'createdAt', 
            sortOrder = -1, 
            search,
            includeTotal = true
        } = req.query;

        let filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } },
                { 'address.state': { $regex: search, $options: 'i' } },
                { 'address.country': { $regex: search, $options: 'i' } }
            ];

            if (mongoose.Types.ObjectId.isValid(search)) {
                filter.$or.push({ _id: new mongoose.Types.ObjectId(search) });
            }
        }

        if (role) {
            filter.role = { $regex: new RegExp(role, 'i') };
        }

        if (status) {
            filter.status = { $regex: new RegExp(status, 'i') };
        }

        const skip = (page - 1) * limit;
        const sort = { [sortBy]: parseInt(sortOrder) };

        // Get paginated users
        const users = await userModel.find(filter)
            .select('-password -__v')
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort)
            .lean();

        // Get total counts (both filtered and unfiltered)
        const [totalFilteredUsers, totalAllUsers] = await Promise.all([
            userModel.countDocuments(filter),
            includeTotal ? userModel.estimatedDocumentCount() : null
        ]);

        const totalPages = Math.ceil(totalFilteredUsers / limit);

        const response = {
            message: "Users fetched successfully",
            success: true,
            error: false,
            data: users,
            pagination: {
                page: parseInt(page),
                totalPages,
                totalFilteredUsers, // Total matching the current filters
                limit: parseInt(limit),
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };

        // Only include totalAllUsers if explicitly requested
        if (includeTotal) {
            response.pagination.totalAllUsers = totalAllUsers;
        }

        res.status(200).json(response);

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