import { useState } from "react";
import api from "../api/api";

export default function WalletConnect({ onLogin }) {
  const [wallet, setWallet] = useState(
    localStorage.getItem("walletAddress") || "",
  );

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Bạn chưa cài MetaMask");
        return;
      }

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
    }
  };

  return (
    <div className="wallet-box">
      {wallet ? (
        <p>
          Ví đang dùng: <strong>{wallet}</strong>
        </p>
      ) : (
        <button onClick={connectWallet}>Kết nối MetaMask</button>
      )}
    </div>
  );
}
