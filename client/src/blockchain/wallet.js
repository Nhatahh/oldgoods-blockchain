import { ensureValidiumNetwork, requireValidiumNetwork } from "./network";

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("Không tìm thấy MetaMask. Vui lòng cài đặt MetaMask.");
  }

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const provider = await requireValidiumNetwork();
  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();

  return {
    provider,
    signer,
    walletAddress,
  };
}

export async function connectWalletAndEnsureValidium() {
  if (!window.ethereum) {
    throw new Error("Không tìm thấy MetaMask. Vui lòng cài đặt MetaMask.");
  }

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const provider = await ensureValidiumNetwork();
  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();

  return {
    provider,
    signer,
    walletAddress,
  };
}

export async function getConnectedWallet() {
  if (!window.ethereum) {
    throw new Error("Không tìm thấy MetaMask.");
  }

  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  });

  if (!accounts || accounts.length === 0) {
    throw new Error("Chưa có ví nào được kết nối.");
  }

  const provider = await requireValidiumNetwork();
  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();

  return {
    provider,
    signer,
    walletAddress,
  };
}
