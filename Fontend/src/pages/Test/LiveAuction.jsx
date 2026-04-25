import React, { useState, useEffect, useRef } from 'react';
import { 
  Gavel, User, Users, Eye, MessageSquare, Heart, 
  Share2, ShieldCheck, Clock, ArrowLeft, Trophy,
  Zap, Send, Mic, Video, Volume2, Maximize2,
  TrendingUp, Award, Star, Info, AlertCircle,
  Settings, Box, CheckCircle2, History, ChevronLeft, ChevronRight
} from 'lucide-react';

// --- MOCK DATA ---
const CURRENT_PRODUCT = {
  title: "Patek Philippe Nautilus 5711/1A-010",
  condition: "Used",
  conditionDetail: "99% Like New - Đầy đủ mắt dây",
  specs: [
    { label: "Kích thước", value: "40 mm" },
    { label: "Chất liệu vỏ", value: "Thép không gỉ" },
    { label: "Bộ máy", value: "Tự động Calibre 26-330 S C" },
    { label: "Chống nước", value: "120 m" },
    { label: "Năm sản xuất", value: "2022" },
  ],
  description: "Phiên bản thép không gỉ huyền thoại với mặt số xanh Blue Gradation. Full box, giấy tờ chính hãng 2022. Thiết kế bởi Gérald Genta, biểu tượng của sự sang trọng thể thao.",
  startPrice: 2100000000,
  currentBid: 2450000000,
  bidStep: 50000000,
  timeLeft: 45,
  // Thêm mảng ảnh để chuyển đổi
  images: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1522337360788-8b13df772ec2?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1200"
  ],
  seller: {
    name: "Luxury Watch VN",
    rating: 4.9,
    isVerified: true
  }
};

const BIDS_HISTORY = [
  { id: 1, user: "Minh Tran", amount: 2450000000, time: "10s trước", isHighest: true },
  { id: 2, user: "Hoang Luxury", amount: 2400000000, time: "45s trước", isHighest: false },
  { id: 3, user: "Anh Tuan", amount: 2350000000, time: "2p trước", isHighest: false },
];

const INITIAL_MESSAGES = [
  { id: 1, user: "Hệ thống", text: "Phiên đấu giá đã bắt đầu! Chúc mọi người may mắn.", type: "system" },
  { id: 2, user: "Luxury Watch VN", text: "Chào mọi người, tôi là người bán. Sản phẩm này cam kết chính hãng 100%.", type: "seller" },
  { id: 3, user: "Thanh Tung", text: "Nhìn mê quá, giá đang tốt quá các bác.", type: "user" },
];

