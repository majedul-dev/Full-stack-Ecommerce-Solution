// controllers/assetController.js
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (ensure this runs before any API calls)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all assets with pagination
const getAllAssets = async (req, res) => {
  try {
    const { next_cursor, search } = req.query;
    
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: search,
      max_results: 30,
      next_cursor: next_cursor || undefined
    });

    res.json({
      success: true,
      data: {
        resources: result.resources,
        next_cursor: result.next_cursor,
        total_count: result.total_count
      }
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    console.log('Error fetching assets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch assets'
    });
  }
};

// Delete multiple assets
const deleteAssets = async (req, res) => {
  try {
    const { public_ids } = req.body;
    
    if (!public_ids || !Array.isArray(public_ids)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid public_ids provided'
      });
    }

    const result = await cloudinary.api.delete_resources(public_ids);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error deleting assets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete assets'
    });
  }
};

module.exports = {
  getAllAssets,
  deleteAssets
};