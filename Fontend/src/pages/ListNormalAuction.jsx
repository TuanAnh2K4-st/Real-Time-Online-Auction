import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {filterNormalAuctionsApi} from "../services/api/auctionNormalApi"
import {getRootCategories, getChildCategories} from "../services/api/categoryApi"

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

// Đếm giờ kết thúc auction card
const CountdownTimer = ({ endTime }) => {

  const calculateTimeLeft = () => {

    const difference = new Date(endTime.replace("T", " ") + " GMT+0700") - new Date();

    if (difference <= 0) {
      return "Đã kết thúc";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (difference % (1000 * 60 * 60)) /
      (1000 * 60)
    );

    const seconds = Math.floor(
      (difference % (1000 * 60)) / 1000
    );

    if (days > 0) {
      return `${days} ngày ${hours} giờ`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);

  }, [endTime]);

  return (
    <span className={`text-[10px] font-black ${ timeLeft === "Đã kết thúc" ? "text-red-300" : "text-white" }`}>
      {timeLeft}
    </span>
  );
};

const App = () => {

  const navigate = useNavigate();

  const HistoryIcon = ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l4 2"/>
    </svg>
  );

  const SORT_OPTIONS = [
    { id: 'newest', label: 'Mới nhất', name: 'Mới nhất', icon: Clock },
    { id: 'oldest', label: 'Cũ nhất', name: 'Cũ nhất', icon: HistoryIcon },
    { id: 'price_asc', label: 'Giá thấp đến cao', name: 'Giá thấp đến cao', icon: SortAsc },
    { id: 'price_desc', label: 'Giá cao đến thấp', name: 'Giá cao đến thấp', icon: SortDesc }
  ];

  const [selectedCatId, setSelectedCatId] = useState("all");
  const [expandedCats, setExpandedCats] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [activeStatus, setActiveStatus] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isClearing, setIsClearing] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const hasActiveFilters = selectedCatId !== "all" || priceRange.min !== "" || priceRange.max !== "" || activeStatus.length > 0;

  const fetchAuctions = async () => {
    try {

      setLoading(true);

      const request = {
        categoryId: selectedCatId === "all"
          ? null
          : Number(selectedCatId),

        minPrice: priceRange.min
          ? Number(priceRange.min)
          : null,

        maxPrice: priceRange.max
          ? Number(priceRange.max)
          : null,

        sortBy: sortBy
      };

      console.log("FILTER REQUEST", request);

      const response = await filterNormalAuctionsApi(request, page);

      console.log("FILTER RESPONSE", response);

      const data = response.data;

      setAuctions(data?.content || []);
      setTotalPages(data?.totalPages || 0);

    } catch (error) {

      console.error("Lỗi filter auction", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

  fetchAuctions(); }, [
    selectedCatId,
    priceRange.min,
    priceRange.max,
    sortBy,
    page
  ]);

  useEffect(() => {
    setPage(0);
  }, [
    selectedCatId,
    priceRange.min,
    priceRange.max,
    sortBy
  ]);

    const fetchCategories = async () => {
    try {

      const response = await getRootCategories();

      console.log("ROOT CATEGORIES", response.data);

      const roots = response.data || [];

      const categoriesWithChildren = await Promise.all(
        roots.map(async (cat) => {

          try {

            const childRes = await getChildCategories(cat.id);

            return {
              ...cat,
              subCategories: childRes.data || []
            };

          } catch (err) {

            return {
              ...cat,
              subCategories: []
            };

          }

        })
      );

      setCategories([
        {
          id: "all",
          name: "Tất cả",
          subCategories: []
        },
        ...categoriesWithChildren
      ]);

    } catch (error) {

      console.error("Lỗi load categories", error);

    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xử lý khi nhập giá (chỉ cho phép số và format)
  const handlePriceInput = (value, type) => {
    // Chỉ giữ lại ký số
    const cleanValue = value.replace(/\D/g, '');
    setPriceRange(prev => ({ ...prev, [type]: cleanValue }));
  };

  const handleClearAll = () => {
    setIsClearing(true);
    setTimeout(() => {
      setSelectedCatId("all");
      setPriceRange({ min: "", max: "" });
      setActiveStatus([]);
      setSortBy('newest');
      setIsClearing(false);
      setPage(0);
    }, 400);
  };

  const toggleExpand = (id) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getCategoryLabel = (id) => {
    for (const cat of categories) {
      if (String(cat.id) === String(id)) {
        return cat.name;
      }
      if (cat.subCategories) {
        const sub = cat.subCategories.find(
          s => String(s.id) === String(id));
        if (sub) {
          return sub.name;
        }
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
              {categories.map(cat => (
                <div key={cat.id} className="space-y-1">
                  <div 
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm border cursor-pointer ${
                      String(selectedCatId) === String(cat.id) 
                        ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent'
                    }`}
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      if (cat.subCategories) toggleExpand(cat.id);
                    }}
                  >
                    {cat.name}
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
                            String(selectedCatId) === String(sub.id) 
                            ? 'text-blue-400 bg-blue-600/5' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" /> {sub.name}
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
                {SORT_OPTIONS.find(o => o.id === sortBy)?.name} <ArrowUpDown className="w-4 h-4 text-blue-400" />
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

          {loading && (
            <div className="text-center py-20">
              <p className="text-slate-400 font-bold">
                Đang tải auctions...
              </p>
            </div>
          )}
          {!loading && auctions.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 font-bold">
                Không có phiên đấu giá phù hợp
              </p>
            </div>
          )}

          {!loading && auctions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {auctions.map(item => (
            <div
              key={item.auctionId}
              onClick={() => navigate(`/auction/${item.auctionId}`)}
              className="group bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-4 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300">

              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-800 mb-5">

                <img
                  src={item.primaryImage}
                  alt={item.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 rounded-lg text-[9px] font-black text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <CountdownTimer endTime={item.endTime} />
                </div>

              </div>

              <div className="space-y-4">

                <div>

                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    {item.categoryName}
                  </span>

                  <h3 className="font-bold text-white text-base line-clamp-2">
                    {item.productName}
                  </h3>

                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">

                  <div>

                    <p className="text-[9px] font-bold text-slate-600 uppercase">
                      Giá hiện tại
                    </p>

                    <p className="text-lg font-black text-white">
                      {formatCurrency(item.currentPrice)}
                    </p>

                  </div>

                  <button className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all">
                    <Gavel className="w-5 h-5" />
                  </button>

                </div>

              </div>

            </div>
          ))}
          </div>)}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-10">

              <button
                disabled={page === 0}
                onClick={() => setPage(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-30"
              >
                Prev
              </button>

              <span className="text-white font-bold">
                {page + 1} / {totalPages}
              </span>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-30"
              >
                Next
              </button>

            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default App;