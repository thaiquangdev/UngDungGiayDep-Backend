const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "fullname, email and password is required",
      });
    }
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email is already",
      });
    }
    const hashPassword = bcrypt.hashSync(password, 12);
    const newUser = await userModel({
      fullname,
      email,
      password: hashPassword,
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "Register is successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  register,
};
