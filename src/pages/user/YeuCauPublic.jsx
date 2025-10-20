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
  hinh_anh: "",
};

const vatDung = [
  "Nước uống",
  "Lương thực",
  "Chăn màn",
  "Quần áo",
  "Thuốc men",
  "Đèn pin",
  "Pin dự phòng",
  "Nhà ngập"
];

const cities = {
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Ngũ Hành Sơn", "Sơn Trà"],
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Cầu Giấy"],
  "TP HCM": ["Quận 1", "Quận 3", "Quận 5", "Quận 10"],
};

export default function YeuCauPublic() {
  const [form, setForm] = useState(empty);
  const [selectedItems, setSelectedItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleItem = (item) => {
    const updated = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];
    setSelectedItems(updated);
    setForm({ ...form, noi_dung: updated.join(", ") });
  };

  const getLocation = () => {
    if (!navigator.geolocation)
      return toast.error("Trình duyệt không hỗ trợ định vị.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          vi_do: pos.coords.latitude,
          kinh_do: pos.coords.longitude,
        });
        setLocationEnabled(true);
      },
      () => toast.error("Vui lòng cho phép truy cập vị trí.")
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, hinh_anh: file });
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.ho_va_ten.trim()) errs.ho_va_ten = "Họ và tên bắt buộc";
    if (!form.so_dien_thoai.match(/^\d{10,11}$/))
      errs.so_dien_thoai = "Số điện thoại không hợp lệ (10-11 số)";
    if (!form.dia_chi_cu_the.trim())
      errs.dia_chi_cu_the = "Địa chỉ cụ thể bắt buộc";
    if (!form.thanh_pho) errs.thanh_pho = "Chọn thành phố";
    if (!form.phuong) errs.phuong = "Chọn phường/xã";
    if (!form.noi_dung.trim())
      errs.noi_dung = "Nội dung yêu cầu bắt buộc";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!locationEnabled) return setShowConfirm(true);

    await submitForm();
  };

  const submitForm = async () => {
    try {
      setLoading(true);
      let imageUrl = "";

      // Upload ảnh nếu có
      if (form.hinh_anh) {
        const imgData = new FormData();
        imgData.append("file", form.hinh_anh);
        imgData.append("upload_preset", "react_unsigned");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/dwpizqbrm/image/upload`,
          { method: "POST", body: imgData }
        );

        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) imageUrl = uploadData.secure_url;
      }

      // Gửi dữ liệu lên backend
      const res = await fetch("http://127.0.0.1:3000/nguoi-dung/gui-yeu-cau", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, hinh_anh: imageUrl }),
      });

      if (!res.ok) throw new Error("Lỗi khi gửi yêu cầu");
      toast.success("Gửi yêu cầu thành công!");

      // Reset form
      setForm(empty);
      setSelectedItems([]);
      setPreview(null);
      setLocationEnabled(false);
      setErrors({});
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      toast.error("Không thể gửi yêu cầu, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-3 text-center">
          Gửi yêu cầu cứu trợ
        </h2>
        <p className="text-gray-700 mb-4 text-center text-sm">
          Vui lòng <span className="text-red-600">điền thông tin</span> và{" "}
          <span className="text-red-600">bật định vị</span> để chúng tôi dễ dàng hỗ trợ bạn.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ và tên + SĐT */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <input
                type="text"
                name="ho_va_ten"
                placeholder="Họ và tên"
                value={form.ho_va_ten}
                onChange={handleChange}
                className={`border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-300 w-full ${
                  errors.ho_va_ten ? "border-red-400" : ""
                }`}
              />
              {errors.ho_va_ten && (
                <span className="text-red-500 text-xs mt-1">{errors.ho_va_ten}</span>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="tel"
                name="so_dien_thoai"
                placeholder="Số điện thoại"
                value={form.so_dien_thoai}
                onChange={handleChange}
                className={`border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-300 w-full ${
                  errors.so_dien_thoai ? "border-red-400" : ""
                }`}
              />
              {errors.so_dien_thoai && (
                <span className="text-red-500 text-xs mt-1">{errors.so_dien_thoai}</span>
              )}
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex flex-col gap-2">
            <div>
              <input
                type="text"
                name="dia_chi_cu_the"
                placeholder="Địa chỉ cụ thể"
                value={form.dia_chi_cu_the}
                onChange={handleChange}
                className={`border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-300 w-full ${
                  errors.dia_chi_cu_the ? "border-red-400" : ""
                }`}
              />
              {errors.dia_chi_cu_the && (
                <span className="text-red-500 text-xs mt-1">{errors.dia_chi_cu_the}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <select
                  name="thanh_pho"
                  value={form.thanh_pho}
                  onChange={handleChange}
                  className={`border rounded-lg p-2 text-sm w-full ${
                    errors.thanh_pho ? "border-red-400" : ""
                  }`}
                >
                  <option value="">Chọn thành phố</option>
                  {Object.keys(cities).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.thanh_pho && (
                  <span className="text-red-500 text-xs mt-1">{errors.thanh_pho}</span>
                )}
              </div>

              <div>
                <select
                  name="phuong"
                  value={form.phuong}
                  onChange={handleChange}
                  disabled={!form.thanh_pho}
                  className={`border rounded-lg p-2 text-sm w-full ${
                    errors.phuong ? "border-red-400" : ""
                  }`}
                >
                  <option value="">Chọn phường/xã</option>
                  {form.thanh_pho &&
                    cities[form.thanh_pho].map((p) => <option key={p}>{p}</option>)}
                </select>
                {errors.phuong && (
                  <span className="text-red-500 text-xs mt-1">{errors.phuong}</span>
                )}
              </div>
            </div>
          </div>

          {/* Nội dung + vật dụng */}
          <div>
            <textarea
              name="noi_dung"
              placeholder="Nội dung yêu cầu"
              value={form.noi_dung}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 text-sm h-20 focus:ring-2 focus:ring-blue-300 ${
                errors.noi_dung ? "border-red-400" : ""
              }`}
            />
            {errors.noi_dung && (
              <span className="text-red-500 text-xs mt-1">{errors.noi_dung}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {vatDung.map((item) => (
              <label
                key={item}
                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-100"
              >
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

          {/* Ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh đính kèm (nếu có)
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-2 w-full h-40 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Nút hành động */}
          <div className="flex justify-between items-center mt-3">
            <button
              type="button"
              onClick={getLocation}
              className={`px-4 py-1 rounded-lg text-sm ${
                locationEnabled
                  ? "bg-green-600 text-white"
                  : "bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              {locationEnabled ? "Đã bật vị trí" : "Bật vị trí"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal confirm */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <h3 className="text-lg font-bold mb-2">Bạn chưa bật định vị</h3>
            <p className="text-sm mb-4">
              Bạn có muốn tiếp tục gửi yêu cầu mà không bật định vị không?
            </p>

            {loading ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm text-gray-600">Đang gửi...</span>
              </div>
            ) : (
              <div className="flex justify-around">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={submitForm}
                  className="px-4 py-1 rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                >
                  Tiếp tục
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
