import { useState } from "react";
import { Wallet, CheckCircle2 } from "lucide-react";
import api from "../api/api";

function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function WalletConnect({ onLogin }) {
  const [wallet, setWallet] = useState(
    localStorage.getItem("walletAddress") || "",
  );
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Bạn chưa cài MetaMask");
        return;
      }

      setLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];

      const res = await api.post("/auth/metamask-login", { walletAddress });

      localStorage.setItem("walletAddress", walletAddress);
      localStorage.setItem("sessionTokenBase64", res.data.sessionTokenBase64);

      setWallet(walletAddress);
      if (onLogin) onLogin(walletAddress);
    } catch (error) {
      console.error(error);
      alert("Kết nối ví thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="og-wallet-connect">
      {wallet ? (
        <div className="og-wallet-inline">
          <CheckCircle2 size={18} className="og-text-success" />
          <span>
            Ví đang dùng:{" "}
            <strong className="og-address-text">{shortAddress(wallet)}</strong>
          </span>
        </div>
      ) : (
        <button
          className="og-btn og-btn--primary"
          onClick={connectWallet}
          disabled={loading}
          type="button"
        >
          <Wallet size={18} />
          {loading ? "Đang mở MetaMask..." : "Kết nối MetaMask"}
        </button>
      )}
    </div>
  );
}
