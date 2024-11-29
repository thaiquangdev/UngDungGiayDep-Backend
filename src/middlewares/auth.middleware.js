const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    let token;

    // Kiểm tra nếu header chứa Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user theo ID từ payload của token
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Gắn user vào request để các middleware sau có thể sử dụng
      req.user = user;
      return next();
    }

    // Nếu không có token
    return res.status(401).json({
      success: false,
      message: "Authorization token missing or invalid",
    });
  } catch (error) {
    // Nếu có lỗi trong quá trình xử lý
    return res.status(401).json({
      success: false,
      message: "Token is not valid",
      error: error.message,
    });
  }
};

module.exports = protect;
