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
    <div className="modal-overlay" onClick={loading ? undefined : onClose}>
      <div
        className="modal-card danger-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header danger-header">
          <div className="danger-icon-wrap">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3>Xác nhận xóa sản phẩm</h3>
            <p className="subtle-text modal-subtle">
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        <div className="modal-body">
          <div className="delete-product-box">
            <div className="delete-product-image">
              <img
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/400x260?text=OldGoods"
                }
                alt={product.title}
              />
            </div>

            <div className="delete-product-info">
              <h4>{product.title}</h4>
              <p className="line-clamp-2">{product.description}</p>

              <div className="delete-meta-grid">
                <div>
                  <small>Giá tổng</small>
                  <strong>
                    {product.priceNative} {NATIVE_SYMBOL}
                  </strong>
                </div>
                <div>
                  <small>Đặt cọc</small>
                  <strong>
                    {product.depositNative} {NATIVE_SYMBOL}
                  </strong>
                </div>
                <div>
                  <small>Danh mục</small>
                  <strong>{product.category || "Khác"}</strong>
                </div>
                <div>
                  <small>Trạng thái</small>
                  <strong>{product.status}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="danger-note">
            Chỉ có thể xóa sản phẩm khi đang ở trạng thái{" "}
            <strong>available</strong>.
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            Hủy
          </button>

          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
            type="button"
          >
            <Trash2 size={16} />
            {loading ? "Đang xóa..." : "Xóa sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
}
