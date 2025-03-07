// const productModel = require("../../models/productModel")

// const getCategoryWiseProduct = async(req,res)=>{
//     try{
//         const { category } = req?.body || req?.query
//         const product = await productModel.find({ category })

//         res.json({
//             data : product,
//             message : "Product",
//             success : true,
//             error : false
//         })
//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = getCategoryWiseProduct

const productModel = require("../../models/productModel");

const getCategoryWiseProduct = async (req, res) => {
  try {
    // Destructure category from query parameters, along with pagination parameters (page, limit)
    const { category } = req?.body || req?.query;
    const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 products per page if not provided

    // Check if category is provided
    if (!category) {
      return res.status(400).json({
        message: "Category is required.",
        error: true,
        success: false
      });
    }

    // Fetch products by category with pagination
    const products = await productModel.find({ category })
      .skip((page - 1) * limit) // Skip the records based on current page
      .limit(limit); // Limit the number of results to the specified page size

    // Count total products in the category for pagination metadata
    const totalProducts = await productModel.countDocuments({ category });

    // Check if products are found
    if (products.length === 0) {
      return res.status(404).json({
        message: `No products found for category: ${category}`,
        error: true,
        success: false
      });
    }

    // Pagination metadata
    const totalPages = Math.ceil(totalProducts / limit); // Calculate the total pages

    // Return the paginated response
    res.json({
      data: products,
      message: `Products in category: ${category}`,
      success: true,
      error: false,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit
      }
    });
    
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server Error",
      error: true,
      success: false
    });
  }
};

module.exports = getCategoryWiseProduct;
