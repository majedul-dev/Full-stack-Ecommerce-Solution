const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel"); // Assuming you have a User model

async function updateProductController(req, res) {
  try {
    const sessionUserId = req.userId;

    // Check user permission to update the product
    if (!uploadProductPermission(sessionUserId)) {
      return res.status(403).json({
        message: "Permission denied",
        error: true,
        success: false,
      });
    }

    const {
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
    } = req.body;

    // Manual Validation
    if (productName && (productName.length < 3 || productName.length > 100)) {
      return res.status(400).json({
        message: "Product name must be between 3 and 100 characters.",
        error: true,
        success: false,
      });
    }

    if (productImage && !Array.isArray(productImage)) {
      return res.status(400).json({
        message: "Product images must be an array of valid URLs.",
        error: true,
        success: false,
      });
    }

    if (productImage && productImage.some(url => !/\.(jpg|jpeg|png|gif|webp)$/.test(url))) {
      return res.status(400).json({
        message: "Each product image must be a valid URL ending with jpg, jpeg, png, gif, or webp.",
        error: true,
        success: false,
      });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({
        message: "Description cannot exceed 1000 characters.",
        error: true,
        success: false,
      });
    }

    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number.",
        error: true,
        success: false,
      });
    }

    if (sellingPrice !== undefined) {
      if (sellingPrice <= 0) {
        return res.status(400).json({
          message: "Selling price must be a positive number.",
          error: true,
          success: false,
        });
      }
      if (price !== undefined && sellingPrice > price) {
        return res.status(400).json({
          message: "Selling price cannot exceed the original price.",
          error: true,
          success: false,
        });
      }
    }

    if (stock !== undefined && (stock < 0 || !Number.isInteger(stock))) {
      return res.status(400).json({
        message: "Stock must be a non-negative integer.",
        error: true,
        success: false,
      });
    }

    if (discount !== undefined && (discount < 0 || discount > 100)) {
      return res.status(400).json({
        message: "Discount must be between 0 and 100%.",
        error: true,
        success: false,
      });
    }

    // Get the current user's name for the 'updatedBy' field
    const currentUser = await userModel.findById(sessionUserId);
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Find the product by ID
    const existingProduct = await productModel.findById(req.params.productId);
    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // Prepare the updated product data
    const updatedData = {
      ...(productName && { productName }),
      ...(brandName && { brandName }),
      ...(category && { category }),
      ...(productImage && { productImage }),
      ...(description && { description }),
      ...(price && { price }),
      ...(sellingPrice && { sellingPrice }),
      ...(stock && { stock }),
      ...(sku && { sku }),
      ...(discount && { discount }),
      ...(tags && { tags }),
      ...(isPublished !== undefined && { isPublished }),
      ...(isFeatured !== undefined && { isFeatured }),
      updatedBy: currentUser.name, // Store the user's name who updated the product
    };

    // Update the product in the database
    const updatedProduct = await productModel.findByIdAndUpdate(req.params.productId, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validations
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while updating the product",
      error: true,
      success: false,
    });
  }
}

module.exports = updateProductController;
