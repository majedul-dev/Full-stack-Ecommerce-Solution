const Category = require('../../models/categoryModel');
const { validationResult } = require('express-validator');
const { default: slugify } = require('slugify');

const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, parent, isActive, image, order, metadata } = req.body;

    let slug = slugify(name, {
        lower: true,
        strict: true,
      });
  
      let slugExists = await Category.findOne({ slug });
      let counter = 1;
      while (slugExists) {
        slug = `${slug}-${counter}`;
        slugExists = await Category.findOne({ slug });
        counter++;
      }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this slug already exists.' });
    }

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({ message: 'Parent category not found.' });
      }
    }

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

    await newCategory.save();

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