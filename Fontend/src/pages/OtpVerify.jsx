import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowRight, RefreshCw, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { verifyOtpApi, resendOtpApi } from '../services/api/authApi';
import { useNavigate } from 'react-router-dom';

export default function OtpVerify({ email, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180); // 3 phút = 180 giây
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [notification, setNotification] = useState(null);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Đếm ngược timer
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const showNotification = (msg, status = 'info') => {
    setNotification({ msg, status });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const newOtp = [...otp];
    paste.split('').forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { showNotification('Vui lòng nhập đủ 6 chữ số.', 'warning'); return; }
    setIsLoading(true);
    try {
      await verifyOtpApi({ email, otpCode: code });
      showNotification('Xác thực thành công! Đang chuyển hướng...', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Mã OTP không chính xác.';
      showNotification(msg, 'error');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendOtpApi({ email });
      setTimer(180);
      setOtp(['', '', '', '', '', '']);
      showNotification('Mã OTP mới đã được gửi!', 'success');
      inputRefs.current[0]?.focus();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Không thể gửi lại OTP.';
      showNotification(msg, 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex-1 p-8 md:p-12 bg-slate-900/40 flex items-center justify-center">
      {notification && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white shadow-2xl animate-in slide-in-from-top-4">
          <div className={`w-2 h-2 rounded-full ${notification.status === 'success' ? 'bg-emerald-400' : notification.status === 'error' ? 'bg-rose-400' : 'bg-amber-400'}`}></div>
          <p className="text-sm font-medium">{notification.msg}</p>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            <ShieldCheck size={40} className="text-blue-400" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Xác thực OTP</h2>
          <p className="text-slate-400 text-sm">Mã OTP 6 chữ số đã được gửi đến</p>
          <p className="text-blue-400 font-semibold text-sm mt-1 flex items-center justify-center gap-2">
            <Mail size={14} /> {email}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 6 OTP inputs */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-2xl border-2 bg-slate-800/50 text-white outline-none transition-all duration-200
                  ${digit ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' : 'border-slate-700/50 focus:border-blue-500/70'}`}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            {timer > 0 ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
                <div className={`w-2 h-2 rounded-full animate-pulse ${timer <= 30 ? 'bg-rose-400' : 'bg-emerald-400'}`}></div>
                <span className={`text-sm font-mono font-bold ${timer <= 30 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {formatTime(timer)}
                </span>
                <span className="text-slate-500 text-xs">còn lại</span>
              </div>
            ) : (
              <p className="text-rose-400 text-sm font-medium flex items-center justify-center gap-1">
                <XCircle size={14} /> Mã OTP đã hết hạn
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || otp.join('').length < 6}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wider py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mb-4"
          >
            {isLoading
              ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              : <><CheckCircle2 size={18} /> XÁC NHẬN</>
            }
          </button>

          {/* Resend */}
          <div className="text-center space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || timer > 0}
              className="flex items-center gap-2 text-xs font-semibold mx-auto transition-all disabled:opacity-40 disabled:cursor-not-allowed text-slate-400 hover:text-blue-400 enabled:hover:text-blue-400"
            >
              <RefreshCw size={14} className={isResending ? 'animate-spin' : ''} />
              {isResending ? 'Đang gửi...' : timer > 0 ? `Gửi lại sau ${formatTime(timer)}` : 'Gửi lại mã OTP'}
            </button>
            <button type="button" onClick={onBack} className="block text-xs text-slate-600 hover:text-slate-400 mx-auto transition-colors">
              ← Quay lại đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
