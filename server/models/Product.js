const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    priceNative: { type: String, required: true },
    depositNative: { type: String, required: true },
    category: { type: String, default: "Khác" },
    imageUrl: { type: String, default: "" },
    sellerWallet: { type: String, required: true, lowercase: true },
    status: {
      type: String,
      enum: ["available", "reserved", "completed"],
      default: "available",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
