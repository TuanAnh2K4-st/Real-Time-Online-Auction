import { useState } from "react";
import {
  registerUserApi,
  registerSellerApi,
} from "../services/api/authApi";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X, ShieldCheck, User, Store } from "lucide-react";

export default function Register() {
  const [type, setType] = useState("user");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    companyName: "",
    roomName: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const password = form.password || "";

  const passwordRules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const doPasswordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Check validate trước khi gọi API
    if (!form.email) return;
    if (type === "user" && !form.username) return;
    if (type === "seller" && (!form.companyName || !form.roomName)) return;

    try {
      let res;

      if (type === "user") {
        res = await registerUserApi({
          username: form.username,
          email: form.email,
          password: form.password,
        });
      } else {
        res = await registerSellerApi({
          companyName: form.companyName,
          roomName: form.roomName,
          email: form.email,
          password: form.password,
        });
      }

      alert(res.message);
      navigate("/login");
    } catch (err) {
      alert(err.message || "Đăng ký thất bại");
    }
  };

  const RuleIndicator = ({ isValid, text }) => (
  <div className={`flex items-center text-sm ${isValid ? "text-green-600" : "text-gray-400"}`}>
    {isValid ? <Check size={16} /> : <X size={16} />}
    <span className="ml-2">{text}</span>
  </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 my-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h2>
          <p className="text-gray-500 mt-2 text-sm">Chọn loại tài khoản và điền thông tin</p>
        </div>

        {/* Nút chọn loại tài khoản (User / Seller) */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            className={`flex-1 flex justify-center items-center py-2 text-sm font-medium rounded-md transition-all ${
              type === 'user' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setType("user")}
          >
            <User size={16} className="mr-2" /> Người dùng
          </button>
          <button
            type="button"
            className={`flex-1 flex justify-center items-center py-2 text-sm font-medium rounded-md transition-all ${
              type === 'seller' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setType("seller")}
          >
            <Store size={16} className="mr-2" /> Doanh nghiệp
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Các trường dành riêng cho User */}
          {type === "user" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị (Username)</label>
              <input
                type="text"
                placeholder="Nhập tên của bạn"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required={type === 'user'}
              />
            </div>
          )}

          {/* Các trường dành riêng cho Seller */}
          {type === "seller" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty (Company)</label>
                <input
                  type="text"
                  placeholder="Nhập tên công ty"
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required={type === 'seller'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng (Room)</label>
                <input
                  type="text"
                  placeholder="Nhập tên phòng/mã gian hàng"
                  onChange={(e) => setForm({ ...form, roomName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required={type === 'seller'}
                />
              </div>
            </>
          )}

          {/* Email dùng chung */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="nhap@email.com"
              required
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all pr-10
                  ${isSubmitted && !isPasswordValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                `}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Box hiển thị điều kiện mật khẩu */}
            <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
              <p className="text-xs font-semibold text-gray-600 mb-2">Yêu cầu mật khẩu:</p>
              <div className="grid grid-cols-2 gap-2">
                <RuleIndicator isValid={passwordRules.length} text="Ít nhất 12 ký tự" />
                <RuleIndicator isValid={passwordRules.uppercase} text="Chữ hoa (A-Z)" />
                <RuleIndicator isValid={passwordRules.lowercase} text="Chữ thường (a-z)" />
                <RuleIndicator isValid={passwordRules.number} text="Chữ số (0-9)" />
                <RuleIndicator isValid={passwordRules.special} text="Ký tự đặc biệt" />
              </div>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all pr-10
                  ${confirmPassword.length > 0 && !doPasswordsMatch ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 
                    doPasswordsMatch ? 'border-green-500 focus:ring-green-200 focus:border-green-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                `}
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword.length > 0 && !doPasswordsMatch && (
              <p className="mt-1 text-sm text-red-500">Mật khẩu xác nhận không khớp.</p>
            )}
          </div>

          {/* Checkbox Điều khoản với liên kết */}
          <div className="pt-2">
            <label className="flex items-start cursor-pointer group">
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <span className={`ml-2 text-sm ${isSubmitted && !agreed ? 'text-red-500' : 'text-gray-600'}`}>
                Tôi xác nhận đã đọc và đồng ý với các{' '}
                <a 
                  href="/chinh-sach" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()} // Ngăn chặn việc click vào link làm thay đổi checkbox
                >
                  chính sách
                </a>{' '}
                của bạn.
              </span>
            </label>
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors mt-6 flex justify-center items-center"
          >
            Đăng ký ngay
          </button>
        </form>
      </div>
    </div>
  );
}