// --- HELPER ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const App = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [bids, setBids] = useState(BIDS_HISTORY);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(45);
  const [showBidAnimation, setShowBidAnimation] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Image Slideshow Effect
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % CURRENT_PRODUCT.images.length);
    }, 4000); // Chuyển ảnh mỗi 4 giây
    return () => clearInterval(slideTimer);
  }, []);

  const handleBid = (amount) => {
    const newBid = {
      id: Date.now(),
      user: "Bạn",
      amount: amount,
      time: "Vừa xong",
      isHighest: true
    };
    setBids([newBid, ...bids.map(b => ({ ...b, isHighest: false }))]);
    setShowBidAnimation(true);
    setTimeout(() => setShowBidAnimation(false), 2000);
    setTimeLeft(30); 
    
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      user: "Hệ thống",
      text: `🚀 Bạn vừa đặt giá mới: ${formatCurrency(amount)}`,
      type: "system"
    }]);
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { id: Date.now(), user: "Bạn", text: chatInput, type: "user" }]);
    setChatInput("");
  };

  const nextImage = () => {
    setCurrentImgIndex((prev) => (prev + 1) % CURRENT_PRODUCT.images.length);
  };

  const prevImage = () => {
    setCurrentImgIndex((prev) => (prev - 1 + CURRENT_PRODUCT.images.length) % CURRENT_PRODUCT.images.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* Top Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">{CURRENT_PRODUCT.title}</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Auction • {CURRENT_PRODUCT.seller.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
            <Users className="w-4 h-4 text-red-500" />
            <span className="text-xs font-black text-red-500">1.2K</span>
          </div>
          <button className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Content Scroll Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            
            {/* Image Carousel (Updated from static Image) */}
            <div className="relative aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group ring-1 ring-white/10">
              {CURRENT_PRODUCT.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`Product view ${idx + 1}`} 
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                    idx === currentImgIndex ? 'opacity-70 scale-100 rotate-0' : 'opacity-0 scale-110 rotate-1'
                  }`}
                />
              ))}
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>
              
              {/* Carousel Controls */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prevImage} className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 border border-white/10">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextImage} className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 border border-white/10">
                    <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5">
                {CURRENT_PRODUCT.images.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>

              {/* Badge Condition Overlay */}
              <div className="absolute top-6 left-6 flex gap-2">
                <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-widest flex items-center gap-2 shadow-xl shadow-red-900/20">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div> LIVE
                </div>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest shadow-xl border ${
                  CURRENT_PRODUCT.condition === 'New' 
                  ? 'bg-green-600 border-green-400 text-white' 
                  : 'bg-orange-600 border-orange-400 text-white'
                }`}>
                  {CURRENT_PRODUCT.condition === 'New' ? 'BRAND NEW' : 'PRE-OWNED'}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-white/20 shadow-xl">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-400 flex items-center gap-1 uppercase tracking-wider">Host: Tran Anh <CheckCircle2 className="w-3 h-3 fill-blue-400 text-slate-900" /></p>
                    <p className="text-base font-black text-white drop-shadow-md">Phiên đấu giá VIP #09</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 border border-white/10"><Volume2 className="w-5 h-5" /></button>
                  <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 border border-white/10"><Maximize2 className="w-5 h-5" /></button>
                </div>
              </div>
            </div>

            {/* Content Tabs for Specs & Info */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 md:p-8 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{CURRENT_PRODUCT.title}</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Tình trạng:</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${CURRENT_PRODUCT.condition === 'New' ? 'text-green-400 bg-green-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                        {CURRENT_PRODUCT.conditionDetail}
                    </span>
                </div>
                <p className="text-slate-400 leading-relaxed">{CURRENT_PRODUCT.description}</p>
              </div>

              {/* Specs Grid */}
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <Settings className="w-4 h-4 text-blue-500" /> Thông số kĩ thuật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CURRENT_PRODUCT.specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <span className="text-xs font-bold text-slate-500 uppercase">{spec.label}</span>
                      <span className="text-sm font-black text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Info */}
              <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-4">
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30" />
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-base">{CURRENT_PRODUCT.seller.name}</h4>
                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-500"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                            <span className="text-[10px] text-slate-500 font-black uppercase">98% Phản hồi tốt</span>
                        </div>
                    </div>
                 </div>
                 <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-xs transition-all uppercase tracking-widest w-full md:w-auto">Ghé gian hàng</button>
              </div>
            </div>
          </div>
        </main>

        {/* Right: Bidding & Interaction Area */}
        <aside className="lg:w-[420px] w-full bg-slate-900/80 backdrop-blur-3xl border-l border-white/10 flex flex-col">
          
          {/* Bid Summary */}
          <div className="p-6 space-y-6 border-b border-white/5 bg-gradient-to-b from-blue-600/5 to-transparent">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1 italic flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Giá cao nhất
                </p>
                <h3 className={`text-4xl font-black transition-all duration-500 ${showBidAnimation ? 'text-green-400 scale-105' : 'text-white'}`}>
                  {formatCurrency(bids[0].amount)}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 italic">Kết thúc sau</p>
                <div className={`flex items-center justify-end gap-2 text-2xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                   <Clock className="w-5 h-5" /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleBid(bids[0].amount + 20000000)}
                className="py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-600/20 hover:border-blue-500/50 transition-all group"
              >
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Bước lẻ</p>
                <p className="text-sm font-black text-white">+20M</p>
              </button>
              <button 
                onClick={() => handleBid(bids[0].amount + CURRENT_PRODUCT.bidStep)}
                className="py-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl hover:bg-blue-600/20 transition-all group"
              >
                <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Mặc định</p>
                <p className="text-sm font-black text-white">+{formatCurrency(CURRENT_PRODUCT.bidStep).split(',')[0]}M</p>
              </button>
            </div>

            <button 
              onClick={() => handleBid(bids[0].amount + CURRENT_PRODUCT.bidStep)}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-blue-900/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <Gavel className="w-6 h-6" />
              ĐẶT GIÁ NGAY
            </button>
          </div>

          {/* Interaction Tabs */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex border-b border-white/5 px-6 gap-6">
              <button 
                onClick={() => setActiveTab('history')}
                className={`py-4 text-xs font-black transition-all relative ${activeTab === 'history' ? 'text-blue-500' : 'text-slate-500'}`}
              >
                LỊCH SỬ ĐẤU
                {activeTab === 'history' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>}
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className={`py-4 text-xs font-black transition-all relative ${activeTab === 'chat' ? 'text-blue-500' : 'text-slate-500'}`}
              >
                BÌNH LUẬN
                {activeTab === 'chat' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
              {activeTab === 'history' ? (
                bids.map((bid) => (
                  <div key={bid.id} className={`flex items-center justify-between p-4 rounded-2xl border ${bid.isHighest ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/5 border-transparent'}`}>
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${bid.isHighest ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>
                          {bid.isHighest ? <Trophy className="w-5 h-5" /> : bid.user.charAt(0)}
                       </div>
                       <div>
                          <p className="text-xs font-black text-white">{bid.user}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{bid.time}</p>
                       </div>
                    </div>
                    <p className={`text-sm font-black ${bid.isHighest ? 'text-blue-400' : 'text-white'}`}>{formatCurrency(bid.amount)}</p>
                  </div>
                ))
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-2xl flex flex-col gap-1 transition-all animate-in slide-in-from-bottom-2 ${
                    msg.type === 'system' ? 'bg-blue-900/10 border border-blue-500/20' : 
                    msg.type === 'seller' ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'
                  }`}>
                    <div className="flex items-center justify-between">
                       <span className={`text-[10px] font-black uppercase tracking-wider ${
                         msg.type === 'system' ? 'text-blue-400' : 
                         msg.type === 'seller' ? 'text-yellow-500' : 'text-slate-500'
                       }`}>
                         {msg.user}
                         {msg.type === 'seller' && <span className="ml-1 text-[8px] bg-yellow-500 text-black px-1 rounded">NGƯỜI BÁN</span>}
                       </span>
                    </div>
                    <p className={`text-sm ${msg.type === 'system' ? 'font-bold text-blue-200' : 'text-slate-300'}`}>
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-950/80 border-t border-white/10">
              <form onSubmit={sendChatMessage} className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={activeTab === 'chat' ? "Nhập bình luận..." : "Nhắn tin cho phiên đấu..."} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
                  />
                </div>
                <button type="submit" className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.2); }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slideInUp 0.3s ease-out forwards; }
      `}} />
    </div>
  );
};

export default App;