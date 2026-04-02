import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
import { useWallet } from "../context/WalletContext";
import ConfirmModal from "./ConfirmModal";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

export default function EditProductModal({ open, product, onClose, onSaved }) {
  const { walletAddress } = useWallet();
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceNative: "",
    depositNative: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        priceNative: product.priceNative || "",
        depositNative: product.depositNative || "",
        category: product.category || "",
        imageUrl: product.imageUrl || "",
      });
      setImgError(false);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "imageUrl") {
      setImgError(false);
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!product) return;
    if (Number(form.depositNative) >= Number(form.priceNative)) {
      toast.error("Đặt cọc phải nhỏ hơn giá tổng");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/products/${product._id}`, {
        ...form,
        sellerWallet: walletAddress,
      });
      toast.success("Cập nhật sản phẩm thành công");
      onSaved();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Lỗi cập nhật sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmModal
      open={open}
      title="Chỉnh sửa sản phẩm"
      description="Cập nhật lại thông tin món đồ của bạn trên chợ nội bộ."
      confirmText="Lưu thay đổi"
      cancelText="Đóng"
      onConfirm={handleSubmit}
      onClose={onClose}
      loading={loading}
    >
      {/* Layout bọc ngoài để xử lý Responsive */}
      <div className="og-edit-modal-layout">
        {/* Khối bên trái: Form nhập liệu */}
        <div className="og-modal-form">
          <div className="og-modal-row">
            <div className="og-form-group">
              <label htmlFor="edit-title" className="og-label">
                Tên sản phẩm
              </label>
              <input
                id="edit-title"
                className="og-input"
                name="title"
                placeholder="Tên sản phẩm"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="og-form-group">
              <label htmlFor="edit-category" className="og-label">
                Danh mục
              </label>
              <input
                id="edit-category"
                className="og-input"
                name="category"
                placeholder="Danh mục"
                value={form.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="og-modal-row">
            <div className="og-form-group">
              <label htmlFor="edit-price" className="og-label">
                Giá tổng ({NATIVE_SYMBOL})
              </label>
              <input
                id="edit-price"
                className="og-input"
                type="number"
                step="any"
                name="priceNative"
                placeholder="0.00"
                value={form.priceNative}
                onChange={handleChange}
              />
            </div>

            <div className="og-form-group">
              <label htmlFor="edit-deposit" className="og-label">
                Đặt cọc ({NATIVE_SYMBOL})
              </label>
              <input
                id="edit-deposit"
                className="og-input"
                type="number"
                step="any"
                name="depositNative"
                placeholder="0.00"
                value={form.depositNative}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="og-form-group">
            <label htmlFor="edit-desc" className="og-label">
              Mô tả sản phẩm
            </label>
            <textarea
              id="edit-desc"
              className="og-input og-textarea"
              rows="3"
              name="description"
              placeholder="Mô tả tình trạng..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="og-form-group">
            <label htmlFor="edit-img" className="og-label">
              Link ảnh minh họa
            </label>
            <input
              id="edit-img"
              className="og-input"
              name="imageUrl"
              placeholder="Dán link ảnh http/https"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Khối bên phải: Xem trước ảnh (Chỉ hiện khi có link) */}
        {form.imageUrl && (
          <div className="og-edit-preview-area">
            <label className="og-label">Xem trước ảnh</label>
            <div className="og-preview-box">
              {!imgError ? (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="og-preview-image"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="og-preview-error">
                  <span>⚠️ Lỗi tải ảnh</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ConfirmModal>
  );
}
