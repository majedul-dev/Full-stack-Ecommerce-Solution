const Category = require('../../models/categoryModel');

const getIndividualCategory = async (req, res) => {
  try {
    const { search } = req.query;

    const query = { 
      isActive: true,
      isDeleted: false
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const categories = await Category.find(query)
      .select('_id name')
      .sort({ name: 1 })
      .lean();

    const result = categories.map(category => ({
      id: category._id,
      name: category.name
    }));

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Categories retrieved successfully',
      data: result
    });

  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({
      success: false,
      error: true,
      message: err.message || 'Server error while fetching categories'
    });
  }
};

module.exports = getIndividualCategory;