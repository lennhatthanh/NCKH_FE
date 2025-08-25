import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Users, ClipboardList, BarChart3, MapPinHouse, Cpu,
  AlertTriangle, Bell, Mail, LifeBuoy, Map, Warehouse
} from "lucide-react";

const menuItems = [
  { to: "/admin/nhan-vien", icon: Users, label: "Nhân viên" },
  { to: "/admin/yeu-cau", icon: ClipboardList, label: "Quản lý yêu cầu" },
  { to: "/admin/thong-ke", icon: BarChart3, label: "Thống kê" },
  { to: "/admin/tram-so-tan", icon: MapPinHouse, label: "Trạm sơ tán" },
  { to: "/admin/iot", icon: Cpu, label: "IoT" },
  { to: "/admin/canh-bao", icon: AlertTriangle, label: "Cảnh báo" },
  { to: "/admin/thong-bao", icon: Bell, label: "Thông báo" },
  { to: "/admin/gui-mail", icon: Mail, label: "Gửi mail" },
  { to: "/admin/cuu-tro", icon: LifeBuoy, label: "Cứu trợ" },
  { to: "/admin/map", icon: Map, label: "Map" },
  { to: "/admin/quan-ly-tram", icon: Warehouse, label: "Quản lý trạm" },
];

const Item = ({ to, icon: Icon, label, open }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-200
      ${isActive ? "bg-ocean-500 text-ocean-50" : "text-ocean-100 hover:bg-ocean-300/30 hover:text-ocean-50"}`
    }
  >
    <Icon className="w-5 h-5" />
    {open && <span className="font-medium">{label}</span>}
  </NavLink>
);

export default function BotAdmin() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) setMobileOpen(!mobileOpen);
    else setOpen(!open);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-screen bg-ocean-900
          transition-all duration-300 ease-in-out
          ${open ? "w-60" : "w-18"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4 flex items-center gap-3 text-ocean-50">
          <button
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-ocean-500/30 hover:bg-ocean-500/50 transition"
          >
            ☰
          </button>
          {open && <span className="text-lg font-semibold">Admin</span>}
        </div>

        <nav className="px-3 space-y-1 mt-4">
          {menuItems.map((item) => (
            <Item key={item.to} {...item} open={open} />
          ))}
        </nav>
      </aside>
    </>
  );
}
