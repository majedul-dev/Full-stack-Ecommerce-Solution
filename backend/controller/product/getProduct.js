const productModel = require("../../models/productModel");

const getProductController = async (req, res) => {
    try {
        // Extract pagination and filter parameters from the request
        const { page = 1, limit = 10, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = -1, search, startDate,
            endDate } = req.query;

        // Build the filter object dynamically based on query parameters
        let filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { brandName: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }
        
        if (category) {
            filter.category = category;
        }
        
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = minPrice;
            if (maxPrice) filter.price.$lte = maxPrice;
        }

        // Add date range filter if startDate and endDate are provided
        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate), // Greater than or equal to startDate
                $lte: new Date(endDate)  // Less than or equal to endDate
            };
        } else if (startDate) {
            filter.createdAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.createdAt = { $lte: new Date(endDate) };
        }

        // Set up pagination and sorting
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: parseInt(sortOrder) };

        // Fetch the products from the database with filters, pagination, and sorting
        const products = await productModel
            .find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort);

        // Get the total number of products to calculate the total pages
        const totalProducts = await productModel.countDocuments(filter);

        // Calculate the total pages for pagination
        const totalPages = Math.ceil(totalProducts / limit);

        // Return the response with the products and pagination info
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            error: false,
            data: products,
            pagination: {
                page,
                totalPages,
                totalProducts,
                limit: parseInt(limit)
            }
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: err.message || "Error fetching products",
            error: true,
            success: false
        });
    }
};

module.exports = getProductController;
