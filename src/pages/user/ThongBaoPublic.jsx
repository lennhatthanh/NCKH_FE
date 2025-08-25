import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnnouncements } from "../../features/announcements/announcements"
export default function ThongBaoPublic() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(s => s.announcements);

  useEffect(()=>{ dispatch(fetchAnnouncements()); }, [dispatch]);

  if (loading) return <div>Đang tải…</div>;
  if (error)   return <div className="text-red-600">Lỗi: {error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Thông báo</h1>
      <div className="grid gap-3">
        {items.map(tb => (
          <div key={tb.id} className="rounded-xl border border-ocean-100 bg-white p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium">{tb.tieu_de}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${Number(tb.tinh_trang)===1 ? "bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>
                {Number(tb.tinh_trang)===1 ? "Đang hiển thị" : "Ẩn"}
              </span>
            </div>
            <p className="text-ocean-700">{tb.noi_dung}</p>
          </div>
        ))}
        {items.length===0 && <div className="text-ocean-500">Chưa có thông báo.</div>}
      </div>
    </div>
  );
}
