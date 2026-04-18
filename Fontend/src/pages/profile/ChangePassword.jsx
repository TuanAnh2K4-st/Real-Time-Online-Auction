import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, XCircle, LockKeyhole, ShieldCheck,Loader2 } from 'lucide-react';

import { changePassword } from "../../services/api/profileApi";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ================= VALIDATION =================
  const validations = {
    length: newPassword.length >= 12, 
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const isPasswordValid = Object.values(validations).every(Boolean);
  const isPasswordMatch = newPassword === confirmPassword && newPassword !== "";
  const canSubmit =
    isPasswordValid && isPasswordMatch && currentPassword !== "" && !loading;

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccess(false);

    if (!canSubmit) return;

    setLoading(true);

    try {
      await changePassword({
        oldPass: currentPassword,
        newPass: newPassword,
      });

      setSuccess(true);

      // reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  const ValidationItem = ({ label, isValid }) => (
    <div
      className={`flex items-center space-x-2 text-sm transition-colors ${
        newPassword.length === 0
          ? "text-gray-400"
          : isValid
          ? "text-emerald-600"
          : "text-rose-500"
      }`}
    >
      {isValid ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white text-center">
          <div className="mx-auto bg-indigo-500 w-12 h-12 flex items-center justify-center rounded-full mb-3">
            <LockKeyhole className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Đổi Mật Khẩu</h2>
          <p className="text-indigo-200 text-sm mt-1">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Mật khẩu hiện tại */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(!showCurrentPassword)
                }
                className="absolute right-3 top-2"
              >
                {showCurrentPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2"
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            
            {/* Vùng kiểm tra điều kiện */}
            <div className="mt-3 bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-1 gap-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Yêu cầu mật khẩu:</p>
              <ValidationItem label="Ít nhất 12 ký tự" isValid={validations.length} />
              <ValidationItem label="Có ít nhất 1 chữ hoa (A-Z)" isValid={validations.uppercase} />
              <ValidationItem label="Có ít nhất 1 chữ thường (a-z)" isValid={validations.lowercase} />
              <ValidationItem label="Có ít nhất 1 chữ số (0-9)" isValid={validations.number} />
              <ValidationItem label="Có ít nhất 1 ký tự đặc biệt (!@#...)" isValid={validations.special} />
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {confirmPassword && !isPasswordMatch && (
              <p className="text-rose-500 text-sm mt-1 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                Mật khẩu xác nhận không khớp
              </p>
            )}
          </div>

          {/* ERROR */}
          {errorMsg && (
            <div className="text-red-500 text-sm">{errorMsg}</div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="text-green-600 flex items-center gap-2">
              <ShieldCheck /> Đổi mật khẩu thành công
            </div>
          )}

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex justify-center items-center ${
              canSubmit && !success
                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Đang xử lý..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}