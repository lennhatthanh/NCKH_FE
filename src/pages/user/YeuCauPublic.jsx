import { useState } from "react";
import toast from "react-hot-toast";

const empty = {
  id: "",
  ho_va_ten: "",
  so_dien_thoai: "",
  dia_chi_cu_the: "",
  phuong: "",
  thanh_pho: "",
  noi_dung: "",
  vi_do: "",
  kinh_do: "",
};

const vatDung = ["Nước uống", "Lương thực", "Chăn màn", "Quần áo", "Thuốc men", "Đèn pin", "Pin dự phòng"];

const cities = {
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Ngũ Hành Sơn", "Sơn Trà"],
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Cầu Giấy"],
  "TP HCM": ["Quận 1", "Quận 3", "Quận 5", "Quận 10"],
};

export default function YeuCauPublic() {
  const [form, setForm] = useState(empty);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleItem = (item) => {
    const updated = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];
    setSelectedItems(updated);
    setForm({ ...form, noi_dung: updated.join(", ") });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ định vị.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm({ ...form, vi_do: position.coords.latitude, kinh_do: position.coords.longitude });
        setLocationEnabled(true);
      },
      () => toast.error("Vui lòng cho phép truy cập vị trí.")
    );
  };

  const validate = () => {
    const errs = {};
    if (!form.ho_va_ten.trim()) errs.ho_va_ten = "Họ và tên bắt buộc";
    if (!form.so_dien_thoai.match(/^\d{10,11}$/)) errs.so_dien_thoai = "Số điện thoại không hợp lệ (10-11 số)";
    if (!form.dia_chi_cu_the.trim()) errs.dia_chi_cu_the = "Địa chỉ cụ thể bắt buộc";
    if (!form.thanh_pho) errs.thanh_pho = "Chọn thành phố";
    if (!form.phuong) errs.phuong = "Chọn phường/xã";
    if (!form.noi_dung.trim()) errs.noi_dung = "Nội dung yêu cầu bắt buộc";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!locationEnabled) {
      setShowConfirm(true); // hiện modal confirm
      return;
    }
    submitForm();
  };

  const submitForm = () => {
    console.log("Form submitted:", form);
    toast.success("Yêu cầu đã được gửi!");
    setForm(empty);
    setSelectedItems([]);
    setLocationEnabled(false);
    setErrors({});
    setShowConfirm(false);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-3 text-center">Gửi yêu cầu cứu trợ</h2>
        <p className="text-gray-700 mb-4 text-center text-sm">
          Vui lòng <span className="text-red-600">điền thông tin</span> và <span className="text-red-600">bật định vị</span> để chúng tôi dễ dàng hỗ trợ bạn.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Họ và tên + SĐT */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <input
                type="text"
                name="ho_va_ten"
                placeholder="Họ và tên"
                value={form.ho_va_ten}
                onChange={handleChange}
                className={`border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.ho_va_ten ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
                }`}
                required
              />
              {errors.ho_va_ten && <span className="text-red-500 text-xs">{errors.ho_va_ten}</span>}
            </div>
            <div className="flex flex-col">
              <input
                type="tel"
                name="so_dien_thoai"
                placeholder="Số điện thoại"
                value={form.so_dien_thoai}
                onChange={handleChange}
                className={`border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.so_dien_thoai ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
                }`}
                required
              />
              {errors.so_dien_thoai && <span className="text-red-500 text-xs">{errors.so_dien_thoai}</span>}
            </div>
          </div>

          {/* Địa chỉ + Thành phố/Phường */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <input
                type="text"
                name="dia_chi_cu_the"
                placeholder="Địa chỉ cụ thể"
                value={form.dia_chi_cu_the}
                onChange={handleChange}
                className={`border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.dia_chi_cu_the ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
                }`}
                required
              />
              {errors.dia_chi_cu_the && <span className="text-red-500 text-xs">{errors.dia_chi_cu_the}</span>}
            </div>

            <div className="flex flex-col">
              <select
                name="thanh_pho"
                value={form.thanh_pho}
                onChange={handleChange}
                className={`border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.thanh_pho ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
                }`}
              >
                <option value="">Chọn thành phố</option>
                {Object.keys(cities).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.thanh_pho && <span className="text-red-500 text-xs">{errors.thanh_pho}</span>}

              <select
                name="phuong"
                value={form.phuong}
                onChange={handleChange}
                className={`border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 mt-1 ${
                  errors.phuong ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
                }`}
                disabled={!form.thanh_pho}
              >
                <option value="">Chọn phường/xã</option>
                {form.thanh_pho && cities[form.thanh_pho].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.phuong && <span className="text-red-500 text-xs">{errors.phuong}</span>}
            </div>
          </div>

          {/* Nội dung + Vật dụng */}
          <textarea
            name="noi_dung"
            placeholder="Nội dung yêu cầu"
            value={form.noi_dung}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 resize-none h-20 ${
              errors.noi_dung ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
            }`}
            required
          />

          <div className="flex flex-wrap gap-1 text-sm">
            {vatDung.map((item) => (
              <label key={item} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-100">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => toggleItem(item)}
                  className="accent-blue-500"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          {/* Nút bật vị trí + gửi */}
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={getLocation}
              className={`px-4 py-1 rounded-lg text-sm ${
                locationEnabled ? "bg-green-600 text-white cursor-default" : "bg-blue-700 text-white hover:bg-blue-800 transition"
              }`}
            >
              {locationEnabled ? "Đã bật vị trí" : "Bật vị trí"}
            </button>

            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>

      {/* Modal confirm */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <h3 className="text-lg font-bold mb-2">Bạn chưa bật định vị</h3>
            <p className="text-sm mb-4">Bạn có muốn tiếp tục gửi yêu cầu mà không bật định vị không?</p>
            <div className="flex justify-around">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={submitForm}
                className="px-4 py-1 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
