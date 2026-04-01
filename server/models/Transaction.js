const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    buyerWallet: { type: String, required: true, lowercase: true },
    sellerWallet: { type: String, required: true, lowercase: true },

    totalPriceNative: { type: String, required: true },
    depositNative: { type: String, required: true },
    remainingNative: { type: String, required: true },

    status: {
      type: String,
      enum: ["draft", "deposited", "completed"],
      default: "draft",
    },

    txDataString: { type: String, required: true },
    txHashLocal: { type: String, required: true },

    depositTxHash: { type: String, default: "" },
    remainingTxHash: { type: String, default: "" },

    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
