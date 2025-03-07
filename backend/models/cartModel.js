const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: true,
        },
        sellingPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0, // Calculate based on items array
    },
    totalSellingPrice: {
      type: Number,
      required: true,
      default: 0, // Calculate based on items array
    },
    discount: {
      type: Number,
      default: 0, // Optional discount on the total price
    },
    isActive: {
      type: Boolean,
      default: true, // Flag for checking if the cart is active
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

cartSchema.pre('save', function (next) {
  // Calculate total prices before saving the cart
  this.totalPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  this.totalSellingPrice = this.items.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
