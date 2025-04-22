const Order = require("../../models/orderModel");
const UserModel = require("../../models/userModel");

// Update order status (for users and admins)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId)
    
    console.log( req.userId)
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value.",
        success: false,
        error: true,
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
        success: false,
        error: true,
      });
    }

    if (user.role !== "admin" && String(order.user) !== userId) {
      return res.status(403).json({
        message: "You are not authorized to update this order.",
        success: false,
        error: true,
      });
    }

    if (user.role !== "admin" && status !== "Cancelled") {
      return res.status(403).json({
        message: "You are only allowed to cancel your orders.",
        success: false,
        error: true,
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order status updated successfully.",
      success: true,
      error: false,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error.message);
    res.status(500).json({
      message: "Failed to update order status.",
      success: false,
      error: true,
      details: error.message,
    });
  }
};


module.exports = updateOrderStatus;