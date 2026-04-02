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
    <div className="og-modal-overlay" onClick={loading ? undefined : onClose}>
      <div
        className="og-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="og-modal-header">
          <h3 className="og-modal-title">{title}</h3>
        </div>

        <div className="og-modal-body">
          {description && <p className="og-modal-desc">{description}</p>}
          {children}
        </div>

        <div className="og-modal-actions">
          <button
            className="og-btn og-btn--outline"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            {cancelText}
          </button>

          <button
            className="og-btn og-btn--primary"
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
