const Order = require("../../models/orderModel");

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("products.productId", "name price description");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      success: true,
      error: false,
      data: order,
    });
  } catch (error) {
    console.error("Get Order by ID Error:", error.message);
    res.status(500).json({
      message: "Failed to fetch order",
      error: true,
      success: false,
      details: error.message,
    });
  }
};


module.exports = getOrderById;