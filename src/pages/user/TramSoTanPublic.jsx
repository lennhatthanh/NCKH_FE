import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dataTramSoTan } from "../../features/tramsotan/tramSoTanSlice";

export default function TramSoTanPublic() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.tramsotan.tramsotan) || [];
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(dataTramSoTan());
  }, [dispatch]);

  const filteredData = data.filter(
    (tram) =>
      tram.ten_khu_vuc.toLowerCase().includes(search.toLowerCase()) ||
      tram.mo_ta.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Danh sách Trạm Sơ Tán</h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Tìm kiếm theo khu vực hoặc mô tả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((tram) => (
          <div
            key={tram.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-white"
          >
            <h2 className="text-lg font-semibold mb-2">{tram.ten_khu_vuc}</h2>
            <p className="text-gray-600 mb-1">Điện thoại: {tram.so_dien_thoai || "Chưa có"}</p>
            <p className="text-gray-600 mb-1">Mô tả: {tram.mo_ta || "Không có mô tả"}</p>
            <p className="text-gray-600 mb-1">
              Sức chứa: {tram.suc_chua} - Đang chứa: {tram.dang_chua}
            </p>
            <p className="text-gray-600 mb-2">
              Tình trạng: {tram.tinh_trang ? "Hoạt động" : "Ngưng hoạt động"}
            </p>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-200"
              onClick={() => navigate("/map", { state: { id: tram.id } })}
            >
              Xem trên map
            </button>
          </div>
        ))}

        {filteredData.length === 0 && (
          <p className="col-span-full text-center text-gray-500">Không tìm thấy trạm sơ tán phù hợp</p>
        )}
      </div>
    </div>
  );
}
