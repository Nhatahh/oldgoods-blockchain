import { Link, useLocation } from "react-router-dom";
import {
  Wallet,
  Landmark,
  ShieldCheck,
  LogOut,
  RefreshCcw,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import CopyButton from "./CopyButton";
import ThemeToggle from "./ThemeToggle";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Header() {
  const location = useLocation();
  const {
    walletAddress,
    isConnected,
    balanceNative,
    chainId,
    connectWallet,
    changeWallet,
    logoutWallet,
  } = useWallet();

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-logo">OG</div>
        <div>
          <h2>OldGoods Web3 Dashboard</h2>
          <p>Mua bán đồ cũ nội bộ • MetaMask • Validium • Escrow</p>
        </div>
      </div>

      <nav className="menu">
        <Link className={location.pathname === "/" ? "active-link" : ""} to="/">
          Trang chủ
        </Link>
        <Link
          className={location.pathname === "/add-product" ? "active-link" : ""}
          to="/add-product"
        >
          Đăng bán
        </Link>
        <Link
          className={location.pathname === "/transactions" ? "active-link" : ""}
          to="/transactions"
        >
          Giao dịch
        </Link>
      </nav>

      <div className="wallet-panel">
        <ThemeToggle />

        <div className="network-badges">
          <span className="top-badge">
            <Landmark size={14} />
            Validium
          </span>
          <span className="top-badge soft">
            <ShieldCheck size={14} />
            Chain {chainId || "?"}
          </span>
        </div>

        {isConnected ? (
          <div className="wallet-box-advanced">
            <div className="wallet-box-top">
              <div className="wallet-pill">
                <span className="dot"></span>
                <Wallet size={14} />
                {shortAddress(walletAddress)}
              </div>
              <CopyButton text={walletAddress} label="Đã copy địa chỉ ví" />
            </div>

            <div className="wallet-metrics">
              <small>Số dư</small>
              <strong>
                {Number(balanceNative).toFixed(4)} {NATIVE_SYMBOL}
              </strong>
            </div>

            <div className="wallet-action-row">
              <button
                className="btn btn-outline small-btn"
                onClick={changeWallet}
                type="button"
              >
                <RefreshCcw size={15} />
                Đổi ví
              </button>

              <button
                className="btn btn-danger small-btn"
                onClick={logoutWallet}
                type="button"
              >
                <LogOut size={15} />
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={connectWallet}>
            Kết nối MetaMask
          </button>
        )}
      </div>
    </header>
  );
}
