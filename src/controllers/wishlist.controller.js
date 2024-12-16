const wishlistModel = require("../models/wishlist.model");

// Thêm sản phẩm vào wishlist
const addWishlist = async (req, res) => {
  try {
    const { id } = req.user; // Lấy ID người dùng từ middleware
    const { productId } = req.body; // Lấy productId từ body request

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Kiểm tra sản phẩm đã tồn tại trong wishlist chưa
    const alreadyWishlist = await wishlistModel.findOne({
      userId: id,
      productId,
    });
    if (alreadyWishlist) {
      return res.status(400).json({
        success: false,
        message: "Product is already in your wishlist",
      });
    }

    // Thêm sản phẩm mới vào wishlist
    const newWishlist = new wishlistModel({
      userId: id,
      productId,
    });

    await newWishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully",
      wishlist: newWishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Lấy tất cả sản phẩm trong wishlist của người dùng
const getAllWishlist = async (req, res) => {
  try {
    const { id } = req.user; // Lấy ID người dùng từ middleware
    const wishlists = await wishlistModel
      .find({ userId: id }) // Lọc theo userId
      .populate("productId"); // Populate chi tiết productId từ model liên quan

    return res.status(200).json({
      success: true,
      wishlists,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Xóa sản phẩm khỏi wishlist
const deleteWishlist = async (req, res) => {
  try {
    const { pid } = req.params; // Lấy productId từ params
    const { id } = req.user; // Lấy userId từ middleware

    // Tìm sản phẩm trong wishlist của người dùng
    const wishlist = await wishlistModel.findOne({
      userId: id,
      productId: pid,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    // Xóa sản phẩm khỏi wishlist
    await wishlist.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
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
  addWishlist,
  getAllWishlist,
  deleteWishlist,
};
