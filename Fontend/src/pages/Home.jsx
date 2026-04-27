import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, User, Gavel, Radio, Clock,
  ChevronRight, Heart, ShieldCheck, Zap,
  ArrowRight, Menu, X, TrendingUp, Award,
  Star, Share2, Eye, Trophy, Smartphone,
  Layers, ChevronDown, FileText, CheckCircle2,
  Users, Verified, Command, ShoppingCart, LogOut, Settings, Package, Wallet, PlusCircle, PlayCircle, Lock
} from 'lucide-react';
import Header from '../components/Header';
import { getTop4ActiveNormalAuctionsApi } from "../services/api/homeApi";

// Helper
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Mock data (copied from HomeTest2)
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200"
];

const TOP_SELLERS = [
  { id: 1, name: "Hoàng Gia Luxury", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", successSales: "1,240+", rating: 4.9, category: "Đồng hồ & Trang sức" },
  { id: 2, name: "TechWorld VN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200", successSales: "850+", rating: 4.8, category: "Thiết bị công nghệ" },
  { id: 3, name: "Antique Heritage", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", successSales: "2,100+", rating: 5.0, category: "Cổ vật & Nghệ thuật" }
];

const LIVE_SESSIONS = [
  { id: 1, title: "Siêu phẩm Đồng hồ Thụy Sĩ - Patek Philippe Nautilus", isLive: true, productCount: 12, viewers: 3840, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800", host: "Luxury Watch VN", description: "Phiên đấu giá đặc biệt dành cho các nhà sưu tầm đồng hồ hạng sang." },
  { id: 2, title: "Đại tiệc Kim cương & Đá quý thiên nhiên", isLive: false, time: "20:00 Tối nay", productCount: 8, viewers: 1200, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800", host: "Ancarat Jewels", description: "Bộ sưu tập trang sức độc bản được kiểm định bởi GIA." }
];

const MOCK_USER = {
  name: "Alex Vũ",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
  balance: 24500000,
  level: "VIP Member"
};

// Components copied from HomeTest2 (SearchBar, HeroBanner, SellerSection, LiveAuctionCard, ProductCard)
const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSearch = () => { setIsExpanded(true); setTimeout(() => inputRef.current?.focus(), 100); };
  const closeSearch = () => { setIsExpanded(false); setSearchValue(""); };

  const handleClearOrClose = () => {
    if (searchValue.length > 0) { setSearchValue(""); inputRef.current?.focus(); } else { closeSearch(); }
  };

  return (
    <div className="relative flex items-center">
      <div className={`flex items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden rounded-2xl border ${isExpanded ? 'w-64 md:w-80 bg-slate-900 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'w-11 h-11 bg-white/5 border-white/10 hover:border-blue-500/40 cursor-pointer'}`} onClick={() => !isExpanded && openSearch()}>
        <div className={`p-3 transition-colors ${isExpanded ? 'text-blue-400' : 'text-slate-400'}`}><Search className="w-5 h-5" /></div>
        <input ref={inputRef} type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onBlur={() => !searchValue && closeSearch()} placeholder="Tìm sản phẩm, phiên đấu..." className={`bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 transition-all duration-300 w-full ${isExpanded ? 'opacity-100 px-1' : 'opacity-0 w-0 pointer-events-none'}`} />
        <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'opacity-100 pr-2' : 'opacity-0 w-0'}`}>
          {isExpanded && (
            <div className="flex items-center gap-1">
              {searchValue ? (
                <button onClick={(e) => { e.stopPropagation(); handleClearOrClose(); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"><X className="w-4 h-4 text-slate-500 group-hover:text-red-400" /></button>
              ) : (
                <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-500 uppercase tracking-tighter"><Command className="w-2.5 h-2.5" /> K</div>
              )}
            </div>
          )}
        </div>
      </div>

      {isExpanded && searchValue && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Gợi ý nhanh</div>
          <div className="flex flex-col gap-1">
            <div className="p-3 hover:bg-blue-600/20 rounded-xl flex items-center gap-3 cursor-pointer group transition-all"><div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30"><TrendingUp className="w-4 h-4 text-blue-400" /></div><span className="text-sm font-bold text-slate-300 group-hover:text-white">Tìm "{searchValue}" trong Đấu Live</span></div>
            <div className="p-3 hover:bg-blue-600/20 rounded-xl flex items-center gap-3 cursor-pointer group transition-all"><div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30"><User className="w-4 h-4 text-blue-400" /></div><span className="text-sm font-bold text-slate-300 group-hover:text-white">Thành viên: {searchValue}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

const HeroBanner = () => {
  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => { const timer = setInterval(() => setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length), 5000); return () => clearInterval(timer); }, []);
  return (
    <section className="relative pt-40 pb-24 overflow-hidden bg-slate-950">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm"><div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div><span className="text-xs font-black text-blue-400 uppercase tracking-widest">Sàn đấu giá số 1 Việt Nam</span></div>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[1] tracking-tight">Săn vật phẩm <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">Đẳng cấp nhất</span></h1>
          <p className="text-lg text-slate-400 max-w-xl font-medium leading-relaxed">Hệ thống đấu giá thời gian thực với công nghệ bảo mật tiên tiến. Nơi những giá trị đích thực được tôn vinh và bảo vệ pháp lý nghiêm ngặt.</p>
          <div className="flex flex-wrap gap-5">
            <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-900/50 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center gap-3 group">Khám phá ngay<ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></button>
            <button className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center gap-3 group"><div className="relative"><div className="absolute inset-0 bg-blue-400 blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div><ShieldCheck className="w-7 h-7 text-blue-400 relative" /></div>Xem pháp lý</button>
          </div>
        </div>
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-all"></div>
            <div className="relative z-10 p-2 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                {HERO_IMAGES.map((img, idx) => (
                  <img key={idx} src={img} alt={`Slide ${idx}`} className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentImg ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} />
                ))}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">{HERO_IMAGES.map((_, idx) => <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImg ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'}`} />)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SellerSection = () => (
  <section className="max-w-7xl mx-auto px-6 py-12">
    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 text-center md:text-left">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-2">Nhà bán hàng uy tín</h2>
        <p className="text-slate-500 text-sm font-medium">Đối tác tin cậy với hàng ngàn giao dịch thành công.</p>
      </div>
      <div className="flex items-center gap-2 text-blue-400 font-bold text-sm cursor-pointer hover:underline">Trở thành Seller <ArrowRight className="w-4 h-4" /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{TOP_SELLERS.map((seller) => (
      <div key={seller.id} className="group relative bg-slate-900/40 rounded-3xl p-6 border border-white/5 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-500 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Verified className="w-24 h-24 text-blue-500 rotate-12" /></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative"><div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur opacity-40 group-hover:opacity-100 transition-opacity"></div><img src={seller.avatar} alt={seller.name} className="relative w-16 h-16 rounded-full object-cover border-2 border-slate-950" /><div className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-slate-900"><CheckCircle2 className="w-3 h-3 text-white" /></div></div>
          <div className="space-y-1"><h4 className="text-white font-black text-lg group-hover:text-blue-400 transition-colors">{seller.name}</h4><p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">{seller.category}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5 relative z-10">
          <div className="space-y-1"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Thành công</p><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span className="text-lg font-black text-white">{seller.successSales}</span></div></div>
          <div className="space-y-1"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Đánh giá</p><div className="flex items-center gap-2"><Star className="w-4 h-4 text-blue-400 fill-blue-400" /><span className="text-lg font-black text-white">{seller.rating}</span></div></div>
        </div>
      </div>
    ))}</div>
  </section>
);

const LiveAuctionCard = ({ session }) => (
  <div className="relative group bg-slate-900/50 rounded-[2.5rem] p-4 border border-white/5 shadow-2xl hover:border-blue-500/30 transition-all duration-500">
    <div className="relative h-80 rounded-[2rem] overflow-hidden mb-6"><img src={session.image} alt={session.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      <div className="absolute top-5 left-5 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest shadow-lg shadow-red-900/40"><span className="w-2 h-2 bg-white rounded-full animate-ping"></span> {session.isLive ? 'LIVE NOW' : session.time}</div>
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-bold flex items-center gap-2 border border-white/10"><Eye className="w-4 h-4 text-blue-400" /> {session.viewers.toLocaleString()}</div>
      <div className="absolute bottom-8 left-8 right-8"><h3 className="text-2xl font-black text-white leading-tight mb-2 group-hover:text-blue-400 transition-colors">{session.title}</h3><p className="text-slate-400 text-sm line-clamp-1">{session.description}</p></div>
    </div>
    <div className="flex flex-col gap-4 px-2 pb-2">
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5"><div className="flex items-center gap-3"><div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400 border border-blue-500/20"><Layers className="w-5 h-5" /></div><div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Danh mục sản phẩm</p><p className="text-sm font-black text-white">{session.productCount} Vật phẩm</p></div></div><button className="flex items-center gap-2 text-xs font-black text-blue-400 hover:text-blue-300 transition-colors">Chi tiết <ChevronDown className="w-4 h-4" /></button></div>
      <div className="grid grid-cols-2 gap-3"><button className="py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group">Vào phòng <Gavel className="w-4 h-4 group-hover:rotate-12 transition-transform" /></button><button className="py-4 bg-white/5 text-white rounded-2xl font-black text-sm hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2">Xem danh sách <ChevronRight className="w-4 h-4 text-slate-500" /></button></div>
    </div>
  </div>
);

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/auction/${item.auctionId}`)} className="cursor-pointer group bg-slate-900/40 rounded-[2rem] border border-white/5 p-3 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-800 mb-4"><img src={item.primaryImage} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all"><button onClick={e => e.stopPropagation()} className="p-2.5 bg-slate-950/80 backdrop-blur-md rounded-xl text-white hover:text-red-500 border border-white/10"><Heart className="w-4 h-4" /></button><button onClick={e => e.stopPropagation()} className="p-2.5 bg-slate-950/80 backdrop-blur-md rounded-xl text-white hover:text-blue-500 border border-white/10"><Share2 className="w-4 h-4" /></button></div>
        <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-xl py-3 px-4 rounded-2xl flex items-center justify-between border border-white/10"><div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-tighter italic"><Clock className="w-4 h-4" /> {new Date(item.endTime).toLocaleString("vi-VN")}</div></div>
      </div>
      <div className="px-2 space-y-4 flex-grow"><div><span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">{item.categoryName}</span><h3 className="font-bold text-white line-clamp-2 leading-tight text-base">{item.productName}</h3></div><div className="flex items-center justify-between pt-4 border-t border-white/5"><div><p className="text-[9px] font-bold text-slate-500 uppercase">Giá cao nhất</p><p className="text-lg font-black text-blue-400">{formatCurrency(item.currentPrice)}</p></div><button onClick={e => e.stopPropagation()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50"><Gavel className="w-5 h-5" /></button></div></div>
    </div>
  );
};

export default function Home() {
  const [normalAuctions, setNormalAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
    try {
      const res = await getTop4ActiveNormalAuctionsApi();

      console.log("API res:", res);

      const data = res?.data?.data || res?.data || [];

      setNormalAuctions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load auctions error:", err);
      setNormalAuctions([]);
    }
  };

    fetchAuctions();
  }, []);
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      <Header />
      <main className="space-y-24 pb-24">
        <HeroBanner />
        <SellerSection />
        <section className="max-w-7xl mx-auto px-6 relative py-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-600/5 rounded-full blur-[150px] -z-10"></div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"><div className="space-y-4"><div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">Đang diễn ra</div><h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">PHIÊN ĐẤU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 underline decoration-blue-500/30 underline-offset-8">LIVE CAO CẤP</span></h2></div><button className="group flex items-center gap-2 text-sm font-black text-slate-400 hover:text-white transition-colors">Xem lịch phát sóng <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">{LIVE_SESSIONS.map(session => <LiveAuctionCard key={session.id} session={session} />)}</div>
        </section>
        <section className="relative py-24 bg-slate-900/30"><div className="max-w-7xl mx-auto px-6"><div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8"><div className="text-center md:text-left space-y-2"><h2 className="text-3xl font-black text-white tracking-tighter uppercase">Sàn đấu phổ thông</h2><p className="text-slate-500 font-medium">Hàng ngàn vật phẩm đang chờ đợi bạn gõ búa.</p></div><div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">{['Mới nhất', 'Giá cao', 'Sắp kết thúc'].map((sort, i) => <button key={sort} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{sort}</button>)}</div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{normalAuctions.map(item => (<ProductCard key={item.auctionId || item.id} item={item} />))}</div>
          <div className="mt-16 text-center"><button className="px-12 py-5 bg-transparent border-2 border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest text-white hover:bg-white hover:text-slate-950 transition-all duration-500">Tải thêm sản phẩm</button></div>
        </div>
        </section>
        <section className="max-w-7xl mx-auto px-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{[
          { label: "Vật phẩm đã đấu", value: "24.5k+", icon: <Trophy /> },
          { label: "Người dùng tin tưởng", value: "1.2M", icon: <Award /> },
          { label: "Tỷ lệ an toàn", value: "99.9%", icon: <ShieldCheck /> }
        ].map((stat, i) => (<div key={i} className="p-10 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] border border-white/5 text-center group hover:-translate-y-2 transition-all duration-500"><div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform">{stat.icon}</div><h4 className="text-4xl font-black text-white mb-2">{stat.value}</h4><p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p></div>))}</div></section>
      </main>
      <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3"><div className="bg-blue-600 p-2 rounded-xl"><Gavel className="w-6 h-6 text-white" /></div><span className="text-2xl font-black text-white uppercase tracking-tighter italic">DauGiaViet</span></div>
              <p className="text-slate-500 max-w-sm leading-relaxed">Nền tảng đấu giá trực tuyến tiên phong tại Việt Nam, mang lại sự minh bạch, an toàn và chuyên nghiệp trong từng phiên đấu.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:col-span-2">
              <div className="space-y-4"><h5 className="text-white font-black uppercase text-xs tracking-widest">Dịch vụ</h5><ul className="space-y-2 text-sm text-slate-500 font-bold"><li className="hover:text-blue-400 cursor-pointer transition-colors">Đấu giá Live</li><li className="hover:text-blue-400 cursor-pointer transition-colors">Ký gửi tài sản</li><li className="hover:text-blue-400 cursor-pointer transition-colors">Kiểm định chuyên sâu</li></ul></div>
              <div className="space-y-4"><h5 className="text-white font-black uppercase text-xs tracking-widest">Hỗ trợ</h5><ul className="space-y-2 text-sm text-slate-500 font-bold"><li className="hover:text-blue-400 cursor-pointer transition-colors">Trung tâm trợ giúp</li><li className="hover:text-blue-400 cursor-pointer transition-colors">Quy tắc sàn</li><li className="hover:text-blue-400 cursor-pointer transition-colors">Chính sách bảo mật</li></ul></div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">© 2026 DauGiaViet - Advanced Auction Tech</p>
            <div className="flex gap-6">{['FB', 'INSTA', 'TT'].map(s => <span key={s} className="text-[10px] font-black text-slate-600 hover:text-blue-400 cursor-pointer transition-colors">{s}</span>)}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}