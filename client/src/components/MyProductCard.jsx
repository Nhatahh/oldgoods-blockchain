import { Pencil, Trash2 } from "lucide-react";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

export default function MyProductCard({ item, onEdit, onDelete }) {
  const canEditOrDelete = item.status === "available";

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
        <h3 className="product-title">{item.title}</h3>
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

        <div className="my-product-actions">
          <button
            className="btn btn-outline"
            onClick={onEdit}
            disabled={!canEditOrDelete}
            type="button"
          >
            <Pencil size={16} />
            Sửa
          </button>

          <button
            className="btn btn-danger"
            onClick={onDelete}
            disabled={!canEditOrDelete}
            type="button"
          >
            <Trash2 size={16} />
            Xóa
          </button>
        </div>

        {!canEditOrDelete && (
          <p className="small-note">
            Chỉ có thể sửa/xóa khi sản phẩm đang ở trạng thái available.
          </p>
        )}
      </div>
    </article>
  );
}
