// const Joi = require("joi");
// const Order = require("../../models/orderModel");
// const OrderCounter = require("../../models/OrderCounter");
// const User = require("../../models/userModel");

// // Joi Schema for input validation
// const orderSchema = Joi.object({
//   user: Joi.string().required().messages({
//     "any.required": "User ID is required.",
//     "string.base": "User ID must be a string.",
//   }),
//   products: Joi.array()
//     .items(
//       Joi.object({
//         productId: Joi.string().required().messages({
//           "any.required": "Product ID is required.",
//         }),
//         quantity: Joi.number().min(1).required().messages({
//           "number.min": "Quantity must be at least 1.",
//           "any.required": "Quantity is required.",
//         }),
//         price: Joi.number().min(0).required().messages({
//           "number.min": "Price must be a positive number.",
//           "any.required": "Price is required.",
//         }),
//       })
//     )
//     .min(1)
//     .required()
//     .messages({
//       "array.min": "At least one product is required.",
//       "any.required": "Products are required.",
//     }),
//   totalAmount: Joi.number().min(0).required().messages({
//     "number.min": "Total amount must be a positive number.",
//     "any.required": "Total amount is required.",
//   }),
//   shippingAddress: Joi.object({
//     street: Joi.string().min(5).required(),
//     city: Joi.string().min(2).required(),
//     state: Joi.string().min(2).required(),
//     postalCode: Joi.string().min(4).required(),
//     country: Joi.string().min(2).required(),
//   }).required(),
//   paymentMethod: Joi.string().valid("CARD", "PAYPAL", "COD").required().messages({
//     "any.required": "Payment method is required.",
//     "any.only": "Payment method must be one of CARD, PAYPAL, or COD.",
//   }),
// });

// // Create a new order
// const createOrder = async (req, res) => {
//   try {
//     // Validate input using Joi schema
//     const { error, value } = orderSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({
//         message: "Validation error",
//         error: error.details.map((detail) => detail.message), // Send detailed error messages
//         success: false,
//       });
//     }

//     const { user, products, totalAmount, shippingAddress, paymentMethod } = value;

//     const userData = await User.findById(req.userId).select("_id name email")
    

//     // Calculate total amount (server-side validation)
//     const calculatedTotal = products.reduce(
//       (sum, item) => sum + item.quantity * item.price,
//       0
//     );

//     if (calculatedTotal !== totalAmount) {
//       return res.status(400).json({
//         message: "Total amount mismatch.",
//         error: true,
//         success: false,
//       });
//     }

//     // Generate order code
//     const counter = await OrderCounter.findByIdAndUpdate(
//       { _id: 'orderId' },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );

//     const orderCode = `MSO${String(counter.seq).padStart(7, '0')}`;

//     // Create and save the order
//     const newOrder = new Order({
//       orderCode,
//       user: userData,
//       products,
//       totalAmount,
//       shippingAddress,
//       paymentMethod,
//       createdBy: req.userId,
//     });

//     const savedOrder = await newOrder.save();

//     res.status(201).json({
//       message: "Order created successfully",
//       error: false,
//       success: true,
//       data: savedOrder,
//     });
//   } catch (err) {
//     console.error("Create Order Error:", err.message);
//     console.log(err);
//     res.status(500).json({
//       message: err.message || "Internal server error.",
//       error: true,
//       success: false,
//     });
//   }
// };

// module.exports = createOrder;


const Joi = require("joi");
const Order = require("../../models/orderModel");
const OrderCounter = require("../../models/OrderCounter");
const User = require("../../models/userModel");
const Product = require("../../models/productModel"); // Make sure to import your Product model
const { default: mongoose } = require("mongoose");

// Joi Schema for input validation remains the same
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

// Create a new order with stock management
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Validate input using Joi schema
    const { error, value } = orderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Validation error",
        error: error.details.map((detail) => detail.message),
        success: false,
      });
    }

    const { user, products, totalAmount, shippingAddress, paymentMethod } = value;

    const userData = await User.findById(req.userId).select("_id name email");

    // Check product availability and stock
    const productUpdates = [];
    const outOfStockProducts = [];
    
    // Check all products first
    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          message: `Product not found with ID: ${item.productId}`,
          error: true,
          success: false,
        });
      }
      
      if (product.stock < item.quantity) {
        outOfStockProducts.push({
          productId: item.productId,
          productName: product.productName,
          availableStock: product.stock,
          requestedQuantity: item.quantity,
        });
      }
    }
    
    // If any products are out of stock, abort the transaction
    if (outOfStockProducts.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Some products are out of stock",
        outOfStockProducts,
        error: true,
        success: false,
      });
    }
    
    // Calculate total amount (server-side validation)
    const calculatedTotal = products.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    if (calculatedTotal !== totalAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Total amount mismatch.",
        error: true,
        success: false,
      });
    }

    // Generate order code
    const counter = await OrderCounter.findByIdAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );

    const orderCode = `MSO${String(counter.seq).padStart(7, '0')}`;

    const newOrder = new Order({
      orderCode,
      user: userData,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      createdBy: req.userId,
    });

    const savedOrder = await newOrder.save({ session });

    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order created successfully",
      error: false,
      success: true,
      data: savedOrder,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Create Order Error:", err.message);
    res.status(500).json({
      message: err.message || "Internal server error.",
      error: true,
      success: false,
    });
  }
};

module.exports = createOrder;