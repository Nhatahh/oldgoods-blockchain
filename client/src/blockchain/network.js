import { ethers } from "ethers";

export const VALIDIUM_CHAIN_ID = 567;
export const VALIDIUM_CHAIN_ID_HEX = "0x237";

export const VALIDIUM_NETWORK_PARAMS = {
  chainId: VALIDIUM_CHAIN_ID_HEX,
  chainName: "Validium",
  nativeCurrency: {
    name: "Validium Native",
    symbol: "VLDM",
    decimals: 18,
  },
  rpcUrls: ["https://testnet.l2.rpc.validium.network/"],
  blockExplorerUrls: [],
};

export async function getBrowserProvider() {
  if (!window.ethereum) {
    throw new Error("Không tìm thấy MetaMask. Vui lòng cài đặt MetaMask.");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

export async function getCurrentChainId() {
  const provider = await getBrowserProvider();
  const network = await provider.getNetwork();
  return Number(network.chainId);
}

export async function ensureValidiumNetwork() {
  if (!window.ethereum) {
    throw new Error("Không tìm thấy MetaMask. Vui lòng cài đặt MetaMask.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  const currentChainId = Number(network.chainId);

  if (currentChainId === VALIDIUM_CHAIN_ID) {
    return provider;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: VALIDIUM_CHAIN_ID_HEX }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [VALIDIUM_NETWORK_PARAMS],
        });

        // ép switch lại sau khi add
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: VALIDIUM_CHAIN_ID_HEX }],
        });
      } catch {
        throw new Error("Không thể thêm hoặc chuyển sang mạng Validium.");
      }
    } else {
      throw new Error("Vui lòng chuyển MetaMask sang mạng Validium.");
    }
  }

  const providerAfterSwitch = new ethers.BrowserProvider(window.ethereum);
  const newNetwork = await providerAfterSwitch.getNetwork();

  if (Number(newNetwork.chainId) !== VALIDIUM_CHAIN_ID) {
    throw new Error("MetaMask chưa chuyển sang đúng mạng Validium.");
  }

  return providerAfterSwitch;
}

export async function requireValidiumNetwork() {
  if (!window.ethereum) {
    throw new Error("Không tìm thấy MetaMask. Vui lòng cài đặt MetaMask.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  const currentChainId = Number(network.chainId);

  if (currentChainId !== VALIDIUM_CHAIN_ID) {
    throw new Error(
      "Vui lòng chuyển MetaMask sang mạng Validium để đăng nhập.",
    );
  }

  return provider;
}

export function registerChainChangedHandler(onInvalidNetwork, onValidNetwork) {
  if (!window.ethereum) return () => {};

  const handler = (chainIdHex) => {
    const chainId = parseInt(chainIdHex, 16);

    if (chainId === VALIDIUM_CHAIN_ID) {
      if (typeof onValidNetwork === "function") onValidNetwork(chainId);
    } else {
      if (typeof onInvalidNetwork === "function") onInvalidNetwork(chainId);
    }
  };

  window.ethereum.on("chainChanged", handler);

  return () => {
    if (window.ethereum?.removeListener) {
      window.ethereum.removeListener("chainChanged", handler);
    }
  };
}
