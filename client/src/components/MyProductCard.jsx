import { Pencil, Trash2 } from "lucide-react";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

export default function MyProductCard({ item, onEdit, onDelete }) {
  const canEditOrDelete = item.status === "available";

  return (
    <article className="og-card">
      {/* Khối Hình Ảnh */}
      <div className="og-card__img-wrap">
        <img
          className="og-card__img"
          src={
            item.imageUrl || "https://via.placeholder.com/600x400?text=OldGoods"
          }
          alt={item.title}
          loading="lazy"
        />
        {/* Tái sử dụng class og-status từ trang Transactions */}
        <span className={`og-status og-status--${item.status} og-card__badge`}>
          {item.status}
        </span>
      </div>

      {/* Khối Nội Dung */}
      <div className="og-card__body">
        <h3 className="og-card__title" title={item.title}>
          {item.title}
        </h3>
        <p className="og-card__desc">{item.description}</p>

        {/* Khối Giá */}
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

        {/* Nút Hành Động */}
        <div className="og-card__actions-grid">
          <button
            className="og-btn og-btn--outline"
            onClick={onEdit}
            disabled={!canEditOrDelete}
            type="button"
          >
            <Pencil size={16} /> Sửa
          </button>

          <button
            className="og-btn og-btn--danger"
            onClick={onDelete}
            disabled={!canEditOrDelete}
            type="button"
          >
            <Trash2 size={16} /> Xóa
          </button>
        </div>

        {/* Ghi chú nếu bị disable */}
        {!canEditOrDelete && (
          <p className="og-card__note">
            Chỉ có thể sửa/xóa khi sản phẩm ở trạng thái{" "}
            <strong>available</strong>.
          </p>
        )}
      </div>
    </article>
  );
}
