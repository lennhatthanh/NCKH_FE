import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TramSoTanPublic() {
  const dispatch = useDispatch();
  const [kw, setKw] = useState("");


  // return (
  //   <div className="space-y-4">
  //     <h1 className="text-2xl font-semibold">Trạm sơ tán</h1>
  //     <input value={kw} onChange={e=>setKw(e.target.value)} placeholder="Tìm theo tên/địa chỉ…" className="w-full md:w-96 px-3 py-2 rounded-lg border border-ocean-100 bg-white" />
  //     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  //       {filtered.map(tram=>(
  //         <div key={tram.id} className="rounded-xl border border-ocean-100 bg-white p-4">
  //           <div className="flex items-center justify-between">
  //             <h3 className="font-medium">{tram.ten_khu_vuc}</h3>
  //             <span className={`text-xs px-2 py-0.5 rounded ${Number(tram.tinh_trang)===1?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>
  //               {Number(tram.tinh_trang)===1?"Mở":"Đóng"}
  //             </span>
  //           </div>
  //           <div className="text-sm text-ocean-600 mt-1">{tram.dia_chi}</div>
  //           <div className="mt-2 text-sm">Người lớn: <b>{tram.so_nguoi_lon}</b> • Trẻ em: <b>{tram.so_tre_em}</b></div>
  //           <div className="text-xs text-ocean-500 mt-1">({tram.kinh_do}, {tram.vi_do})</div>
  //         </div>
  //       ))}
  //     </div>
  //     {filtered.length===0 && <div className="text-ocean-500">Không tìm thấy trạm phù hợp.</div>}
  //   </div>
  // );
}
