import {
  LayoutDashboard,
  Gavel,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Store,
  Folder,
  Package
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";

export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-white/5 transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-64"}`}
    >
      <div
        className={`p-6 flex items-center transition-all ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <Gavel className="w-5 h-5" />
        </div>

        {!collapsed && (
          <span className="text-lg font-black uppercase italic tracking-tighter dark:text-white">
            Admin
          </span>
        )}
      </div>

      <nav className="mt-4">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Tổng quan"
          active={location.pathname === "/admin/dashboard"}
          onClick={() => navigate("/admin/dashboard")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={<Users size={20} />}
          label="Người dùng"
          active={location.pathname === "/admin/user-manage"}
          onClick={() => navigate("/admin/user-manage")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={<Store size={20} />}
          label="Cửa hàng"
          active={location.pathname === "/admin/store-manage"}
          onClick={() => navigate("/admin/store-manage")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={<Folder size={20} />}
          label="Danh mục"
          active={location.pathname === "/admin/category-manage"}
          onClick={() => navigate("/admin/category-manage")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={<Gavel size={20} />}
          label="Đấu giá"
          active={location.pathname === "/admin/auction-manage"}
          onClick={() => navigate("/admin/auction-manage")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={<CreditCard size={20} />}
          label="Gói VIP"
          active={location.pathname === "/admin/subcription-manage"}
          onClick={() => navigate("/admin/subcription-manage")}
          collapsed={collapsed}
        />

        <SidebarItem
          icon={<Package size={20} />}
          label="Sản phẩm"
          active={location.pathname === "/admin/product-manage"}
          onClick={() => navigate("/admin/product-manage")}
          collapsed={collapsed}
        />
      </nav>

      <div className="absolute bottom-6 w-full px-4">
        <button className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut size={20} />

          {!collapsed && (
            <span className="text-xs font-black uppercase">
              Đăng xuất
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}