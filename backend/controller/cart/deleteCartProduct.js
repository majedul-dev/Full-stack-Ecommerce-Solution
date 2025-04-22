const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel");

async function deleteCartProductController(req, res) {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const cart = await cartModel.findOne({ userId, isActive: true });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
        error: true,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
        error: true,
      });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.status(200).json({
      message: "Product removed from cart successfully",
      data: cart,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while removing the product from the cart",
      success: false,
      error: true,
    });
  }
}

module.exports = deleteCartProductController;
