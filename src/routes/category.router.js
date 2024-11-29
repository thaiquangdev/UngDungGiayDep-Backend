const express = require("express");
const {
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  createCategory,
} = require("../controllers/category.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create-category", protect, createCategory);
router.get("/get-categories", getAllCategories);
router.get("/get-category/:slug", getCategoryBySlug);
router.put("/update-category/:slug", protect, updateCategory);
router.delete("/delete-category/:slug", protect, deleteCategory);

module.exports = router;
