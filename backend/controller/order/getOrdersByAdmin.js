const Order = require("../../models/orderModel");
const User = require("../../models/userModel");

// Get all orders (admin)
const getAllOrdersByAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, userId, status, startDate, endDate } = req.query;

    const query = {};
    
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      query.$or = [
        { orderCode: { $regex: search, $options: 'i' } },
        { user: { $in: userIds } }
      ];
    } 
    
    if (userId) {
      query.user = userId;
    }
    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
      };
    } else if (startDate) {
        query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
        query.createdAt = { $lte: new Date(endDate) };
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

module.exports = getAllOrdersByAdmin;