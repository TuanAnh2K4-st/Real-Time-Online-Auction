import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Search, Bell, User, Gavel, Radio, Clock,
  ChevronRight, Heart, ShieldCheck, Zap,
  ArrowRight, Menu as MenuIcon, X, TrendingUp,
  Command, ShoppingCart, LogOut, Settings, Package, Wallet, PlusCircle, PlayCircle, Lock, Menu
} from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getMyProfile } from '../services/api/profileApi';

const formatCurrency = (amount) => {
  const n = Number(amount);
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number.isFinite(n) ? n : 0);
};

const roleLabel = (role) => {
  if (!role) return 'Thành viên';
  const r = String(role).toUpperCase();
  if (r.includes('ADMIN')) return 'Quản trị';
  if (r.includes('SELLER')) return 'Người bán';
  return 'Thành viên';
};

const SearchBar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSearch = () => { setIsExpanded(true); setTimeout(() => inputRef.current?.focus(), 100); };
  const closeSearch = () => { setIsExpanded(false); setSearchValue(''); };
  const location = useLocation();

  const handleSearch = () => {

    if (!searchValue.trim()) return;

    navigate(
      `/list-normal-auctions?keyword=${encodeURIComponent(searchValue)}`
    );

    closeSearch();
  };

  return (
    <div className="relative flex items-center">
      <div
        className={`flex items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden rounded-2xl border ${
          isExpanded ? 'w-64 md:w-80 bg-slate-900 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'w-11 h-11 bg-white/5 border-white/10 hover:border-blue-500/40 cursor-pointer'
        }`}
        onClick={() => !isExpanded && openSearch()}
      >
        <div className={`p-3 transition-colors ${isExpanded ? 'text-blue-400' : 'text-slate-400'}`}>
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch();}}}
          onBlur={() => !searchValue && closeSearch()}
          placeholder="Tìm sản phẩm, phiên đấu..."
          className={`bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 transition-all duration-300 w-full ${isExpanded ? 'opacity-100 px-1' : 'opacity-0 w-0 pointer-events-none'}`}
        />

        <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'opacity-100 pr-2' : 'opacity-0 w-0'}`}>
          {isExpanded && (
            <div className="flex items-center gap-1">
              {searchValue ? (
                <button onClick={(e) => { e.stopPropagation(); setSearchValue(''); inputRef.current?.focus(); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group">
                  <X className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                </button>
              ) : (
                <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                  <Command className="w-2.5 h-2.5" /> K
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isExpanded && searchValue && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Gợi ý nhanh</div>
          <div className="flex flex-col gap-1">
            <div onClick={handleSearch} className="p-3 hover:bg-blue-600/20 rounded-xl flex items-center gap-3 cursor-pointer group transition-all">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-slate-300 group-hover:text-white">Tìm "{searchValue}" trong Đấu Live</span>
            </div>
            <div className="p-3 hover:bg-blue-600/20 rounded-xl flex items-center gap-3 cursor-pointer group transition-all">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-slate-300 group-hover:text-white">Thành viên: {searchValue}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const displayName = profile?.fullName?.trim() || user?.username || 'Người dùng';
  const avatarUrl = profile?.avatarUrl || null;

  useEffect(() => setIsLoggedIn(!!user), [user]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyProfile();
        const data = res?.data ?? res;
        if (!cancelled && data) setProfile(data);
      } catch {
        if (!cancelled) setProfile(null);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.userId]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsUserMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigateProfile = () => {
    if (!user) { navigate('/login'); return; }
    const isSeller = user.role?.includes('SELLER');
    navigate(isSeller ? '/business/me' : '/profile/me');
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/5 py-3 shadow-lg' : 'bg-slate-950/60 backdrop-blur-md border-b border-white/5 py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="bg-blue-600 p-2.5 rounded-2xl relative border border-blue-400/30">
              <Gavel className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-black text-white tracking-tighter hidden sm:block">DAUGIA<span className="text-blue-400 italic">VIET</span></span>
        </div>

        <div className="hidden lg:flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          {[
            { label: 'Trang chủ', path: '/' },
            { label: 'Đấu Live', path: '/list-live-auctions' },
            { label: 'Phổ thông', path: '/list-normal-auctions' },
            { label: 'Hướng dẫn', path: '/user-guide' }
          ].map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <SearchBar />

          {!isLoggedIn ? (
            <button onClick={() => navigate('/login')} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/40">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => navigate('/cart')} className="relative p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors" aria-label="Giỏ hàng">
                <ShoppingCart className="w-5 h-5 text-slate-300" />
              </button>

              <button onClick={() => navigate('/my-notification')} type="button" className="hidden sm:block relative p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors" aria-label="Thông báo">
                <Bell className="w-5 h-5 text-slate-300" />
              </button>

              <div className="relative" ref={profileRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 hover:scale-105 transition-transform">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] border-2 border-slate-950 object-cover" />
                  ) : (
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] border-2 border-slate-950 bg-white/5 flex items-center justify-center text-blue-400">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200 p-2">
                    <div className="p-4 bg-white/5 rounded-2xl mb-2 flex items-center gap-3">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-bold">{displayName}</p>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{roleLabel(user?.role)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 p-1">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors w-full text-left"
                      >
                        <User className="w-4 h-4 text-slate-400" /> Hồ sơ cá nhân
                      </button>
                      <button onClick={() => { logout(); setIsProfileOpen(false); navigate("/"); }} className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors w-full text-left mt-1 border-t border-white/5">
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className={`p-3 border rounded-2xl transition-all ${isUserMenuOpen ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'}`}>
                  {isUserMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200 p-2">
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trung tâm quản lý</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {[
                        { icon: <Wallet className="w-5 h-5" />, label: 'Ví thanh toán', value: formatCurrency(profile?.walletBalance ?? 0), color: 'text-green-400', bg: 'bg-green-400/10' },
                        { icon: <Package className="w-5 h-5" />, label: 'Đơn hàng của tôi', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                        { icon: <Gavel className="w-5 h-5" />, label: 'Tài sản đang đấu giá', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                        { icon: <PlusCircle className="w-5 h-5" />, label: 'Đăng sản phẩm kiểm duyệt', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                        { icon: <PlayCircle className="w-5 h-5" />, label: 'Mở phiên đấu giá phổ thông', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                        { icon: <Radio className="w-5 h-5" />, label: 'Mở phiên Live', color: 'text-rose-400', bg: 'bg-rose-400/10' },
                        { icon: <Heart className="w-5 h-5" />, label: 'Sản phẩm yêu thích', color: 'text-red-400', bg: 'bg-red-400/10' },
                        { icon: <Lock className="w-5 h-5" />, label: 'Đổi mật khẩu', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                        { icon: <Settings className="w-5 h-5" />, label: 'Cài đặt tài khoản', color: 'text-slate-400', bg: 'bg-white/5' },
                      ].map((item, idx) => (
                        <button key={idx} 
                        onClick={() => {
                          if (item.label === 'Ví thanh toán') {
                            navigate('/wallet');
                            setIsUserMenuOpen(false);
                            return;
                          }
                          if (item.label === 'Đăng sản phẩm kiểm duyệt') {
                            navigate('/my-products');
                            setIsUserMenuOpen(false);
                            return;
                          }
                          if (item.label === 'Mở phiên đấu giá phổ thông') {
                            navigate('/create-normal-auction');
                            setIsUserMenuOpen(false);
                            return;
                          }
                        }}  
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors group w-full text-left">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>{item.icon}</div>
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">{item.label}</span>
                          </div>
                          {item.value && <span className="text-xs font-black text-white">{item.value}</span>}
                          {item.info && <span className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded-lg text-slate-400">{item.info}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}