/* eslint-disable */
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios, { delayResponse: 300 });

// -------- Helpers --------
const ok = (data = {}) => [200, data];
const parse = (config) => {
  try { return JSON.parse(config.data || "{}"); } catch { return {}; }
};
const idFromUrl = (url) => {
  const m = url && url.match(/\/(\d+)(\/)?$/);
  return m ? Number(m[1]) : null;
};

// -------- Seed data (mock) --------
let nhanVien = [
  { id:1, ho_va_ten:"Nguyễn An", email:"an@example.com", so_dien_thoai:"0901234567", dia_chi:"Q.1, TP.HCM", id_tram:"T1", tinh_trang:1 },
  { id:2, ho_va_ten:"Trần Bình", email:"binh@example.com", so_dien_thoai:"0912345678", dia_chi:"Q.7, TP.HCM", id_tram:"T2", tinh_trang:0 },
];

let yeuCau = [
  { id:11, ho_va_ten:"Lê Chi", so_dien_thoai:"0987654321", dia_chi:"Q.3", phuong:"P.5", quan:"Q.3", noi_dung:"Cần thực phẩm", tinh_trang:0 },
  { id:12, ho_va_ten:"Phạm Dũng", so_dien_thoai:"0909999999", dia_chi:"Q.10", phuong:"P.12", quan:"Q.10", noi_dung:"Hỗ trợ y tế", tinh_trang:1 },
];

let thongBao = [
  { id:51, tieu_de:"Lịch diễn tập", noi_dung:"Sáng thứ 7", tinh_trang:1 },
];

let canhBao = [
  { id:41, khu_vuc:"Q.7", muc_do:"Cao", noi_dung:"Ngập sâu", kinh_do:"106.71", vi_do:"10.73" },
];

let iot = [
  { id:31, id_iot:"IOT-001", vi_tri:"Cầu A", kinh_do:"106.70", vi_do:"10.77", mo_ta:"Cảm biến mực nước", tinh_trang:1 },
];

let tramSoTan = [
  { id:21, ten_khu_vuc:"Nhà văn hoá P.5", dia_chi:"123 Lê Lợi", kinh_do:"106.7", vi_do:"10.78", so_nguoi_lon:50, so_tre_em:10, tinh_trang:1 },
];

let cuuTro = [
  { id:61, ho_va_ten:"Võ Hà", so_dien_thoai:"0903333333", dia_chi:"Q.4", phuong:"P.8", quan:"Q.4", noi_dung:"Cần áo phao", tinh_trang:0 },
];

let mapPoints = [
  { id:71, khu_vuc:"Trường TH A", kinh_do:"106.69", vi_do:"10.75", mo_ta:"Điểm tập kết" },
];

let quanLyTram = [
  { id:81, ho_va_ten:"Nguyễn Quản Trạm", so_cccd:"079xxxxxxxx", so_dien_thoai:"0901111222", dia_chi:"Q.1" },
];

// ====== NHÂN VIÊN ======
mock.onGet(/\/admin\/nhan-vien\/data$/).reply(() => ok(nhanVien));
mock.onPost(/\/admin\/nhan-vien\/create$/).reply((cfg) => {
  const b = parse(cfg);
  const id = Math.max(0, ...nhanVien.map(x=>x.id)) + 1;
  nhanVien.push({ id, ...b });
  return ok({ id });
});
mock.onPost(/\/admin\/nhan-vien\/update$/).reply((cfg) => {
  const b = parse(cfg); // { id, ...fields }
  nhanVien = nhanVien.map(x => x.id === Number(b.id) ? { ...x, ...b } : x);
  return ok();
});
// chấp nhận cả PUT /update/:id (nếu trang nào dùng)
mock.onPut(/\/admin\/nhan-vien\/update\/\d+$/).reply((cfg) => {
  const id = idFromUrl(cfg.url);
  const b = parse(cfg);
  nhanVien = nhanVien.map(x => x.id === id ? { ...x, ...b } : x);
  return ok();
});
mock.onPost(/\/admin\/nhan-vien\/delete$/).reply((cfg) => {
  const { id } = parse(cfg);
  nhanVien = nhanVien.filter(x => x.id !== Number(id));
  return ok();
});
mock.onDelete(/\/admin\/nhan-vien\/delete\/\d+$/).reply((cfg) => {
  const id = idFromUrl(cfg.url);
  nhanVien = nhanVien.filter(x => x.id !== id);
  return ok();
});
mock.onPost(/\/admin\/nhan-vien\/doi-trang-thai$/).reply((cfg) => {
  const { id } = parse(cfg);
  nhanVien = nhanVien.map(x => x.id === Number(id) ? { ...x, tinh_trang: x.tinh_trang ? 0 : 1 } : x);
  return ok();
});

