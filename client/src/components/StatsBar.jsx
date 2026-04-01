import { Package, Wallet, ArrowLeftRight, CheckCircle2 } from "lucide-react";

const NATIVE_SYMBOL = import.meta.env.VITE_NATIVE_SYMBOL || "VLDM";

export default function StatsBar({ products = [] }) {
  const total = products.length;
  const available = products.filter((p) => p.status === "available").length;
  const reserved = products.filter((p) => p.status === "reserved").length;
  const completed = products.filter((p) => p.status === "completed").length;

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon blue">
          <Package size={18} />
        </div>
        <div>
          <p>Tổng sản phẩm</p>
          <h3>{total}</h3>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">
          <Wallet size={18} />
        </div>
        <div>
          <p>Khả dụng</p>
          <h3>{available}</h3>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon orange">
          <ArrowLeftRight size={18} />
        </div>
        <div>
          <p>Đã đặt cọc</p>
          <h3>{reserved}</h3>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <p>Hoàn tất</p>
          <h3>
            {completed} {NATIVE_SYMBOL ? "" : ""}
          </h3>
        </div>
      </div>
    </section>
  );
}
