const Category = require('../../models/categoryModel');

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate('parent', 'name slug') 
      .populate('children', 'name slug');

    if (!category || category.isDeleted) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.status(200).json({
      message: 'Category retrieved successfully.',
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

module.exports = getCategoryById