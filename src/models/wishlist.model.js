const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const wishlistModel = mongoose.model("Wishlist", wishlistSchema);

module.exports = wishlistModel;
