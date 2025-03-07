// const bcrypt = require('bcryptjs')
// const userModel = require('../../models/userModel')
// const jwt = require('jsonwebtoken');

// async function userSignInController(req,res){
//     try{
//         const { email , password} = req.body

//         if(!email){
//             throw new Error("Please provide email")
//         }
//         if(!password){
//              throw new Error("Please provide password")
//         }

//         const user = await userModel.findOne({email})

//        if(!user){
//             throw new Error("User not found")
//        }

//        const checkPassword = await bcrypt.compare(password,user.password)

//        console.log("checkPassoword",checkPassword)

//        if(checkPassword){
//         const tokenData = {
//             _id : user._id,
//             email : user.email,
//         }
//         const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

//         const tokenOption = {
//             httpOnly : true,
//             secure : true
//         }

//         res.cookie("token",token,tokenOption).status(200).json({
//             message : "Login successfully",
//             data : token,
//             success : true,
//             error : false
//         })

//        }else{
//          throw new Error("Please check Password")
//        }

//     }catch(err){
//         res.json({
//             message : err.message || err  ,
//             error : true,
//             success : false,
//         })
//     }

// }

// module.exports = userSignInController

const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

async function userSignInController(req, res) {
  try {
    // Validate input using Joi
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      }),
      password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
      }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: true,
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid password",
      });
    }

    // Create JWT token
    const tokenData = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "8h", // Token expires in 8 hours
    });

    // Cookie options
    const tokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Lax", // Prevent CSRF attacks
      maxAge: 72 * 60 * 60 * 1000, // 8 hours in milliseconds
    };

    // Send response with token in a cookie
    res
      .cookie("token", token, tokenOptions)
      .header("Authorization", `Bearer ${token}`)
      .status(200)
      .json({
        success: true,
        error: false,
        message: "Login successful",
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          token
        },
      });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      success: false,
      error: true,
      message: err.message || "An unexpected error occurred",
    });
  }
}

module.exports = userSignInController;
