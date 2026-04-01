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
    <div>
      <section className="hero">
        <div className="hero-left">
          <span className="badge">Web3 Marketplace Demo</span>
          <h1>Dashboard mua bán đồ cũ nội bộ bằng MetaMask</h1>
          <p>
            Đăng sản phẩm off-chain trong MongoDB, đặt cọc và thanh toán trực
            tiếp bằng ví MetaMask trên Validium. Mọi giao dịch đều gắn với
            blockchain proof để đối chiếu tính toàn vẹn.
          </p>

          <div className="hero-inline-stats">
            <div>
              <small>Hạ tầng</small>
              <strong>MongoDB + Express + React</strong>
            </div>
            <div>
              <small>Mạng</small>
              <strong>Validium</strong>
            </div>
            <div>
              <small>Token</small>
              <strong>{NATIVE_SYMBOL}</strong>
            </div>
          </div>
        </div>
      </section>

      <StatsBar products={products} />
      <MiniStatsChart products={products} />

      <section className="toolbar toolbar-advanced">
        <div className="search-wrap">
          <Search size={18} />
          <input
            className="input no-border"
            placeholder="Tìm theo tên, mô tả, danh mục..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="filters-wrap">
          <div className="filter-title">
            <SlidersHorizontal size={16} />
            Bộ lọc
          </div>

          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Có thể mua</option>
            <option value="reserved">Đã đặt cọc</option>
            <option value="completed">Đã hoàn tất</option>
          </select>

          <select
            className="input"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
      </section>

      {loading ? (
        <section className="product-grid">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </section>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Không có sản phẩm phù hợp"
          desc="Hãy thử đổi bộ lọc hoặc đăng thêm sản phẩm mới."
        />
      ) : (
        <section className="product-grid">
          {filtered.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </section>
      )}
    </div>
  );
}
