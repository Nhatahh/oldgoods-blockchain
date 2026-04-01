const CryptoJS = require("crypto-js");

function canonicalTradeData(data) {
  return JSON.stringify({
    transactionId: data.transactionId,
    productId: data.productId,
    buyerWallet: data.buyerWallet.toLowerCase(),
    sellerWallet: data.sellerWallet.toLowerCase(),
    totalPriceNative: String(data.totalPriceNative),
    depositNative: String(data.depositNative),
    remainingNative: String(data.remainingNative),
    status: data.status,
  });
}

function sha256Hex(dataString) {
  return CryptoJS.SHA256(dataString).toString(CryptoJS.enc.Hex);
}

module.exports = {
  canonicalTradeData,
  sha256Hex,
};
