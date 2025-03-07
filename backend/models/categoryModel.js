const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    path: {
      type: String,
      index: true,
      default: '',
    },
    pathNames: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    image: String,
    order: {
      type: Number,
      default: 0,
    },
    metadata: {}, // Custom fields (e.g., SEO tags, external IDs)
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Virtual for child categories (optional)
categorySchema.virtual('childCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Middleware to enforce max depth and update materialized path
categorySchema.pre('save', async function (next) {
  if (this.parent) {
    const parent = await this.model('Category').findById(this.parent);
    if (!parent) throw new Error('Parent category not found.');

    // Calculate depth and update materialized path
    let depth = 1;
    let current = parent;

    // Traverse up the hierarchy to calculate depth and build path
    while (current && current.parent) {
      current = await this.model('Category').findById(current.parent);
      if (!current) throw new Error('Invalid parent reference in hierarchy.');
      depth++;
      if (depth >= 3) throw new Error('Max category depth exceeded (3 levels).');
    }

    // Update materialized path
    this.path = `${parent.path ? `${parent.path}/` : ''}${parent._id}`;

    // Update pathNames
    this.pathNames = `${parent.pathNames ? `${parent.pathNames} / ` : ''}${parent.name}`;
  } else {
    // Root category
    this.path = '';
    this.pathNames = '';
  }

  next();
});

// Middleware to update parent's children array
categorySchema.post('save', async function (doc, next) {
  if (doc.parent) {
    await this.model('Category').findByIdAndUpdate(
      doc.parent,
      { $addToSet: { children: doc._id } },
      { new: true }
    );
  }
  next();
});

const Category = model('Category', categorySchema);
module.exports = Category;