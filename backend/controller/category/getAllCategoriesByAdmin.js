const Category = require('../../models/categoryModel');

const getAllCategoriesByAdmin = async (req, res) => {
  try {
    const { search, isActive, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    const query = {isDeleted: false};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    const skip = (page - 1) * limit;

    const categories = await Category.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('parent', 'name slug') 
      .populate('children', 'name slug');

    const total = await Category.countDocuments(query);

    const totalPages = Math.ceil(total / limit);

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