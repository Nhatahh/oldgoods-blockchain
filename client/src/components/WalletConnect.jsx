import { useState } from "react";
import { Wallet, CheckCircle2 } from "lucide-react";
import { useWallet } from "../context/WalletContext";

function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function WalletConnect({ onLogin }) {
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const address = await connectWallet();
      if (onLogin && address) onLogin(address);
    } catch (error) {
      console.error(error);
      alert(error.message || "Kết nối ví thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="og-wallet-connect">
      {isConnected && walletAddress ? (
        <div className="og-wallet-inline">
          <CheckCircle2 size={18} className="og-text-success" />
          <span>
            Ví đang dùng:{" "}
            <strong className="og-address-text">
              {shortAddress(walletAddress)}
            </strong>
          </span>
        </div>
      ) : (
        <button
          className="og-btn og-btn--primary"
          onClick={handleConnect}
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
