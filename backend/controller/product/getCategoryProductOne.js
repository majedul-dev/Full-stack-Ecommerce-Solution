
const productModel = require("../../models/productModel");

const getCategoryProduct = async (req, res) => {
  try {
    // Fetch all distinct categories
    const productCategory = await productModel.distinct("category");

    // If no categories found, return an appropriate response
    if (productCategory.length === 0) {
      return res.status(404).json({
        message: "No categories found.",
        error: true,
        success: false,
      });
    }

    // Create a list of categories and their associated products
    const categoryWithProducts = [];

    for (const category of productCategory) {
      // Fetch all products for the current category
      const productsInCategory = await productModel.find({ category });

      // Add category and its products to the list
      categoryWithProducts.push({
        category,
        products: productsInCategory,
      });
    }

    // Return categories and products
    res.json({
      message: "Category products fetched successfully",
      data: categoryWithProducts,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = getCategoryProduct;
