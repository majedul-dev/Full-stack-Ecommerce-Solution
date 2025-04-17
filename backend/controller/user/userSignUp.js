const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

async function userSignUpController(req, res) {
  try {
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

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: true,
        message: "A user with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      email,
      password: hashedPassword,
      name,
      role: "user",
    });

    const savedUser = await newUser.save();

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
    console.error(err);
    res.status(500).json({
      success: false,
      error: true,
      message: err.message || "An unexpected error occurred",
    });
  }
}

module.exports = userSignUpController;
