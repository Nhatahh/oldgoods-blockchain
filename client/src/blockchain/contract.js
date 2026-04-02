import { ethers } from "ethers";
import contractArtifact from "../../../contract/artifacts/contracts/MarketplaceEscrowHash.sol/MarketplaceEscrowHash.json";
import { ensureValidiumNetwork } from "./network";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  console.warn("Thiếu VITE_CONTRACT_ADDRESS trong file .env");
}

export async function getEscrowContract() {
  const provider = await ensureValidiumNetwork();
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    signer,
  );

  return { provider, signer, contract };
}

export function toBytes32Hash(hashValue) {
  if (!hashValue) {
    throw new Error("Thiếu giá trị hash.");
  }

  if (ethers.isHexString(hashValue, 32)) {
    return hashValue;
  }

  // Nếu đầu vào là chuỗi thường thì tự băm sang bytes32
  return ethers.keccak256(ethers.toUtf8Bytes(hashValue));
}
