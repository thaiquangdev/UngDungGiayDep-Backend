const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  state: {
    type: String,
    default: "pending",
  },
  cartDetails: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      size: {
        type: String,
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
