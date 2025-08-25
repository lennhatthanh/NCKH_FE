import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

const emptyForm = { id: null, ho_va_ten: "", so_cccd: "", so_dien_thoai: "", dia_chi: "" };

export default function QuanLyTram() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [keyword, setKeyword] = useState("");

  const fetchData = async () => { const res = await axios.get("/nhan-vien/quan-ly-tram/data"); setList(res.data?.data || res.data || []); };
  const createItem = async () => { await axios.post("/nhan-vien/quan-ly-tram/create", form); fetchData(); };
  const updateItem = async () => { await axios.post("/nhan-vien/quan-ly-tram/update", { id: editingId, ...form }); fetchData(); };
  const deleteItem = async (id) => { await axios.post("/nhan-vien/quan-ly-tram/delete", { id }); fetchData(); };

  useEffect(() => { fetchData(); }, []);
  const filtered = useMemo(() => {
    const k = keyword.toLowerCase();
    return list.filter(r =>
      (r.ho_va_ten || "").toLowerCase().includes(k) ||
      (r.so_cccd || "").toLowerCase().includes(k) ||
      (r.so_dien_thoai || "").toLowerCase().includes(k) ||
      (r.dia_chi || "").toLowerCase().includes(k)
    );
  }, [list, keyword]);

  const submitForm = (e) => { e.preventDefault(); editingId ? updateItem() : createItem(); setShowForm(false); setForm(emptyForm); setEditingId(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ocean-900">Quản lý trạm</h1>
        <button onClick={() => { setForm(emptyForm); setShowForm(true); }} className="px-4 py-2 rounded-lg bg-ocean-500 text-white">
          <Plus className="w-4 h-4 inline-block mr-2" />Thêm mới
        </button>
      </div>

      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300" />
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm theo tên, CCCD, SĐT, địa chỉ…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-ocean-100 bg-white" />
      </div>

      <div className="overflow-auto rounded-xl border border-ocean-100 bg-white">
        <table className="min-w-[880px] w-full">
          <thead className="bg-ocean-100/40"><tr className="text-sm">
            <th className="px-4 py-3">#</th><th className="px-4 py-3">Họ và tên</th><th className="px-4 py-3">CCCD</th>
            <th className="px-4 py-3">SĐT</th><th className="px-4 py-3">Địa chỉ</th><th className="px-4 py-3 text-right">Hành động</th>
          </tr></thead>
          <tbody className="divide-y divide-ocean-100">
            {filtered.map((r, i) => (
              <tr key={r.id} className="text-sm hover:bg-ocean-50/60">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{r.ho_va_ten}</td>
                <td className="px-4 py-3">{r.so_cccd}</td>
                <td className="px-4 py-3">{r.so_dien_thoai}</td>
                <td className="px-4 py-3">{r.dia_chi}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setForm(r); setEditingId(r.id); setShowForm(true); }} className="px-3 py-1.5 rounded-lg border border-ocean-100 hover:bg-ocean-100/50"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem(r.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-ocean-500">Không có dữ liệu</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5">
            <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-semibold">{editingId ? "Cập nhật" : "Thêm người phụ trách"}</h3><button onClick={() => setShowForm(false)} className="p-2 hover:bg-ocean-50 rounded"><X className="w-5 h-5" /></button></div>
            <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Họ và tên" value={form.ho_va_ten} onChange={e => setForm({ ...form, ho_va_ten: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
              <input placeholder="CCCD" value={form.so_cccd} onChange={e => setForm({ ...form, so_cccd: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
              <input placeholder="Số điện thoại" value={form.so_dien_thoai} onChange={e => setForm({ ...form, so_dien_thoai: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
              <input placeholder="Địa chỉ" value={form.dia_chi} onChange={e => setForm({ ...form, dia_chi: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="submit" className="px-4 py-2 rounded-lg bg-ocean-500 text-white">{editingId ? "Cập nhật" : "Thêm"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-ocean-100">Huỷ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
