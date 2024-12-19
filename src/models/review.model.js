const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    comment: {
      type: String,
    },
    star: {
      type: number,
    },
  },
  { timestamp: true }
);

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
