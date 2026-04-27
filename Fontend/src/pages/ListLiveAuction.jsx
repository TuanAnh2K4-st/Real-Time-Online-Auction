import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, User, Gavel, Radio, Clock, 
  ChevronRight, Heart, ShieldCheck, Zap, 
  ArrowRight, Menu, X, TrendingUp, Award, 
  Star, Share2, Eye, Trophy, Smartphone,
  Layers, ChevronDown, FileText, CheckCircle2,
  Users, Verified, Command, Calendar, Filter, 
  LayoutGrid, List, BellRing, MapPin
} from 'lucide-react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

// --- HÀM TRỢ GIÚP ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// --- DỮ LIỆU GIẢ LẬP LỊCH ĐẤU GIÁ ---
const AUCTION_SCHEDULE = [
  {
    id: 1,
    title: "Siêu phẩm Đồng hồ Thụy Sĩ - Patek Philippe Nautilus",
    status: "live",
    startTime: "Đang diễn ra",
    date: "Hôm nay",
    productCount: 12,
    viewers: 3840,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    host: "Luxury Watch VN",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    description: "Phiên đấu giá đặc biệt dành cho các nhà sưu tầm đồng hồ hạng sang.",
    tags: ["Cao cấp", "Đồng hồ"]
  },
  {
    id: 2,
    title: "Đại tiệc Kim cương & Đá quý thiên nhiên",
    status: "upcoming",
    startTime: "20:00",
    date: "Hôm nay",
    productCount: 8,
    viewers: 1200, 
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    host: "Ancarat Jewels",
    hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    description: "Bộ sưu tập trang sức độc bản được kiểm định bởi GIA.",
    tags: ["Trang sức", "GIA"]
  },
  {
    id: 3,
    title: "Di sản Á Đông: Cổ vật triều Nguyễn",
    status: "upcoming",
    startTime: "09:00",
    date: "Ngày mai",
    productCount: 45,
    viewers: 0,
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    host: "Antique Heritage",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    description: "Đấu giá các tạo tác gốm sứ và pháp lam quý hiếm.",
    tags: ["Cổ vật", "Lịch sử"]
  },
  {
    id: 4,
    title: "Siêu Xe & Xe Thể Thao Nhập Khẩu",
    status: "upcoming",
    startTime: "15:30",
    date: "25/04/2026",
    productCount: 5,
    viewers: 0,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800",
    host: "Auto World VN",
    hostAvatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=100",
    description: "Những dòng xe hiệu năng cao và giới hạn lần đầu xuất hiện.",
    tags: ["Siêu xe", "Ducati"]
  },
  {
    id: 5,
    title: "Đồ chơi High-end & Bearbrick Limited",
    status: "ended",
    startTime: "Đã kết thúc",
    date: "Hôm qua",
    productCount: 30,
    viewers: 5600,
    image: "https://images.unsplash.com/photo-1559564484-e48b3e040ff4?auto=format&fit=crop&q=80&w=800",
    host: "ToyZone",
    hostAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    description: "Phiên đấu sôi động với các mẫu Bearbrick 1000%.",
    tags: ["Art Toy", "Sưu tầm"]
  }
];

