export const marketplaceAbi = [
  "function depositForTrade(string businessId, bytes32 dataHash, address seller, uint256 totalPrice) payable",
  "function payRemaining(string businessId, bytes32 newDataHash) payable",
  "function getTrade(string businessId) view returns (tuple(string businessId, bytes32 dataHash, address buyer, address seller, uint256 totalPrice, uint256 depositAmount, uint256 remainingAmount, uint256 createdAt, uint256 updatedAt, uint8 status))",
];
