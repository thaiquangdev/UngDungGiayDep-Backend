const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
    brandSlug: {
      type: String,
      required: true,
    },
    isActive: {
      type: String,
      default: true,
    },
  },
  { timestamps: true }
);

const brandModel = mongoose.model("Brand", brandSchema);

module.exports = brandModel;
