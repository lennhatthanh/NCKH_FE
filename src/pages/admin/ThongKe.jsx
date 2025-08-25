import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Activity, Cpu, AlertTriangle, Calendar, RefreshCw } from "lucide-react";

function MiniBar({ values = [] }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex items-end gap-1 h-12">
      {values.map((v, i) => (
        <div key={i} className="w-2 rounded bg-ocean-300" style={{ height: `${(v / max) * 100}%` }} title={`${v}`} />
      ))}
    </div>
  );
}

export default function ThongKe() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(todayISO);
  const [to, setTo] = useState(todayISO);

  const [overview, setOverview] = useState({ tongYeuCau: 0, daXuLy: 0, chuaXuLy: 0, iotOnline: 0, canhBao: 0 });
  const [series, setSeries] = useState({ yeuCauTheoNgay: [], iotTheoNgay: [], canhBaoTheoNgay: [] });
  const [loading, setLoading] = useState(false);

  const fetchLayDate = async () => {
    try {
      const res = await axios.get("/admin/thong-ke/laydate");
      if (res.data?.from && res.data?.to) { setFrom(res.data.from); setTo(res.data.to); }
    } catch { /* ignore */ }
  };

  const fetchThongKe = async () => {
    setLoading(true);
    try {
      const resData = await axios.post("/admin/thong-ke/data", { from, to });
      const d = resData.data || {};
      setOverview({
        tongYeuCau: Number(d.tongYeuCau || 0),
        daXuLy: Number(d.daXuLy || 0),
        chuaXuLy: Number(d.chuaXuLy || 0),
        iotOnline: Number(d.iotOnline || 0),
        canhBao: Number(d.canhBao || 0),
      });
      const resIOT = await axios.post("/admin/thong-ke/dataIOT", { from, to });
      const iot = resIOT.data || {};
      setSeries({
        yeuCauTheoNgay: Array.isArray(d.yeuCauTheoNgay) ? d.yeuCauTheoNgay : [5, 7, 3, 9, 6, 8, 4],
        iotTheoNgay: Array.isArray(iot.iotTheoNgay) ? iot.iotTheoNgay : [2, 3, 1, 5, 4, 6, 2],
        canhBaoTheoNgay: Array.isArray(d.canhBaoTheoNgay) ? d.canhBaoTheoNgay : [0, 1, 0, 2, 1, 0, 3],
      });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLayDate(); }, []);
  useEffect(() => { fetchThongKe(); }, [from, to]);

  const tyLeXuLy = useMemo(() => {
    const t = overview.tongYeuCau || 0;
    return t ? Math.round((overview.daXuLy / t) * 100) : 0;
  }, [overview]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ocean-900">Thống kê</h1>
          <p className="text-sm text-ocean-500">Dữ liệu từ mock API.</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ocean-500" />
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-ocean-100 bg-white" />
            <span className="text-ocean-500">→</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 rounded-lg border border-ocean-100 bg-white" />
          </div>
          <button onClick={fetchThongKe} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-ocean-500 text-white hover:bg-ocean-500/90">
            <RefreshCw className="w-4 h-4" />
            Lấy dữ liệu
          </button>
        </div>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl p-4 bg-white border border-ocean-100">
          <div className="flex items-center justify-between"><span className="text-sm text-ocean-500">Tổng yêu cầu</span><BarChart3 className="w-4 h-4 text-ocean-300" /></div>
          <div className="mt-1 text-2xl font-semibold text-ocean-900">{overview.tongYeuCau}</div>
        </div>
        <div className="rounded-xl p-4 bg-white border border-ocean-100">
          <div className="flex items-center justify-between"><span className="text-sm text-ocean-500">Đã xử lý</span><Activity className="w-4 h-4 text-ocean-300" /></div>
          <div className="mt-1 text-2xl font-semibold text-ocean-900">{overview.daXuLy}</div>
          <div className="text-xs text-ocean-500 mt-1">{tyLeXuLy}% tổng</div>
        </div>
        <div className="rounded-xl p-4 bg-white border border-ocean-100">
          <div className="flex items-center justify-between"><span className="text-sm text-ocean-500">Chưa xử lý</span><AlertTriangle className="w-4 h-4 text-ocean-300" /></div>
          <div className="mt-1 text-2xl font-semibold text-ocean-900">{overview.chuaXuLy}</div>
        </div>
        <div className="rounded-xl p-4 bg-white border border-ocean-100">
          <div className="flex items-center justify-between"><span className="text-sm text-ocean-500">IoT online</span><Cpu className="w-4 h-4 text-ocean-300" /></div>
          <div className="mt-1 text-2xl font-semibold text-ocean-900">{overview.iotOnline}</div>
        </div>
        <div className="rounded-xl p-4 bg-white border border-ocean-100">
          <div className="flex items-center justify-between"><span className="text-sm text-ocean-500">Cảnh báo</span><AlertTriangle className="w-4 h-4 text-ocean-300" /></div>
          <div className="mt-1 text-2xl font-semibold text-ocean-900">{overview.canhBao}</div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 bg-white border border-ocean-100">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium text-ocean-900">Yêu cầu theo ngày</h3><span className="text-xs text-ocean-500">7 ngày</span></div>
          <MiniBar values={series.yeuCauTheoNgay} />
        </div>
        <div className="rounded-xl p-4 bg-white border border-ocean-100">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium text-ocean-900">Thiết bị IoT theo ngày</h3><span className="text-xs text-ocean-500">7 ngày</span></div>
          <MiniBar values={series.iotTheoNgay} />
        </div>
        <div className="rounded-xl p-4 bg-white border border-ocean-100">
          <div className="flex items-center justify-between mb-2"><h3 className="font-medium text-ocean-900">Cảnh báo theo ngày</h3><span className="text-xs text-ocean-500">7 ngày</span></div>
          <MiniBar values={series.canhBaoTheoNgay} />
        </div>
      </section>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] grid place-items-center z-50">
          <div className="px-4 py-2 rounded-lg bg-white border border-ocean-100 text-ocean-700">Đang tải thống kê…</div>
        </div>
      )}
    </div>
  );
}
