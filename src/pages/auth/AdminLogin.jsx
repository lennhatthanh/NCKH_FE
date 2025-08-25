import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // thêm api
      await axios.post("/admin/auth/login", {
        email: form.email,
        password: form.password,
        remember: form.remember ? 1 : 0,
      });

   

      navigate("/admin"); 
    } catch (e) {
      console.error(e);
      setErr("Thông tin đăng nhập không đúng hoặc máy chủ lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-ocean-500 text-white shadow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-ocean-900">Đăng nhập Admin</h1>
          <p className="text-sm text-ocean-600">Truy cập bảng điều khiển quản trị</p>
        </div>

        <div className="rounded-2xl border border-ocean-100 bg-white p-5 md:p-6 shadow-sm">
          {err && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-ocean-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-ocean-100 bg-white focus:outline-none focus:ring-2 focus:ring-ocean-300"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-ocean-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-ocean-100 bg-white focus:outline-none focus:ring-2 focus:ring-ocean-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-ocean-50"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-ocean-700">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="accent-ocean-500"
                />
                Ghi nhớ tôi
              </label>
              <span className="text-ocean-500 cursor-pointer hover:text-ocean-900">
                Quên mật khẩu?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-ocean-500 text-white hover:bg-ocean-500/90 disabled:opacity-60"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-ocean-600">
          Chưa có tài khoản?{" "}
          <span className="text-ocean-900 font-medium cursor-pointer hover:underline">
            Đăng ký quản trị
          </span>
        </p>
      </div>
    </div>
  );
}
