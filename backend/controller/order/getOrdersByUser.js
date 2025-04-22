const Order = require("../../models/orderModel");

const getOrdersByUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.userId };
    if (status) {
      query.status = status;
    }

    const totalCount = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("products.productId", "name price")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

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
