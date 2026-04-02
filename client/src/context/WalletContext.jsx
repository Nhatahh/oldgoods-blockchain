import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import api from "../api/api";
import { ensureValidiumNetwork } from "../blockchain/network";

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

  const refreshWalletInfo = async (addressParam) => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      const address = addressParam || walletAddress;
      if (!address) return;

      const balance = await provider.getBalance(address);

      setChainId(Number(network.chainId));
      setBalanceNative(ethers.formatEther(balance));
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Bạn chưa cài MetaMask");
        return;
      }

      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await ensureValidiumNetwork();

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
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
    } catch (error) {
      console.error(error);
      alert(error.message || "Kết nối ví thất bại");
    }
  };

  const logoutWallet = () => {
    clearLocalWalletState();
  };
  const changeWallet = async () => {
    try {
      clearLocalWalletState();

      if (!window.ethereum) {
        alert("Bạn chưa cài MetaMask");
        return;
      }

      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      await ensureValidiumNetwork();

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
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
    } catch (error) {
      console.error(error);
      alert(error.message || "Đổi ví thất bại");
    }
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
