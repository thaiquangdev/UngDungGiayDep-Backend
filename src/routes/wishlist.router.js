const express = require("express");
const {
  addWishlist,
  getAllWishlist,
  deleteWishlist,
} = require("../controllers/wishlist.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add-wishlist", protect, addWishlist);
router.get("/get-wishlists", protect, getAllWishlist);
router.delete("/delete-wishlist/:pid", protect, deleteWishlist);

module.exports = router;
