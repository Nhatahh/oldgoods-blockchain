const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const { getTradeFromChain } = require("../utils/blockchainRead");

router.get("/:transactionId", async (req, res) => {
  try {
    const transaction = await Transaction.findById(
      req.params.transactionId,
    ).populate("productId");

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    const onChainTrade = await getTradeFromChain(transaction._id.toString());

    const localHash = "0x" + transaction.txHashLocal.replace(/^0x/, "");
    const chainHash = onChainTrade.dataHash;

    const isMatch = localHash.toLowerCase() === chainHash.toLowerCase();

    return res.json({
      transactionId: transaction._id,
      localHash,
      chainHash,
      isMatch,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi verify giao dịch" });
  }
});

module.exports = router;
