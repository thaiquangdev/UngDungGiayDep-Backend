const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    slug: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    images: [
      {
        imageUrl: {
          type: String,
          required: true,
        },
        imageId: {
          type: String,
          required: true,
        },
      },
    ],
    ratingAvg: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    variants: [
      {
        size: {
          type: String,
        },
        sku: {
          type: String,
        },
        stock: {
          type: Number,
          required: true,
          min: [0, "Stock cannot be negative"],
        },
        sold: {
          type: Number,
          default: 0,
          min: [0, "Sold count cannot be negative"],
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Tự động thêm `createdAt` và `updatedAt`
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
