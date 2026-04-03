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
import logo from "../images/logo.png";

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
    <header className="og-header">
      <div className="og-header__container">
        {/* Left: Brand */}
        <div className="og-brand">
          <img src={logo} alt="logo" />
        </div>

        {/* Center: Navigation */}
        <nav className="og-nav">
          <Link
            className={`og-nav__link ${location.pathname === "/" ? "og-nav__link--active" : ""}`}
            to="/"
          >
            Trang chủ
          </Link>
          <Link
            className={`og-nav__link ${location.pathname === "/add-product" ? "og-nav__link--active" : ""}`}
            to="/add-product"
          >
            Đăng bán
          </Link>
          <Link
            className={`og-nav__link ${location.pathname === "/transactions" ? "og-nav__link--active" : ""}`}
            to="/transactions"
          >
            Giao dịch
          </Link>
        </nav>

        {/* Right: Wallet & Actions */}
        <div className="og-wallet-panel">
          <div className="og-wallet-panel__tools">
            <ThemeToggle />
            <div className="og-badges">
              <span className="og-badge og-badge--primary">
                <Landmark size={14} /> Validium
              </span>
              <span className="og-badge og-badge--soft">
                <ShieldCheck size={14} /> Chain {chainId || "?"}
              </span>
            </div>
          </div>

          {isConnected ? (
            <div className="og-wallet-card">
              <div className="og-wallet-card__header">
                <div className="og-wallet-card__pill">
                  <span className="og-status-dot"></span>
                  <Wallet size={14} />
                  <span className="og-address">
                    {shortAddress(walletAddress)}
                  </span>
                </div>
                <CopyButton text={walletAddress} label="Đã copy!" />
              </div>

              <div className="og-wallet-card__metrics">
                <span className="og-metrics-label">Số dư</span>
                <strong className="og-metrics-value">
                  {Number(balanceNative).toFixed(4)}{" "}
                  <span className="og-symbol">{NATIVE_SYMBOL}</span>
                </strong>
              </div>

              <div className="og-wallet-card__actions">
                <button
                  className="og-btn og-btn--outline"
                  onClick={changeWallet}
                  type="button"
                >
                  <RefreshCcw size={14} /> Đổi ví
                </button>
                <button
                  className="og-btn og-btn--danger"
                  onClick={logoutWallet}
                  type="button"
                >
                  <LogOut size={14} /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <button className="og-btn og-btn--primary" onClick={connectWallet}>
              <Wallet size={18} /> Kết nối MetaMask
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
