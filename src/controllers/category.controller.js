const slugify = require("slugify");
const categoryModel = require("../models/category.model");

// API Tạo mới danh mục sản phẩm
const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const categorySlug = slugify(categoryName);
    const category = await categoryModel.findOne({ categorySlug });
    if (category) {
      return res.status(400).json({
        success: false,
        message: "Category is already",
      });
    }
    const newCategory = new categoryModel({
      categoryName,
      categorySlug,
    });
    await newCategory.save();
    return res.status(201).json({
      success: true,
      message: "Create category is successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// API lấy ra danh sách sản phẩm
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// API lấy sản phẩm theo slug được truyền từ params
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ categorySlug: slug });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is not found",
      });
    }
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// API cập nhật danh mục sản phẩm với slug được truyền từ params.
const updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { categoryName } = req.body;
    const category = await categoryModel.findOne({ categorySlug: slug });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is not found",
      });
    }
    const categorySlug = slugify(categoryName);
    category.categoryName = categoryName;
    category.categorySlug = categorySlug;
    await category.save();
    return res.status(200).json({
      success: true,
      message: "Update category is successful",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// API xóa danh mục sản phẩm với slug được truyền từ params
const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ categorySlug: slug });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is not found",
      });
    }
    await category.deleteOne();
    return rres.status(200).json({
      success: true,
      message: "Delete category is successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internals server error",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
