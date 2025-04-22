const productModel = require("../../models/productModel");
const searchProduct = async (req, res) => {
  try {
    const query = req.query.q?.trim(); // Safely access and trim the search query

    if (!query) {
      return res.status(400).json({
        message: "Query parameter 'q' is required.",
        error: true,
        success: false,
      });
    }

    // Create a case-insensitive regex for the search query
    const regex = new RegExp(query, "i");

    // Limit results to the top 10 matches for better performance during typing
    const product = await productModel
      .find({
        $or: [
          { productName: regex },
          { category: regex },
        ],
      })
      .select("productName category price") // Only select required fields for lightweight responses
      .limit(10);

    res.json({
      data: product,
      message: "Search Product List",
      error: false,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while searching for products.",
      error: true,
      success: false,
    });
  }
};

module.exports = searchProduct;
