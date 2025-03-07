const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');

const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have `userId` from authentication middleware
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Invalid product or quantity',
        success: false,
        error: true,
      });
    }

    // Find the product to add
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
        error: true,
      });
    }

    // Check if the quantity exceeds the available stock
    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} units available in stock`,
        success: false,
        error: true,
      });
    }

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ userId, isActive: true });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item's quantity
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal =
          cart.items[existingItemIndex].quantity * product.sellingPrice;
      } else {
        // Add a new item
        cart.items.push({
          productId,
          quantity,
          subtotal: quantity * product.sellingPrice,
        });
      }
      

    // Save the cart
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
