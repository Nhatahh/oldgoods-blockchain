import { ethers } from "ethers";
import { getEscrowContract, toBytes32Hash } from "./contract";

export async function depositForTrade({
  businessId,
  dataHash,
  seller,
  totalPriceNative,
  depositNative,
}) {
  if (!businessId) throw new Error("Thiếu businessId.");
  if (!seller) throw new Error("Thiếu địa chỉ seller.");
  if (!totalPriceNative) throw new Error("Thiếu totalPriceNative.");
  if (!depositNative) throw new Error("Thiếu depositNative.");

  const { contract } = await getEscrowContract();

  const totalPriceWei = ethers.parseEther(String(totalPriceNative));
  const depositWei = ethers.parseEther(String(depositNative));
  const dataHashBytes32 = toBytes32Hash(dataHash);

  const tx = await contract.depositForTrade(
    businessId,
    dataHashBytes32,
    seller,
    totalPriceWei,
    {
      value: depositWei,
    },
  );

  const receipt = await tx.wait();

  return {
    txHash: tx.hash,
    receipt,
  };
}

export async function payRemaining({
  businessId,
  newDataHash,
  remainingNative,
}) {
  if (!businessId) throw new Error("Thiếu businessId.");
  if (!remainingNative) throw new Error("Thiếu remainingNative.");

  const { contract } = await getEscrowContract();

  const remainingWei = ethers.parseEther(String(remainingNative));
  const newDataHashBytes32 = toBytes32Hash(newDataHash);

  const tx = await contract.payRemaining(businessId, newDataHashBytes32, {
    value: remainingWei,
  });

  const receipt = await tx.wait();

  return {
    txHash: tx.hash,
    receipt,
  };
}

export async function getTradeOnChain(businessId) {
  if (!businessId) throw new Error("Thiếu businessId.");

  const { contract } = await getEscrowContract();
  const trade = await contract.getTrade(businessId);

  return {
    businessId: trade.businessId,
    dataHash: trade.dataHash,
    buyer: trade.buyer,
    seller: trade.seller,
    totalPrice: trade.totalPrice.toString(),
    depositAmount: trade.depositAmount.toString(),
    remainingAmount: trade.remainingAmount.toString(),
    createdAt: Number(trade.createdAt),
    updatedAt: Number(trade.updatedAt),
    status: Number(trade.status),
  };
}
