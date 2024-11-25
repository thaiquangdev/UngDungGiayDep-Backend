const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// API đăng ký
const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    // các trường không được để trống
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "fullname, email and password is required",
      });
    }
    // kiểm tra xem email đã tồn tại chưa
    const emailExist = await userModel.findOne({ email });
    // nếu tồn tại thì không cho đăng ký
    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email is already",
      });
    }
    // mã hóa mật khẩu
    const hashPassword = bcrypt.hashSync(password, 12);
    // tạo mới người dùng
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

// API đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // các trường không được để trống
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password required",
      });
    }
    // kiểm tra xem email đã tồn tại chưa
    const emailExist = await userModel.findOne({ email });
    // nếu tồn tại thì không cho đăng ký
    if (!emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email is not already",
      });
    }

    // so sánh mật khẩu
    const comparePassword = bcrypt.compareSync(password, emailExist.password);
    // nếu comparePassword trả về false thì không đúng
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not match",
      });
    }

    const accessToken = jwt.sign(
      { id: emailExist._id, email: emailExist.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { id: emailExist._id, email: emailExist.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // lưu refreshToken vào cookie
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
    });

    // lưu refreshToken vào db
    emailExist.refreshToken = refreshToken;
    await emailExist.save();

    return res.status(200).json({
      success: true,
      token: accessToken,
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
  login,
};
