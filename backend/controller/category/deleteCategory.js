const Category = require('../../models/categoryModel');

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const deleteCategoryAndChildren = async (categoryId) => {
      const categoryToDelete = await Category.findById(categoryId);
      if (!categoryToDelete) return;

      for (const childId of categoryToDelete.children) {
        await deleteCategoryAndChildren(childId);
      }

      await Category.findByIdAndDelete(categoryId);
    };

    await deleteCategoryAndChildren(id);

    if (category.parent) {
      await Category.findByIdAndUpdate(
        category.parent,
        { $pull: { children: id } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Category and its children deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
  }
};

module.exports = deleteCategory