const ScheduleCard = ({ session, viewMode }) => {
  const isLive = session.status === 'live';
  const isEnded = session.status === 'ended';

  if (viewMode === 'list') {
    return (
      <div className={`group flex flex-col md:flex-row gap-6 p-4 rounded-[2rem] border transition-all duration-300 ${
        isLive ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-900/40 border-white/5 hover:border-white/20'
      }`}>
        <div className="relative w-full md:w-64 h-48 rounded-[1.5rem] overflow-hidden shrink-0">
          <img src={session.image} className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" />
          {isLive && (
             <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-[9px] font-black animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE
             </div>
          )}
        </div>
        
        <div className="flex flex-col justify-between flex-grow py-2">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                isLive ? 'bg-blue-500 text-white' : isEnded ? 'bg-slate-800 text-slate-500' : 'bg-white/10 text-blue-400'
              }`}>
                {session.date} • {session.startTime}
              </span>
              {session.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold text-slate-500">#{tag}</span>
              ))}
            </div>
            <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">{session.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-400">
               <div className="flex items-center gap-2">
                  <img src={session.hostAvatar} className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-bold">{session.host}</span>
               </div>
               <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> {session.productCount} Vật phẩm</span>
               {isLive && <span className="flex items-center gap-1.5 text-blue-400"><Eye className="w-4 h-4" /> {session.viewers.toLocaleString()} đang xem</span>}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-sm transition-all ${
              isLive ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}>
              {isLive ? 'Tham gia ngay' : isEnded ? 'Xem lại phiên' : 'Xem danh mục'}
            </button>
            {!isEnded && !isLive && (
              <button className="p-3 bg-white/5 text-slate-400 rounded-xl hover:text-blue-400 transition-colors border border-white/5">
                <BellRing className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative flex flex-col p-3 rounded-[2.5rem] border transition-all duration-500 ${
      isLive ? 'bg-blue-600/10 border-blue-500/40 shadow-2xl shadow-blue-900/20' : 'bg-slate-900/40 border-white/5 hover:border-blue-500/30'
    }`}>
      <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-5">
        <img src={session.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 left-4 flex gap-2">
          {isLive ? (
            <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[9px] font-black flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> TRỰC TIẾP
            </div>
          ) : (
            <div className="bg-slate-950/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black border border-white/10">
              {session.date.toUpperCase()}
            </div>
          )}
        </div>

        {!isEnded && (
          <button className="absolute top-4 right-4 p-2 bg-slate-950/60 backdrop-blur-md rounded-xl text-white hover:text-blue-400 transition-colors border border-white/10">
            <BellRing className="w-4 h-4" />
          </button>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-black">{session.startTime}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-black">{session.productCount}</span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <img src={session.hostAvatar} className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-500/20" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{session.host}</span>
          {isLive && <div className="ml-auto flex items-center gap-1.5 text-blue-400 text-[10px] font-black"><Eye className="w-3 h-3"/> {session.viewers}</div>}
        </div>
        
        <h3 className="text-lg font-black text-white leading-tight mb-4 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {session.title}
        </h3>

        <div className="mt-auto">
          <button className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
            isLive ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 hover:bg-blue-500' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
          }`}>
            {isLive ? 'Vào phòng ngay' : isEnded ? 'Xem kết quả' : 'Xem chi tiết'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredAuctions = AUCTION_SCHEDULE.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      <Header />
      
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
                <Calendar className="w-3 h-3" /> Lịch đấu giá trực tuyến
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                ĐỪNG BỎ LỠ <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 italic">NHỮNG KHOẢNH KHẮC</span>
              </h1>
              <p className="text-slate-500 max-w-xl font-medium">
                Theo dõi lịch phát sóng trực tiếp của các phiên đấu giá cao cấp. Đăng ký nhận thông báo để trở thành người đầu tiên gõ búa.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-24 z-40 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {[
                { id: 'all', label: 'Tất cả phiên' },
                { id: 'live', label: 'Đang diễn ra' },
                { id: 'upcoming', label: 'Sắp diễn ra' },
                { id: 'ended', label: 'Đã kết thúc' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                    filter === btn.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
               <div className="flex items-center gap-2 text-slate-500 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold cursor-pointer hover:border-blue-500/50 transition-all">
                  <Filter className="w-4 h-4" />
                  Lọc theo ngày
               </div>
               <div className="flex-grow md:w-48 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="Tìm nhanh..." 
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-blue-500/50 outline-none transition-all"
                  />
               </div>
            </div>
          </div>
        </section>

        {/* Grid/List Content */}
        <section className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map(session => (
              <ScheduleCard key={session.id} session={session} viewMode={viewMode} />
            ))
          ) : (
            <div className="col-span-full py-32 text-center space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Không tìm thấy phiên đấu nào</h3>
              <p className="text-slate-600">Hãy thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.</p>
            </div>
          )}
        </section>

        {/* Newsletter / CTA */}
        <section className="mt-32 relative overflow-hidden rounded-[3rem] p-12 lg:p-20 border border-blue-500/20">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-950 -z-10"></div>
           <div className="absolute top-0 right-0 p-20 opacity-10">
              <BellRing className="w-64 h-64 text-blue-500 rotate-12" />
           </div>
           
           <div className="max-w-2xl space-y-8 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                NHẬN THÔNG BÁO <br/>
                <span className="text-blue-400">TRƯỚC 15 PHÚT</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                Đăng ký bản tin đấu giá để cập nhật các siêu phẩm hiếm có và lịch đấu giá độc quyền mỗi tuần qua Email hoặc SMS.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <input 
                    type="email" 
                    placeholder="Địa chỉ Email của bạn..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none backdrop-blur-md"
                 />
                 <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 whitespace-nowrap">
                    Đăng ký ngay
                 </button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> Không spam
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> Hủy bất cứ lúc nào
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white uppercase tracking-tighter italic">DauGiaViet</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                Nền tảng đấu giá trực tuyến tiên phong tại Việt Nam, mang lại sự minh bạch, an toàn và chuyên nghiệp trong từng phiên đấu.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:col-span-2">
              <div className="space-y-4">
                <h5 className="text-white font-black uppercase text-xs tracking-widest">Dịch vụ</h5>
                <ul className="space-y-2 text-sm text-slate-500 font-bold">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Đấu giá Live</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Ký gửi tài sản</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Kiểm định chuyên sâu</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-white font-black uppercase text-xs tracking-widest">Hỗ trợ</h5>
                <ul className="space-y-2 text-sm text-slate-500 font-bold">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Trung tâm trợ giúp</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Quy tắc sàn</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Chính sách bảo mật</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">© 2026 DauGiaViet - Advanced Auction Tech</p>
            <div className="flex gap-6">
              {['FB', 'INSTA', 'TT'].map(s => (
                <span key={s} className="text-[10px] font-black text-slate-600 hover:text-blue-400 cursor-pointer transition-colors">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;