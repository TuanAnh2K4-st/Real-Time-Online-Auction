import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  ChevronRight,
  Gavel,
  Check
} from 'lucide-react';
import { changePassword } from '../services/api/authApi';

// Giả lập Navigation nếu không có Router thực tế
const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Gavel className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-black text-white uppercase tracking-tighter italic">DauGiaViet</span>
      </div>
      <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
        <ArrowLeft className="w-4 h-4" /> Quay lại hồ sơ
      </button>
    </div>
  </header>
);

const PasswordRequirement = ({ label, met }) => (
  <div className="flex items-center gap-2 mb-1.5">
    {met ? (
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
    ) : (
      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
    )}
    <span className={`text-[11px] font-medium transition-colors ${met ? 'text-emerald-400' : 'text-slate-500'}`}>
      {label}
    </span>
  </div>
);

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [status, setStatus] = useState({ type: null, message: '' }); // 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation logic
  const requirements = {
    length: formData.newPassword.length >= 12,
    hasUpper: /[A-Z]/.test(formData.newPassword),
    hasLower: /[a-z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword),
    match: formData.newPassword === formData.confirmPassword && formData.confirmPassword !== ''
  };

  const isFormValid = Object.values(requirements).every(Boolean) && formData.oldPassword !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) return;

        setIsSubmitting(true);

        setStatus({
            type: null,
            message: ''
        });

        try {

            const payload = {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            };

            const response = await changePassword(payload);

            setStatus({
                type: 'success',
                message: response.message || 'Đổi mật khẩu thành công'
            });

            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (error) {

            console.log("FULL ERROR:", error);
            console.log("STATUS:", error?.response?.status);
            console.log("DATA:", error?.response?.data);

            setStatus({
                type: 'error',
                message:
                    error?.response?.data?.message ||
                    'Đổi mật khẩu thất bại'
            });

        } finally {

            setIsSubmitting(false);

        }
    };

  const toggleShow = (key) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      <Header />

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl border border-blue-500/20 mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight italic uppercase">
              Bảo mật <span className="text-blue-500">Tài khoản</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Cập nhật mật khẩu định kỳ để bảo vệ tài sản và thông tin cá nhân của bạn trên sàn đấu giá.
            </p>
          </div>

          {/* Alert Message */}
          {status.type && (
            <div className={`mb-8 p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500 ${
              status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
              <p className="text-sm font-bold leading-relaxed">{status.message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <div className="space-y-6">
              {/* Old Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Mật khẩu hiện tại</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-0 transition-all outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => toggleShow('old')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full my-2"></div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 text-blue-400">Mật khẩu mới</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    placeholder="Tối thiểu 12 ký tự..."
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-0 transition-all outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => toggleShow('new')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Requirements Grid */}
                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5 grid grid-cols-2 gap-x-4">
                  <PasswordRequirement label="Ít nhất 12 ký tự" met={requirements.length} />
                  <PasswordRequirement label="Chữ cái in hoa" met={requirements.hasUpper} />
                  <PasswordRequirement label="Chữ cái in thường" met={requirements.hasLower} />
                  <PasswordRequirement label="Chữ số (0-9)" met={requirements.hasNumber} />
                  <PasswordRequirement label="Ký tự đặc biệt" met={requirements.hasSpecial} />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Xác nhận mật khẩu mới</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Check className="w-5 h-5" />
                  </div>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Nhập lại mật khẩu mới..."
                    className={`w-full bg-slate-950/50 border rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-700 focus:ring-0 transition-all outline-none ${
                      formData.confirmPassword && !requirements.match ? 'border-red-500/50' : 'border-white/5 focus:border-blue-500/50'
                    }`}
                  />
                  <button 
                    type="button"
                    onClick={() => toggleShow('confirm')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && !requirements.match && (
                  <p className="text-[10px] text-red-400 font-bold ml-2 flex items-center gap-1 uppercase tracking-wider">
                    <XCircle className="w-3 h-3" /> Mật khẩu không khớp
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 mt-4 shadow-xl ${
                  isFormValid && !isSubmitting 
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/40 hover:-translate-y-1' 
                  : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Xác nhận thay đổi <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Support Note */}
          <div className="mt-12 text-center">
            <p className="text-slate-600 text-xs font-medium">
              Gặp vấn đề khi đổi mật khẩu? <span className="text-blue-400 hover:underline cursor-pointer font-bold">Liên hệ hỗ trợ kỹ thuật 24/7</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            © 2026 DauGiaViet - Secure Authentication Module
          </p>
        </div>
      </footer>
    </div>
  );
}