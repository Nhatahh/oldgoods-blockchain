export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onClose,
  loading = false,
  children,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={loading ? undefined : onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>

        <div className="modal-body">
          {description && <p>{description}</p>}
          {children}
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            {cancelText}
          </button>

          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={loading}
            type="button"
          >
            {loading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
