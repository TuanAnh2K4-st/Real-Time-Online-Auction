import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  Package, 
  Store, 
  Clock, 
  XCircle, 
  LayoutDashboard,
  AlertCircle,
  Zap,
  Sparkles,
  DollarSign,
  Calendar,
  Hammer,
  ArrowLeft,
  Gavel,
  History,
  TrendingUp,
  Timer,
  Users,
  Power
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_TRACKING_DATA = [
  { id: 'REG-9921', title: 'MacBook Pro M3 2024', status: 'processing', date: '20/10/2023', store: 'Chi nhánh Quận 1', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400' },
  { id: 'REG-8842', title: 'iPhone 15 Pro Max', status: 'accepted', date: '18/10/2023', store: 'Chi nhánh Cầu Giấy', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d256e?auto=format&fit=crop&q=80&w=400' },
  { id: 'REG-7710', title: 'Rolex Submariner', status: 'rejected', date: '15/10/2023', store: 'Chi nhánh Hoàn Kiếm', reason: 'Thiếu giấy tờ bảo hành gốc', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=400' },
  { id: 'REG-5544', title: 'Sony Alpha A7 IV', status: 'accepted', date: '25/10/2023', store: 'Showroom Tân Bình', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400' }
];

const INITIAL_ACTIVE_AUCTIONS = [
  { id: 'AUC-102', title: 'Vintage Leica M6', currentBid: 45000000, bids: 12, timeLeft: '02:45:10', image: 'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?auto=format&fit=crop&q=80&w=400' },
  { id: 'AUC-105', title: 'Jordan 1 Retro High OG', currentBid: 8200000, bids: 5, timeLeft: '14:20:00', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=400' }
];

const App = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'create-auction'
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' | 'active'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingList, setTrackingList] = useState(INITIAL_TRACKING_DATA);
  const [activeAuctions, setActiveAuctions] = useState(INITIAL_ACTIVE_AUCTIONS);
  const [showConfirmClose, setShowConfirmClose] = useState(null);
  
  // State cho quy trình tạo đấu giá
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [auctionForm, setAuctionForm] = useState({
    startPrice: '',
    bidStep: '',
    endDate: '',
    endTime: '',
    type: 'standard'
  });

  // Lọc sản phẩm đã được chấp nhận để đấu giá
  const acceptedProducts = useMemo(() => {
    return trackingList.filter(item => item.status === 'accepted');
  }, [trackingList]);

  const handleCreateAuction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newAuction = {
        id: `AUC-${Math.floor(Math.random() * 900 + 100)}`,
        title: selectedProduct.title,
        currentBid: parseInt(auctionForm.startPrice) || 0,
        bids: 0,
        timeLeft: '24:00:00',
        image: selectedProduct.image
      };
      setActiveAuctions([newAuction, ...activeAuctions]);
      setIsSubmitting(false);
      setSelectedProduct(null);
      setView('dashboard');
      setActiveTab('active');
    }, 1500);
  };

  const handleEndAuctionEarly = (id) => {
    setActiveAuctions(activeAuctions.filter(a => a.id !== id));
    setShowConfirmClose(null);
  };

  // --- RENDERING COMPONENTS ---

  const Dashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
            Hệ thống <span className="text-blue-500">Quản lý</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Chào mừng trở lại, quản trị viên phiên đấu giá.</p>
        </div>
        <button 
          onClick={() => setView('create-auction')}
          className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[2rem] font-black uppercase text-[11px] tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
        >
          <Hammer className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
          Tạo đấu giá mới
        </button>
      </div>

      {/* Tabs Điều hướng Nội bộ */}
      <div className="flex gap-4 border-b border-white/5 pb-4">
        {[
          { id: 'tracking', label: 'Hồ sơ ký gửi', icon: History },
          { id: 'active', label: 'Đang diễn ra', icon: TrendingUp },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'tracking' ? (
          trackingList.map((item) => (
            <div key={item.id} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-900/80 transition-all group">
              <div className="flex items-center gap-6 w-full md:w-auto">
                 <div className="w-20 h-20 rounded-3xl overflow-hidden border border-white/10 shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt="item" />
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${
                        item.status === 'accepted' ? 'bg-green-500/10 text-green-500' : 
                        item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{item.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 text-[10px] uppercase font-black flex items-center gap-1.5"><Store className="w-3 h-3" /> {item.store}</p>
                 </div>
              </div>
              
              {item.status === 'accepted' && (
                <button 
                  onClick={() => { setSelectedProduct(item); setView('create-auction'); }}
                  className="bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 border border-white/5"
                >
                  Mở đấu giá <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
            {activeAuctions.length > 0 ? activeAuctions.map((auction) => (
              <div key={auction.id} className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-6 hover:bg-slate-900/60 transition-all group overflow-hidden relative">
                {/* Status Indicator */}
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/5 shrink-0">
                    <img src={auction.image} className="w-full h-full object-cover" alt="item" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{auction.id}</span>
                      <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{auction.title}</h3>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase">Giá hiện tại</p>
                        <p className="text-blue-400 font-black text-sm">{auction.currentBid.toLocaleString()}đ</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase">Lượt đặt</p>
                        <p className="text-white font-black text-sm flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-slate-500" /> {auction.bids}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Timer className="w-4 h-4" />
                    <span className="text-xs font-black tracking-tighter">{auction.timeLeft}</span>
                  </div>
                  <button 
                    onClick={() => setShowConfirmClose(auction)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <Power className="w-3.5 h-3.5" /> Kết thúc ngay
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-900/20 border border-dashed border-white/10 rounded-[3rem]">
                <Gavel className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Chưa có phiên đấu giá nào đang diễn ra</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Confirm Modal */}
      {showConfirmClose && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowConfirmClose(null)}></div>
          <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase mb-2 tracking-tight">Xác nhận kết thúc?</h3>
            <p className="text-slate-400 text-sm mb-8">Bạn đang yêu cầu kết thúc phiên đấu giá <span className="text-white font-bold">{showConfirmClose.title}</span> trước thời hạn. Người đang dẫn đầu sẽ được tính là người chiến thắng.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirmClose(null)}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={() => handleEndAuctionEarly(showConfirmClose.id)}
                className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-red-600/20"
              >
                Xác nhận đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const CreateAuctionPage = () => (
    <div className="animate-in slide-in-from-right-10 duration-500 space-y-12 pb-20">
      {/* Header riêng cho trang tạo */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <button 
          onClick={() => { setView('dashboard'); setSelectedProduct(null); }}
          className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors group"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-black uppercase text-[11px] tracking-[0.2em]">Quay lại sàn</span>
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-black text-white uppercase italic">Trang Tạo Đấu Giá</h2>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Loại hình: Đấu giá phổ thông</p>
        </div>
      </div>

      {!selectedProduct ? (
        <div className="space-y-8">
          <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Bước 1: Chọn sản phẩm đấu giá</h3>
              <p className="text-slate-400 text-sm">Chỉ những sản phẩm đã qua kiểm định mới có thể tham gia đấu giá phổ thông.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedProducts.map(product => (
              <div key={product.id} className="group bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <div className="aspect-square rounded-3xl overflow-hidden mb-6 border border-white/5 relative">
                   <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="product" />
                   <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-xl shadow-xl">
                      <ShieldCheck className="w-5 h-5" />
                   </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase flex items-center gap-2"><Store className="w-3 h-3 text-blue-500" /> {product.store}</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                   <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 inline-flex items-center gap-2 transition-transform">
                      Chọn sản phẩm này <ChevronRight className="w-4 h-4" />
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in zoom-in-95 duration-500">
          {/* Cột trái: Thông tin sản phẩm */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-8">
              <div className="aspect-square rounded-[3rem] overflow-hidden border-4 border-slate-900 shadow-2xl relative group">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt="Focus" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-6 left-6 right-6">
                   <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 uppercase tracking-widest">{selectedProduct.id}</span>
                   <h3 className="text-2xl font-black text-white mt-2 leading-tight uppercase italic">{selectedProduct.title}</h3>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                 <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Kiểm định tại</p>
                    <p className="text-xs font-bold text-slate-300">{selectedProduct.store}</p>
                 </div>
                 <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ngày nhận</p>
                    <p className="text-xs font-bold text-slate-300">{selectedProduct.date}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Form cấu hình */}
          <div className="lg:col-span-8 bg-slate-900/40 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl space-y-10">
            <div className="space-y-2">
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Bước 2: Thiết lập đấu giá</h3>
               <p className="text-slate-500 text-sm">Cấu hình các thông số tài chính và thời gian cho phiên đấu giá.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FieldWrapper label="Giá khởi điểm (VNĐ)">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-blue-500/10 rounded-xl group-focus-within:bg-blue-600 transition-all">
                    <DollarSign className="w-4 h-4 text-blue-500 group-focus-within:text-white" />
                  </div>
                  <input 
                    type="number" 
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-blue-500 font-bold text-lg transition-all"
                    placeholder="0.00"
                    value={auctionForm.startPrice}
                    onChange={(e) => setAuctionForm({...auctionForm, startPrice: e.target.value})}
                  />
                </div>
              </FieldWrapper>

              <FieldWrapper label="Bước giá nhảy">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-purple-500/10 rounded-xl group-focus-within:bg-purple-600 transition-all">
                    <Zap className="w-4 h-4 text-purple-500 group-focus-within:text-white" />
                  </div>
                  <input 
                    type="number" 
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-purple-500 font-bold text-lg transition-all"
                    placeholder="Ví dụ: 500,000"
                    value={auctionForm.bidStep}
                    onChange={(e) => setAuctionForm({...auctionForm, bidStep: e.target.value})}
                  />
                </div>
              </FieldWrapper>

              <FieldWrapper label="Ngày kết thúc">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/10 rounded-xl group-focus-within:bg-emerald-600 transition-all">
                    <Calendar className="w-4 h-4 text-emerald-500 group-focus-within:text-white" />
                  </div>
                  <input 
                    type="date" 
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-emerald-500 font-bold transition-all"
                    value={auctionForm.endDate}
                    onChange={(e) => setAuctionForm({...auctionForm, endDate: e.target.value})}
                  />
                </div>
              </FieldWrapper>

              <FieldWrapper label="Thời điểm kết thúc">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-orange-500/10 rounded-xl group-focus-within:bg-orange-600 transition-all">
                    <Clock className="w-4 h-4 text-orange-500 group-focus-within:text-white" />
                  </div>
                  <input 
                    type="time" 
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-orange-500 font-bold transition-all"
                    value={auctionForm.endTime}
                    onChange={(e) => setAuctionForm({...auctionForm, endTime: e.target.value})}
                  />
                </div>
              </FieldWrapper>
            </div>

            <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem] space-y-4">
              <h4 className="flex items-center gap-2 text-blue-400 font-black uppercase text-[11px] tracking-widest">
                <Info className="w-4 h-4" /> Lưu ý đấu giá phổ thông
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-400 font-medium italic">
                <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shrink-0"></div> Phiên đấu giá sẽ tự động công khai sau khi xác nhận.</li>
                <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shrink-0"></div> Phí nền tảng 5% sẽ khấu trừ khi giao dịch thành công.</li>
              </ul>
            </div>

            <button 
              onClick={handleCreateAuction}
              disabled={isSubmitting}
              className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Gavel className="w-5 h-5" /> Kích hoạt phiên đấu giá
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-10 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[5%] right-[5%] w-[35%] h-[35%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {view === 'dashboard' ? <Dashboard /> : <CreateAuctionPage />}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }
      `}</style>
    </div>
  );
};

const FieldWrapper = ({ label, children }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">{label}</label>
    {children}
  </div>
);

export default App;