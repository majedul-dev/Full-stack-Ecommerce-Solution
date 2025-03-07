const Category = require('../../models/categoryModel'); // Import your Category model
const { validationResult } = require('express-validator'); // For input validation
const slugify = require('slugify'); // For slug generation

const updateCategory = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params; // Category ID to update
    const { name, description, parent, isActive, image } = req.body;

    // Find the category to update
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Generate a new slug if the name is updated
    let slug = category.slug;
    if (name && name !== category.name) {
      slug = slugify(name, {
        lower: true,
        strict: true,
      });

      // Ensure the new slug is unique
      let slugExists = await Category.findOne({ slug, _id: { $ne: id } }); // Exclude current category
      let counter = 1;
      while (slugExists) {
        slug = `${slug}-${counter}`;
        slugExists = await Category.findOne({ slug, _id: { $ne: id } });
        counter++;
      }
    }

    // If the parent is updated, validate the new parent
    let oldParent = category.parent;
    let newParent;
    if (parent && parent.toString() !== (oldParent || '').toString()) {
      newParent = await Category.findById(parent);
      if (!newParent) {
        return res.status(404).json({ message: 'New parent category not found.' });
      }

      // Check for circular dependency
      if (newParent.path && newParent.path.includes(id)) {
        return res.status(400).json({ message: 'Circular dependency detected.' });
      }
    }

    // Update the category fields
    category.name = name || category.name;
    category.slug = slug;
    category.description = description || category.description;
    category.parent = parent || category.parent;
    category.isActive = isActive !== undefined ? isActive : category.isActive;
    category.image = image || category.image;
    // category.order = order || category.order;
    // category.metadata = metadata || category.metadata;

    // Save the updated category
    await category.save();

    // If the parent was updated, update the old and new parent's children arrays
    if (oldParent && oldParent.toString() !== (newParent?._id || '').toString()) {
      // Remove the category from the old parent's children array
      await Category.findByIdAndUpdate(
        oldParent,
        { $pull: { children: id } },
        { new: true }
      );
    }

    if (newParent) {
      // Add the category to the new parent's children array
      await Category.findByIdAndUpdate(
        newParent._id,
        { $addToSet: { children: id } },
        { new: true }
      );
    }

    // Return the updated category
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