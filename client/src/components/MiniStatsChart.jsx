import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";

export default function MiniStatsChart({ products = [] }) {
  const data = [
    {
      name: "Có thể mua",
      value: products.filter((p) => p.status === "available").length,
      color: "var(--og-primary)", // Xanh dương (Primary)
    },
    {
      name: "Đã đặt cọc",
      value: products.filter((p) => p.status === "reserved").length,
      color: "#f59e0b", // Vàng cam (Warning/Reserved)
    },
    {
      name: "Đã hoàn tất",
      value: products.filter((p) => p.status === "completed").length,
      color: "var(--og-success)", // Xanh ngọc (Success/Completed)
    },
  ];

  // Custom Tooltip để trông "pro" hơn
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="og-chart-tooltip">
          <p className="og-chart-tooltip__label">{payload[0].payload.name}</p>
          <p className="og-chart-tooltip__value">
            <span
              className="og-chart-tooltip__dot"
              style={{ backgroundColor: payload[0].payload.color }}
            ></span>
            {payload[0].value} sản phẩm
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="og-chart-card">
      <div className="og-chart-card__header">
        <h3 className="og-chart-card__title">Phân bố trạng thái sản phẩm</h3>
        <p className="og-chart-card__desc">
          Biểu đồ tổng quan hoạt động trên chợ đồ cũ
        </p>
      </div>

      <div className="og-chart-card__body">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "var(--og-text-muted)",
                fontSize: 13,
                fontWeight: 500,
              }}
              dy={10} // Đẩy text trục X xuống một chút
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />

            {/* Sử dụng Cell để đổ màu riêng cho từng cột dựa vào data */}
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
