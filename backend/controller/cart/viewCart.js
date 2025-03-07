const cartModel = require("../../models/cartModel"); // Path to your Cart model
const productModel = require("../../models/productModel"); // Path to your Product model

async function viewCartController(req, res) {
  try {
    const userId = req.userId; // Assume the user ID is extracted from the auth middleware

    // Find the user's cart
    const cart = await cartModel.findOne({ userId, isActive: true }).populate({
      path: "items.productId",
      model: "Product", // Reference your Product model
      select: "productName price sellingPrice stock productImage", // Select only relevant fields
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart is empty",
        success: false,
        error: true,
      });
    }

    // Format the response to include product details
    const cartDetails = {
      cartId: cart._id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.productName,
        price: item.productId.price,
        sellingPrice: item.productId.sellingPrice,
        stock: item.productId.stock,
        productImage: item.productId.productImage,
        quantity: item.quantity,
        subtotal: item.quantity * item.productId.sellingPrice,
      })),
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: cart.items.reduce(
        (sum, item) => sum + item.quantity * item.productId.sellingPrice,
        0
      ),
      isActive: cart.isActive,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };

    res.status(200).json({
      message: "Cart fetched successfully",
      data: cartDetails,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while fetching the cart",
      success: false,
      error: true,
    });
  }
}

module.exports = viewCartController;
