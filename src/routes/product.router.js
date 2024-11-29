const express = require("express");
const protect = require("../middlewares/auth.middleware");
const {
  createProduct,
  getAllProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.post("/create-product", protect, createProduct);
router.get("/get-products", getAllProduct);
router.get("/get-product/:slug", getProductBySlug);
router.put("/update-product/:slug", protect, updateProduct);
router.delete("/delete-product/:slug", protect, deleteProduct);

module.exports = router;
