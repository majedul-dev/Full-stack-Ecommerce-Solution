const userModel = require("../../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUserId = req.userId; // From authentication middleware
        const { email, name, role, status, address } = req.body;
        const userId = req.params.id

        // Get the current user making the request
        const currentUser = await userModel.findById(sessionUserId);

        if (!currentUser) {
            return res.status(404).json({
                message: "Authenticated user not found",
                error: true,
                success: false,
            });
        }

        // Determine if this is a self-update (no userId provided)
        const isSelfUpdate = !userId;
        const targetUserId = isSelfUpdate ? sessionUserId : userId;

        // Get the user to be updated
        const userToUpdate = await userModel.findById(targetUserId);

        if (!userToUpdate) {
            return res.status(404).json({
                message: "User to update not found",
                error: true,
                success: false,
            });
        }

        // For non-self updates, verify admin privileges
        if (!isSelfUpdate && currentUser.role !== "admin") {
            return res.status(403).json({
                message: "Only admins can update other users",
                error: true,
                success: false,
            });
        }

        // Role update restrictions (only for admins)
        if (role) {
            if (currentUser.role !== "admin") {
                return res.status(403).json({
                    message: "Only admins can update roles",
                    error: true,
                    success: false,
                });
            }

            // Prevent changing the role of the last admin
            if (userToUpdate.role === "admin" && role !== "admin") {
                const adminCount = await userModel.countDocuments({ role: "admin" });
                if (adminCount === 1) {
                    return res.status(403).json({
                        message: "Cannot change the role of the last admin",
                        error: true,
                        success: false,
                    });
                }
            }
        }

        // Status update restrictions (only for admins)
        if (status && currentUser.role !== "admin") {
            return res.status(403).json({
                message: "Only admins can update status",
                error: true,
                success: false,
            });
        }

        // Prepare the payload with valid fields
        const payload = {
            ...(email && { email }),
            ...(name && { name }),
            ...(role && currentUser.role === "admin" && { role }), // Only admins can update roles
            ...(status && currentUser.role === "admin" && { status }), // Only admins can update status
            ...(address && { address }),
        };

        if (Object.keys(payload).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update",
                error: true,
                success: false,
            });
        }

        // Update the user
        const updatedUser = await userModel.findByIdAndUpdate(
            targetUserId, 
            payload, 
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            data: updatedUser,
            message: "User updated successfully",
            success: true,
            error: false,
        });

    } catch (err) {
        console.error("Error in updateUser:", err);
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = updateUser;