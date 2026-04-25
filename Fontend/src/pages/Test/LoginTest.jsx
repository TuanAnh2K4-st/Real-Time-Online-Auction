import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Gavel, ShieldCheck, Zap, UserPlus, Eye, EyeOff } from 'lucide-react';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Hiệu ứng giả lập thông báo
  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false);
      showNotification("Hệ thống đang bảo trì tính năng đăng nhập trực tiếp!", "warning");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[1000px] flex flex-col md:flex-row bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700">
        
        {/* Notification Toast */}
        {notification && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl animate-bounce">
            <span className={`w-2 h-2 rounded-full ${notification.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`}></span>
            <p className="text-sm font-medium">{notification.msg}</p>
          </div>
        )}

        {/* Left Side: Branding & Experience */}
        <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-12 flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-10">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-lg border border-white/20">
                <Gavel size={28} className="text-blue-200" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">BidMaster</span>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Sàn đấu giá <span className="text-blue-300">thế hệ mới</span>
            </h1>
            <p className="text-blue-100/70 text-lg leading-relaxed">
              Minh bạch tuyệt đối. Tốc độ tức thì. Trải nghiệm đấu giá đỉnh cao ngay tại nhà.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center border border-blue-400/30 group-hover:bg-blue-400/40 transition-all">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-semibold">Bảo mật đa tầng</p>
                <p className="text-sm text-blue-200/60">Xác thực 2FA cho mọi giao dịch</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center border border-blue-400/30 group-hover:bg-blue-400/40 transition-all">
                <Zap size={20} />
              </div>
              <div>
                <p className="font-semibold">Thời gian thực</p>
                <p className="text-sm text-blue-200/60">Cập nhật giá thầu dưới 0.1 giây</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="flex-1 p-8 md:p-14 bg-[#1e293b]/50 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-3">Chào mừng bạn!</h2>
              <p className="text-slate-400">Đăng nhập để tham gia săn những báu vật giá trị nhất.</p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-3 py-3.5 px-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-2xl text-slate-200 font-medium transition-all duration-300 active:scale-95">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3.5 px-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-2xl text-slate-200 font-medium transition-all duration-300 active:scale-95">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            <div className="relative mb-8 text-center flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <span className="relative px-6 bg-[#1e293b] text-slate-500 text-xs font-semibold uppercase tracking-widest">
                Hoặc email
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-slate-400 mb-2 ml-1 group-focus-within:text-blue-400 transition-colors">
                  Email của bạn
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-900/80 text-white placeholder:text-slate-600 transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="text-sm font-medium text-slate-400 group-focus-within:text-blue-400 transition-colors">
                    Mật khẩu
                  </label>
                  <a href="#" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors underline-offset-4 hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-900/80 text-white placeholder:text-slate-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 p-1 rounded-lg transition-all active:scale-90"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                disabled={isLoading}
                className="group relative w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(37,99,235,0.6)] active:scale-[0.98] transition-all overflow-hidden flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>ĐĂNG NHẬP</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                Chưa có tài khoản? 
              </p>
              <button className="flex items-center gap-2 text-blue-500 font-bold hover:text-blue-400 transition-colors group">
                <UserPlus size={18} />
                <span>Đăng ký ngay</span>
                <div className="w-0 group-hover:w-full h-0.5 bg-blue-500 absolute bottom-0 left-0 transition-all"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        input::placeholder {
          font-weight: 400;
        }
      `}} />
    </div>
  );
};

export default App;