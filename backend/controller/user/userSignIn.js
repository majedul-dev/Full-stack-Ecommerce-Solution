const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

async function userSignInController(req, res) {
  try {
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

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid password",
      });
    }

    const tokenData = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1h",
    });

    const tokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 1 * 60 * 60 * 1000,
    };

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
    console.error(err);
    res.status(500).json({
      success: false,
      error: true,
      message: err.message || "An unexpected error occurred",
    });
  }
}

module.exports = userSignInController;
