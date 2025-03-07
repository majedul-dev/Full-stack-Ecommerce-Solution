const Joi = require("joi");
const Order = require("../../models/orderModel");

// Joi Schema for input validation
const orderSchema = Joi.object({
  user: Joi.string().required().messages({
    "any.required": "User ID is required.",
    "string.base": "User ID must be a string.",
  }),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages({
          "any.required": "Product ID is required.",
        }),
        quantity: Joi.number().min(1).required().messages({
          "number.min": "Quantity must be at least 1.",
          "any.required": "Quantity is required.",
        }),
        price: Joi.number().min(0).required().messages({
          "number.min": "Price must be a positive number.",
          "any.required": "Price is required.",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one product is required.",
      "any.required": "Products are required.",
    }),
  totalAmount: Joi.number().min(0).required().messages({
    "number.min": "Total amount must be a positive number.",
    "any.required": "Total amount is required.",
  }),
  shippingAddress: Joi.object({
    street: Joi.string().min(5).required(),
    city: Joi.string().min(2).required(),
    state: Joi.string().min(2).required(),
    postalCode: Joi.string().min(4).required(),
    country: Joi.string().min(2).required(),
  }).required(),
  paymentMethod: Joi.string().valid("CARD", "PAYPAL", "COD").required().messages({
    "any.required": "Payment method is required.",
    "any.only": "Payment method must be one of CARD, PAYPAL, or COD.",
  }),
});

// Create a new order
const createOrder = async (req, res) => {
  try {
    // Validate input using Joi schema
    const { error, value } = orderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        error: error.details.map((detail) => detail.message), // Send detailed error messages
        success: false,
      });
    }

    const { user, products, totalAmount, shippingAddress, paymentMethod } = value;

    // Calculate total amount (server-side validation)
    const calculatedTotal = products.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    if (calculatedTotal !== totalAmount) {
      return res.status(400).json({
        message: "Total amount mismatch.",
        error: true,
        success: false,
      });
    }

    // Create and save the order
    const newOrder = new Order({
      user,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      createdBy: req.userId, // Assuming authenticated user's ID is available
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      error: false,
      success: true,
      data: savedOrder,
    });
  } catch (err) {
    console.error("Create Order Error:", err.message);
    console.log(err);
    res.status(500).json({
      message: err.message || "Internal server error.",
      error: true,
      success: false,
    });
  }
};

module.exports = createOrder;
