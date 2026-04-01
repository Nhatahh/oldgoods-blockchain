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
    <div className="form-page-wrap">
      <div className="page-card form-card-premium">
        <div className="form-page-header">
          <div className="form-icon-badge">
            <PackagePlus size={20} />
          </div>
          <div>
            <h1>Đăng sản phẩm mới</h1>
            <p>Thêm món đồ cũ nội bộ và sẵn sàng giao dịch bằng MetaMask.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={submit}>
          <input
            className="input"
            name="title"
            placeholder="Tên sản phẩm"
            value={form.title}
            onChange={handleChange}
            required
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
            required
          />

          <input
            className="input"
            name="depositNative"
            placeholder={`Đặt cọc (${NATIVE_SYMBOL})`}
            value={form.depositNative}
            onChange={handleChange}
            required
          />

          <textarea
            className="input full-span"
            rows="6"
            name="description"
            placeholder="Mô tả sản phẩm"
            value={form.description}
            onChange={handleChange}
          />

          <div className="input-with-icon full-span">
            <ImagePlus size={18} />
            <input
              className="input no-shadow no-border"
              name="imageUrl"
              placeholder="Dán link ảnh http/https"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          {form.imageUrl && (
            <div className="full-span preview-box">
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

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng bán"}
          </button>
        </form>
      </div>
    </div>
  );
}
