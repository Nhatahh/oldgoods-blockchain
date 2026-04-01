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
      description="Bạn có thể thay đổi thông tin và xem trước ảnh từ link."
      confirmText="Lưu thay đổi"
      cancelText="Đóng"
      onConfirm={handleSubmit}
      onClose={onClose}
      loading={loading}
    >
      <div className="edit-form-grid">
        <input
          className="input"
          name="title"
          placeholder="Tên sản phẩm"
          value={form.title}
          onChange={handleChange}
        />

        <input
          className="input"
          name="category"
          placeholder="Danh mục"
          value={form.category}
          onChange={handleChange}
        />

        <input
          className="input"
          name="priceNative"
          placeholder={`Giá tổng (${NATIVE_SYMBOL})`}
          value={form.priceNative}
          onChange={handleChange}
        />

        <input
          className="input"
          name="depositNative"
          placeholder={`Đặt cọc (${NATIVE_SYMBOL})`}
          value={form.depositNative}
          onChange={handleChange}
        />

        <textarea
          className="input edit-full-span"
          rows="4"
          name="description"
          placeholder="Mô tả sản phẩm"
          value={form.description}
          onChange={handleChange}
        />

        <input
          className="input edit-full-span"
          name="imageUrl"
          placeholder="Dán link ảnh http/https"
          value={form.imageUrl}
          onChange={handleChange}
        />

        {form.imageUrl && (
          <div className="edit-full-span preview-box">
            {!imgError ? (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="preview-image"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="preview-error">
                Không tải được ảnh từ link này
              </div>
            )}
          </div>
        )}
      </div>
    </ConfirmModal>
  );
}
