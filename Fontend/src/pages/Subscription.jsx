import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ShieldCheck, Zap, Star, 
  Clock, Calendar, Rocket, Crown,
  Info, AlertCircle, PlayCircle, X, CreditCard
} from 'lucide-react';
import { getAllSubscriptionPlans, getCurrentSubscription, subscribePlan } from "../services/api/subscriptionApi";

const formatCurrency = (amount) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function Subscription() {
  const [currentSub, setCurrentSub] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      // ===== GET PLANS =====

      const plansRes = await getAllSubscriptionPlans();

      const enrichedPlans = plansRes.data.map((plan) => {

        // ===== GÓI BASIC =====
        if (plan.maxLiveRooms <= 5) {
          return {
            ...plan,
            isPopular: false,
            description: "Phù hợp cho người mới bắt đầu kinh doanh đấu giá livestream.",
            features: [
              "Đăng không giới hạn sản phẩm",
              "Hỗ trợ đấu giá realtime",
              "Chat trực tiếp với người mua",
              "Ưu tiên hiển thị sản phẩm",
              "Hỗ trợ khách hàng cơ bản"
            ]
          };
        }

        // ===== GÓI PREMIUM =====
        return {
          ...plan,
          isPopular: true,
          description: "Dành cho seller chuyên nghiệp với khả năng mở rộng mạnh mẽ.",
          features: [
            "Tạo nhiều phiên đấu giá cùng lúc",
            "Ưu tiên hiển thị toàn hệ thống",
            "Hỗ trợ livestream tốc độ cao",
            "Phân tích thống kê kinh doanh",
            "Hỗ trợ khách hàng ưu tiên 24/7",
            "Badge Seller Premium"
          ]
        };
      });

      setPlans(enrichedPlans);

      // ===== GET CURRENT SUB =====

      const subRes = await getCurrentSubscription();

      setCurrentSub(subRes.data);

    } catch (error) {

      console.log(error);

    }
  };

  const handleUpgradeClick = (plan) => {
    setSelectedPlan(plan);
    setShowConfirmModal(true);
  };

  const handlePayment = async () => {

    try {
      setIsProcessing(true);
      console.log(selectedPlan);
      const response = await subscribePlan(selectedPlan.id);
      setCurrentSub(response.data);
      setShowConfirmModal(false);
      setShowSuccessMessage(true);

    } catch (error) {

        console.log("FULL ERROR:", error);

        console.log("STATUS:", error?.response?.status);

        console.log("DATA:", error?.response?.data);

        alert(
          JSON.stringify(error?.response?.data) ||
          "Đăng ký gói thất bại"
        );
      } finally {
      setIsProcessing(false);
    }
  };

  // Tính toán % thời gian còn lại (nếu có sub)
  const getProgress = () => {
    if (!currentSub || !currentSub.endDate) {
      return {
        days: 0,
        percent: 0
      };
    }

    const daysRemaining = Math.ceil(
      (new Date(currentSub.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return {
      days: daysRemaining,
      percent: Math.max(
        0,
        Math.min(100, (daysRemaining / (currentSub.durationDays || 30)) * 100)
      )
    };
  };

  const subInfo = getProgress();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30 pb-20">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-32 space-y-20">
        
        {/* Header Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Dịch vụ hội viên cao cấp</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
            Mở khóa sức mạnh <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 italic">Kinh doanh Đấu giá</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Loại bỏ mọi giới hạn. Nâng cấp tài khoản của bạn để tiếp cận hàng triệu nhà sưu tầm và vận hành nhiều phiên live cùng lúc.
          </p>
        </section>

        {/* Current Status Section */}
        {currentSub && currentSub.status === "ACTIVE" && (
          <section className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 rounded-[3rem] blur-3xl"></div>
            <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/50">
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Gói đang kích hoạt</h2>
                      <h3 className="text-3xl font-black text-white uppercase italic">{currentSub.planName}</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Ngày hết hạn</p>
                      <p className="text-sm font-black text-white">{new Date(currentSub.endDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Thời gian còn lại</p>
                      <p className="text-sm font-black text-white">{subInfo.days} ngày</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Phòng Live</p>
                      <p className="text-sm font-black text-white">Tối đa {currentSub.maxLiveRooms}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Tiến trình sử dụng</span>
                      <span className="text-blue-400">{Math.round(subInfo.percent)}% còn lại</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${subInfo.percent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Plans Selection */}
        <section className="space-y-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Bảng giá dịch vụ</h2>
            <p className="text-slate-500 font-medium">Chọn lộ trình phát triển phù hợp với quy mô kinh doanh của bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {plans.map(plan => (
              <div key={plan.id} className={`relative group flex flex-col bg-slate-900/40 rounded-[3rem] border transition-all duration-500 ${
                plan.isPopular ? 'border-blue-500/50 bg-slate-900/80 shadow-2xl shadow-blue-900/20' : 'border-white/5 hover:border-white/20'
              }`}>
                {plan.isPopular && (
                  <div className="absolute top-8 right-8 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Đề xuất
                  </div>
                )}
                
                <div className="p-10 space-y-8 flex-grow">
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      plan.isPopular ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-400'
                    }`}>
                      {plan.maxLiveRooms > 10 ? <Crown size={32} /> : <Rocket size={32} />}
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic">{plan.name}</h3>
                    <p className="text-slate-500 text-sm">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter">{formatCurrency(plan.price)}</span>
                    <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">/ {plan.durationDays} ngày</span>
                  </div>

                  <ul className="space-y-4 pt-8 border-t border-white/5">
                    {(plan.features || []).map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> {f}
                      </li>
                    ))}
                    <li className="flex items-center gap-3 text-cyan-400 font-bold">
                        <PlayCircle className="w-5 h-5 shrink-0" /> Tối đa {plan.maxLiveRooms} phòng Live cùng lúc
                    </li>
                  </ul>
                </div>

                <div className="p-10 pt-0">
                  <button 
                    onClick={() => handleUpgradeClick(plan)}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                      currentSub?.planId === plan.id
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-1'
                    }`}
                  >
                    {currentSub?.planId === plan.id ? 'Đang sử dụng' : 'Nâng cấp ngay'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/60 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic">Xác nhận nâng cấp</h3>
                <p className="text-slate-500 text-sm">Vui lòng kiểm tra lại thông tin đơn hàng trước khi thanh toán.</p>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 space-y-4 border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Gói dịch vụ</span>
                  <span className="text-white font-black">{selectedPlan?.planName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Thời hạn</span>
                  <span className="text-white font-black">{selectedPlan?.durationDays} ngày</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-blue-400 text-sm font-black uppercase tracking-widest">Tổng thanh toán</span>
                  <span className="text-2xl font-black text-white">{formatCurrency(selectedPlan?.price)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    'Thanh toán ngay'
                  )}
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isProcessing}
                  className="w-full py-5 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
                >
                  Hủy giao dịch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessMessage && (
        <div className="fixed bottom-10 right-10 z-[110] animate-in slide-in-from-right-10 duration-500">
            <div className="bg-emerald-500 text-white px-8 py-6 rounded-3xl shadow-2xl flex items-center gap-6 border border-emerald-400/50">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle2 size={28} />
                </div>
                <div className="space-y-1">
                    <h4 className="font-black text-lg uppercase italic leading-none">Nâng cấp thành công!</h4>
                    <p className="text-emerald-100 text-xs font-medium">Gói dịch vụ của bạn đã được kích hoạt.</p>
                </div>
                <button 
                    onClick={() => setShowSuccessMessage(false)}
                    className="ml-4 p-2 hover:bg-white/10 rounded-lg"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
}