const Category = require('../../models/categoryModel');

const getParentCategories = async (req, res) => {
  try {
    const parentCategories = await Category.find(
      { isDeleted: false },
      { _id: 1, name: 1, path: 1 }
    );

    res.status(200).json({
      message: 'Parent categories retrieved successfully.',
      data: parentCategories,
    });
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

module.exports = getParentCategories