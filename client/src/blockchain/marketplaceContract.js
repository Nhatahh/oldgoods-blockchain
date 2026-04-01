import { ethers } from "ethers";
import { marketplaceAbi } from "./marketplaceAbi";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const TARGET_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 567);
const NATIVE_DECIMALS = Number(import.meta.env.VITE_NATIVE_DECIMALS || 18);

async function ensureWalletReady() {
  if (!window.ethereum) {
    throw new Error("Chưa cài MetaMask");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  const currentChainId = Number(network.chainId);

  if (currentChainId !== TARGET_CHAIN_ID) {
    throw new Error(
      `Sai mạng. Hãy chuyển MetaMask sang chainId ${TARGET_CHAIN_ID}`,
    );
  }

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    marketplaceAbi,
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
    "0x" + hashHex.replace(/^0x/, ""),
    sellerWallet,
    ethers.parseUnits(totalPriceNative, NATIVE_DECIMALS),
    {
      value: ethers.parseUnits(depositNative, NATIVE_DECIMALS),
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
    "0x" + hashHex.replace(/^0x/, ""),
    {
      value: ethers.parseUnits(remainingNative, NATIVE_DECIMALS),
    },
  );

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
  };
}
