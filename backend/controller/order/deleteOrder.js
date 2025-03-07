const Order = require("../../models/orderModel");
const UserModel = require("../../models/userModel");

// Cancel or delete an order
const updateOrderStatusOrDelete = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      const order = await Order.findById(orderId);
      const user = await UserModel.findById(req.userId);
  
      if (!order) {
        return res.status(404).json({ error: "Order not found." });
      }
  
      // If user is an admin, they can delete the order
      if (user.role === "ADMIN") {
        await order.deleteOne();
        return res.status(200).json({ message: "Order deleted successfully." });
      }
  
      // If user is a customer and they own the order, allow status update to 'Cancelled'
      if (String(order.user) === String(req.userId)) {
        if (status === "Cancelled") {
          order.status = status;
          const updatedOrder = await order.save();
          return res.status(200).json({
            message: "Order cancelled successfully.",
            data: updatedOrder,
          });
        } else {
          return res
            .status(403)
            .json({ error: "Customers can only cancel their orders." });
        }
      }
  
      res.status(403).json({ error: "Unauthorized action." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = updateOrderStatusOrDelete;