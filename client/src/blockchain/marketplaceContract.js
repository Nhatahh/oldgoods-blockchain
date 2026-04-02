import { ethers } from "ethers";
import { ensureValidiumNetwork } from "./network";
import contractArtifact from "../contracts/MarketplaceEscrowHash.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const NATIVE_DECIMALS = Number(import.meta.env.VITE_NATIVE_DECIMALS || 18);

function normalizeBytes32(hashHex) {
  if (!hashHex) {
    throw new Error("Thiếu hash giao dịch.");
  }

  const normalized = "0x" + String(hashHex).replace(/^0x/, "");

  if (!ethers.isHexString(normalized, 32)) {
    throw new Error("Hash giao dịch không đúng định dạng bytes32.");
  }

  return normalized;
}

async function ensureWalletReady() {
  if (!window.ethereum) {
    throw new Error("Chưa cài MetaMask");
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error("Thiếu VITE_CONTRACT_ADDRESS trong file .env");
  }

  const provider = await ensureValidiumNetwork();
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    signer,
  );

  return { provider, signer, address, contract };
}

export async function depositForTradeOnChain({
  businessId,
  hashHex,
  sellerWallet,
  totalPriceNative,
  depositNative,
}) {
  const { contract } = await ensureWalletReady();

  const tx = await contract.depositForTrade(
    businessId,
    normalizeBytes32(hashHex),
    sellerWallet,
    ethers.parseUnits(String(totalPriceNative), NATIVE_DECIMALS),
    {
      value: ethers.parseUnits(String(depositNative), NATIVE_DECIMALS),
    },
  );

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
  };
}

export async function payRemainingOnChain({
  businessId,
  hashHex,
  remainingNative,
}) {
  const { contract } = await ensureWalletReady();

  const tx = await contract.payRemaining(
    businessId,
    normalizeBytes32(hashHex),
    {
      value: ethers.parseUnits(String(remainingNative), NATIVE_DECIMALS),
    },
  );

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
  };
}

export async function getTradeOnChain(businessId) {
  const { contract } = await ensureWalletReady();
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
