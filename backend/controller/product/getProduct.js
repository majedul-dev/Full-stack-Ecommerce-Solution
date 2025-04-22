const productModel = require("../../models/productModel");

const getProductController = async (req, res) => {
    try {
        const { page = 1, limit = 20, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = -1, search, startDate,
            endDate, stockStatus } = req.query;

        // await productModel.updateAllStockStatuses();

        let filter = {};
        if (search) {
            filter.$or = [
                { productName: { $regex: search, $options: 'i' } },
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

        if (stockStatus) {
            const validStatuses = ['in-stock', 'low-stock', 'out-of-stock'];
            if (validStatuses.includes(stockStatus)) {
                filter.stockStatus = stockStatus;
            } else {
                return res.status(400).json({
                    message: "Invalid stockStatus value. Must be one of: in-stock, low-stock, out-of-stock",
                    error: true,
                    success: false
                });
            }
        }

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            filter.createdAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.createdAt = { $lte: new Date(endDate) };
        }

        const skip = (page - 1) * limit;
        const sort = { [sortBy]: parseInt(sortOrder) };

        const products = await productModel
            .find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort);

        const totalProducts = await productModel.countDocuments(filter);

        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            error: false,
            data: products,
            pagination: {
                page: Number(page),
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
