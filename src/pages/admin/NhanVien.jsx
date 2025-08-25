import axios from "axios";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const emptyForm = {
  ho_va_ten: "",
  email: "",
  so_dien_thoai: "",
  dia_chi: "",
  id_tram: "",
  tinh_trang: 1,
};

export default function NhanVien() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // GET danh sách
  const fetchData = async () => {
    try {
      const res = await axios.get("/admin/nhan-vien/data"); // thêm api
      setList(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE
  const createItem = async () => {
    try {
      await axios.post("/admin/nhan-vien/create", form); // thêm api
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE
  const updateItem = async () => {
    try {
      await axios.post("/admin/nhan-vien/update", { id: editingId, ...form }); // thêm api
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const deleteItem = async (id) => {
    try {
      await axios.post("/admin/nhan-vien/delete", { id }); // thêm api
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // TOGGLE
  const toggleStatus = async (id) => {
    try {
      await axios.post("/admin/nhan-vien/doi-trang-thai", { id }); // thêm api
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (row) => {
    // tránh mutate trực tiếp object trong list
    const safe = {
      id: row.id,
      ho_va_ten: row.ho_va_ten || "",
      email: row.email || "",
      so_dien_thoai: row.so_dien_thoai || "",
      dia_chi: row.dia_chi || "",
      id_tram: row.id_tram || "",
      tinh_trang: Number(row.tinh_trang) ?? 1,
    };
    setForm(safe);
    setEditingId(row.id);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    // reset sau animation để tránh nháy form
    setTimeout(() => {
      setForm(emptyForm);
      setEditingId(null);
    }, 150);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) updateItem();
    else createItem();
    closeModal();
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-ocean-900">Nhân viên</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ocean-500 text-white hover:bg-ocean-500/90 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      {/* Bảng */}
      <div className="overflow-auto rounded-xl border border-ocean-100 bg-white">
        <table className="min-w-[920px] w-full">
          <thead className="bg-ocean-100/40 text-ocean-900">
            <tr className="text-sm">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Họ và tên</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">SĐT</th>
              <th className="px-4 py-3 text-left">Địa chỉ</th>
              <th className="px-4 py-3 text-left">Trạm</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ocean-100">
            {list.map((nv, i) => (
              <tr key={nv.id} className="text-sm hover:bg-ocean-50/60">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{nv.ho_va_ten}</td>
                <td className="px-4 py-3">{nv.email}</td>
                <td className="px-4 py-3">{nv.so_dien_thoai}</td>
                <td className="px-4 py-3">{nv.dia_chi}</td>
                <td className="px-4 py-3">{nv.id_tram}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleStatus(nv.id)}
                    className={`px-2 py-1 rounded text-white ${
                      Number(nv.tinh_trang) === 1 ? "bg-green-600" : "bg-red-500"
                    }`}
                  >
                    {Number(nv.tinh_trang) === 1 ? "Hoạt động" : "Dừng"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(nv)}
                      className="px-3 py-1.5 rounded-lg border border-ocean-100 hover:bg-ocean-100/50"
                      title="Sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem(nv.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      title="Xoá"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-ocean-500">
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL thêm/sửa */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-100"
            onClick={closeModal}
          />
          {/* panel */}
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-ocean-100">
            {/* header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-ocean-100">
              <h3 className="text-lg font-semibold text-ocean-900">
                {editingId ? "Cập nhật nhân viên" : "Thêm nhân viên"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-ocean-50"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* body */}
            <form onSubmit={handleSubmit} className="px-5 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm text-ocean-500">Họ và tên</label>
                  <input
                    required
                    value={form.ho_va_ten}
                    onChange={(e) => setForm({ ...form, ho_va_ten: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100 bg-white"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-ocean-500">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100 bg-white"
                    placeholder="a@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-ocean-500">Số điện thoại</label>
                  <input
                    value={form.so_dien_thoai}
                    onChange={(e) => setForm({ ...form, so_dien_thoai: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100 bg-white"
                    placeholder="0901xxxxxx"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-ocean-500">ID trạm</label>
                  <input
                    value={form.id_tram}
                    onChange={(e) => setForm({ ...form, id_tram: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100 bg-white"
                    placeholder="T1, T2…"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm text-ocean-500">Địa chỉ</label>
                  <input
                    value={form.dia_chi}
                    onChange={(e) => setForm({ ...form, dia_chi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-ocean-100 bg-white"
                    placeholder="Số nhà, đường, phường, quận…"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="inline-flex items-center gap-2 text-sm text-ocean-700">
                    <input
                      type="checkbox"
                      checked={Number(form.tinh_trang) === 1}
                      onChange={(e) =>
                        setForm({ ...form, tinh_trang: e.target.checked ? 1 : 0 })
                      }
                      className="accent-ocean-500"
                    />
                    Đang hoạt động
                  </label>
                </div>
              </div>

              {/* footer */}
              <div className="mt-5 flex items-center justify-end gap-2 border-t border-ocean-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-ocean-100"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-ocean-500 text-white hover:bg-ocean-500/90"
                >
                  {editingId ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
