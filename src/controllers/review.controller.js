const productModel = require("../models/product.model");
const reviewModel = require("../models/review.model");

const createReview = async (req, res) => {
  try {
    const { id } = req.user; // ID người dùng từ middleware xác thực
    const { comment, rating, productId } = req.body;

    // Kiểm tra nếu thiếu các trường cần thiết
    if (!comment || !rating || !productId) {
      return res.status(400).json({
        success: false,
        message: "Comment, rating, and product ID are required",
      });
    }

    // Kiểm tra sản phẩm có tồn tại hay không
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Tạo một đánh giá mới
    const newComment = new reviewModel({
      comment,
      rating,
      userId: id,
      productId,
    });
    await newComment.save();

    // Tính toán rating trung bình
    const reviews = await reviewModel.find({ product: productId });
    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    const avgRating = parseFloat((totalRating / reviews.length).toFixed(2)); // Làm tròn đến 2 chữ số thập phân

    // Cập nhật rating trung bình cho sản phẩm
    product.ratingAvg = avgRating;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Review product is successful",
      review: newComment,
      ratingAvg: avgRating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllReview = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({
        product: req.params.productId,
      })
      .populate("user");
    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { createReview, getAllReview };
