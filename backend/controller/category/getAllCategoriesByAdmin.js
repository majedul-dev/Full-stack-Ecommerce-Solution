const Category = require('../../models/categoryModel'); // Import your Category model

// Get all categories with search, filtering, sorting, and pagination
const getAllCategoriesByAdmin = async (req, res) => {
  try {
    // Optional query parameters
    const { search, isActive, sortBy, sortOrder, page, limit } = req.query;

    // Build the query
    const query = {isDeleted: false}; // Exclude soft-deleted categories
    if (isActive !== undefined) {
      query.isActive = isActive === 'true'; // Convert string to boolean
    }

    // Add search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    // Build the sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1; // Default to ascending order
    } else {
      sort.createdAt = -1;
    }

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch categories from the database
    const categories = await Category.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .populate('parent', 'name slug') // Populate parent category details
      .populate('children', 'name slug'); // Populate child categories

    // Count total documents for pagination
    const total = await Category.countDocuments(query);

    // Return the response
    res.status(200).json({
      message: 'Categories retrieved successfully.',
      data: categories,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

module.exports = getAllCategoriesByAdmin