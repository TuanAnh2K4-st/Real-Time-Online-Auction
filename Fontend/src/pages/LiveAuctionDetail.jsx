import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Send,
  Zap,
  Award,
  Info,
  Package,
  Timer,
  MessageSquare,
  Activity,
  History,
  Coins,
  Gavel,
  ShieldCheck,
  FileText,
  CalendarDays,
  CheckCircle2,
  PlayCircle,
  Layout,
  Clock,
  Hammer
} from 'lucide-react';

// --- CẤU HÌNH LỊCH TRÌNH ---
const TODAY = new Date().toISOString().split('T')[0];

const SCHEDULE = [
  {
    id: 'PROD-A',
    startTime: `${TODAY}T10:00:00`,
    endTime: `${TODAY}T10:14:00`, 
    title: 'MacBook Pro M3 Max 2024 - Chính hãng Apple Việt Nam',
    description: 'Sản phẩm mới nhất từ Apple với vi xử lý M3 Max cực khủng. Máy nguyên seal, bảo hành 12 tháng tại Apple Việt Nam. Phù hợp cho các công việc đồ họa nặng, render video 8K và lập trình chuyên nghiệp. Thiết kế sang trọng với vỏ nhôm nguyên khối, bàn phím Magic Keyboard gõ cực sướng.',
    startPrice: 85000000,
    minBidStep: 500000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1629131726692-1accd0c93cd0?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { label: 'Vi xử lý', value: 'Apple M3 Max (14-core CPU)' }, 
      { label: 'Bộ nhớ RAM', value: '64GB Unified Memory' },
      { label: 'Lưu trữ', value: '1TB SSD Superfast' },
      { label: 'Màn hình', value: 'Liquid Retina XDR 14 inch' }
    ]
  },
  {
    id: 'PROD-B',
    startTime: `${TODAY}T10:15:00`, 
    endTime: `${TODAY}T10:28:00`, 
    title: 'iPhone 15 Pro Max 1TB - Bản Titanium Xanh',
    description: 'Chiếc iPhone mạnh mẽ nhất hiện nay với khung viền Titanium siêu bền và siêu nhẹ. Hệ thống camera chuyên nghiệp với khả năng zoom quang học 5x. Dung lượng 1TB thoải mái lưu trữ video 4K ProRes chất lượng cao nhất cho các nhà sáng tạo nội dung.',
    startPrice: 35000000,
    minBidStep: 200000,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d256e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { label: 'Vi xử lý', value: 'A17 Pro (3nm)' }, 
      { label: 'Màn hình', value: '6.7 inch ProMotion 120Hz' },
      { label: 'Camera', value: '48MP Pro System' },
      { label: 'Cổng sạc', value: 'USB-C 3.0' }
    ]
  },
  {
    id: 'PROD-C',
    startTime: `${TODAY}T10:29:00`,
    endTime: `${TODAY}T10:45:00`,
    title: 'iPad Pro M4 13 inch - Phiên bản Nano-Texture',
    description: 'Mẫu iPad mỏng nhất lịch sử với màn hình OLED Tandem rực rỡ và chip M4 thế hệ mới. Mặt kính Nano-texture giúp chống chói tối ưu trong mọi điều kiện ánh sáng mạnh. Phù hợp cho nghệ sĩ vẽ minh họa chuyên nghiệp.',
    startPrice: 42000000,
    minBidStep: 300000,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { label: 'Màn hình', value: 'Ultra Retina XDR OLED' },
      { label: 'Chip', value: 'Apple M4 (10-core)' },
      { label: 'Độ dày', value: '5.1 mm' }
    ]
  }
];

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionStatus, setSessionStatus] = useState('loading');
  const [currentProduct, setCurrentProduct] = useState(SCHEDULE[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('history');
  
  const [bids, setBids] = useState([]);
  const [chats, setChats] = useState([{ id: 1, user: 'Admin', message: 'Hệ thống đã sẵn sàng cho phiên đấu giá!', type: 'system' }]);
  const [newMessage, setNewMessage] = useState('');
  const [customBid, setCustomBid] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = currentTime.getTime();
    const activeIdx = SCHEDULE.findIndex(p => {
      const start = new Date(p.startTime).getTime();
      const end = new Date(p.endTime).getTime();
      return now >= start && now < end;
    });

    if (activeIdx !== -1) {
      const product = SCHEDULE[activeIdx];
      if (currentProduct.id !== product.id || sessionStatus !== 'live') {
        setCurrentProduct(product);
        setSessionStatus('live');
        setBids([{ id: Date.now(), user: 'Hệ thống', amount: product.startPrice, time: 'Bắt đầu', isTop: true }]);
        setChats(prev => [...prev, { id: Date.now(), user: 'Hệ thống', message: `Đang đấu giá: ${product.title}`, type: 'system' }]);
      }
    } else {
      const nextIdx = SCHEDULE.findIndex(p => now < new Date(p.startTime).getTime());
      if (nextIdx !== -1) {
        setSessionStatus('break');
        if (currentProduct.id !== SCHEDULE[nextIdx].id) setCurrentProduct(SCHEDULE[nextIdx]);
      } else {
        setSessionStatus('ended');
      }
    }
  }, [currentTime, currentProduct.id, sessionStatus]);

  useEffect(() => {
    if (sessionStatus !== 'live') return;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % currentProduct.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentProduct, sessionStatus]);

  const formatPrice = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' đ';

  const handleCustomBidChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCustomBid(value === "" ? "" : new Intl.NumberFormat('vi-VN').format(parseInt(value)));
  };

  const getCountdown = () => {
    let targetTime = null;
    if (sessionStatus === 'live') targetTime = new Date(currentProduct.endTime);
    else if (sessionStatus === 'break') targetTime = new Date(currentProduct.startTime);
    else return "00:00";

    const diff = Math.max(0, Math.floor((targetTime.getTime() - currentTime.getTime()) / 1000));
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const executeBid = (amount) => {
    if (sessionStatus !== 'live') return;
    if (amount <= (bids[0]?.amount || 0)) return;
    setBids([{ id: Date.now(), user: 'Bạn', amount: amount, time: 'Vừa xong', isTop: true }, ...bids.map(b => ({...b, isTop: false}))]);
    setCustomBid("");
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-slate-950/60 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-black tracking-tight text-white uppercase italic">AUCTION <span className="text-blue-500">LIVE</span></h1>
        </div>

        <div className={`flex items-center gap-4 px-4 py-1.5 rounded-xl border transition-all ${sessionStatus === 'live' ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-900 border-white/10'}`}>
          <div className={`w-2 h-2 rounded-full ${sessionStatus === 'live' ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-white font-mono text-lg font-bold uppercase">{sessionStatus === 'break' ? 'Chờ phiên kế: ' : ''}{getCountdown()}</span>
        </div>
      </header>

      {/* OVERLAY NGHỈ */}
      {sessionStatus === 'break' && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center">
           <Timer className="w-16 h-16 text-blue-500 animate-pulse mb-4" />
           <h2 className="text-3xl font-black text-white uppercase mb-2">Đang chuẩn bị sản phẩm mới</h2>
           <p className="text-slate-400 mb-8 max-w-md text-sm italic">"Vui lòng đợi trong giây lát, siêu phẩm tiếp theo sắp xuất hiện..."</p>
           <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-4 w-full max-w-sm">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Sắp lên sóng</span>
              <img src={currentProduct.images[0]} className="w-32 h-32 rounded-2xl object-cover shadow-2xl" alt="next" />
              <p className="text-white font-bold px-4">{currentProduct.title}</p>
              <div className="text-4xl font-mono text-white font-black">{getCountdown()}</div>
           </div>
        </div>
      )}

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT: MEDIA & GRID INFO */}
        <div className="lg:w-[60%] overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8 bg-slate-950/20">
          
          {/* Gallery Section */}
          <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-900 group">
            {sessionStatus === 'live' && (
              <img src={currentProduct.images[imageIndex]} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="product" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
               <h2 className="text-2xl lg:text-4xl font-black text-white uppercase italic drop-shadow-2xl max-w-2xl">{currentProduct.title}</h2>
               <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                 <Users className="w-4 h-4 text-blue-400" />
                 <span className="text-xs font-bold text-white">1,284 đang xem</span>
               </div>
            </div>
            <div className="absolute top-8 left-8 flex items-center gap-2 bg-red-600 px-3 py-1 rounded text-[10px] font-bold animate-pulse">LIVE</div>
          </div>

          {/* DUAL INFO GRID (HÀNG TRÊN CHIA ĐÔI) */}
          <div className="grid lg:grid-cols-2 gap-8">
             {/* Trái: Mô tả sản phẩm */}
             <div className="space-y-4">
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Mô tả sản phẩm
                </h3>
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl min-h-[180px]">
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    {currentProduct.description}
                  </p>
                </div>
             </div>

             {/* Phải: Thông số kỹ thuật */}
             <div className="space-y-4">
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Package className="w-4 h-4" /> Thông số kỹ thuật
                </h3>
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl min-h-[180px] space-y-3">
                   {currentProduct.specs.map((spec, i) => (
                     <div key={i} className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{spec.label}</span>
                        <span className="text-xs text-slate-200 font-semibold">{spec.value}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* SCHEDULE ROW (HÀNG DƯỚI - XẾP TỪ TRÊN XUỐNG) */}
          <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> Lịch trình phiên đấu giá hôm nay
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase italic">3 Sản phẩm</span>
              </div>
              
              <div className="space-y-3">
                  {SCHEDULE.map((item, index) => {
                    const isNow = currentProduct.id === item.id && sessionStatus === 'live';
                    const isPast = new Date(item.endTime).getTime() < currentTime.getTime();
                    
                    return (
                      <div key={item.id} className="relative group">
                        {/* Line connector */}
                        {index !== SCHEDULE.length - 1 && (
                          <div className="absolute left-6 top-12 bottom-[-12px] w-[2px] bg-white/5 z-0" />
                        )}
                        
                        <div className={`relative z-10 flex items-center gap-5 p-4 rounded-2xl border transition-all duration-300 ${isNow ? 'bg-blue-600/10 border-blue-500/40 ring-1 ring-blue-500/20 translate-x-2' : 'bg-white/[0.02] border-white/5'}`}>
                           {/* Status Icon */}
                           <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isNow ? 'bg-blue-600 shadow-xl shadow-blue-600/40 scale-110' : 'bg-slate-800'}`}>
                              {isPast ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                isNow ? <PlayCircle className="w-6 h-6 text-white animate-pulse" /> : <Clock className="w-5 h-5 text-slate-600" />
                              )}
                           </div>

                           {/* Info */}
                           <div className="flex-1 min-w-0 grid md:grid-cols-4 items-center gap-4">
                              <div className="md:col-span-2">
                                <p className={`text-[11px] font-black uppercase truncate ${isNow ? 'text-white' : 'text-slate-500'}`}>
                                  {item.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isNow ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                                    {isPast ? 'ĐÃ KẾT THÚC' : (isNow ? 'ĐANG DIỄN RA' : 'CHỜ PHIÊN')}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="hidden md:block text-center">
                                <p className="text-[9px] text-slate-600 font-bold uppercase mb-0.5">Thời gian</p>
                                <p className={`text-[10px] font-mono font-bold ${isNow ? 'text-blue-400' : 'text-slate-500'}`}>
                                  {item.startTime.split('T')[1].substring(0, 5)} - {item.endTime.split('T')[1].substring(0, 5)}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-[9px] text-slate-600 font-bold uppercase mb-0.5">Khởi điểm</p>
                                <p className={`text-[11px] font-black ${isNow ? 'text-white' : 'text-slate-500'}`}>
                                  {formatPrice(item.startPrice)}
                                </p>
                              </div>
                           </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
          </div>
        </div>

        {/* RIGHT: ACTION & INTERACTION */}
        <div className="lg:w-[40%] flex flex-col border-l border-white/5 bg-slate-950/60 backdrop-blur-xl">
          
          {/* Bidding Zone */}
          <div className="p-6 border-b border-white/5 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2rem] p-7 shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                 <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Đấu giá hiện tại</p>
                 <h3 className="text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tighter">
                   {bids.length > 0 ? formatPrice(bids[0].amount) : formatPrice(currentProduct.startPrice)}
                 </h3>
                 <div className="mt-4 inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                   <Award className="w-3.5 h-3.5 text-amber-400" />
                   <span className="text-[11px] font-black text-white uppercase">{bids.length > 0 ? bids[0].user : 'Đang chờ lượt đầu'}</span>
                 </div>
               </div>
               <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Giá khởi điểm</p>
                  <p className="text-sm font-bold text-slate-300">{formatPrice(currentProduct.startPrice)}</p>
               </div>
               <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                  <p className="text-[9px] text-blue-500 uppercase font-bold mb-1">Bước giá tối thiểu</p>
                  <p className="text-sm font-bold text-blue-400">+{formatPrice(currentProduct.minBidStep)}</p>
               </div>
            </div>

            <div className="space-y-4">
               <button 
                 onClick={() => executeBid((bids[0]?.amount || currentProduct.startPrice) + currentProduct.minBidStep)}
                 disabled={sessionStatus !== 'live'}
                 className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-20"
               >
                 <Hammer className="w-4 h-4 fill-current" /> Đấu giá ngay: {formatPrice((bids[0]?.amount || currentProduct.startPrice) + currentProduct.minBidStep)}
               </button>

               <div className="relative flex items-center gap-2">
                  <div className="relative flex-1 group">
                    <input 
                      type="text" 
                      value={customBid}
                      onChange={handleCustomBidChange}
                      placeholder="Nhập giá bạn muốn..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-10 text-[11px] font-bold text-white focus:border-blue-500 outline-none transition-all"
                    />
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500" />
                  </div>
                  <button 
                    onClick={() => {
                      const val = parseInt(customBid.replace(/\D/g, ""));
                      if(val > (bids[0]?.amount || 0)) executeBid(val);
                    }}
                    disabled={!customBid || sessionStatus !== 'live'}
                    className="bg-blue-600 px-5 py-4 rounded-xl text-white disabled:opacity-30 active:scale-90 transition-all shadow-lg flex items-center justify-center"
                  >
                    <Gavel className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </div>

          {/* Interaction Tabs */}
          <div className="flex-1 flex flex-col overflow-hidden">
             <div className="flex border-b border-white/5">
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'history' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <History className="w-4 h-4" /> Lịch sử ({bids.length})
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'chat' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <MessageSquare className="w-4 h-4" /> Chat trực tiếp
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-black/10">
                {activeTab === 'history' ? (
                  <div className="space-y-3">
                    {bids.map((bid) => (
                      <div key={bid.id} className={`flex items-center justify-between p-4 rounded-2xl border animate-in slide-in-from-right duration-500 ${bid.isTop ? 'bg-blue-600/10 border-blue-500/30 shadow-lg' : 'bg-white/[0.02] border-white/5'}`}>
                        <div className="flex items-center gap-3">
                           <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black ${bid.isTop ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                             {bid.user[0]}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs font-black">{bid.user}</span>
                              <span className="text-[9px] text-slate-600 font-bold">{bid.time}</span>
                           </div>
                        </div>
                        <span className={`text-[13px] font-black tabular-nums ${bid.isTop ? 'text-blue-400' : 'text-slate-500'}`}>{formatPrice(bid.amount)}</span>
                      </div>
                    ))}
                    {bids.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-40 text-slate-700">
                        <Activity className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Đang chờ lượt đấu đầu tiên...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chats.map(chat => (
                      <div key={chat.id} className={chat.type === 'system' ? 'text-center' : 'flex flex-col'}>
                        {chat.type === 'system' ? (
                          <span className="text-[9px] font-black text-slate-600 uppercase italic bg-white/5 px-4 py-1.5 rounded-full inline-block">{chat.message}</span>
                        ) : (
                          <div className="flex flex-col items-start">
                            <span className="text-[9px] font-black text-slate-600 uppercase mb-1 ml-1">{chat.user}</span>
                            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-2xl rounded-tl-none max-w-[85%]">
                              <p className="text-xs text-slate-300 leading-relaxed">{chat.message}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
             </div>

             {activeTab === 'chat' && (
               <div className="p-4 bg-slate-950 border-t border-white/5">
                 <form onSubmit={(e) => {
                   e.preventDefault();
                   if(!newMessage.trim()) return;
                   setChats([...chats, { id: Date.now(), user: 'Khách hàng', message: newMessage }]);
                   setNewMessage('');
                 }} className="relative">
                   <input 
                     type="text" 
                     placeholder="Tham gia thảo luận..."
                     className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-5 text-xs text-white outline-none focus:border-blue-500 transition-all pr-14 shadow-inner"
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                   />
                   <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
                     <Send className="w-4 h-4" />
                   </button>
                 </form>
               </div>
             )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.4); }
      `}</style>
    </div>
  );
};

export default App;