import axios from "axios";
import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";

export default function MapPage() {
  const [points, setPoints] = useState([]);
  const [form, setForm] = useState({ khu_vuc: "", kinh_do: "", vi_do: "", mo_ta: "" });

  const fetchPoints = async () => { const res = await axios.get("/admin/map/data"); setPoints(res.data?.data || res.data || []); };
  const createPoint = async () => { await axios.post("/admin/map/create", form); fetchPoints(); setForm({ khu_vuc: "", kinh_do: "", vi_do: "", mo_ta: "" }); };
  const deletePoint = async (id) => { await axios.post("/admin/map/delete", { id }); fetchPoints(); };

  useEffect(() => { fetchPoints(); }, []);

  return (
    <div className="grid lg:grid-cols-[1fr,420px] gap-6">
      <div className="rounded-xl border border-ocean-100 bg-white h-[520px] grid place-items-center text-ocean-500">
        {/* TODO: Gắn bản đồ thật (Leaflet/Mapbox/Google) */}
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <div>Map placeholder – gắn thư viện bản đồ của bạn vào đây.</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-ocean-100 bg-white p-4 space-y-3">
          <h3 className="font-medium text-ocean-900">Thêm điểm</h3>
          <input placeholder="Khu vực" value={form.khu_vuc} onChange={e => setForm({ ...form, khu_vuc: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-ocean-100" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Kinh độ" value={form.kinh_do} onChange={e => setForm({ ...form, kinh_do: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
            <input placeholder="Vĩ độ" value={form.vi_do} onChange={e => setForm({ ...form, vi_do: e.target.value })} className="px-3 py-2 rounded-lg border border-ocean-100" />
          </div>
          <textarea placeholder="Mô tả" value={form.mo_ta} onChange={e => setForm({ ...form, mo_ta: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-ocean-100" />
          <button onClick={createPoint} className="px-4 py-2 rounded-lg bg-ocean-500 text-white"><Plus className="w-4 h-4 inline-block mr-2" />Thêm điểm</button>
        </div>

        <div className="rounded-xl border border-ocean-100 bg-white p-4">
          <h3 className="font-medium text-ocean-900 mb-3">Danh sách điểm</h3>
          <div className="max-h-[240px] overflow-auto space-y-2">
            {points.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-ocean-100">
                <div>
                  <div className="font-medium">{p.khu_vuc}</div>
                  <div className="text-sm text-ocean-500">{p.kinh_do} , {p.vi_do}</div>
                </div>
                <button onClick={() => deletePoint(p.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Xoá</button>
              </div>
            ))}
            {points.length === 0 && <div className="text-ocean-500 text-sm">Chưa có điểm nào</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
