import { useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, PackagePlus } from "lucide-react";
import api from "../api/api";
import { useWallet } from "../context/WalletContext";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

export default function AddProductPage() {
  const { walletAddress, isConnected } = useWallet();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceNative: "",
    depositNative: "",
    category: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  const submit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Hãy kết nối MetaMask trước");
      return;
    }

    if (Number(form.depositNative) >= Number(form.priceNative)) {
      toast.error("Đặt cọc phải nhỏ hơn giá tổng");
      return;
    }

    try {
      setLoading(true);

      await api.post("/products", {
        ...form,
        sellerWallet: walletAddress,
      });

      toast.success("Đăng sản phẩm thành công");

      setForm({
        title: "",
        description: "",
        priceNative: "",
        depositNative: "",
        category: "",
        imageUrl: "",
      });
      setImgError(false);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi đăng sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="og-page-wrapper">
      <div className="og-form-card">
        <div className="og-form-card__header">
          <div className="og-icon-badge">
            <PackagePlus size={24} />
          </div>
          <div>
            <h1 className="og-form-card__title">Đăng sản phẩm mới</h1>
            <p className="og-form-card__desc">
              Thêm món đồ cũ nội bộ và sẵn sàng giao dịch bằng MetaMask.
            </p>
          </div>
        </div>

        <form className="og-form" onSubmit={submit}>
          <div className="og-form__row">
            <div className="og-form-group">
              <label htmlFor="title" className="og-label">
                Tên sản phẩm
              </label>
              <input
                id="title"
                className="og-input"
                name="title"
                placeholder="Ví dụ: Bàn phím cơ Keychron..."
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="og-form-group">
              <label htmlFor="category" className="og-label">
                Danh mục
              </label>
              <input
                id="category"
                className="og-input"
                name="category"
                placeholder="Ví dụ: Đồ công nghệ"
                value={form.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="og-form__row">
            <div className="og-form-group">
              <label htmlFor="priceNative" className="og-label">
                Giá tổng ({NATIVE_SYMBOL})
              </label>
              <input
                id="priceNative"
                className="og-input"
                type="number"
                step="any"
                name="priceNative"
                placeholder="0.00"
                value={form.priceNative}
                onChange={handleChange}
                required
              />
            </div>

            <div className="og-form-group">
              <label htmlFor="depositNative" className="og-label">
                Đặt cọc ({NATIVE_SYMBOL})
              </label>
              <input
                id="depositNative"
                className="og-input"
                type="number"
                step="any"
                name="depositNative"
                placeholder="0.00"
                value={form.depositNative}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="og-form-group">
            <label htmlFor="description" className="og-label">
              Mô tả chi tiết
            </label>
            <textarea
              id="description"
              className="og-input og-textarea"
              rows="5"
              name="description"
              placeholder="Tình trạng, thời gian sử dụng, phụ kiện đi kèm..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="og-form-group">
            <label htmlFor="imageUrl" className="og-label">
              Hình ảnh sản phẩm
            </label>
            <div className="og-input-wrapper">
              <ImagePlus className="og-input-icon" size={18} />
              <input
                id="imageUrl"
                className="og-input og-input--with-icon"
                name="imageUrl"
                placeholder="Dán link ảnh http/https vào đây..."
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          {form.imageUrl && (
            <div className="og-form-group">
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
                    <span>⚠️ Không tải được ảnh từ đường link này</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="og-form__actions">
            <button
              className="og-btn og-btn--primary og-btn--full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Đang xử lý trên mạng..." : "Đăng bán sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
