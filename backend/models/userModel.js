const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    profilePic: {
      type: String
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'editor'],
      default: 'user',
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
