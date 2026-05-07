import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, ShieldCheck, ChevronLeft, ArrowRight, Package, 
  Truck, Shield, Info, CreditCard as CardIcon,
  CheckCircle2, Clock, MapPin, Tag, BadgeCheck, Zap,
  AlertCircle, Gavel, Timer, History, ChevronDown, ShoppingBag,
  Archive, ExternalLink
} from 'lucide-react';
import {getCartOrders, getProvinces, getWardsByProvince, payOrder} from "../services/api/cartApi";

// --- HÀM TRỢ GIÚP ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const CountdownTimer = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!createdAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();

      // deadline = createdAt + 48h
      const createdTime = new Date(createdAt).getTime();
      const deadline = createdTime + 48 * 60 * 60 * 1000;

      const distance = deadline - now;

      if (distance <= 0) {
        setTimeLeft("ĐÃ HẾT HẠN");
        clearInterval(timer);
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  return (
    <div className="flex items-center gap-2 text-amber-400 font-black italic">
      <Timer className="w-4 h-4 animate-pulse" />
      <span className="text-sm tracking-tighter">{timeLeft}</span>
    </div>
  );
};

export default function Cart() {

  const [orders, setOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await getCartOrders();

      const data = res.data || [];

      setOrders(data);

      if (data.length > 0) {
        setSelectedItem(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    fetchOrders();
  }, []);

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await getProvinces();
        setProvinces(res.data || []);
      } catch (err) {
        console.error("Lỗi load provinces:", err);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceId = Number(e.target.value);

    setAddress(prev => ({
      ...prev,
      province: provinceId,
      ward: ""
    }));

    try {
      const res = await getWardsByProvince(provinceId);
      setWards(res.data || []);
    } catch (err) {
      console.error("Lỗi load wards:", err);
    }
  };

  const [provinceOpen, setProvinceOpen] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState("");

  const filteredProvinces = provinces.filter(p =>
    p.name.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  const [wardOpen, setWardOpen] = useState(false);
  const [wardSearch, setWardSearch] = useState("");

  const filteredWards = wards.filter(w =>
    w.name.toLowerCase().includes(wardSearch.toLowerCase())
  );
  const handleWardChange = (e) => {
    const wardId = Number(e.target.value);
    setAddress(prev => ({
      ...prev,
      ward: wardId
    }));
  };

  // Thanh toán
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validatePayment = () => {
    if (!selectedItem) {return "Vui lòng chọn đơn hàng";}
    if (!address.province) {return "Vui lòng chọn tỉnh/thành";}
    if (!address.ward) {return "Vui lòng chọn phường/xã";}
    if (!address.street.trim()) {return "Vui lòng nhập địa chỉ";}
    return null;
  };

  const handlePayment = async () => {
    setError("");
    setSuccess("");
    // validate
    const validationError = validatePayment();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setPaying(true);
      const payload = {
        orderId: selectedItem.orderId,
        method: paymentMethod,
        street: address.street.trim(),
        provinceId: address.province,
        wardId: address.ward
      };

      const res = await payOrder(payload);
      setSuccess(res.message || "Thanh toán thành công");
      // remove paid order khỏi cart
      const updatedOrders = orders.filter(item => item.orderId !== selectedItem.orderId);
      setOrders(updatedOrders);
      // reset address
      setAddress({
        province: "",
        ward: "",
        street: ""
      });

      setProvinceSearch("");
      setWardSearch("");
      setWards([]);

      // chọn item tiếp theo
      if (updatedOrders.length > 0) {
        setSelectedItem(updatedOrders[0]);
      } else {
        setSelectedItem(null);
      }

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message ||"Thanh toán thất bại");
    } finally {setPaying(false);}
  };

  const [paymentMethod, setPaymentMethod] = useState("WALLET");
  const [address, setAddress] = useState({ province: "", ward: "", street: "" });

  const insuranceFee = (selectedItem?.totalAmount || 0) * 0.01;
  const shippingFee = (selectedItem?.totalAmount || 0) > 100000000 ? 0 : 250000;
  const total = (selectedItem?.totalAmount || 0) + insuranceFee + shippingFee;

  const isEmpty = !loading && orders.length === 0;

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
                {orders.map((item, index) => (
                  <div key={item.orderId} className="w-10 h-10 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-800">
                    <img src={item.imageUrl} alt="Cart item" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đang chờ</p>
                <p className="text-lg font-black text-white leading-none">{orders.length} Vật phẩm</p>
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

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Đang tải giỏ hàng...</p>
              </div>
            )}

            {isEmpty && (
              <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-slate-900/30 rounded-[2.5rem] border border-white/5">
                <div className="p-6 bg-slate-800/50 rounded-full">
                  <ShoppingBag className="w-16 h-16 text-slate-600" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-white tracking-tighter">Giỏ hàng trống</h2>
                  <p className="text-sm text-slate-500 max-w-xs">Bạn chưa có vật phẩm nào cần thanh toán. Hãy tham gia đấu giá để sở hữu vật phẩm!</p>
                </div>
                <a href="/" className="px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600/30 transition-all">
                  Khám phá đấu giá
                </a>
              </div>
            )}
            
            {orders.map((item, index) => (
              <div 
                key={item.orderId} 
                onClick={() => setSelectedItem(item)}
                className={`group relative cursor-pointer rounded-[2.5rem] p-6 border transition-all duration-500 animate-in fade-in slide-in-from-left-4 ${
                  selectedItem?.orderId === item.orderId 
                  ? 'bg-slate-900/60 border-blue-500/50 shadow-2xl shadow-blue-900/20' 
                  : 'bg-slate-900/30 border-white/5 hover:border-white/20'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Active Indicator */}
                {selectedItem?.orderId === item.orderId && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-12 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                )}

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-full md:w-40 aspect-square rounded-3xl overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                       <span className="text-[8px] font-black text-white uppercase flex items-center gap-1"><ExternalLink className="w-2 h-2" /> Xem chi tiết thầu</span>
                    </div>
                  </div>

                  <div className="flex-grow space-y-3 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.categoryName}</span>
                        <CountdownTimer createdAt={item.createdAt} />
                    </div>
                    <h3 className="text-xl font-black text-white leading-tight">{item.productName}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <div className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-cyan-400" /> {item.sellName}</div>
                    </div>
                  </div>

                  <div className="text-center md:text-right shrink-0">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Giá thắng cuộc</p>
                    <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(item.totalAmount)}</p>
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
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Địa chỉ giao hàng</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Cấu trúc địa chỉ mới sau sáp nhập</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Tỉnh / Thành phố</label>

                  {/* Input */}
                  <div onClick={() => setProvinceOpen(!provinceOpen)} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm cursor-pointer flex items-center justify-between">
                    <input value={provinceSearch} onChange={(e) => { setProvinceSearch(e.target.value); setProvinceOpen(true);}}
                      placeholder="Chọn tỉnh/thành..."
                      className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>

                  {/* Dropdown */}
                  {provinceOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-2xl max-h-60 overflow-y-auto shadow-xl">
                      {filteredProvinces.length > 0 ? (
                        filteredProvinces.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setProvinceSearch(p.name);
                              setProvinceOpen(false);
                              handleProvinceChange({ target: { value: p.id } });
                            }}
                            className="px-6 py-3 hover:bg-blue-500/20 cursor-pointer text-sm"
                          >
                            {p.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-3 text-slate-500 text-sm">
                          Không tìm thấy
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Phường / Xã</label>
                  <div onClick={() => setWardOpen(!wardOpen)} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm cursor-pointer flex items-center justify-between">
                    <input value={wardSearch} onChange={(e) => { setWardSearch(e.target.value); setWardOpen(true);}}
                      placeholder="Chọn phường/xã..."
                      className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>

                  {/* Dropdown */}
                  {wardOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-2xl max-h-60 overflow-y-auto shadow-xl">
                      {filteredWards.length > 0 ? (
                        filteredWards.map((w) => (
                          <div
                            key={w.id}
                            onClick={() => {
                              setWardSearch(w.name);
                              setWardOpen(false);
                              handleWardChange({ target: { value: w.id } });
                            }}
                            className="px-6 py-3 hover:bg-blue-500/20 cursor-pointer text-sm"
                          >
                            {w.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-3 text-slate-500 text-sm">
                          Không tìm thấy
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Số nhà & Tên đường</label>
                  <input type="text" value={address.street} placeholder="Số nhà, ngõ, tên đường..." className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-700" onChange={(e) =>setAddress(prev => ({...prev,street: e.target.value}))} />
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

                {selectedItem ? (
                  <>
                <div className="space-y-5 mb-8">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500">Giá thắng thầu</span>
                    <span className="text-white">{formatCurrency(selectedItem.totalAmount)}</span>
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
                        <button onClick={() => setPaymentMethod('TRANSFER')} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${paymentMethod === 'TRANSFER' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950/40 border-white/5 text-slate-500'}`}>
                            <div className={`p-2 rounded-lg ${paymentMethod === 'TRANSFER' ? 'bg-blue-500 text-white' : 'bg-slate-800'}`}><CardIcon className="w-4 h-4" /></div>
                            <span className="text-xs font-black uppercase italic">Chuyển khoản Ngân hàng</span>
                        </button>
                        <button onClick={() => setPaymentMethod('WALLET')} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${paymentMethod === 'WALLET' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950/40 border-white/5 text-slate-500'}`}>
                            <div className={`p-2 rounded-lg ${paymentMethod === 'WALLET' ? 'bg-blue-500 text-white' : 'bg-slate-800'}`}><Zap className="w-4 h-4" /></div>
                            <span className="text-xs font-black uppercase italic">Ví Điện Tử</span>
                        </button>
                    </div>
                </div>

                {error && (<div className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">{error}</div>)}
                {success && (<div className="mb-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold">{success}</div>)}
                <button onClick={handlePayment} disabled={paying} className={`w-full py-6 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-4 group uppercase tracking-tighter italic ${paying ? "bg-slate-700 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-[1.02]"}`}>
                  {paying ? "ĐANG XỬ LÝ..." : "TIẾN HÀNH THANH TOÁN"} <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                  </>
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <p className="text-slate-500 text-sm">Chọn một vật phẩm để xem chi tiết thanh toán</p>
                  </div>
                )}
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