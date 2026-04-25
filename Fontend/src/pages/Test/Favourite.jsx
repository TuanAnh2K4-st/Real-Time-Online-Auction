import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, User, Gavel, Clock, 
  Heart, Share2, TrendingUp, 
  ArrowLeft, LayoutGrid, List,
  Trash2, ChevronRight, X, Radio
} from 'lucide-react';

// --- HÀM TRỢ GIÚP ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// --- DỮ LIỆU GIẢ LẬP YÊU THÍCH ---
const INITIAL_FAVORITES = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 1TB - Phiên bản mạ vàng 24K",
    currentBid: 85000000,
    timeLeft: "01:14:05",
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    category: "Công nghệ",
    isLive: true,
    viewers: 1240
  },
  {
    id: 3,
    title: "Túi Hermes Birkin 35 - Da cá sấu Niloticus",
    currentBid: 1200000000,
    timeLeft: "5 ngày 12 giờ",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800",
    category: "Thời trang xa xỉ",
    isLive: false
  },
  {
    id: 101,
    title: "Đồng hồ Rolex Submariner Date 2024",
    currentBid: 450000000,
    timeLeft: "02:45:10",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
    category: "Đồng hồ",
    isLive: true,
    viewers: 850
  }
];

// --- COMPONENTS ---

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className={`flex items-center transition-all duration-500 rounded-2xl border ${
      isExpanded ? 'w-64 bg-slate-900 border-blue-500/50 shadow-lg' : 'w-11 h-11 bg-white/5 border-white/10'
    }`}>
      <div className="p-3 text-slate-400 cursor-pointer" onClick={() => {setIsExpanded(true); setTimeout(() => inputRef.current?.focus(), 100)}}>
        <Search className="w-5 h-5" />
      </div>
      <input 
        ref={inputRef}
        type="text" 
        className={`bg-transparent border-none outline-none text-xs text-white transition-all ${isExpanded ? 'w-full opacity-100 pr-4' : 'w-0 opacity-0'}`}
        placeholder="Tìm trong yêu thích..."
        onBlur={(e) => !e.target.value && setIsExpanded(false)}
      />
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="bg-blue-600 p-2 rounded-xl border border-blue-400/30">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">
            DAUGIA<span className="text-blue-400 italic">VIET</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar />
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Cá nhân</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const FavoriteCard = ({ item, onRemove, viewType }) => (
  <div className={`group relative bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-4 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-500 flex ${viewType === 'list' ? 'flex-row gap-8 items-center' : 'flex-col'}`}>
    <div className={`relative overflow-hidden rounded-[2rem] shrink-0 ${viewType === 'list' ? 'w-64 h-48' : 'aspect-square w-full mb-6'}`}>
      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
      
      {item.isLive && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest shadow-lg shadow-red-950/50">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> LIVE
        </div>
      )}

      <button 
        onClick={() => onRemove(item.id)}
        className="absolute top-4 right-4 p-2.5 bg-slate-950/80 backdrop-blur-md rounded-xl text-red-500 border border-white/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-red-500 hover:text-white"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>

    <div className="flex-grow space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{item.category}</span>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
             <Clock className="w-3 h-3" /> {item.timeLeft}
          </span>
        </div>
        <h3 className="text-xl font-black text-white italic tracking-tighter leading-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>
      </div>

      <div className={`flex items-end justify-between ${viewType === 'list' ? 'pt-2' : 'pt-4 border-t border-white/5'}`}>
        <div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Giá hiện tại</p>
          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 italic">
            {formatCurrency(item.currentBid)}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/30 group/btn">
          Vào phòng <Gavel className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);

const App = () => {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);
  const [viewType, setViewType] = useState('grid');
  const [filterType, setFilterType] = useState('all'); // 'all', 'live', 'normal'

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = favorites.filter(item => {
    if (filterType === 'live') return item.isLive;
    if (filterType === 'normal') return !item.isLive;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      <Navbar />

      {/* Trang trí nền */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="space-y-4">
            <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Về trang chủ</span>
            </button>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
              MỤC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">YÊU THÍCH</span>
            </h1>
            <div className="flex items-center gap-3">
               <div className="h-px w-12 bg-blue-500"></div>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Quản lý danh sách đấu giá</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setViewType('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewType === 'grid' ? 'bg-white/10 text-blue-400' : 'text-slate-500 hover:text-white'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`p-2.5 rounded-xl transition-all ${viewType === 'list' ? 'bg-white/10 text-blue-400' : 'text-slate-500 hover:text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bộ lọc tối giản: Live vs Phổ thông */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 p-2 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center w-full sm:w-auto">
            <button 
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterType === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-white'
              }`}
            >
              Tất cả ({favorites.length})
            </button>
            <button 
              onClick={() => setFilterType('live')}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                filterType === 'live' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Radio className={`w-3 h-3 ${filterType === 'live' ? 'animate-pulse' : ''}`} /> Đấu giá Live
            </button>
            <button 
              onClick={() => setFilterType('normal')}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterType === 'normal' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-white'
              }`}
            >
              Đấu giá Phổ thông
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-6 text-slate-600">
             <TrendingUp className="w-4 h-4" />
             <span className="text-[9px] font-black uppercase tracking-widest">Lọc theo sở thích cá nhân</span>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        {filteredItems.length > 0 ? (
          <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <FavoriteCard item={item} onRemove={removeFavorite} viewType={viewType} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5 animate-in zoom-in duration-500">
             <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10 group">
                <Heart className="w-8 h-8 text-slate-800 group-hover:scale-110 transition-transform" />
             </div>
             <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Không tìm thấy mục nào</h2>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">
               Bạn không có sản phẩm nào trong mục "{filterType === 'live' ? 'Đấu giá Live' : 'Đấu giá Phổ thông'}"
             </p>
             <button 
               onClick={() => setFilterType('all')}
               className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
             >
               Xem tất cả yêu thích
             </button>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-white/5 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">DauGiaViet - Premium Realtime Auction</p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;