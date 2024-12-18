const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        sucess: false,
        message: "user is not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not found",
      });
    }
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not match",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Change password is successful",
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
  getUser,
  changePassword,
};
