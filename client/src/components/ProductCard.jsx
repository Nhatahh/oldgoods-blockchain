import { Link } from "react-router-dom";
import { BadgeCheck, WalletCards } from "lucide-react";
import CopyButton from "./CopyButton";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ProductCard({ item }) {
  return (
    <article className="og-card">
      <div className="og-card__img-wrap">
        <img
          className="og-card__img"
          src={
            item.imageUrl || "https://via.placeholder.com/600x400?text=OldGoods"
          }
          alt={item.title}
          loading="lazy"
        />
        <span className={`og-status og-status--${item.status} og-card__badge`}>
          {item.status}
        </span>
      </div>

      <div className="og-card__body">
        <h3 className="og-card__title" title={item.title}>
          {item.title}
        </h3>

        <p className="og-card__desc">{item.description}</p>

        {/* Khung Giá (Dùng lại của MyProductCard) */}
        <div className="og-card__price-grid">
          <div className="og-card__price-item">
            <small>Giá tổng</small>
            <strong>
              {item.priceNative}{" "}
              <span className="og-symbol">{NATIVE_SYMBOL}</span>
            </strong>
          </div>
          <div className="og-card__price-item">
            <small>Đặt cọc</small>
            <strong>
              {item.depositNative}{" "}
              <span className="og-symbol">{NATIVE_SYMBOL}</span>
            </strong>
          </div>
        </div>

        {/* Khung Người Bán */}
        <div className="og-card__seller-row">
          <div className="og-card__seller-left">
            <WalletCards size={16} className="og-text-muted" />
            <span className="og-address-text">
              {shortAddress(item.sellerWallet)}
            </span>
          </div>
          <CopyButton text={item.sellerWallet} label="Đã copy ví người bán" />
        </div>

        {/* Khung Danh mục & Tem xác thực */}
        <div className="og-card__meta-row">
          <span className="og-mini-badge">{item.category || "Khác"}</span>
          <span
            className="og-mini-proof"
            title="Hỗ trợ giao dịch qua Smart Contract"
          >
            <BadgeCheck size={14} />
            Blockchain-ready
          </span>
        </div>

        <Link
          className="og-btn og-btn--primary og-btn--full og-card__action-btn"
          to={`/product/${item._id}`}
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}
