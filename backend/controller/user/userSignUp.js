// const userModel = require("../../models/userModel")
// const bcrypt = require('bcryptjs');


// async function userSignUpController(req,res){
//     try{
//         const { email, password, name} = req.body

//         const user = await userModel.findOne({email})

//         console.log("user",user)

//         if(user){
//             throw new Error("Already user exits.")
//         }

//         if(!email){
//            throw new Error("Please provide email")
//         }
//         if(!password){
//             throw new Error("Please provide password")
//         }
//         if(!name){
//             throw new Error("Please provide name")
//         }

//         const salt = bcrypt.genSaltSync(10);
//         const hashPassword = await bcrypt.hashSync(password, salt);

//         if(!hashPassword){
//             throw new Error("Something is wrong")
//         }

//         const payload = {
//             ...req.body,
//             role : "GENERAL",
//             password : hashPassword
//         }

//         const userData = new userModel(payload)
//         const saveUser = await userData.save()

//         res.status(201).json({
//             data : saveUser,
//             success : true,
//             error : false,
//             message : "User created Successfully!"
//         })


//     }catch(err){
//         res.json({
//             message : err.message || err  ,
//             error : true,
//             success : false,
//         })
//     }
// }

// module.exports = userSignUpController

const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

async function userSignUpController(req, res) {
  try {
    // Validate input using Joi
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      }),
      password: Joi.string()
        .min(6)
        .required()
        .messages({
          "string.min": "Password must be at least 6 characters long",
          "any.required": "Password is required",
        }),
      name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
          "string.min": "Name must be at least 2 characters long",
          "string.max": "Name cannot exceed 50 characters",
          "any.required": "Name is required",
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

    const { email, password, name } = req.body;

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: true,
        message: "A user with this email already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new userModel({
      email,
      password: hashedPassword,
      name,
      role: "GENERAL", // Default role
    });

    const savedUser = await newUser.save();

    // Respond with success
    res.status(201).json({
      success: true,
      error: false,
      data: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
      message: "User created successfully!",
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

module.exports = userSignUpController;
