import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, CheckCircle2, XCircle, ArrowUpDown, X } from "lucide-react";

const emptyForm = {
  id: null,
  ho_va_ten: "",
  so_dien_thoai: "",
  dia_chi: "",
  phuong: "",
  quan: "",
  noi_dung: "",
  tinh_trang: 0, 
};

export default function YeuCau() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    try {
      const res = await axios.get("/admin/yeu-cau-cuu-tro/data");
      setList(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (e) { console.error(e); }
  };
  const createItem = async () => { await axios.post("/admin/yeu-cau-cuu-tro/create", form); fetchData(); };
  const updateItem = async () => { await axios.post("/admin/yeu-cau-cuu-tro/update", { id: editingId, ...form }); fetchData(); };
  const deleteItem = async (id) => { await axios.post("/admin/yeu-cau-cuu-tro/delete", { id }); fetchData(); };
  const toggleStatus = async (id) => { await axios.post("/admin/yeu-cau-cuu-tro/doi-trang-thai", { id }); fetchData(); };

  useEffect(() => { fetchData(); }, []);
  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (row) => { setForm(row); setEditingId(row.id); setShowForm(true); };
  const askDelete = (row) => { setDelTarget(row); setShowDelete(true); };
  const submitForm = (e) => { e.preventDefault(); editingId ? updateItem() : createItem(); setShowForm(false); };

  const filtered = useMemo(() => {
    let arr = list;
    if (keyword.trim()) {
      const k = keyword.toLowerCase();
      arr = arr.filter((r) =>
        (r.ho_va_ten || "").toLowerCase().includes(k) ||
        (r.so_dien_thoai || "").toLowerCase().includes(k) ||
        (r.dia_chi || "").toLowerCase().includes(k) ||
        (r.noi_dung || "").toLowerCase().includes(k) ||
        (r.phuong || "").toLowerCase().includes(k) ||
        (r.quan || "").toLowerCase().includes(k)
      );
    }
    if (statusFilter !== "all") {
      const st = Number(statusFilter);
      arr = arr.filter((r) => Number(r.tinh_trang) === st);
    }
    return [...arr].sort((a, b) => {
      const A = (a.ho_va_ten || "").toLowerCase();
      const B = (b.ho_va_ten || "").toLowerCase();
      return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
    });
  }, [list, keyword, sortAsc, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ocean-900">Quản lý yêu cầu</h1>

        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ocean-500 text-white hover:bg-ocean-500/90">
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm theo tên, SĐT, địa chỉ, nội dung…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-ocean-100 bg-white" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-ocean-100 bg-white">
            <option value="all">Tất cả trạng thái</option>
            <option value="0">Mới / Chờ</option>
            <option value="1">Đã xử lý</option>
          </select>
        </div>
        <button onClick={() => setSortAsc((v) => !v)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-ocean-100 hover:bg-ocean-100/50">
          <ArrowUpDown className="w-4 h-4" />
          Sắp xếp theo tên {sortAsc ? "(A→Z)" : "(Z→A)"}
        </button>
      </div>

      <div className="overflow-auto rounded-xl border border-ocean-100 bg-white">
        <table className="min-w-[880px] w-full text-left">
          <thead className="bg-ocean-100/40 text-ocean-900">
            <tr className="text-sm">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Họ và tên</th>
              <th className="px-4 py-3">SĐT</th>
              <th className="px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3">Phường</th>
              <th className="px-4 py-3">Quận</th>
              <th className="px-4 py-3">Nội dung</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ocean-100">
            {filtered.map((r, idx) => (
              <tr key={r.id} className="text-sm hover:bg-ocean-50/60">
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3 font-medium text-ocean-900">{r.ho_va_ten}</td>
                <td className="px-4 py-3">{r.so_dien_thoai}</td>
                <td className="px-4 py-3">{r.dia_chi}</td>
                <td className="px-4 py-3">{r.phuong}</td>
                <td className="px-4 py-3">{r.quan}</td>
                <td className="px-4 py-3 max-w-[280px]"><div className="line-clamp-2">{r.noi_dung}</div></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {Number(r.tinh_trang) === 1 ? (
                      <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" /> Đã xử lý</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-orange-600"><XCircle className="w-4 h-4" /> Mới / Chờ</span>
                    )}
                    <button onClick={() => toggleStatus(r.id)} className="text-xs px-2 py-1 rounded border border-ocean-100 hover:bg-ocean-100/50">Đổi</button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(r)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ocean-100 hover:bg-ocean-100/50"><Pencil className="w-4 h-4" /> Sửa</button>
                    <button onClick={() => askDelete(r)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Xoá</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-ocean-500">Không có dữ liệu</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-ocean-900">{editingId ? "Cập nhật yêu cầu" : "Thêm yêu cầu"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-ocean-50 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Họ và tên" value={form.ho_va_ten} onChange={(e) => setForm({ ...form, ho_va_ten: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
              <input placeholder="Số điện thoại" value={form.so_dien_thoai} onChange={(e) => setForm({ ...form, so_dien_thoai: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
              <input placeholder="Địa chỉ" value={form.dia_chi} onChange={(e) => setForm({ ...form, dia_chi: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100 md:col-span-2" />
              <input placeholder="Phường" value={form.phuong} onChange={(e) => setForm({ ...form, phuong: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
              <input placeholder="Quận" value={form.quan} onChange={(e) => setForm({ ...form, quan: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
              <textarea placeholder="Nội dung" value={form.noi_dung} onChange={(e) => setForm({ ...form, noi_dung: e.target.value })} rows={4} className="px-3 py-2 rounded-lg border border-ocean-100 md:col-span-2" />
              <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2">
                <button type="submit" className="px-4 py-2 rounded-lg bg-ocean-500 text-white">{editingId ? "Cập nhật" : "Thêm"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-ocean-100">Huỷ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xoá */}
      {showDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-ocean-900">Xoá yêu cầu</h3>
              <p className="text-sm text-ocean-500">Bạn có chắc muốn xoá yêu cầu của <b>{delTarget?.ho_va_ten}</b>?</p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 rounded-lg border border-ocean-100">Huỷ</button>
              <button onClick={() => { deleteItem(delTarget.id); setShowDelete(false); }} className="px-4 py-2 rounded-lg bg-red-500 text-white">Xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
