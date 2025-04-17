const Category = require('../../models/categoryModel'); // Import your Category model

// Get all categories with search, filtering, sorting, and pagination
const getAllCategoriesByAdmin = async (req, res) => {
  try {
    // Optional query parameters
    const { search, isActive, sortBy, sortOrder, page = 1, limit = 5 } = req.query;

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
    const skip = (page - 1) * limit;

    // Fetch categories from the database
    const categories = await Category.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('parent', 'name slug') // Populate parent category details
      .populate('children', 'name slug'); // Populate child categories

    // Count total documents for pagination
    const total = await Category.countDocuments(query);

    const totalPages = Math.ceil(total / limit);

    // Return the response
    res.status(200).json({
      message: 'Categories retrieved successfully.',
      data: categories,
      pagination: {
        total,
        page,
        limit: parseInt(limit),
        totalPages
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

module.exports = getAllCategoriesByAdmin