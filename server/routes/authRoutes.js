const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/metamask-login", async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: "Thiếu walletAddress" });
    }

    const normalizedWallet = walletAddress.toLowerCase();

    let user = await User.findOne({ walletAddress: normalizedWallet });

    const payload = {
      walletAddress: normalizedWallet,
      loginAt: new Date().toISOString(),
    };

    const sessionTokenBase64 = Buffer.from(JSON.stringify(payload)).toString(
      "base64",
    );

    if (!user) {
      user = await User.create({
        walletAddress: normalizedWallet,
        displayName: `User_${normalizedWallet.slice(2, 8)}`,
        role: "user",
        sessionTokenBase64,
      });
    } else {
      user.sessionTokenBase64 = sessionTokenBase64;
      await user.save();
    }

    return res.json({
      message: "Đăng nhập MetaMask thành công",
      user,
      sessionTokenBase64,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
