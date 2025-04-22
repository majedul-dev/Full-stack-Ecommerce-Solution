const Category = require('../../models/categoryModel');
const { validationResult } = require('express-validator');
const slugify = require('slugify');

const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, parent, isActive, image } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    let slug = category.slug;
    if (name && name !== category.name) {
      slug = slugify(name, {
        lower: true,
        strict: true,
      });

      let slugExists = await Category.findOne({ slug, _id: { $ne: id } });
      let counter = 1;
      while (slugExists) {
        slug = `${slug}-${counter}`;
        slugExists = await Category.findOne({ slug, _id: { $ne: id } });
        counter++;
      }
    }

    let oldParent = category.parent;
    let newParent;
    if (parent && parent.toString() !== (oldParent || '').toString()) {
      newParent = await Category.findById(parent);
      if (!newParent) {
        return res.status(404).json({ message: 'New parent category not found.' });
      }

      if (newParent.path && newParent.path.includes(id)) {
        return res.status(400).json({ message: 'Circular dependency detected.' });
      }
    }

    category.name = name || category.name;
    category.slug = slug;
    category.description = description || category.description;
    category.parent = parent || category.parent;
    category.isActive = isActive !== undefined ? isActive : category.isActive;
    category.image = image || category.image;
    // category.order = order || category.order;
    // category.metadata = metadata || category.metadata;

    await category.save();

    if (oldParent && oldParent.toString() !== (newParent?._id || '').toString()) {
      await Category.findByIdAndUpdate(
        oldParent,
        { $pull: { children: id } },
        { new: true }
      );
    }

    if (newParent) {
      await Category.findByIdAndUpdate(
        newParent._id,
        { $addToSet: { children: id } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
  }
};

module.exports = updateCategory