const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const { canonicalTradeData, sha256Hex } = require("../utils/hash");

router.get("/", async (req, res) => {
  try {
    const data = await Transaction.find()
      .populate("productId")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy danh sách giao dịch" });
  }
});

router.post("/prepare-deposit", async (req, res) => {
  try {
    const { productId, buyerWallet } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    if (product.status !== "available") {
      return res.status(400).json({ message: "Sản phẩm không còn khả dụng" });
    }

    if (product.sellerWallet.toLowerCase() === buyerWallet.toLowerCase()) {
      return res
        .status(400)
        .json({ message: "Người bán không thể tự mua sản phẩm của mình" });
    }

    const totalPriceNative = product.priceNative;
    const depositNative = product.depositNative;
    const remainingNative = (
      Number(totalPriceNative) - Number(depositNative)
    ).toString();

    const draft = await Transaction.create({
      productId: product._id,
      buyerWallet: buyerWallet.toLowerCase(),
      sellerWallet: product.sellerWallet.toLowerCase(),
      totalPriceNative,
      depositNative,
      remainingNative,
      status: "draft",
      txDataString: "draft",
      txHashLocal: "draft",
    });

    const tradeData = {
      transactionId: draft._id.toString(),
      productId: product._id.toString(),
      buyerWallet: buyerWallet.toLowerCase(),
      sellerWallet: product.sellerWallet.toLowerCase(),
      totalPriceNative,
      depositNative,
      remainingNative,
      status: "deposited",
    };

    const txDataString = canonicalTradeData(tradeData);
    const txHashLocal = sha256Hex(txDataString);

    draft.txDataString = txDataString;
    draft.txHashLocal = txHashLocal;
    await draft.save();

    return res.json({
      transactionId: draft._id,
      product,
      tradeData,
      txHashLocal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi prepare deposit" });
  }
});

router.post("/:id/confirm-deposit", async (req, res) => {
  try {
    const { depositTxHash } = req.body;

    const tx = await Transaction.findById(req.params.id).populate("productId");
    if (!tx) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    tx.status = "deposited";
    tx.depositTxHash = depositTxHash;
    tx.verified = true;
    await tx.save();

    const product = await Product.findById(tx.productId._id);
    if (product) {
      product.status = "reserved";
      await product.save();
    }

    return res.json({
      message: "Đã xác nhận đặt cọc",
      transaction: tx,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi confirm deposit" });
  }
});

router.post("/:id/prepare-remaining", async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id).populate("productId");
    if (!tx) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    if (tx.status !== "deposited") {
      return res
        .status(400)
        .json({ message: "Giao dịch chưa ở trạng thái deposited" });
    }

    const tradeData = {
      transactionId: tx._id.toString(),
      productId: tx.productId._id.toString(),
      buyerWallet: tx.buyerWallet.toLowerCase(),
      sellerWallet: tx.sellerWallet.toLowerCase(),
      totalPriceNative: tx.totalPriceNative,
      depositNative: tx.depositNative,
      remainingNative: tx.remainingNative,
      status: "completed",
    };

    const txDataString = canonicalTradeData(tradeData);
    const txHashLocal = sha256Hex(txDataString);

    return res.json({
      transactionId: tx._id,
      remainingNative: tx.remainingNative,
      txHashLocal,
      txDataString,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi prepare remaining" });
  }
});

router.post("/:id/confirm-remaining", async (req, res) => {
  try {
    const { remainingTxHash, txHashLocal, txDataString } = req.body;

    const tx = await Transaction.findById(req.params.id).populate("productId");
    if (!tx) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    tx.status = "completed";
    tx.remainingTxHash = remainingTxHash;
    tx.txHashLocal = txHashLocal;
    tx.txDataString = txDataString;
    tx.verified = true;
    await tx.save();

    const product = await Product.findById(tx.productId._id);
    if (product) {
      product.status = "completed";
      await product.save();
    }

    return res.json({
      message: "Đã xác nhận thanh toán phần còn lại",
      transaction: tx,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi confirm remaining" });
  }
});

module.exports = router;
