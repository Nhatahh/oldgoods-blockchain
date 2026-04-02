import { AlertTriangle, Trash2 } from "lucide-react";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

export default function DeleteProductModal({
  open,
  product,
  loading = false,
  onClose,
  onConfirm,
}) {
  if (!open || !product) return null;

  return (
    <div className="og-modal-overlay" onClick={loading ? undefined : onClose}>
      <div
        className="og-modal-card og-modal-card--danger"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="og-modal-header og-modal-header--danger">
          <div className="og-danger-icon-wrap">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="og-modal-title og-text-danger">
              Xác nhận xóa sản phẩm
            </h3>
            <p className="og-modal-desc">
              Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa khỏi cơ sở dữ
              liệu nội bộ.
            </p>
          </div>
        </div>

        <div className="og-modal-body">
          <div className="og-delete-preview">
            <div className="og-delete-preview__image">
              <img
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/400x260?text=OldGoods"
                }
                alt={product.title}
              />
            </div>

            <div className="og-delete-preview__info">
              <h4 className="og-delete-preview__title">{product.title}</h4>
              <p className="og-delete-preview__desc">{product.description}</p>

              <div className="og-delete-preview__grid">
                <div className="og-preview-stat">
                  <small>Giá tổng</small>
                  <strong>
                    {product.priceNative} {NATIVE_SYMBOL}
                  </strong>
                </div>
                <div className="og-preview-stat">
                  <small>Đặt cọc</small>
                  <strong>
                    {product.depositNative} {NATIVE_SYMBOL}
                  </strong>
                </div>
                <div className="og-preview-stat">
                  <small>Danh mục</small>
                  <strong>{product.category || "Khác"}</strong>
                </div>
                <div className="og-preview-stat">
                  <small>Trạng thái</small>
                  <strong
                    className={`og-text-${product.status === "available" ? "success" : "danger"}`}
                  >
                    {product.status}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="og-notice-box og-notice-box--danger">
            <AlertTriangle size={16} />
            <span>
              Chỉ có thể xóa sản phẩm khi đang ở trạng thái{" "}
              <strong>available</strong> (chưa ai đặt cọc).
            </span>
          </div>
        </div>

        <div className="og-modal-actions">
          <button
            className="og-btn og-btn--outline"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            Hủy
          </button>

          <button
            className="og-btn og-btn--danger"
            onClick={onConfirm}
            disabled={loading}
            type="button"
          >
            <Trash2 size={16} />
            {loading ? "Đang xử lý xóa..." : "Xóa vĩnh viễn"}
          </button>
        </div>
      </div>
    </div>
  );
}
