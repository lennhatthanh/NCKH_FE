import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle2, XCircle } from "lucide-react";

export default function CuuTro() {
  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState("");

  const fetchData = async () => { const res = await axios.get("/admin/cuu-tro/data"); setList(res.data?.data || res.data || []); };
  const toggleStatus = async (id) => { await axios.post("/admin/cuu-tro/doi-trang-thai", { id }); fetchData(); };

  useEffect(() => { fetchData(); }, []);
  const filtered = useMemo(() => {
    const k = keyword.toLowerCase();
    return list.filter(r =>
      (r.ho_va_ten || "").toLowerCase().includes(k) ||
      (r.so_dien_thoai || "").toLowerCase().includes(k) ||
      (r.dia_chi || "").toLowerCase().includes(k) ||
      (r.noi_dung || "").toLowerCase().includes(k)
    );
  }, [list, keyword]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ocean-900">Cứu trợ</h1>
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300" />
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm theo tên, SĐT, địa chỉ, nội dung…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-ocean-100 bg-white" />
      </div>

      <div className="overflow-auto rounded-xl border border-ocean-100 bg-white">
        <table className="min-w-[900px] w-full">
          <thead className="bg-ocean-100/40"><tr className="text-sm">
            <th className="px-4 py-3">#</th><th className="px-4 py-3">Họ và tên</th><th className="px-4 py-3">SĐT</th>
            <th className="px-4 py-3">Địa chỉ</th><th className="px-4 py-3">Phường</th><th className="px-4 py-3">Quận</th><th className="px-4 py-3">Nội dung</th><th className="px-4 py-3 text-center">Trạng thái</th>
          </tr></thead>
          <tbody className="divide-y divide-ocean-100">
            {filtered.map((r, i) => (
              <tr key={r.id} className="text-sm hover:bg-ocean-50/60">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{r.ho_va_ten}</td>
                <td className="px-4 py-3">{r.so_dien_thoai}</td>
                <td className="px-4 py-3">{r.dia_chi}</td>
                <td className="px-4 py-3">{r.phuong}</td>
                <td className="px-4 py-3">{r.quan}</td>
                <td className="px-4 py-3">{r.noi_dung}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleStatus(r.id)} className={`px-2 py-1 rounded text-white ${Number(r.tinh_trang) === 1 ? "bg-green-600" : "bg-orange-500"}`}>
                    {Number(r.tinh_trang) === 1 ? <span className="inline-flex gap-1 items-center"><CheckCircle2 className="w-4 h-4" /> Đã xử lý</span> : <span className="inline-flex gap-1 items-center"><XCircle className="w-4 h-4" /> Mới/Chờ</span>}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-ocean-500">Không có dữ liệu</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
