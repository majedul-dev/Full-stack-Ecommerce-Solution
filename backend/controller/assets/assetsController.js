const cloudinary = require('cloudinary').v2;
const Asset = require('../../models/Asset');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getAllAssets = async (req, res) => {
  try {
    const { next_cursor, search, resource_type, format, tags } = req.query;

    let mongoFilter = {};
    if (search) {
      mongoFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { public_id: { $regex: search, $options: 'i' } }
      ];
    }

    const mongoAssets = await Asset.find(mongoFilter).lean();
    const mongoPublicIds = mongoAssets.map(asset => asset.public_id);

    const cloudinaryOptions = {
      type: 'upload',
      max_results: 30,
      next_cursor: next_cursor || undefined
    };

    if (search) {
      cloudinaryOptions.public_ids = mongoPublicIds;
      if (mongoPublicIds.length === 0) {
        return res.json({
          success: true,
          data: {
            resources: [],
            next_cursor: null,
            total_count: 0
          }
        });
      }
    }

    if (resource_type) cloudinaryOptions.resource_type = resource_type;
    if (format) cloudinaryOptions.format = format;
    if (tags) cloudinaryOptions.tags = tags;

    const cloudinaryResult = await cloudinary.api.resources(cloudinaryOptions);

    const combinedResources = cloudinaryResult.resources.map(resource => {
      const metadata = mongoAssets.find(a => a.public_id === resource.public_id) || {};
      return {
        ...resource,
        title: metadata.title || '',
        description: metadata.description || ''
      };
    });

    res.json({
      success: true,
      data: {
        resources: combinedResources,
        next_cursor: cloudinaryResult.next_cursor,
        total_count: cloudinaryResult.total_count
      }
    });

  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch assets'
    });
  }
};


const createOrUpdateAsset = async (req, res) => {
  try {
    const { public_id, title, description } = req.body;
    
    if (!public_id || !title) {
      return res.status(400).json({
        success: false,
        message: 'public_id and title are required'
      });
    }

    const resource = await cloudinary.api.resource(public_id);
    
    const asset = await Asset.findOneAndUpdate(
      { public_id },
      { 
        public_id,
        title,
        description,
        url: resource.secure_url,
        resource_type: resource.resource_type,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        bytes: resource.bytes
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: asset
    });
  } catch (error) {
    console.error('Error saving asset metadata:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save asset metadata'
    });
  }
};

const deleteAssets = async (req, res) => {
  try {
    const { public_ids } = req.body;
    
    if (!public_ids || !Array.isArray(public_ids)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid public_ids provided'
      });
    }

    const cloudinaryResult = await cloudinary.api.delete_resources(public_ids);
    
    await Asset.deleteMany({ public_id: { $in: public_ids } });

    res.json({
      success: true,
      data: {
        cloudinary: cloudinaryResult,
        mongo: { deletedCount: public_ids.length }
      }
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
  createOrUpdateAsset,
  deleteAssets
};