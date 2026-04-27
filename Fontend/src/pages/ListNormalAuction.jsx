import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Bell, User, Gavel, Radio, Clock, 
  ChevronRight, Heart, ShieldCheck, Zap, 
  ArrowRight, Menu, X, TrendingUp, Award, 
  Star, Share2, Eye, Trophy, Smartphone,
  Layers, ChevronDown, FileText, CheckCircle2,
  Users, BadgeCheck, Command, Filter, Grid, List,
  ArrowUpDown, SlidersHorizontal, Sparkles, RefreshCcw,
  Trash2, SortAsc, SortDesc, Laptop, ChevronUp
} from 'lucide-react';
import Header from '../components/Header';

// --- HÀM TRỢ GIÚP ---
const formatCurrency = (amount) => {
  if (!amount) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Hàm định dạng số có dấu chấm (1.000.000)
const formatNumberWithDots = (val) => {
  if (!val) return "";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Hàm chuyển đổi số sang chữ (Ví dụ: 1.200.000 -> 1 triệu 200 ngàn)
const convertToVietnameseWords = (numStr) => {
  const num = parseInt(numStr);
  if (isNaN(num) || num === 0) return "";
  
  if (num >= 1000000000) {
    const ty = Math.floor(num / 1000000000);
    const trieu = Math.floor((num % 1000000000) / 1000000);
    return `${ty} tỷ ${trieu > 0 ? trieu + ' triệu' : ''}`;
  }
  if (num >= 1000000) {
    const trieu = Math.floor(num / 1000000);
    const ngan = Math.floor((num % 1000000) / 1000);
    return `${trieu} triệu ${ngan > 0 ? ngan + ' ngàn' : ''}`;
  }
  if (num >= 1000) {
    return `${Math.floor(num / 1000)} ngàn`;
  }
  return `${num} đồng`;
};

// --- DỮ LIỆU GIẢ LẬP ---
const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { 
    id: "tech", 
    label: "Công nghệ", 
    subCategories: [
      { id: "phone", label: "Điện thoại" },
      { id: "laptop", label: "Laptop" }
    ] 
  },
  { id: "watch", label: "Đồng hồ" },
  { id: "fashion", label: "Thời trang" },
  { id: "fengshui", label: "Đồ phong thủy" },
  { id: "vehicle", label: "Xe cộ" }
];

const INITIAL_AUCTIONS = [
  { id: 1, title: "iPhone 15 Pro Max 1TB - Phiên bản mạ vàng 24K", currentBid: 85000000, bidsCount: 42, timeLeft: "01:14:05", image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800", categoryId: "phone", parentId: "tech", status: "Hot", createdAt: new Date('2024-03-20T10:00:00') },
  { id: 7, title: "MacBook Pro M3 Max 128GB RAM - Full Option", currentBid: 125000000, bidsCount: 18, timeLeft: "10:30:00", image: "https://images.unsplash.com/photo-1517336714460-4c50d1103f73?auto=format&fit=crop&q=80&w=800", categoryId: "laptop", parentId: "tech", status: "Mới", createdAt: new Date('2024-03-22T15:00:00') },
  { id: 2, title: "Tượng Phật Di Lặc Gỗ Sưa Đỏ Ngàn Năm", currentBid: 245000000, bidsCount: 15, timeLeft: "2 ngày 05 giờ", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800", categoryId: "fengshui", status: "Mới", createdAt: new Date('2024-03-21T08:30:00') },
  { id: 3, title: "Túi Hermes Birkin 35 - Da cá sấu Niloticus", currentBid: 1200000000, bidsCount: 7, timeLeft: "5 ngày 12 giờ", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800", categoryId: "fashion", status: "Cao cấp", createdAt: new Date('2024-03-15T14:20:00') },
  { id: 5, title: "Rolex Submariner Date 126610LN", currentBid: 320000000, bidsCount: 56, timeLeft: "12:45:00", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a1e?auto=format&fit=crop&q=80&w=800", categoryId: "watch", status: "Đang đấu", createdAt: new Date('2024-03-19T11:45:00') },
  { id: 8, title: "Samsung Galaxy S24 Ultra - Special Edition", currentBid: 32000000, bidsCount: 25, timeLeft: "05:15:00", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800", categoryId: "phone", parentId: "tech", status: "Hot", createdAt: new Date('2024-03-23T11:00:00') },
];

const HistoryIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);

const SORT_OPTIONS = [
  { id: 'newest', label: 'Mới nhất', icon: Clock },
  { id: 'oldest', label: 'Cũ nhất', icon: HistoryIcon },
  { id: 'price_asc', label: 'Giá thấp đến cao', icon: SortAsc },
  { id: 'price_desc', label: 'Giá cao đến thấp', icon: SortDesc }
];

const App = () => {
  const [selectedCatId, setSelectedCatId] = useState("all");
  const [expandedCats, setExpandedCats] = useState(["tech"]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [activeStatus, setActiveStatus] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isClearing, setIsClearing] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const hasActiveFilters = selectedCatId !== "all" || priceRange.min !== "" || priceRange.max !== "" || activeStatus.length > 0;

  // Xử lý khi nhập giá (chỉ cho phép số và format)
  const handlePriceInput = (value, type) => {
    // Chỉ giữ lại ký số
    const cleanValue = value.replace(/\D/g, '');
    setPriceRange(prev => ({ ...prev, [type]: cleanValue }));
  };

  const filteredAndSortedAuctions = useMemo(() => {
    let result = [...INITIAL_AUCTIONS];

    if (selectedCatId !== "all") {
      result = result.filter(item => 
        item.categoryId === selectedCatId || item.parentId === selectedCatId
      );
    }

    if (priceRange.min) result = result.filter(item => item.currentBid >= parseInt(priceRange.min));
    if (priceRange.max) result = result.filter(item => item.currentBid <= parseInt(priceRange.max));

    switch (sortBy) {
      case 'newest': result.sort((a, b) => b.createdAt - a.createdAt); break;
      case 'oldest': result.sort((a, b) => a.createdAt - b.createdAt); break;
      case 'price_asc': result.sort((a, b) => a.currentBid - b.currentBid); break;
      case 'price_desc': result.sort((a, b) => b.currentBid - a.currentBid); break;
    }

    return result;
  }, [selectedCatId, priceRange, activeStatus, sortBy]);

  const handleClearAll = () => {
    setIsClearing(true);
    setTimeout(() => {
      setSelectedCatId("all");
      setPriceRange({ min: "", max: "" });
      setActiveStatus([]);
      setSortBy('newest');
      setIsClearing(false);
    }, 400);
  };

  const toggleExpand = (id) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getCategoryLabel = (id) => {
    for (const cat of CATEGORIES) {
      if (cat.id === id) return cat.label;
      if (cat.subCategories) {
        const sub = cat.subCategories.find(s => s.id === id);
        if (sub) return sub.label;
      }
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 font-sans pb-20">
      < Header />

      <header className="pt-32 pb-12 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">
                SÀN ĐẤU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">PHỔ THÔNG</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-72 space-y-8 lg:sticky lg:top-24 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Filter className="w-4 h-4 text-blue-500" /> Bộ lọc</h3>
            {hasActiveFilters && (
              <button onClick={handleClearAll} className="text-[10px] font-black uppercase text-red-400">Xóa hết</button>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Danh mục</p>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="space-y-1">
                  <div 
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm border cursor-pointer ${
                      selectedCatId === cat.id 
                        ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent'
                    }`}
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      if (cat.subCategories) toggleExpand(cat.id);
                    }}
                  >
                    {cat.label}
                    {cat.subCategories ? (
                      expandedCats.includes(cat.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className={`w-4 h-4 ${selectedCatId === cat.id ? 'translate-x-1' : ''}`} />
                    )}
                  </div>
                  
                  {cat.subCategories && expandedCats.includes(cat.id) && (
                    <div className="pl-6 space-y-1 border-l border-white/5 ml-4">
                      {cat.subCategories.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedCatId(sub.id)}
                          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            selectedCatId === sub.id 
                            ? 'text-blue-400 bg-blue-600/5' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {sub.id === 'phone' ? <Smartphone className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bộ lọc khoảng giá VNĐ - Đã cập nhật */}
          <div className="space-y-4 p-6 bg-white/5 rounded-[2rem] border border-white/5 shadow-inner">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
              Khoảng giá (VNĐ)
              <Sparkles className="w-3 h-3 text-yellow-500" />
            </p>
            <div className="space-y-4">
              {/* Input Giá Từ */}
              <div className="space-y-1.5">
                <div className="relative">
                  <input 
                    type="text" 
                    value={formatNumberWithDots(priceRange.min)} 
                    onChange={(e) => handlePriceInput(e.target.value, 'min')} 
                    placeholder="Từ (đ)" 
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700" 
                  />
                  {priceRange.min && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600">đ</span>}
                </div>
                {priceRange.min && (
                  <p className="text-[10px] text-blue-400/80 font-bold italic ml-2 animate-in fade-in slide-in-from-left-1">
                    ~ {convertToVietnameseWords(priceRange.min)}
                  </p>
                )}
              </div>

              {/* Input Giá Đến */}
              <div className="space-y-1.5">
                <div className="relative">
                  <input 
                    type="text" 
                    value={formatNumberWithDots(priceRange.max)} 
                    onChange={(e) => handlePriceInput(e.target.value, 'max')} 
                    placeholder="Đến (đ)" 
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700" 
                  />
                  {priceRange.max && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600">đ</span>}
                </div>
                {priceRange.max && (
                  <p className="text-[10px] text-blue-400/80 font-bold italic ml-2 animate-in fade-in slide-in-from-left-1">
                    ~ {convertToVietnameseWords(priceRange.max)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>

        <div className={`flex-1 space-y-8 ${isClearing ? 'opacity-30' : 'opacity-100'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex flex-wrap gap-2 items-center">
              {selectedCatId !== "all" && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-black border border-blue-500/30">
                  {getCategoryLabel(selectedCatId)}
                  <button onClick={() => setSelectedCatId("all")}><X className="w-3 h-3" /></button>
                </div>
              )}
              {priceRange.min && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-full text-[10px] font-black border border-white/10">
                  Từ {formatNumberWithDots(priceRange.min)}đ
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setShowSortMenu(!showSortMenu)} className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 border border-white/10 rounded-2xl text-xs font-black text-white">
                {SORT_OPTIONS.find(o => o.id === sortBy).label} <ArrowUpDown className="w-4 h-4 text-blue-400" />
              </button>
              {showSortMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl z-50 py-2 shadow-2xl">
                  {SORT_OPTIONS.map((option) => {
                    const SortIcon = option.icon;
                    return (
                      <button key={option.id} onClick={() => { setSortBy(option.id); setShowSortMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold ${sortBy === option.id ? 'text-blue-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                        <SortIcon className="w-4 h-4" /> {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAndSortedAuctions.map(item => (
              <div key={item.id} className="group bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-4 hover:border-blue-500/40 transition-all">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-800 mb-5">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 rounded-lg text-[9px] font-black text-white">{item.status}</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{getCategoryLabel(item.categoryId)}</span>
                    <h3 className="font-bold text-white text-base line-clamp-2">{item.title}</h3>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-slate-600 uppercase">Giá hiện tại</p>
                      <p className="text-lg font-black text-white">{formatCurrency(item.currentBid)}</p>
                    </div>
                    <button className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center"><Gavel className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;