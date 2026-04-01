import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import api from "../api/api";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(
    localStorage.getItem("walletAddress") || "",
  );
  const [isConnected, setIsConnected] = useState(
    !!localStorage.getItem("walletAddress"),
  );
  const [balanceNative, setBalanceNative] = useState("0");
  const [chainId, setChainId] = useState("");
  const nativeDecimals = Number(import.meta.env.VITE_NATIVE_DECIMALS || 18);

  const clearLocalWalletState = () => {
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("sessionTokenBase64");
    setWalletAddress("");
    setIsConnected(false);
    setBalanceNative("0");
    setChainId("");
  };

  const refreshWalletInfo = async (addressInput = null) => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    setChainId(network.chainId.toString());

    const address = addressInput || walletAddress;
    if (!address) return;

    const balance = await provider.getBalance(address);
    setBalanceNative(ethers.formatUnits(balance, nativeDecimals));
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Bạn chưa cài MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts?.[0] || "";

    if (!address) return;

    setWalletAddress(address);
    setIsConnected(true);
    localStorage.setItem("walletAddress", address);

    const loginRes = await api.post("/auth/metamask-login", {
      walletAddress: address,
    });
    if (loginRes.data?.sessionTokenBase64) {
      localStorage.setItem(
        "sessionTokenBase64",
        loginRes.data.sessionTokenBase64,
      );
    }

    await refreshWalletInfo(address);
  };

  const logoutWallet = () => {
    clearLocalWalletState();
  };

  const changeWallet = async () => {
    clearLocalWalletState();

    if (!window.ethereum) {
      alert("Bạn chưa cài MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts?.[0] || "";
    if (!address) return;

    setWalletAddress(address);
    setIsConnected(true);
    localStorage.setItem("walletAddress", address);

    const loginRes = await api.post("/auth/metamask-login", {
      walletAddress: address,
    });
    if (loginRes.data?.sessionTokenBase64) {
      localStorage.setItem(
        "sessionTokenBase64",
        loginRes.data.sessionTokenBase64,
      );
    }

    await refreshWalletInfo(address);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      const next = accounts?.[0] || "";

      if (!next) {
        clearLocalWalletState();
        return;
      }

      setWalletAddress(next);
      setIsConnected(true);
      localStorage.setItem("walletAddress", next);

      const loginRes = await api.post("/auth/metamask-login", {
        walletAddress: next,
      });
      if (loginRes.data?.sessionTokenBase64) {
        localStorage.setItem(
          "sessionTokenBase64",
          loginRes.data.sessionTokenBase64,
        );
      }

      await refreshWalletInfo(next);
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      refreshWalletInfo(walletAddress);
    }
  }, [walletAddress]);

  const value = useMemo(
    () => ({
      walletAddress,
      isConnected,
      balanceNative,
      chainId,
      connectWallet,
      logoutWallet,
      changeWallet,
      refreshWalletInfo,
    }),
    [walletAddress, isConnected, balanceNative, chainId],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