// ====== YÊU CẦU CỨU TRỢ ======
mock.onGet(/\/admin\/yeu-cau-cuu-tro\/data$/).reply(() => ok(yeuCau));
mock.onPost(/\/admin\/yeu-cau-cuu-tro\/create$/).reply((cfg) => {
  const b = parse(cfg);
  const id = Math.max(0, ...yeuCau.map(x=>x.id)) + 1;
  yeuCau.push({ id, ...b });
  return ok({ id });
});
mock.onPost(/\/admin\/yeu-cau-cuu-tro\/update$/).reply((cfg) => {
  const b = parse(cfg);
  yeuCau = yeuCau.map(x => x.id === Number(b.id) ? { ...x, ...b } : x);
  return ok();
});
mock.onPut(/\/admin\/yeu-cau-cuu-tro\/update\/\d+$/).reply((cfg) => {
  const id = idFromUrl(cfg.url);
  const b = parse(cfg);
  yeuCau = yeuCau.map(x => x.id === id ? { ...x, ...b } : x);
  return ok();
});
mock.onPost(/\/admin\/yeu-cau-cuu-tro\/delete$/).reply((cfg) => {
  const { id } = parse(cfg);
  yeuCau = yeuCau.filter(x => x.id !== Number(id));
  return ok();
});
mock.onDelete(/\/admin\/yeu-cau-cuu-tro\/delete\/\d+$/).reply((cfg) => {
  const id = idFromUrl(cfg.url);
  yeuCau = yeuCau.filter(x => x.id !== id);
  return ok();
});
mock.onPost(/\/admin\/yeu-cau-cuu-tro\/doi-trang-thai$/).reply((cfg) => {
  const { id } = parse(cfg);
  yeuCau = yeuCau.map(x => x.id === Number(id) ? { ...x, tinh_trang: Number(x.tinh_trang)===1 ? 0 : 1 } : x);
  return ok();
});

// ====== THỐNG KÊ ======
mock.onGet(/\/admin\/thong-ke\/laydate$/).reply(() => ok({ from: "2025-08-01", to: "2025-08-13" }));
mock.onPost(/\/admin\/thong-ke\/data$/).reply((cfg) => {
  const { from, to } = parse(cfg);
  // mock số liệu
  const tongYeuCau = yeuCau.length;
  const daXuLy = yeuCau.filter(x => Number(x.tinh_trang)===1).length;
  const chuaXuLy = tongYeuCau - daXuLy;
  const canhBaoCount = canhBao.length;
  const iotOnline = iot.filter(x => Number(x.tinh_trang)===1).length;
  return ok({
    tongYeuCau, daXuLy, chuaXuLy, canhBao: canhBaoCount, iotOnline,
    yeuCauTheoNgay: [5,7,3,9,6,8,4],
    canhBaoTheoNgay: [0,1,0,2,1,0,3],
  });
});
mock.onPost(/\/admin\/thong-ke\/dataIOT$/).reply((cfg) => {
  return ok({ iotTheoNgay: [2,3,1,5,4,6,2] });
});

// ====== TRẠM SƠ TÁN ======
mock.onGet(/\/admin\/tram-so-tan\/data$/).reply(() => ok(tramSoTan));
mock.onPost(/\/admin\/tram-so-tan\/create$/).reply((cfg) => {
  const b = parse(cfg);
  const id = Math.max(0, ...tramSoTan.map(x=>x.id)) + 1;
  tramSoTan.push({ id, ...b });
  return ok({ id });
});
mock.onPost(/\/admin\/tram-so-tan\/update$/).reply((cfg) => {
  const b = parse(cfg);
  tramSoTan = tramSoTan.map(x => x.id === Number(b.id) ? { ...x, ...b } : x);
  return ok();
});
mock.onPost(/\/admin\/tram-so-tan\/delete$/).reply((cfg) => {
  const { id } = parse(cfg);
  tramSoTan = tramSoTan.filter(x => x.id !== Number(id));
  return ok();
});
mock.onPost(/\/admin\/tram-so-tan\/doi-trang-thai$/).reply((cfg) => {
  const { id } = parse(cfg);
  tramSoTan = tramSoTan.map(x => x.id === Number(id) ? { ...x, tinh_trang: x.tinh_trang ? 0 : 1 } : x);
  return ok();
});

// ====== IOT ======
mock.onGet(/\/admin\/iot\/data$/).reply(() => ok(iot));
mock.onPost(/\/admin\/iot\/create$/).reply((cfg) => {
  const b = parse(cfg);
  const id = Math.max(0, ...iot.map(x=>x.id)) + 1;
  iot.push({ id, ...b });
  return ok({ id });
});
mock.onPost(/\/admin\/iot\/update$/).reply((cfg) => {
  const b = parse(cfg);
  iot = iot.map(x => x.id === Number(b.id) ? { ...x, ...b } : x);
  return ok();
});
mock.onPost(/\/admin\/iot\/delete$/).reply((cfg) => {
  const { id } = parse(cfg);
  iot = iot.filter(x => x.id !== Number(id));
  return ok();
});
mock.onPost(/\/admin\/iot\/doi-trang-thai$/).reply((cfg) => {
  const { id } = parse(cfg);
  iot = iot.map(x => x.id === Number(id) ? { ...x, tinh_trang: x.tinh_trang ? 0 : 1 } : x);
  return ok();
});

