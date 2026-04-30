import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, ShieldCheck, ChevronLeft, ArrowRight, Package, 
  Truck, Shield, Info, CreditCard as CardIcon,
  CheckCircle2, Clock, MapPin, Tag, BadgeCheck, Zap,
  AlertCircle, Gavel, Timer, History, ChevronDown, ShoppingBag,
  Archive, ExternalLink
} from 'lucide-react';

// --- HÀM TRỢ GIÚP ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// --- DỮ LIỆU GIẢ LẬP ---
const WON_ITEMS = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 1TB - Phiên bản mạ vàng 24K",
    finalBid: 85000000,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    category: "Công nghệ",
    seller: "TechWorld VN",
    auctionId: "#DG-2024-001",
    wonAt: "2024-05-20T10:00:00",
    deadline: "2024-05-22T10:00:00",
  },
  {
    id: 3,
    title: "Túi Hermes Birkin 35 - Da cá sấu Niloticus",
    finalBid: 1200000000,
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800",
    category: "Thời trang xa xỉ",
    seller: "Antique Heritage",
    auctionId: "#DG-2024-085",
    wonAt: "2024-05-20T14:30:00",
    deadline: "2024-05-22T14:30:00",
  }
];

const PROVINCES = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];
const WARDS = ["Phường Bến Nghé", "Phường Đa Kao", "Phường Tân Phong", "Phường 22", "Xã Hiệp Phước", "Phường Thảo Điền"];

const CountdownTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(deadline).getTime() - now;
      
      if (distance < 0) {
        setTimeLeft("ĐÃ HẾT HẠN");
        clearInterval(timer);
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}giờ ${minutes}phút ${seconds}giây`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="flex items-center gap-2 text-amber-400 font-black italic">
      <Timer className="w-4 h-4 animate-pulse" />
      <span className="text-sm tracking-tighter">{timeLeft}</span>
    </div>
  );
};

const App = () => {
  const [selectedItem, setSelectedItem] = useState(WON_ITEMS[0]);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [address, setAddress] = useState({ province: "", ward: "", street: "" });

  const insuranceFee = selectedItem.finalBid * 0.01;
  const shippingFee = selectedItem.finalBid > 100000000 ? 0 : 250000;
  const total = selectedItem.finalBid + insuranceFee + shippingFee;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30 pb-20">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-8 md:pt-16">
        {/* Top Navigation / Cart Breadcrumb */}
        <div className="flex items-center gap-4 mb-8 text-slate-500">
           <button className="flex items-center gap-2 hover:text-white transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Tiếp tục đấu giá</span>
           </button>
           <div className="h-4 w-px bg-white/10"></div>
           <div className="flex items-center gap-2 text-blue-400">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest italic">Giỏ hàng thắng thầu</span>
           </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 text-[10px] font-black uppercase tracking-widest">
              Nghĩa vụ thanh toán
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
              GIỎ HÀNG <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">THẮNG THẦU</span>
            </h1>
          </div>
          
          {/* Cart Stats Summary */}
          <div className="flex items-center gap-6 bg-slate-900/50 border border-white/5 rounded-3xl p-4 pr-6 backdrop-blur-md">
             <div className="flex -space-x-3">
                {WON_ITEMS.map((item) => (
                  <div key={item.id} className="w-10 h-10 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-800">
                    <img src={item.image} alt="Cart item" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đang chờ</p>
                <p className="text-lg font-black text-white leading-none">{WON_ITEMS.length} Vật phẩm</p>
             </div>
          </div>
        </div>

        {/* Thông báo quy định */}
        <div className="mb-10 p-5 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Shield className="w-12 h-12 text-blue-400" />
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 z-10">
                <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300 text-center md:text-left z-10">
                Giỏ hàng thắng thầu yêu cầu thanh toán <b>từng vật phẩm</b> để hoàn tất thủ tục pháp lý. Vui lòng thanh toán trong vòng <b>48 giờ</b> để tránh bị khóa tài khoản đấu giá.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between ml-2">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Danh sách cần xử lý</h3>
                <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:underline">
                  <Archive className="w-3 h-3" /> Xem lịch sử thầu
                </button>
            </div>
            
            {WON_ITEMS.map((item, index) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className={`group relative cursor-pointer rounded-[2.5rem] p-6 border transition-all duration-500 animate-in fade-in slide-in-from-left-4 ${
                  selectedItem.id === item.id 
                  ? 'bg-slate-900/60 border-blue-500/50 shadow-2xl shadow-blue-900/20' 
                  : 'bg-slate-900/30 border-white/5 hover:border-white/20'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Active Indicator */}
                {selectedItem.id === item.id && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-12 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                )}

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-full md:w-40 aspect-square rounded-3xl overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                       <span className="text-[8px] font-black text-white uppercase flex items-center gap-1"><ExternalLink className="w-2 h-2" /> Xem chi tiết thầu</span>
                    </div>
                  </div>

                  <div className="flex-grow space-y-3 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.category}</span>
                        <CountdownTimer deadline={item.deadline} />
                    </div>
                    <h3 className="text-xl font-black text-white leading-tight">{item.title}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <div className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-cyan-400" /> {item.seller}</div>
                      <div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-blue-400" /> {item.auctionId}</div>
                    </div>
                  </div>

                  <div className="text-center md:text-right shrink-0">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Giá thắng cuộc</p>
                    <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(item.finalBid)}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Thông tin nhận hàng */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Địa chỉ bàn giao</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Cấu trúc địa chỉ mới sau sáp nhập</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Người nhận</label>
                  <input type="text" placeholder="Họ và tên..." className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Số điện thoại</label>
                  <input type="text" placeholder="Số điện thoại..." className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-700" />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Tỉnh / Thành phố</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-blue-500 transition-all cursor-pointer" onChange={(e) => setAddress({...address, province: e.target.value})}>
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Phường / Xã</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-blue-500 transition-all cursor-pointer" onChange={(e) => setAddress({...address, ward: e.target.value})}>
                      <option value="">Chọn Phường/Xã trực thuộc</option>
                      {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Số nhà & Tên đường</label>
                  <input type="text" placeholder="Số nhà, ngõ, tên đường..." className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-700" onChange={(e) => setAddress({...address, street: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Cột Tổng kết */}
          <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="sticky top-10 space-y-6">
              <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShoppingCart className="w-32 h-32 text-blue-500 -rotate-12" />
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Thanh toán vật phẩm</h2>
                </div>

                <div className="space-y-5 mb-8">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500">Giá thắng thầu</span>
                    <span className="text-white">{formatCurrency(selectedItem.finalBid)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500 flex items-center gap-2">Bảo hiểm vật phẩm (1%) <Info className="w-3 h-3 cursor-help" /></span>
                    <span className="text-white">{formatCurrency(insuranceFee)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500">Phí vận chuyển ưu tiên</span>
                    <span className="text-white">{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"></div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Tổng cộng thanh toán đơn</p>
                    <p className="text-4xl font-black text-white tracking-tighter leading-none">{formatCurrency(total)}</p>
                  </div>
                </div>

                {/* Phương thức thanh toán */}
                <div className="space-y-3 mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Chọn phương thức</p>
                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={() => setPaymentMethod('bank')} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${paymentMethod === 'bank' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950/40 border-white/5 text-slate-500'}`}>
                            <div className={`p-2 rounded-lg ${paymentMethod === 'bank' ? 'bg-blue-500 text-white' : 'bg-slate-800'}`}><CardIcon className="w-4 h-4" /></div>
                            <span className="text-xs font-black uppercase italic">Chuyển khoản Ngân hàng</span>
                        </button>
                        <button onClick={() => setPaymentMethod('crypto')} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${paymentMethod === 'crypto' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950/40 border-white/5 text-slate-500'}`}>
                            <div className={`p-2 rounded-lg ${paymentMethod === 'crypto' ? 'bg-blue-500 text-white' : 'bg-slate-800'}`}><Zap className="w-4 h-4" /></div>
                            <span className="text-xs font-black uppercase italic">Crypto (USDT/BTC)</span>
                        </button>
                    </div>
                </div>

                <button className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group uppercase tracking-tighter italic">
                  TIẾN HÀNH THANH TOÁN <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-around p-4 bg-slate-900/40 rounded-3xl border border-white/5">
                 <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    <span className="text-[8px] font-black text-slate-500 uppercase">An toàn</span>
                 </div>
                 <div className="w-px h-6 bg-white/5"></div>
                 <div className="flex flex-col items-center gap-1">
                    <Truck className="w-5 h-5 text-blue-400" />
                    <span className="text-[8px] font-black text-slate-500 uppercase">Vận chuyển</span>
                 </div>
                 <div className="w-px h-6 bg-white/5"></div>
                 <div className="flex flex-col items-center gap-1">
                    <BadgeCheck className="w-5 h-5 text-amber-400" />
                    <span className="text-[8px] font-black text-slate-500 uppercase">Uy tín</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;