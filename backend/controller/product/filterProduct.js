// const productModel = require("../../models/productModel")

// const filterProductController = async(req,res)=>{
//  try{
//         const categoryList = req?.body?.category || []

//         const product = await productModel.find({
//             category :  {
//                 "$in" : categoryList
//             }
//         })

//         res.json({
//             data : product,
//             message : "product",
//             error : false,
//             success : true
//         })
//  }catch(err){
//     res.json({
//         message : err.message || err,
//         error : true,
//         success : false
//     })
//  }
// }


// module.exports = filterProductController

const productModel = require("../../models/productModel");

const filterProductController = async (req, res) => {
  try {
    const {
      category = [],
      minPrice = 0,
      maxPrice = Infinity,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.body;

    // Validate and parse filters
    if (!Array.isArray(category)) {
      return res.status(400).json({
        message: "Category should be an array.",
        error: true,
        success: false,
      });
    }
    if (minPrice < 0 || maxPrice < 0) {
      return res.status(400).json({
        message: "Price range cannot be negative.",
        error: true,
        success: false,
      });
    }
    if (minPrice > maxPrice) {
      return res.status(400).json({
        message: "minPrice cannot be greater than maxPrice.",
        error: true,
        success: false,
      });
    }

    // Construct filter criteria
    const filterCriteria = {
      ...(category.length && { category: { $in: category } }),
      price: { $gte: minPrice, $lte: maxPrice },
    };

    // Pagination logic
    const skip = (page - 1) * limit;

    // Fetch filtered products
    const products = await productModel
      .find(filterCriteria)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 }) // Dynamic sorting
      .skip(skip)
      .limit(limit);

    // Count total products for pagination metadata
    const totalProducts = await productModel.countDocuments(filterCriteria);

    res.json({
      data: products,
      total: totalProducts,
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      message: "Filtered products fetched successfully.",
      error: false,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while filtering products.",
      error: true,
      success: false,
    });
  }
};

module.exports = filterProductController;
