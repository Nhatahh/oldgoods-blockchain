import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
import { useWallet } from "../context/WalletContext";
import EmptyState from "../components/EmptyState";
import { ProductCardSkeleton } from "../components/LoadingSkeleton";
import EditProductModal from "../components/EditProductModal";
import MyProductCard from "../components/MyProductCard";
import DeleteProductModal from "../components/DeleteProductModal";

export default function MyProductsPage() {
  const { walletAddress, isConnected } = useWallet();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const fetchProducts = async () => {
    if (!walletAddress) return;

    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: {
          sellerWallet: walletAddress,
        },
      });

      setProducts(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchProducts();
    }
  }, [walletAddress]);

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    try {
      setDeletingLoading(true);

      await api.delete(`/products/${deletingProduct._id}`, {
        data: { sellerWallet: walletAddress },
      });

      toast.success("Xóa sản phẩm thành công");
      setDeletingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Lỗi xóa sản phẩm");
    } finally {
      setDeletingLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="page-card">
        <EmptyState
          title="Chưa kết nối ví"
          desc="Hãy kết nối MetaMask để xem sản phẩm của bạn."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="page-card">
          <h1>Sản phẩm của tôi</h1>
        </div>
        <section className="product-grid">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </section>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="page-card">
          <h1>Sản phẩm của tôi</h1>
          <p className="subtle-text">
            Bạn có thể chỉnh sửa hoặc xóa sản phẩm của mình khi sản phẩm còn khả
            dụng.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="page-card">
            <EmptyState
              title="Bạn chưa đăng sản phẩm nào"
              desc="Hãy vào trang Đăng bán để thêm món đồ đầu tiên."
            />
          </div>
        ) : (
          <section className="product-grid">
            {products.map((item) => (
              <MyProductCard
                key={item._id}
                item={item}
                onEdit={() => setEditingProduct(item)}
                onDelete={() => setDeletingProduct(item)}
              />
            ))}
          </section>
        )}
      </div>

      <EditProductModal
        product={editingProduct}
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSaved={() => {
          setEditingProduct(null);
          fetchProducts();
        }}
      />

      <DeleteProductModal
        open={!!deletingProduct}
        product={deletingProduct}
        loading={deletingLoading}
        onClose={() => {
          if (!deletingLoading) setDeletingProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
