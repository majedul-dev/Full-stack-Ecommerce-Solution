const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    resource_type: {
        type: String,
        required: true
    },
    format: {
        type: String
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    bytes: {
        type: Number
    }
}, {timestamps: true});

module.exports = mongoose.model('Asset', assetSchema);