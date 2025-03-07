const Order = require("../../models/orderModel");

// Get orders for a specific user
const getOrdersByUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query; // Pagination and optional status filter

    // Build the query object
    const query = { user: req.userId };
    if (status) {
      query.status = status; // Filter orders by status if provided
    }

    // Count total orders for the user
    const totalCount = await Order.countDocuments(query);

    // Fetch the user's orders with pagination, filtering, and sorting
    const orders = await Order.find(query)
      .populate("products.productId", "name price") // Populate product details with selected fields
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sort orders by most recent

    // Construct pagination metadata
    const pagination = {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      perPage: Number(limit),
    };

    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      error: false,
      data: orders,
      pagination,
    });
  } catch (error) {
    console.error("Get Orders by User Error:", error.message);
    res.status(500).json({
      message: "Failed to fetch user orders",
      error: true,
      success: false,
      details: error.message,
    });
  }
};

module.exports = getOrdersByUser;
