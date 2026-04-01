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
    <article className="product-card premium-card">
      <div className="product-image-wrap">
        <img
          src={
            item.imageUrl || "https://via.placeholder.com/600x400?text=OldGoods"
          }
          alt={item.title}
        />
        <span className={`status-chip overlay ${item.status}`}>
          {item.status}
        </span>
      </div>

      <div className="product-card-body">
        <div className="row-between gap-top">
          <h3 className="product-title">{item.title}</h3>
        </div>

        <p className="desc line-clamp-2">{item.description}</p>

        <div className="price-box">
          <div>
            <small>Giá tổng</small>
            <strong>
              {item.priceNative} {NATIVE_SYMBOL}
            </strong>
          </div>
          <div>
            <small>Đặt cọc</small>
            <strong>
              {item.depositNative} {NATIVE_SYMBOL}
            </strong>
          </div>
        </div>

        <div className="seller-row">
          <div className="seller-left">
            <WalletCards size={16} />
            <span>{shortAddress(item.sellerWallet)}</span>
          </div>
          <CopyButton text={item.sellerWallet} label="Đã copy địa chỉ ví" />
        </div>

        <div className="category-row">
          <span className="mini-badge">{item.category || "Khác"}</span>
          <span className="mini-proof">
            <BadgeCheck size={14} />
            Blockchain-ready
          </span>
        </div>

        <Link className="btn btn-primary full" to={`/product/${item._id}`}>
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}
