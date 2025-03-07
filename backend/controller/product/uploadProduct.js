const Joi = require("joi");
const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");

async function UploadProductController(req, res) {
  try {
    const sessionUserId = req.userId;

    // Check user permission to upload products
    if (!uploadProductPermission(sessionUserId)) {
      return res.status(403).json({
        message: "Permission denied",
        error: true,
        success: false,
      });
    }

    // Define Joi schema for validation
    const productSchema = Joi.object({
      productName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
          "string.min": "Product name must be at least 3 characters long",
          "string.max": "Product name cannot exceed 100 characters",
          "string.empty": "Product name is required",
        }),
      brandName: Joi.string()
        .trim()
        .required()
        .messages({
          "string.empty": "Brand name is required",
        }),
      category: Joi.string()
        .trim()
        .required()
        .messages({
          "string.empty": "Category is required",
        }),
      productImage: Joi.array()
        .items(Joi.string().uri().regex(/\.(jpg|jpeg|png|gif|webp)$/))
        .messages({
          "array.base": "Product images must be an array of valid URLs",
          "string.pattern.base":
            "Each image must be a valid URL ending with jpg, jpeg, png, gif, or webp",
        }),
      description: Joi.string()
        .trim()
        .max(1000)
        .optional()
        .messages({
          "string.max": "Description cannot exceed 1000 characters",
        }),
      price: Joi.number()
        .positive()
        .required()
        .messages({
          "number.positive": "Price must be a positive number",
          "any.required": "Price is required",
        }),
      sellingPrice: Joi.number()
        .positive()
        .required()
        .max(Joi.ref("price"))
        .messages({
          "number.positive": "Selling price must be a positive number",
          "any.required": "Selling price is required",
          "number.max": "Selling price cannot exceed the original price",
        }),
      stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
          "number.min": "Stock cannot be negative",
          "any.required": "Stock quantity is required",
        }),
      sku: Joi.string()
        .trim()
        .min(2)
        .required()
        .messages({
          "string.min": "SKU must be at least 2 characters long",
          "any.required": "SKU is required",
        }),
      discount: Joi.number()
        .min(0)
        .max(100)
        .optional()
        .messages({
          "number.min": "Discount cannot be negative",
          "number.max": "Discount cannot exceed 100%",
        }),
      tags: Joi.array().items(Joi.string()).optional(),
      isPublished: Joi.boolean().optional(),
      isFeatured: Joi.boolean().optional(),
    });

    // Validate the incoming request data
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        error: true,
        success: false,
      });
    }

    const {
      productName,
      brandName,
      category,
      productImage = [],
      description,
      price,
      sellingPrice,
      stock,
      sku,
      discount = 0,
      tags = [],
      isPublished = false,
      isFeatured = false,
    } = req.body;

    // Check if the product with the same SKU already exists
    const existingProduct = await productModel.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({
        message: "A product with this SKU already exists.",
        error: true,
        success: false,
      });
    }

    // Create the product object
    const productData = {
      productName,
      brandName,
      category,
      productImage,
      description,
      price,
      sellingPrice,
      stock,
      sku,
      discount,
      tags,
      isPublished,
      isFeatured,
      updatedBy: sessionUserId, // Assuming the user is logged in
    };

    // Save the new product
    const newProduct = new productModel(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product uploaded successfully",
      error: false,
      success: true,
      data: savedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while uploading the product",
      error: true,
      success: false,
    });
  }
}

module.exports = UploadProductController;

