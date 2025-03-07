const Order = require("../../models/orderModel");

// Get all orders (admin)
const getAllOrdersByAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, status } = req.query; // Pagination and filtering

    // Build the query object
    const query = {};
    if (userId) {
      query.user = userId; // Filter by user ID if provided
    }
    if (status) {
      query.status = status; // Filter by order status if provided
    }

    // Count total orders matching the query
    const totalCount = await Order.countDocuments(query);

    // Fetch orders with pagination, query, and population
    const orders = await Order.find(query)
      .populate("user", "name email") // Populate user with selected fields
      .populate("products.productId", "name price") // Populate product with selected fields
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sort by most recent orders

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
    console.error("Get All Orders Error:", error.message);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: true,
      success: false,
      details: error.message,
    });
  }
};

module.exports = getAllOrdersByAdmin