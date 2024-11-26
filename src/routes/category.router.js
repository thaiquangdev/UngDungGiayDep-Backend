const express = require("express");
const categoryModel = require("../models/category.model");
const {
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const router = express.Router();

router.post("/create-category", categoryModel);
router.get("/get-categories", getAllCategories);
router.get("/get-category/:slug", getCategoryBySlug);
router.put("/update-category/:slug", updateCategory);
router.delete("/delete-category/:slug", deleteCategory);

module.exports = router;
