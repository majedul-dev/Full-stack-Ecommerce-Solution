const mongoose = require('mongoose')


// const userSchema = new mongoose.Schema({
//     name : String,
//     email : {
//         type : String,
//         unique : true,
//         required : true
//     },
//     password : String,
//     profilePic : String,
//     role : String,
// },{
//     timestamps : true
// })


// const userModel =  mongoose.model("user",userSchema)


// module.exports = userModel


// Define the user schema
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
      enum: ['GENERAL', 'ADMIN'],
      default: 'GENERAL',
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
        enum: ['active', 'inactive', 'banned'],
        default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
