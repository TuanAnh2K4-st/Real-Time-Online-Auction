import React, { useState, useEffect } from 'react';
import { 
  Gavel, Clock, Star, Zap, FileText, Settings, 
  MessageCircle, Send, CheckCircle2, History, X,
  TrendingUp, Tag, Coins
} from 'lucide-react';

// --- HÀM TRỢ GIÚP ĐỊNH DẠNG TIỀN TỆ ---
const formatCurrency = (amount) => {
  if (!amount) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatInputNumber = (val) => {
  if (!val) return "";
  const number = val.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// --- DỮ LIỆU SẢN PHẨM ---
const PRODUCT_DATA = {
  id: 1,
  title: "iPhone 15 Pro Max 1TB - Phiên bản mạ vàng 24K Limited",
  category: "Điện thoại cao cấp",
  status: "Đang diễn ra",
  description: "Sản phẩm độc bản được chế tác bởi các nghệ nhân hàng đầu tại Việt Nam. Vỏ máy được mạ vàng 24K nguyên chất dày 5 micron, đính kèm 22 viên kim cương tự nhiên ở mặt lưng biểu tượng. Toàn bộ phím bấm và viền camera cũng được phủ vàng hồng tạo điểm nhấn sang trọng. Sản phẩm đi kèm hộp gỗ sơn mài cao cấp, bộ sạc bọc da cá sấu và giấy chứng nhận kiểm định độc bản số 01/10.",
  owner: {
    name: "Gia Bảo Luxury",
    rating: 4.9,
    reviews: 1240,
    joinDate: "Tháng 05/2021",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    verified: true
  },
  images: [
    "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1695048133142-1a20484d256e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&q=80&w=1200"
  ],
  currentBid: 85000000,
  startingPrice: 50000000,
  bidIncrement: 1000000,
  timeLeft: "01:14:05",
  bidsCount: 42,
  specs: [
    { label: "Màn hình", value: "6.7 inch, Super Retina XDR OLED" },
    { label: "Chipset", value: "A17 Pro (3nm)" },
    { label: "Bộ nhớ", value: "1TB" },
    { label: "Vật liệu", value: "Khung Titan, Mạ vàng 24K" },
    { label: "Tình trạng", value: "Mới 100% Fullbox" },
    { label: "Bảo hành", value: "24 tháng (12 tháng Apple + 12 tháng chế tác)" }
  ],
  history: [
    { id: 1, user: "Hoàng Anh", amount: 85000000, time: "2 phút trước", isLeading: true },
    { id: 2, user: "Minh Quân", amount: 84000000, time: "5 phút trước", isLeading: false },
    { id: 3, user: "Thanh Hằng", amount: 82500000, time: "12 phút trước", isLeading: false }
  ]
};

const App = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoBidActive, setIsAutoBidActive] = useState(false);
  const [maxAutoBid, setMaxAutoBid] = useState("");
  const [manualBid, setManualBid] = useState("");
  const [activeTab, setActiveTab] = useState('history'); 
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Hệ thống', text: 'Phiên đấu giá đã bắt đầu với giá khởi điểm 50.000.000₫', type: 'system' },
    { id: 2, sender: 'Hoàng Anh', text: 'Sản phẩm có đầy đủ giấy kiểm định vàng không?', type: 'user' },
    { id: 3, sender: 'Người bán', text: 'Dạ có đầy đủ giấy chứng nhận PNJ đi kèm ạ!', type: 'owner' }
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % PRODUCT_DATA.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleManualBidChange = (e) => {
    setManualBid(formatInputNumber(e.target.value));
  };

  const handleMaxAutoBidChange = (e) => {
    setMaxAutoBid(formatInputNumber(e.target.value));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'Bạn', text: chatInput, type: 'user' }]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 pb-10">
      {/* Header */}
      <nav className="fixed top-0 w-full z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <Gavel className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">DAUGIA<span className="text-blue-400 italic">VIET</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span className="hover:text-blue-400 cursor-pointer transition-colors">Khám phá</span>
               <span className="hover:text-blue-400 cursor-pointer transition-colors">Đang diễn ra</span>
               <span className="hover:text-blue-400 cursor-pointer transition-colors">Lịch sử</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs uppercase">MT</div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* CỘT TRÁI: ẢNH & THÔNG TIN SẢN PHẨM (MÔ TẢ TRÊN, SPEC DƯỚI) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Ảnh sản phẩm */}
            <div className="relative group">
              <div className="aspect-square rounded-[3.5rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl relative">
                {PRODUCT_DATA.images.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} 
                    alt="Auction"
                  />
                ))}
                <div className="absolute inset-x-0 bottom-10 flex justify-center gap-2.5 z-10">
                  {PRODUCT_DATA.images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImageIndex ? 'w-10 bg-blue-500' : 'w-2.5 bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bố cục Thông tin dọc (Yêu cầu mới) */}
            <div className="space-y-8">
              {/* PHẦN MÔ TẢ Ở TRÊN */}
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/10 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Mô tả tài sản</h3>
                </div>
                <div className="h-px bg-gradient-to-r from-blue-500/30 to-transparent w-full" />
                <p className="text-slate-400 leading-relaxed text-sm font-medium">
                  {PRODUCT_DATA.description}
                </p>
              </div>

              {/* THÔNG SỐ KỸ THUẬT Ở DƯỚI */}
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/10 rounded-lg">
                    <Settings className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Thông số kỹ thuật</h3>
                </div>
                <div className="h-px bg-gradient-to-r from-blue-500/30 to-transparent w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {PRODUCT_DATA.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center pb-2 border-b border-white/5 group">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-300 transition-colors">{spec.label}</span>
                      <span className="text-[11px] font-black text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Khối Người Bán */}
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img src={PRODUCT_DATA.owner.avatar} className="w-16 h-16 rounded-2xl object-cover border border-white/10" alt="Owner" />
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 p-1 rounded-lg border-2 border-slate-950">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-white italic">{PRODUCT_DATA.owner.name}</h4>
                    <span className="bg-blue-600/20 text-blue-400 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Đại lý uy tín</span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold">Tham gia từ {PRODUCT_DATA.owner.joinDate}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase italic transition-all border border-white/5">Hồ sơ</button>
                <button className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase italic transition-all shadow-lg shadow-blue-600/20">Theo dõi</button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: ĐẤU GIÁ & ĐẶT GIÁ */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-gradient-to-br from-blue-600/20 to-slate-950 rounded-[3rem] border border-blue-500/30 space-y-8 shadow-2xl relative">
              
              {/* Giá hiện tại & Thời gian */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Giá hiện tại</p>
                  <p className="text-5xl font-black text-white tracking-tighter">
                    {formatCurrency(PRODUCT_DATA.currentBid)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> Kết thúc
                  </p>
                  <p className="text-xl font-black text-white tabular-nums">{PRODUCT_DATA.timeLeft}</p>
                </div>
              </div>

              {/* GIÁ KHỞI ĐIỂM & BƯỚC GIÁ (Yêu cầu mới) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Tag className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Giá khởi điểm</p>
                    <p className="text-xs font-black text-white">{formatCurrency(PRODUCT_DATA.startingPrice)}</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Coins className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Bước giá tối thiểu</p>
                    <p className="text-xs font-black text-white">{formatCurrency(PRODUCT_DATA.bidIncrement)}</p>
                  </div>
                </div>
              </div>

              {/* ĐẶT GIÁ THỦ CÔNG */}
              <div className="space-y-4">
                <div className="relative">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nhập giá đặt mua (VNĐ)</p>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={manualBid}
                      onChange={handleManualBidChange}
                      placeholder="Ví dụ: 90.000.000"
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-xl font-black text-white focus:border-blue-500 outline-none pr-16 shadow-inner"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-slate-700 italic">VNĐ</span>
                  </div>
                </div>

                {/* TỰ ĐỘNG TRẢ GIÁ */}
                <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${isAutoBidActive ? 'bg-blue-600/10 border-blue-500/40 ring-1 ring-blue-500/20' : 'bg-slate-900/50 border-white/5'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className={`w-4 h-4 ${isAutoBidActive ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} />
                      <span className="text-[10px] font-black text-white uppercase italic tracking-wider">Tự động trả giá (Auto-bid)</span>
                    </div>
                    <button 
                      onClick={() => setIsAutoBidActive(!isAutoBidActive)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${isAutoBidActive ? 'bg-blue-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isAutoBidActive ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  
                  {isAutoBidActive && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="relative">
                        <input 
                          type="text" 
                          value={maxAutoBid}
                          onChange={handleMaxAutoBidChange}
                          placeholder="Mức giá tối đa bạn muốn..."
                          className="w-full bg-slate-950 border border-blue-500/30 rounded-xl px-4 py-3 text-sm font-black text-white outline-none focus:border-blue-400"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700">VNĐ</span>
                      </div>
                    </div>
                  )}
                </div>

                <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-base font-black uppercase italic tracking-widest shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-95">
                  <Gavel className="w-6 h-6" /> Xác nhận đặt giá
                </button>
              </div>
            </div>

            {/* TAB CHUYỂN ĐỔI: NHẬT KÝ VÀ CHAT TRỰC TIẾP */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-[500px]">
              <div className="flex border-b border-white/5">
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-blue-400' : 'text-slate-500'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <History className="w-3 h-3" /> Nhật ký đấu giá ({PRODUCT_DATA.bidsCount})
                  </div>
                  {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />}
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'chat' ? 'text-blue-400' : 'text-slate-500'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-3 h-3" /> Cộng đồng phiên
                  </div>
                  {activeTab === 'chat' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'history' ? (
                  <div className="space-y-3">
                    {PRODUCT_DATA.history.map((bid, i) => (
                      <div key={bid.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${bid.isLeading ? 'bg-blue-600/10 border-blue-500/30 ring-1 ring-blue-500/20' : 'bg-white/5 border-transparent opacity-60'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${bid.isLeading ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-xs font-black text-white flex items-center gap-2">
                              {bid.user}
                              {bid.isLeading && <span className="text-[8px] bg-green-500 text-white px-1 rounded uppercase tracking-tighter">Dẫn đầu</span>}
                            </p>
                            <p className="text-[9px] text-slate-500 font-bold">{bid.time}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-black ${bid.isLeading ? 'text-blue-400' : 'text-white'}`}>{formatCurrency(bid.amount)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'Bạn' ? 'items-end' : 'items-start'}`}>
                          {msg.type !== 'system' && (
                            <span className="text-[8px] font-black text-slate-500 uppercase mb-1 px-2">
                              {msg.sender} {msg.sender === 'Người bán' && '• Chủ sở hữu'}
                            </span>
                          )}
                          <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] font-bold ${
                            msg.sender === 'Bạn' ? 'bg-blue-600 text-white rounded-tr-none' : 
                            msg.type === 'system' ? 'bg-slate-900 text-slate-500 italic text-center w-full border border-white/5' : 
                            msg.sender === 'Người bán' ? 'bg-blue-900/40 text-blue-200 border border-blue-500/20 rounded-tl-none' :
                            'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="relative mt-auto">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Thảo luận cùng mọi người..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-blue-500"
                      />
                      <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[150] shadow-blue-600/30">
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950">2</div>
      </button>
    </div>
  );
};

export default App;