import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackagePlus,
  Package,
  ArrowLeftRight,
  ShoppingBag,
} from "lucide-react";

const links = [
  { to: "/", label: "Trang chủ", icon: LayoutDashboard },
  { to: "/add-product", label: "Đăng bán", icon: PackagePlus },
  { to: "/my-products", label: "Sản phẩm của tôi", icon: Package },
  { to: "/transactions", label: "Tất cả giao dịch", icon: ArrowLeftRight },
  { to: "/my-transactions", label: "Giao dịch của tôi", icon: ShoppingBag },
];

export default function Sidebar() {
  return (
    <aside className="og-sidebar">
      <div className="og-sidebar__inner">
        <div className="og-sidebar__title">MENU</div>

        <nav className="og-sidebar__nav">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `og-sidebar__link ${isActive ? "og-sidebar__link--active" : ""}`
                }
              >
                <Icon size={18} className="og-sidebar__icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
