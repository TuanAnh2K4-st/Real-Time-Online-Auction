import React, { useState } from 'react';
import {
  Mail, Lock, ArrowRight, Gavel, ShieldCheck, User,
  Store, Eye, EyeOff, LogIn, CheckCircle2, XCircle, Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerUserApi, registerSellerApi } from '../services/api/authApi';
import OtpVerify from './OtpVerify';

export default function Register() {
  const RuleIndicator = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 transition-all duration-300 ${isValid ? 'text-emerald-400' : 'text-slate-500'}`}>
      {isValid
        ? <CheckCircle2 size={14} className="flex-shrink-0" />
        : <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
      }
      <span className="text-[10px] font-medium tracking-wide">{text}</span>
    </div>
  );

  const [step, setStep] = useState('register'); // 'register' | 'otp'
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [type, setType] = useState('user');
  const [formData, setFormData] = useState({ username: '', companyName: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [notification, setNotification] = useState(null);

  const passwordRules = {
    length: formData.password.length >= 12,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };
  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const doPasswordsMatch = formData.password === confirmPassword && confirmPassword !== '';

  const showNotification = (msg, status = 'info') => {
    setNotification({ msg, status });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!isPasswordValid) { showNotification('Mật khẩu chưa đạt yêu cầu bảo mật!', 'warning'); return; }
    if (!doPasswordsMatch) { showNotification('Mật khẩu xác nhận không khớp!', 'warning'); return; }
    if (!agreed) { showNotification('Bạn cần đồng ý với điều khoản dịch vụ.', 'warning'); return; }

    setIsLoading(true);
    try {
      if (type === 'user') {
        await registerUserApi({ username: formData.username, email: formData.email, password: formData.password });
      } else {
        await registerSellerApi({ username: formData.username, companyName: formData.companyName, email: formData.email, password: formData.password });
      }
      setRegisteredEmail(formData.email);
      showNotification('Mã OTP đã gửi đến email của bạn!', 'success');
      setTimeout(() => setStep('otp'), 800);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Lỗi trong quá trình đăng ký';
      showNotification(message, 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[1000px] flex flex-col md:flex-row bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700">

        {/* ===== BƯỚC OTP ===== */}
        {step === 'otp' && (
          <>
            <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-950 p-12 flex-col justify-center relative overflow-hidden text-white border-r border-white/5">
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="p-2 bg-white/10 rounded-xl"><Gavel size={28} className="text-blue-200" /></div>
                  <span className="text-xl font-black tracking-tighter uppercase">BidMaster</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Gần xong rồi!</h2>
                <p className="text-blue-100/70 text-lg">Nhập mã OTP để kích hoạt tài khoản của bạn.</p>
              </div>
            </div>
            <OtpVerify email={registeredEmail} onBack={() => setStep('register')} />
          </>
        )}

        {/* ===== BƯỚC ĐĂNG KÝ ===== */}
        {step === 'register' && (
          <>
            {/* Notification Toast */}
            {notification && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white shadow-2xl animate-in slide-in-from-top-4">
                <div className={`w-2 h-2 rounded-full ${notification.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                <p className="text-sm font-medium">{notification.msg}</p>
              </div>
            )}

            {/* Left Side: Dynamic Branding */}
            <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-950 p-12 flex-col justify-between relative overflow-hidden text-white border-r border-white/5">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/40 to-transparent"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-12">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-lg border border-white/20 shadow-inner">
                    <Gavel size={28} className="text-blue-200" />
                  </div>
                  <span className="text-xl font-black tracking-tighter uppercase">BidMaster</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight mb-6">
                  Gia nhập <span className="text-blue-300 italic">{type === 'user' ? 'Cộng đồng' : 'Mạng lưới'}</span> đấu giá tài sản.
                </h1>
                <p className="text-blue-100/70 text-lg leading-relaxed mb-8">
                  {type === 'user'
                    ? 'Sở hữu những món đồ độc bản với mức giá tốt nhất từ các nhà đấu giá uy tín.'
                    : 'Mở rộng quy mô kinh doanh và tiếp cận hàng triệu nhà sưu tầm chuyên nghiệp.'}
                </p>
                <div className="space-y-4">
                  {[
                    { text: type === 'user' ? 'Tham gia đấu giá thời gian thực' : 'Hệ thống quản lý gian hàng thông minh' },
                    { text: 'Bảo mật thông tin đa lớp' },
                    { text: 'Hỗ trợ pháp lý & vận chuyển' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-blue-100/80">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-blue-400" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 pt-10">
                <div className="p-5 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-xs italic text-blue-200/60 leading-relaxed">
                    "Hệ thống minh bạch là nền tảng của sự tin tưởng trong đấu giá tài sản số."
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 p-8 md:p-12 bg-slate-900/40 relative overflow-y-auto max-h-[90vh] md:max-h-[850px]">
              <div className="max-w-md mx-auto">
                <div className="mb-8 text-center md:text-left">
                  <div className="inline-flex md:hidden items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 mb-4">
                    <ShieldCheck size={28} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Đăng ký tài khoản</h2>
                  <p className="text-slate-400 text-sm">Điền thông tin để bắt đầu hành trình của bạn.</p>
                </div>

                {/* Type Switcher */}
                <div className="flex bg-slate-800/50 p-1.5 rounded-2xl mb-8 border border-white/5 backdrop-blur-md">
                  <button
                    type="button"
                    className={`flex-1 flex justify-center items-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${type === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    onClick={() => setType('user')}
                  >
                    <User size={16} className="mr-2" /> Cá nhân
                  </button>
                  <button
                    type="button"
                    className={`flex-1 flex justify-center items-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${type === 'seller' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    onClick={() => setType('seller')}
                  >
                    <Store size={16} className="mr-2" /> Doanh nghiệp
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-blue-400">
                      Tên hiển thị
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" size={18} />
                      <input
                        name="username" type="text" placeholder="Nguyễn Văn A" required
                        value={formData.username} onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/30 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-white placeholder:text-slate-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Company Name (Seller only) */}
                  {type === 'seller' && (
                    <div className="group animate-in slide-in-from-right-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-blue-400">
                        Tên công ty
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" size={18} />
                        <input
                          name="companyName" type="text" placeholder="Công ty TNHH BidMaster" required
                          value={formData.companyName} onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-800/30 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-white transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-blue-400">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" size={18} />
                      <input
                        name="email" type="email" required placeholder="email@vidu.com"
                        value={formData.email} onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/30 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-blue-400">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" size={18} />
                      <input
                        name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••••••"
                        value={formData.password} onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-3.5 bg-slate-800/30 border rounded-2xl focus:outline-none focus:ring-2 transition-all text-white ${isSubmitted && !isPasswordValid ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-700/50 focus:ring-blue-500/40'}`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="mt-3 bg-slate-800/20 p-4 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiêu chuẩn bảo mật:</p>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <RuleIndicator isValid={passwordRules.length} text="Tối thiểu 12 ký tự" />
                        <RuleIndicator isValid={passwordRules.uppercase} text="Chữ hoa (A-Z)" />
                        <RuleIndicator isValid={passwordRules.lowercase} text="Chữ thường (a-z)" />
                        <RuleIndicator isValid={passwordRules.number} text="Số (0-9)" />
                        <RuleIndicator isValid={passwordRules.special} text="Ký tự đặc biệt (!@#)" />
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-blue-400">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400" size={18} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'} required placeholder="••••••••••••"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3.5 bg-slate-800/30 border rounded-2xl focus:outline-none focus:ring-2 transition-all text-white ${confirmPassword.length > 0 && !doPasswordsMatch ? 'border-rose-500/50 focus:ring-rose-500/20' : doPasswordsMatch ? 'border-emerald-500/50 focus:ring-emerald-500/20' : 'border-slate-700/50 focus:ring-blue-500/40'}`}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && !doPasswordsMatch && (
                      <p className="mt-2 text-[11px] text-rose-400 flex items-center gap-1 ml-1 animate-pulse">
                        <XCircle size={12} /> Mật khẩu xác nhận không trùng khớp.
                      </p>
                    )}
                  </div>

                  {/* Agreement */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="flex-shrink-0 mt-0.5 relative">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="peer absolute opacity-0 w-5 h-5 cursor-pointer" />
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600' : 'bg-slate-800 border-slate-700 group-hover:border-slate-500'}`}>
                          {agreed && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                      </div>
                      <span className={`text-[11px] leading-relaxed select-none ${isSubmitted && !agreed ? 'text-rose-400' : 'text-slate-400'}`}>
                        Tôi xác nhận đã nghiên cứu và đồng ý với các
                        <a href="#" className="text-blue-400 hover:text-blue-300 mx-1 font-bold underline decoration-blue-500/30 underline-offset-4">Chính sách Bảo mật</a>
                        của hệ thống BidMaster.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit" disabled={isLoading}
                    className="group relative w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-black text-xs tracking-[0.2em] py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all overflow-hidden flex items-center justify-center gap-3 mt-6"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>TIẾP TỤC ĐĂNG KÝ</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2.5s_infinite] pointer-events-none"></div>
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
                  <p className="text-xs text-slate-500">Đã có tài khoản thành viên?</p>
                  <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-blue-400 text-xs font-black hover:text-blue-300 transition-all uppercase tracking-wider group">
                    <LogIn size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Đăng nhập</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        input::placeholder { font-weight: 500; opacity: 0.3; font-size: 13px; }
        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}} />
    </div>
  );
}