const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderCode: { type: String, unique: true, required: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price must be non-negative"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount must be non-negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    shippingAddress: {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
      },
    paymentMethod: {
      type: String,
      enum: ["CARD", "PAYPAL", "COD"], // Add payment methods as needed
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
