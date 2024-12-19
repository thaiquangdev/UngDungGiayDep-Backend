const express = require("express");
const protect = require("../middlewares/auth.middleware");
const {
  createReview,
  getAllReview,
} = require("../controllers/review.controller");

const router = express.Router();

router.post("/create-review", protect, createReview);
router.get("/get-reviews/:productId", protect, getAllReview);

module.exports = router;
