const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');

const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Invalid product or quantity',
        success: false,
        error: true,
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
        error: true,
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} units available in stock`,
        success: false,
        error: true,
      });
    }

    let cart = await Cart.findOne({ userId, isActive: true });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      
      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal =
          cart.items[existingItemIndex].quantity * product.sellingPrice;
      } else {
        cart.items.push({
          productId,
          quantity,
          subtotal: quantity * product.sellingPrice,
        });
      }
      
    await cart.save();

    return res.status(200).json({
      message: 'Product added to cart successfully',
      data: cart,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'An error occurred while adding to cart',
      success: false,
      error: true,
    });
  }
};

module.exports = addToCart;
