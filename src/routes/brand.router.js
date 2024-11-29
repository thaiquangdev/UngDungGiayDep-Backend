const express = require("express");

const protect = require("../middlewares/auth.middleware");
const {
  createBrand,
  getAllBrands,
  getBrandBySlug,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand.controller");

const router = express.Router();

router.post("/create-brand", protect, createBrand);
router.get("/get-brands", getAllBrands);
router.get("/get-brand/:slug", getBrandBySlug);
router.put("/update-brand/:slug", protect, updateBrand);
router.delete("/delete-brand/:slug", protect, deleteBrand);

module.exports = router;
