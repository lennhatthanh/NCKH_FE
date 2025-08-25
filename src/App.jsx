// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import IndexAdminLayout from "../layout/wrapper/index_admin.jsx";

// Pages Admin
import NhanVien from "./pages/admin/NhanVien.jsx";
import YeuCau from "./pages/admin/YeuCau.jsx";
import ThongKe from "./pages/admin/ThongKe.jsx";
import TramSoTan from "./pages/admin/TramSoTan.jsx";
import Iot from "./pages/admin/Iot.jsx";
import CanhBao from "./pages/admin/CanhBao.jsx";
import ThongBao from "./pages/admin/ThongBao.jsx";
import GuiMail from "./pages/admin/GuiMail.jsx";
import CuuTro from "./pages/admin/CuuTro.jsx";
import MapPage from "./pages/admin/Map.jsx";
import QuanLyTram from "./pages/admin/QuanLyTram.jsx";
import UserLayout from "../layout/components/UserLayout.jsx";
import Home from "./pages/user/Home.jsx";
import ThongBaoPublic from "./pages/user/ThongBaoPublic.jsx";
import TramSoTanPublic from "./pages/user/TramSoTanPublic.jsx";
import MapPublic from "./pages/user/MapPublic.jsx";
import YeuCauPublic from "./pages/user/YeuCauPublic.jsx";
import AdminLogin from "./pages/auth/AdminLogin.jsx";

export default function App() {
  return (
    <Routes>
     <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="thong-bao" element={<ThongBaoPublic />} />
        <Route path="tram-so-tan" element={<TramSoTanPublic />} />
        <Route path="map" element={<MapPublic />} />
        <Route path="yeu-cau" element={<YeuCauPublic />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<IndexAdminLayout />}>
        <Route index element={<Navigate to="nhan-vien" replace />} />
        <Route path="nhan-vien" element={<NhanVien />} />
        <Route path="yeu-cau" element={<YeuCau />} />
        <Route path="thong-ke" element={<ThongKe />} />
        <Route path="tram-so-tan" element={<TramSoTan />} />
        <Route path="iot" element={<Iot />} />
        <Route path="canh-bao" element={<CanhBao />} />
        <Route path="thong-bao" element={<ThongBao />} />
        <Route path="gui-mail" element={<GuiMail />} />
        <Route path="cuu-tro" element={<CuuTro />} />
        <Route path="map" element={<MapPage />} />
        <Route path="quan-ly-tram" element={<QuanLyTram />} />
      </Route>
      <Route path="*" element={<div className="p-6">Not Found</div>} />
    </Routes>
  );
}
