const Order = require("../../models/orderModel");

// Get all orders (admin)
const getAllOrdersByAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, status } = req.query;

    const query = {};
    if (userId) {
      query.user = userId;
    }
    if (status) {
      query.status = status;
    }

    const totalCount = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("products.productId", "name price")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const pagination = {
      page: Number(page),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
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