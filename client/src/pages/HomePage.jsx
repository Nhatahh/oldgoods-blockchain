import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../api/api";
import StatsBar from "../components/StatsBar";
import ProductCard from "../components/ProductCard";
import MiniStatsChart from "../components/MiniStatsChart";
import { ProductCardSkeleton } from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [sortMode, setSortMode] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: {
          keyword,
          status,
          sortMode,
        },
      });
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, status, sortMode]);

  const filtered = useMemo(() => products, [products]);

  return (
    <div className="og-home">
      {/* Hero Section */}
      <section className="og-hero">
        <div className="og-hero__content">
          <span className="og-badge og-badge--primary og-hero__badge">
            Demo Version
          </span>
          <h1 className="og-hero__title">CHỢ ĐỒ CŨ</h1>
          <h2 className="og-hero__title">
            Mua bán rõ ràng – xác thực bằng Blockchain
          </h2>
          <p className="og-hero__desc">
            Nền tảng mua bán minh bạch với cơ chế đặt cọc thông minh. Dữ liệu
            sản phẩm được tối ưu off-chain, trong khi mọi giao dịch được bảo
            chứng bởi Blockchain Proof trên mạng Validium.
          </p>

          <div className="og-hero__stats">
            <div className="og-hero__stat-item">
              <small>Hạ tầng</small>
              <strong>MongoDB + Express + React</strong>
            </div>
            <div className="og-hero__stat-divider"></div>
            <div className="og-hero__stat-item">
              <small>Mạng</small>
              <strong>Validium</strong>
            </div>
            <div className="og-hero__stat-divider"></div>
            <div className="og-hero__stat-item">
              <small>Token</small>
              <strong>{NATIVE_SYMBOL}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="og-home__stats">
        <StatsBar products={products} />
        <MiniStatsChart products={products} />
      </div>

      {/* Toolbar */}
      <section className="og-toolbar">
        <div className="og-search">
          <Search className="og-search__icon" size={18} />
          <input
            className="og-input og-search__input"
            placeholder="Tìm theo tên, mô tả, danh mục..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="og-filters">
          <div className="og-filters__label">
            <SlidersHorizontal size={16} />
            Bộ lọc
          </div>

          <select
            className="og-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Có thể mua</option>
            <option value="reserved">Đã đặt cọc</option>
            <option value="completed">Đã hoàn tất</option>
          </select>

          <select
            className="og-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
      </section>

      {/* Product Grid */}
      {loading ? (
        <section className="og-grid">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </section>
      ) : filtered.length === 0 ? (
        <div className="og-home__empty">
          <EmptyState
            title="Không có sản phẩm phù hợp"
            desc="Hãy thử đổi bộ lọc hoặc đăng thêm sản phẩm mới."
          />
        </div>
      ) : (
        <section className="og-grid">
          {filtered.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </section>
      )}
    </div>
  );
}
