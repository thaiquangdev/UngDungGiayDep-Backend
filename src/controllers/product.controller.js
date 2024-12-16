const { default: slugify } = require("slugify");
const productModel = require("../models/product.model");
const cloudinary = require("../configs/cloudinary");
const fs = require("fs");

const createProduct = async (req, res) => {
  try {
    const { title, description, price, brand, category, variants } = req.body;

    if (!title || !description || !price || !brand || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const slug = slugify(title);

    // Kiểm tra sản phẩm đã tồn tại
    const existingProduct = await productModel.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }

    // Tạo mới sản phẩm
    const parsedVariants = JSON.parse(variants);
    const newProduct = new productModel({
      title,
      slug,
      description,
      price,
      brand,
      category,
      variants: parsedVariants,
    });

    // Upload ảnh lên Cloudinary
    const imagePromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "ungdunggiaydep" })
    );
    const uploadResults = await Promise.all(imagePromises);
    const images = uploadResults.map((result) => ({
      imageUrl: result.secure_url,
      imageId: result.public_id,
    }));

    // Lưu ảnh vào DB
    newProduct.images = images;

    // Lưu sản phẩm
    await newProduct.save();

    // Xóa file tạm trên server
    files.forEach((file) => fs.unlinkSync(file.path));

    return res.status(201).json({
      success: true,
      message: "Create product is successful",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8; // Giới hạn số sản phẩm mỗi trang
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const skip = (page - 1) * limit; // Số lượng sản phẩm cần bỏ qua

    const { sort } = req.query;
    // Cấu hình sắp xếp mặc định
    let sortOption = {};
    switch (parseInt(sort)) {
      case 1:
        sortOption.sold = -1; // Bán chạy nhất (giảm dần)
        break;
      case 2:
        sortOption.totalRating = -1; // Đánh giá cao nhất (giảm dần)
        break;
      case 3:
        sortOption.createdAt = -1; // Mới nhất (giảm dần)
        break;
      case 4:
        sortOption.price = 1; // Giá tăng dần
        break;
      case 5:
        sortOption.price = -1; // Giá giảm dần
        break;
      default:
        sortOption._id = 1; // Mặc định (id tăng dần)
        break;
    }

    // Điều kiện lọc
    const whereCondition = {};
    if (req.query.name) {
      whereCondition.title = { $regex: req.query.name, $options: "i" }; // Tìm kiếm theo tên (không phân biệt hoa thường)
    }

    if (req.query.category) {
      whereCondition.category = req.query.category;
    }

    // Lấy danh sách sản phẩm
    const products = await productModel
      .find(whereCondition) // Áp dụng điều kiện lọc
      .limit(limit) // Giới hạn số lượng sản phẩm
      .skip(skip) // Bỏ qua các sản phẩm trước đó
      .sort(sortOption) // Sắp xếp theo điều kiện
      .populate("brand", "brandName") // Populate trường "brand" (chỉ lấy "brandName")
      .populate("category", "categoryName"); // Populate trường "category" (chỉ lấy "categoryName")

    // Trả về kết quả
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel.findOne({ slug });
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is not found",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      brand,
      category,
      variants, // Dữ liệu variants gửi từ client
    } = req.body;

    const files = req.files;
    const { slug } = req.params;

    // Tìm sản phẩm cần cập nhật
    const product = await productModel.findOne({ slug });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Cập nhật thông tin sản phẩm
    const productSlug = title ? slugify(title) : product.slug;

    product.title = title || product.title;
    product.slug = productSlug;
    product.price = price || product.price;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.variants = variants || product.variants;

    // Xử lý ảnh (nếu có)
    if (files && files.length > 0) {
      // Xóa ảnh cũ trong Cloudinary
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.imageId);
      }

      // Upload ảnh mới
      const imagePromises = files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "ungdunggiaydep" })
      );
      const uploadResults = await Promise.all(imagePromises);
      const newImages = uploadResults.map((result) => ({
        imageUrl: result.secure_url,
        imageId: result.public_id,
      }));

      product.images = newImages;

      // Xóa file tạm sau khi upload
      files.forEach((file) => fs.unlinkSync(file.path));
    }

    // Lưu sản phẩm sau khi cập nhật
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product, // Trả về thông tin sản phẩm sau khi cập nhật
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { slug } = req.params;

    // Tìm sản phẩm cần cập nhật
    const product = await productModel.findOne({ slug });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    for (image of product.images) {
      await cloudinary.uploader.destroy(image.imageId);
    }
    await product.deleteOne();
    return res.status(200).json({
      success: true,
      message: "delete product is successful",
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
  createProduct,
  getAllProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
