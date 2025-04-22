const productModel = require("../../models/productModel");

const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.params;  // Get productId from URL parameters

        // Find the product by its ID
        const product = await productModel.findById(productId);
        
        // If product is not found, return a 404 error
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false,
            });
        }

        // Return the product details in the response
        res.status(200).json({
            data: product,
            message: "Product details fetched successfully",
            success: true,
            error: false,
        });

    } catch (err) {
        console.error(err);
        // Return a 500 error in case of unexpected server errors
        res.status(500).json({
            message: err.message || "An error occurred while fetching product details",
            error: true,
            success: false,
        });
    }
};

module.exports = getProductDetails;
