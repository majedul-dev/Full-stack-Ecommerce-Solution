const Category = require('../../models/categoryModel'); // Import your Category model
const { validationResult } = require('express-validator'); // For input validation
const { default: slugify } = require('slugify');

// Create a new category
const createCategory = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, parent, isActive, image, order, metadata } = req.body;

    // Generate a URL-friendly slug
    let slug = slugify(name, {
        lower: true, // Convert to lowercase
        strict: true, // Remove special characters
      });
  
      // Ensure the slug is unique
      let slugExists = await Category.findOne({ slug });
      let counter = 1;
      while (slugExists) {
        slug = `${slug}-${counter}`; // Append a counter to make it unique
        slugExists = await Category.findOne({ slug });
        counter++;
      }

    // Check if the category with the same slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this slug already exists.' });
    }

     

    // If a parent category is provided, validate it
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({ message: 'Parent category not found.' });
      }
    }

    // Create the new category
    const newCategory = new Category({
      name,
      slug,
      description,
      parent: parent || null, 
      isActive: isActive !== undefined ? isActive : true, 
      image,
      order: order || 0,
      metadata,
    });

    // Save the category (this will trigger the pre('save') middleware)
    await newCategory.save();

    // Return the created category
    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category: newCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
  }
};

module.exports =  createCategory;