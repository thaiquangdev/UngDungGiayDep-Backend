const { default: slugify } = require("slugify");
const brandModel = require("../models/brand.model");

const createBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!brandName) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    const slug = slugify(brandName, { lower: true });

    // Kiểm tra xem brandSlug đã tồn tại chưa
    const brand = await brandModel.findOne({ brandSlug: slug });
    if (brand) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    // Tạo brand mới
    const newBrand = new brandModel({
      brandName,
      brandSlug: slug,
    });
    await newBrand.save();

    return res.status(201).json({
      success: true,
      message: "Create brand is successful",
      data: newBrand,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const brands = await brandModel.find();
    return res.status(200).json({
      success: true,
      brands,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getBrandBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const brand = await brandModel.findOne({ brandSlug: slug });
    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand is not found",
      });
    }
    return res.status(200).json({
      success: true,
      brand,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    const { slug } = req.params;
    const brand = await brandModel.findOne({ brandSlug: slug });
    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand is not found",
      });
    }
    const brandSlug = brandName ? slugify(brandName) : slug;
    brand.brandName = brandName;
    brand.brandSlug = brandSlug;
    await brand.save();
    return res.status(200).json({
      success: true,
      message: "Update brand is successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { slug } = req.params;
    const brand = await brandModel.findOne({ brandSlug: slug });
    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand is not found",
      });
    }
    await brand.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Delete brand is successful",
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
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandBySlug,
};
