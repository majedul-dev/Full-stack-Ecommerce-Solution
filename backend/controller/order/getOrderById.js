const Order = require("../../models/orderModel");

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch the order and populate user and product details
    const order = await Order.findById(orderId)
      .populate("user", "name email") // Populate user with selected fields
      .populate("products.productId", "name price description"); // Populate product with selected fields

    // Check if the order exists
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