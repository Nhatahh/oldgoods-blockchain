import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function MiniStatsChart({ products = [] }) {
  const data = [
    {
      name: "Available",
      value: products.filter((p) => p.status === "available").length,
    },
    {
      name: "Reserved",
      value: products.filter((p) => p.status === "reserved").length,
    },
    {
      name: "Completed",
      value: products.filter((p) => p.status === "completed").length,
    },
  ];

  return (
    <div className="mini-chart-card">
      <div className="mini-chart-head">
        <h3>Phân bố trạng thái sản phẩm</h3>
        <p>Biểu đồ mini để nhìn nhanh hoạt động hệ thống</p>
      </div>

      <div className="mini-chart-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
