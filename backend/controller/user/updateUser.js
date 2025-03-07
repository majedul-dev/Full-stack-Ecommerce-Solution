// const userModel = require("../../models/userModel")

// async function updateUser(req,res){
//     try{
//         const sessionUser = req.userId

//         const { userId , email, name, role} = req.body

//         const payload = {
//             ...( email && { email : email}),
//             ...( name && { name : name}),
//             ...( role && { role : role}),
//         }

//         const user = await userModel.findById(sessionUser)

//         console.log("user.role",user.role)



//         const updateUser = await userModel.findByIdAndUpdate(userId,payload)

        
//         res.json({
//             data : updateUser,
//             message : "User Updated",
//             success : true,
//             error : false
//         })
//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }


// module.exports = updateUser

const userModel = require("../../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUserId = req.userId; // Authenticated user ID from the token
        const { userId, email, name, role, status, address } = req.body;

        // Check if the current user is an "ADMIN"
        const currentUser = await userModel.findById(sessionUserId);

        if (!currentUser) {
            return res.status(404).json({
                message: "Authenticated user not found",
                error: true,
                success: false,
            });
        }

        if (!userId) {
            return res.status(400).json({
                message: "Target user ID is required",
                error: true,
                success: false,
            });
        }

        const userToUpdate = await userModel.findById(userId);

        if (!userToUpdate) {
            return res.status(404).json({
                message: "User to update not found",
                error: true,
                success: false,
            });
        }

        // Role update restrictions
        if (role) {
            if (currentUser.role !== "ADMIN") {
                return res.status(403).json({
                    message: "Only admins can update roles",
                    error: true,
                    success: false,
                });
            }

            // Prevent changing the role of the last admin
            if (userToUpdate.role === "ADMIN" && role !== "ADMIN") {
                const adminCount = await userModel.countDocuments({ role: "ADMIN" });
                if (adminCount === 1) {
                    return res.status(403).json({
                        message: "Cannot change the role of the last admin",
                        error: true,
                        success: false,
                    });
                }
            }
        }

        // Prepare the payload with valid fields
        const payload = {
            ...(email && { email }),
            ...(name && { name }),
            ...(role && { role }), // Only admins can update roles
            ...(status && { status }),
            ...(address && { address }),
        };

        if (Object.keys(payload).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update",
                error: true,
                success: false,
            });
        }

        // Update the target user
        const updatedUser = await userModel.findByIdAndUpdate(userId, payload, { new: true }).select("-password");

        res.json({
            data: updatedUser,
            message: "User updated successfully",
            success: true,
            error: false,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = updateUser;

