import { NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function UserLayout() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const linkBase = "relative px-3 py-2 text-sm font-medium text-ocean-700 hover:text-ocean-900 transition";
    const linkActive =
        "text-ocean-900 after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:bg-ocean-500";

    return (
        <div className="flex flex-col min-h-screen bg-ocean-50 text-ocean-900">
            {/* NAVBAR */}
            <header
                className={`sticky top-0 z-50 ${
                    scrolled ? "bg-white/95 backdrop-blur border-b border-ocean-100" : "bg-white/80"
                }`}
            >
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="h-14 flex items-center justify-between">
                        <NavLink to="/" className="font-semibold tracking-tight text-ocean-900">
                            Cứu Trợ Khẩn
                        </NavLink>

                        {/* Desktop */}
                        <nav className="hidden md:flex items-center gap-1">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                            >
                                Trang chủ
                            </NavLink>
                            <NavLink
                                to="/thong-bao"
                                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                            >
                                Thông báo
                            </NavLink>
                            <NavLink
                                to="/tram-so-tan"
                                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                            >
                                Trạm sơ tán
                            </NavLink>
                            <NavLink
                                to="/map"
                                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
                            >
                                Bản đồ
                            </NavLink>

                            <NavLink
                                to="/yeu-cau"
                                className="ml-2 px-3 py-2 text-sm font-medium rounded-lg bg-ocean-500 text-white hover:bg-ocean-500/90"
                            >
                                Gửi yêu cầu
                            </NavLink>

                            <NavLink
                                to="/login"
                                className="ml-2 px-3 py-2 text-sm font-medium rounded-lg border border-ocean-300 text-ocean-700 hover:bg-ocean-100"
                            >
                                Đăng nhập / Đăng ký
                            </NavLink>
                        </nav>

                        {/* Mobile toggle */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-ocean-100"
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Menu"
                        >
                            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden overflow-hidden transition-[max-height] ${open ? "max-h-80" : "max-h-0"}`}>
                    <div className="max-w-6xl mx-auto px-4 md:px-6 pb-3">
                        <div className="rounded-xl border border-ocean-100 bg-white p-2 space-y-1 shadow-sm">
                            {[
                                { to: "/", label: "Trang chủ", end: true },
                                { to: "/thong-bao", label: "Thông báo" },
                                { to: "/tram-so-tan", label: "Trạm sơ tán" },
                                { to: "/map", label: "Bản đồ" },
                            ].map((i) => (
                                <NavLink
                                    key={i.to}
                                    to={i.to}
                                    end={i.end}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) => `block ${linkBase} ${isActive ? linkActive : ""}`}
                                >
                                    {i.label}
                                </NavLink>
                            ))}
                            <NavLink
                                to="/yeu-cau"
                                onClick={() => setOpen(false)}
                                className="block px-3 py-2 rounded-lg bg-ocean-500 text-white text-sm font-medium text-center"
                            >
                                Gửi yêu cầu
                            </NavLink>
                            <NavLink
                                to="/login"
                                onClick={() => setOpen(false)}
                                className="block px-3 py-2 rounded-lg border border-ocean-300 text-ocean-700 text-sm font-medium text-center"
                            >
                                Đăng nhập / Đăng ký
                            </NavLink>
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex-1">
                    <Outlet />
                </div>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-ocean-100 bg-white">
                <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between text-sm text-ocean-500">
                    <div>© {new Date().getFullYear()} Hệ thống Cứu Trợ</div>
                    <div className="hidden sm:block">Liên hệ: hotro@example.com</div>
                </div>
            </footer>
            <Toaster />
        </div>
    );
}
