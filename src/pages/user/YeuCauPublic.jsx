import { useDispatch, useSelector } from "react-redux";
import { createRequest, resetState } from "../../features/requests/requestsSlice";
import { useEffect, useState } from "react";

const empty = { ho_va_ten:"", so_dien_thoai:"", dia_chi:"", phuong:"", quan:"", noi_dung:"" };

export default function YeuCauPublic() {
  const dispatch = useDispatch();
  const { sending, ok, error } = useSelector(s=>s.requests);
  const [form, setForm] = useState(empty);

  useEffect(()=>()=>dispatch(resetState()),[dispatch]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(createRequest(form)) 
      .unwrap()
      .then(()=> setForm(empty));
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Gửi yêu cầu hỗ trợ</h1>

      {ok === true  && <div className="mb-4 p-3 rounded-lg border border-green-200 text-green-700 bg-green-50">Đã gửi yêu cầu. Cảm ơn bạn!</div>}
      {ok === false && <div className="mb-4 p-3 rounded-lg border border-red-200 text-red-700 bg-red-50">Gửi thất bại: {error || "Vui lòng thử lại."}</div>}

      <form onSubmit={submit} className="rounded-xl border border-ocean-100 bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        <input required placeholder="Họ và tên" value={form.ho_va_ten} onChange={e=>setForm({...form, ho_va_ten:e.target.value})} className="px-3 py-2 rounded-lg border border-ocean-100"/>
        <input required placeholder="Số điện thoại" value={form.so_dien_thoai} onChange={e=>setForm({...form, so_dien_thoai:e.target.value})} className="px-3 py-2 rounded-lg border border-ocean-100"/>
        <input placeholder="Phường" value={form.phuong} onChange={e=>setForm({...form, phuong:e.target.value})} className="px-3 py-2 rounded-lg border border-ocean-100"/>
        <input placeholder="Quận" value={form.quan} onChange={e=>setForm({...form, quan:e.target.value})} className="px-3 py-2 rounded-lg border border-ocean-100"/>
        <input placeholder="Địa chỉ" value={form.dia_chi} onChange={e=>setForm({...form, dia_chi:e.target.value})} className="md:col-span-2 px-3 py-2 rounded-lg border border-ocean-100"/>
        <textarea required placeholder="Nội dung cần hỗ trợ" rows={5} value={form.noi_dung} onChange={e=>setForm({...form, noi_dung:e.target.value})} className="md:col-span-2 px-3 py-2 rounded-lg border border-ocean-100"/>
        <div className="md:col-span-2 flex justify-end gap-2">
          <button type="submit" disabled={sending} className="px-4 py-2 rounded-lg bg-ocean-500 text-white disabled:opacity-60">
            {sending ? "Đang gửi…" : "Gửi yêu cầu"}
          </button>
        </div>
      </form>
    </div>
  );
}