// ====== CẢNH BÁO ======
mock.onGet(/\/admin\/canh-bao\/data$/).reply(() => ok(canhBao));
mock.onPost(/\/admin\/canh-bao\/create$/).reply((cfg) => {
  const b = parse(cfg);
  const id = Math.max(0, ...canhBao.map(x=>x.id||0)) + 1;
  canhBao.push({ id, ...b });
  return ok({ id });
});
mock.onPost(/\/admin\/canh-bao\/update$/).reply((cfg) => {
  const b = parse(cfg);
  canhBao = canhBao.map(x => x.id === Number(b.id) ? { ...x, ...b } : x);
  return ok();
});
mock.onPost(/\/admin\/canh-bao\/delete$/).reply((cfg) => {
  const { id } = parse(cfg);
  canhBao = canhBao.filter(x => x.id !== Number(id));
  return ok();
});

// ====== THÔNG BÁO ======
mock.onGet(/\/admin\/thong-bao\/data$/).reply(() => ok(thongBao));
mock.onPost(/\/admin\/thong-bao\/create$/).reply((cfg) => {
  const b = parse(cfg);
  const id = Math.max(0, ...thongBao.map(x=>x.id)) + 1;
  thongBao.push({ id, ...b });
  return ok({ id });
});
mock.onPost(/\/admin\/thong-bao\/update$/).reply((cfg) => {
  const b = parse(cfg);
  thongBao = thongBao.map(x => x.id === Number(b.id) ? { ...x, ...b } : x);
  return ok();
});
mock.onPost(/\/admin\/thong-bao\/delete$/).reply((cfg) => {
  const { id } = parse(cfg);
  thongBao = thongBao.filter(x => x.id !== Number(id));
  return ok();
});
mock.onPost(/\/admin\/thong-bao\/doi-trang-thai$/).reply((cfg) => {
  const { id } = parse(cfg);
  thongBao = thongBao.map(x => x.id === Number(id) ? { ...x, tinh_trang: x.tinh_trang ? 0 : 1 } : x);
  return ok();
});

// ====== GỬI MAIL ======
mock.onPost(/\/admin\/gui-mail$/).reply((cfg) => {
  const { to, subject, content } = parse(cfg);
  // giả vờ gửi thành công
  return ok({ sent: true, to, subject, size: (content||"").length });
});

// ====== CỨU TRỢ ======
mock.onGet(/\/admin\/cuu-tro\/data$/).reply(() => ok(cuuTro));
mock.onPost(/\/admin\/cuu-tro\/doi-trang-thai$/).reply((cfg) => {
  const { id } = parse(cfg);
  cuuTro = cuuTro.map(x => x.id === Number(id) ? { ...x, tinh_trang: Number(x.tinh_trang)===1 ? 0 : 1 } : x);
  return ok();
});

// ====== MAP ======
mock.onGet(/\/admin\/map\/data$/).reply(() => ok(mapPoints));
mock.onPost(/\/admin\/map\/create$/).reply((cfg) => {
  const b = parse(cfg);
  const id = Math.max(0, ...mapPoints.map(x=>x.id)) + 1;
  mapPoints.push({ id, ...b });
  return ok({ id });
});
mock.onPost(/\/admin\/map\/delete$/).reply((cfg) => {
  const { id } = parse(cfg);
  mapPoints = mapPoints.filter(x => x.id !== Number(id));
  return ok();
});

// ====== QUẢN LÝ TRẠM ======
mock.onGet(/\/nhan-vien\/quan-ly-tram\/data$/).reply(() => ok(quanLyTram));
mock.onPost(/\/nhan-vien\/quan-ly-tram\/create$/).reply((cfg) => {
  const b = parse(cfg);
  const id = Math.max(0, ...quanLyTram.map(x=>x.id)) + 1;
  quanLyTram.push({ id, ...b });
  return ok({ id });
});
mock.onPost(/\/nhan-vien\/quan-ly-tram\/update$/).reply((cfg) => {
  const b = parse(cfg);
  quanLyTram = quanLyTram.map(x => x.id === Number(b.id) ? { ...x, ...b } : x);
  return ok();
});
mock.onPost(/\/nhan-vien\/quan-ly-tram\/delete$/).reply((cfg) => {
  const { id } = parse(cfg);
  quanLyTram = quanLyTram.filter(x => x.id !== Number(id));
  return ok();
});

export default mock;
