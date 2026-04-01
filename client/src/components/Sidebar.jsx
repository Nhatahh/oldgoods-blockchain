import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackagePlus,
  Package,
  ArrowLeftRight,
  ShoppingBag,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add-product", label: "Đăng bán", icon: PackagePlus },
  { to: "/my-products", label: "Sản phẩm của tôi", icon: Package },
  { to: "/transactions", label: "Tất cả giao dịch", icon: ArrowLeftRight },
  { to: "/my-transactions", label: "Giao dịch của tôi", icon: ShoppingBag },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        <div className="sidebar-title">Workspace</div>

        <nav className="sidebar-nav">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
