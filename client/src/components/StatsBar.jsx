import { Package, Wallet, ArrowLeftRight, CheckCircle2 } from "lucide-react";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

export default function StatsBar({ products = [] }) {
  const total = products.length;
  const available = products.filter((p) => p.status === "available").length;
  const reserved = products.filter((p) => p.status === "reserved").length;
  const completed = products.filter((p) => p.status === "completed").length;

  return (
    <section className="og-stats-grid">
      <div className="og-stat-card">
        <div className="og-stat-icon og-stat-icon--blue">
          <Package size={20} />
        </div>
        <div className="og-stat-info">
          <p className="og-stat-label">Tổng sản phẩm</p>
          <h3 className="og-stat-value">{total}</h3>
        </div>
      </div>

      <div className="og-stat-card">
        <div className="og-stat-icon og-stat-icon--purple">
          <Wallet size={20} />
        </div>
        <div className="og-stat-info">
          <p className="og-stat-label">Khả dụng</p>
          <h3 className="og-stat-value">{available}</h3>
        </div>
      </div>

      <div className="og-stat-card">
        <div className="og-stat-icon og-stat-icon--orange">
          <ArrowLeftRight size={20} />
        </div>
        <div className="og-stat-info">
          <p className="og-stat-label">Đã đặt cọc</p>
          <h3 className="og-stat-value">{reserved}</h3>
        </div>
      </div>

      <div className="og-stat-card">
        <div className="og-stat-icon og-stat-icon--green">
          <CheckCircle2 size={20} />
        </div>
        <div className="og-stat-info">
          <p className="og-stat-label">Hoàn tất</p>
          <h3 className="og-stat-value">{completed}</h3>
        </div>
      </div>
    </section>
  );
}
