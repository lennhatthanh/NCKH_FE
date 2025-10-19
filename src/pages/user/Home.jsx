import { NavLink } from "react-router-dom";
import { AlertTriangle, Megaphone, MapPin, Send, LifeBuoy } from "lucide-react";
import { useSelector } from "react-redux";
export default function Home() {
    const announcements = useSelector((s) => s.announcements?.items || []);
    const latest3 = announcements.slice(0, 3);

    return (
        <div className="space-y-14">
            <section className="relative rounded-3xl overflow-hidden">
                <img
                    src="https://i.pinimg.com/1200x/48/a2/c8/48a2c898dc2c83562d1ad6b3795736f5.jpg"
                    alt="hero-bg"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/80 to-ocean-500/50" />
                <div className="relative z-10 px-6 py-16 md:py-28 max-w-5xl mx-auto text-white">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                        Chung tay cứu trợ, <br /> mang hy vọng đến mọi nhà
                    </h1>
                    <p className="text-lg max-w-xl mb-6 opacity-90">
                        Kết nối nhanh chóng giữa người cần giúp đỡ và lực lượng
                        hỗ trợ. Cập nhật thông tin chính xác, kịp thời.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <NavLink
                            to="/yeu-cau"
                            className="px-6 py-3 rounded-full bg-white text-ocean-900 font-medium hover:bg-ocean-50 transition"
                        >
                            <div className="flex items-center gap-2">
                                <Send className="w-5 h-5" /> Gửi yêu cầu ngay
                            </div>
                        </NavLink>
                        <NavLink
                            to="/thong-bao"
                            className="px-6 py-3 rounded-full bg-ocean-500 text-white font-medium hover:bg-ocean-500/90 transition"
                        >
                            Xem thông báo
                        </NavLink>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-semibold mb-8 text-center">
                    Chúng tôi có thể giúp gì cho bạn?
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={AlertTriangle}
                        title="Gửi yêu cầu khẩn cấp"
                        desc="Điền thông tin liên lạc và nhu cầu hỗ trợ, hệ thống sẽ xử lý nhanh chóng."
                        to="/yeu-cau"
                        color="from-red-400 to-red-600"
                    />
                    <FeatureCard
                        icon={Megaphone}
                        title="Nhận thông báo mới nhất"
                        desc="Cập nhật thông tin chính thức từ các cơ quan chức năng và cộng đồng."
                        to="/thong-bao"
                        color="from-blue-400 to-blue-600"
                    />
                    <FeatureCard
                        icon={MapPin}
                        title="Tìm trạm sơ tán"
                        desc="Xem vị trí, tình trạng hoạt động và sức chứa của các trạm gần bạn."
                        to="/tram-so-tan"
                        color="from-green-400 to-green-600"
                    />
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Thông báo mới</h2>
                    <NavLink
                        to="/thong-bao"
                        className="text-sm px-3 py-1.5 rounded-lg border border-ocean-200 hover:bg-ocean-50"
                    >
                        Xem tất cả
                    </NavLink>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {latest3.length > 0
                        ? latest3.map((tb) => (
                              <AnnouncementCard key={tb.id} item={tb} />
                          ))
                        : [1, 2, 3].map((i) => (
                              <SkeletonCard key={i} text="Đang cập nhật..." />
                          ))}
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-semibold mb-4">
                    Hình ảnh hoạt động
                </h2>
                <div className="columns-2 md:columns-4 gap-4 space-y-4">
                    {[
                        "https://i.pinimg.com/736x/e0/2f/9c/e02f9c8c0dafb72247deac7917cbec14.jpg",
                        "https://i.pinimg.com/736x/b8/ba/14/b8ba14b29683e9586fd5df546b847f7f.jpg",
                        "https://i.pinimg.com/736x/d4/6b/8e/d46b8e5341a889d76bd53baf3efd8d21.jpg",
                        "https://i.pinimg.com/1200x/27/17/1c/27171cb1fafda439f8ed9101b96a3942.jpg",
                        "https://i.pinimg.com/736x/45/04/b2/4504b22b17c2bcd1462351e96d03ab29.jpg",
                        "https://i.pinimg.com/736x/e0/2f/9c/e02f9c8c0dafb72247deac7917cbec14.jpg",
                        "https://i.pinimg.com/736x/b8/ba/14/b8ba14b29683e9586fd5df546b847f7f.jpg",
                    ].map((url, idx) => {
                        const targetUrl =
                            "https://i.pinimg.com/736x/45/04/b2/4504b22b17c2bcd1462351e96d03ab29.jpg";

                        if (url === targetUrl) {
                            return (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-ocean-100 w-full relative overflow-hidden"
                                    style={{ paddingBottom: "150%" }}
                                >
                                    <img
                                        src={url}
                                        alt={`gallery-${idx}`}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`gallery-${idx}`}
                                    className="rounded-xl border border-ocean-100 w-full object-cover"
                                />
                            );
                        }
                    })}
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4">
                <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-ocean-500 to-ocean-300 text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                            <LifeBuoy className="w-6 h-6" /> Cần hỗ trợ ngay?
                        </h3>
                        <p className="opacity-90">
                            Gửi yêu cầu kèm thông tin chi tiết để chúng tôi hỗ
                            trợ nhanh nhất có thể.
                        </p>
                    </div>
                    <NavLink
                        to="/yeu-cau"
                        className="px-6 py-3 rounded-full bg-white text-ocean-900 font-medium hover:bg-ocean-50 transition"
                    >
                        Gửi yêu cầu
                    </NavLink>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc, to, color }) {
    return (
        <NavLink
            to={to}
            className="group rounded-2xl border border-ocean-100 bg-white p-6 hover:shadow-lg hover:-translate-y-1 transition"
        >
            <div
                className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white w-fit mb-4`}
            >
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-ocean-600 mb-3">{desc}</p>
            <span className="text-sm text-ocean-500 group-hover:text-ocean-900">
                Tìm hiểu →
            </span>
        </NavLink>
    );
}

function AnnouncementCard({ item }) {
    return (
        <div className="rounded-2xl border border-ocean-100 bg-white p-5 flex flex-col">
            <div className="text-sm text-ocean-500 mb-1">
                {item.ngay_phat_hanh || "—"}
            </div>
            <h3 className="font-medium line-clamp-2">{item.tieu_de}</h3>
            <p className="text-sm text-ocean-700 mt-1 line-clamp-3">
                {item.noi_dung}
            </p>
        </div>
    );
}

function SkeletonCard({ text }) {
    return (
        <div className="rounded-2xl border border-ocean-100 bg-white p-5 animate-pulse">
            <div className="h-3 w-24 bg-ocean-100 rounded mb-2" />
            <div className="h-5 w-3/4 bg-ocean-100 rounded mb-2" />
            <div className="h-4 w-full bg-ocean-100 rounded mb-1" />
            <div className="h-4 w-5/6 bg-ocean-100 rounded mb-1" />
            <div className="h-4 w-4/6 bg-ocean-100 rounded mb-3" />
            <div className="text-sm text-ocean-500">{text}</div>
        </div>
    );
}
