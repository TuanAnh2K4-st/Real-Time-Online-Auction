import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronRight,
  Info,
  CheckCircle2,
  ShieldCheck,
  Clock,
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
  Power,
  RefreshCw,
  PackageX,
} from 'lucide-react';
import {
  getProductsForAuction,
  createNormalAuction,
  getMyNormalAuctions,
  endAuctionEarlyApi,
} from '../services/api/createNormalAuctionApi';

// ─────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────
const formatVND = (value) => {
  if (value == null || value === '') return '—';
  return Number(value).toLocaleString('vi-VN') + 'đ';
};

const formatDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN');
};

const statusLabel = (s) => {
  switch (s) {
    case 'APPROVED':    return 'Đã duyệt';
    case 'REJECTED':    return 'Từ chối';
    case 'IN_AUCTION':  return 'Đang đấu giá';
    case 'SOLD':        return 'Đã bán';
    case 'SHIPPING':    return 'Đang vận chuyển';
    case 'RECEIVED':    return 'Đã tiếp nhận';
    default:            return 'Chờ xử lý';
  }
};

const statusClass = (s) => {
  switch (s) {
    case 'APPROVED':   return 'bg-green-500/10 text-green-500';
    case 'REJECTED':   return 'bg-red-500/10 text-red-500';
    case 'IN_AUCTION': return 'bg-blue-500/10 text-blue-400';
    case 'SOLD':       return 'bg-slate-500/10 text-slate-400';
    default:           return 'bg-yellow-500/10 text-yellow-500';
  }
};

// ─────────────────────────────────────────
// Shared hooks
// ─────────────────────────────────────────
const useCountdown = (endTimeIso) => {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    if (!endTimeIso) return;
    const tick = () => {
      const diff = new Date(endTimeIso) - Date.now();
      if (diff <= 0) { setRemaining('Đã kết thúc'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTimeIso]);
  return remaining;
};

// ─────────────────────────────────────────
// Pure UI sub-components (defined OUTSIDE main component)
// ─────────────────────────────────────────
const FieldWrapper = ({ label, children }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">{label}</label>
    {children}
  </div>
);

const CountdownCell = ({ endTime }) => {
  const remaining = useCountdown(endTime);
  const ended = remaining === 'Đã kết thúc';
  return (
    <div className={`flex items-center gap-2 ${ended ? 'text-red-400' : 'text-orange-400'}`}>
      <Timer className="w-4 h-4" />
      <span className="text-xs font-black tracking-tighter">{remaining}</span>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 animate-pulse">
    <div className="w-full aspect-square rounded-3xl bg-slate-800 mb-6" />
    <div className="h-5 bg-slate-800 rounded mb-3 w-3/4" />
    <div className="h-3 bg-slate-800 rounded w-1/2" />
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-900/20 border border-dashed border-white/10 rounded-[3rem] gap-4">
    <Icon className="w-12 h-12 text-slate-700" />
    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs text-center px-4">{message}</p>
  </div>
);

const Toast = ({ toast }) => {
  if (!toast) return null;
  const colors = { success: 'bg-green-600 shadow-green-600/20', error: 'bg-red-600 shadow-red-600/20', info: 'bg-blue-600 shadow-blue-600/20' };
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl text-white font-black text-sm shadow-2xl ${colors[toast.type] || colors.info}`}>
      {toast.message}
    </div>
  );
};

// ─────────────────────────────────────────
// Dashboard (defined OUTSIDE — no remount on state change)
// ─────────────────────────────────────────
const Dashboard = ({
  activeTab, setActiveTab,
  productList, activeAuctions,
  loadingProducts, loadingAuctions,
  fetchProducts, fetchMyAuctions,
  setView, setSelectedProduct,
  showConfirmClose, setShowConfirmClose,
  handleEndAuctionEarly,
  endingAuctionId,
}) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    {/* Header */}
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

    {/* Tabs */}
    <div className="flex gap-4 border-b border-white/5 pb-4">
      {[{ id: 'tracking', label: 'Hồ sơ ký gửi', icon: History }, { id: 'active', label: 'Đang diễn ra', icon: TrendingUp }].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === tab.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <tab.icon className="w-4 h-4" /> {tab.label}
        </button>
      ))}
      <button
        onClick={() => { fetchProducts(); fetchMyAuctions(); }}
        className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-all"
        title="Làm mới dữ liệu"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>

    {/* Content */}
    <div className="grid grid-cols-1 gap-4">
      {activeTab === 'tracking' ? (
        loadingProducts ? (
          <div className="col-span-full py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : productList.length === 0 ? (
          <EmptyState icon={PackageX} message="Bạn chưa có hồ sơ ký gửi nào" />
        ) : (
          productList.map((item) => (
            <div key={item.productId} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-900/80 transition-all group">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border border-white/10 shrink-0 bg-slate-800">
                  {item.imageUrl
                    ? <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.productName} />
                    : <div className="w-full h-full flex items-center justify-center text-slate-600"><PackageX className="w-8 h-8" /></div>
                  }
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${statusClass(item.itemStatus)}`}>
                      {statusLabel(item.itemStatus)}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">#{item.productId}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{item.productName}</h3>
                  <p className="text-slate-500 text-[10px] uppercase font-black flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {item.createdAt ? formatDateTime(item.createdAt) : '—'}
                  </p>
                </div>
              </div>
              {item.itemStatus === 'APPROVED' && (
                <button
                  onClick={() => { setSelectedProduct(item); setView('create-auction'); }}
                  className="bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 border border-white/5 shrink-0"
                >
                  Mở đấu giá <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingAuctions ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : activeAuctions.length > 0 ? (
            activeAuctions.map((auction) => (
              <div key={auction.auctionId} className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-6 hover:bg-slate-900/60 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/5 shrink-0 bg-slate-800">
                    {auction.imageUrl
                      ? <img src={auction.imageUrl} className="w-full h-full object-cover" alt={auction.productName} />
                      : <div className="w-full h-full flex items-center justify-center text-slate-600"><Gavel className="w-8 h-8" /></div>
                    }
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">#{auction.auctionId}</span>
                      <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{auction.productName}</h3>
                    </div>
                    <div className="flex gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase">Giá hiện tại</p>
                        <p className="text-blue-400 font-black text-sm">{formatVND(auction.currentPrice ?? auction.startPrice)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase">Trạng thái</p>
                        <p className="text-white font-black text-sm flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-slate-500" /> {auction.auctionStatus || 'ACTIVE'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                  <CountdownCell endTime={auction.endTime} />
                  <button
                    onClick={() => setShowConfirmClose(auction)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <Power className="w-3.5 h-3.5" /> Kết thúc ngay
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon={Gavel} message="Chưa có phiên đấu giá nào đang diễn ra" />
          )}
        </div>
      )}
    </div>

    {/* Confirm close modal */}
    {showConfirmClose && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowConfirmClose(null)} />
        <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full relative z-10 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-white italic uppercase mb-2 tracking-tight">Xác nhận kết thúc?</h3>
          <p className="text-slate-400 text-sm mb-8">
            Bạn đang yêu cầu kết thúc phiên đấu giá <span className="text-white font-bold">{showConfirmClose.productName}</span> trước thời hạn.
            Người đang dẫn đầu sẽ được tính là người chiến thắng.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowConfirmClose(null)}
              disabled={endingAuctionId === showConfirmClose.auctionId}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-40"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => handleEndAuctionEarly(showConfirmClose.auctionId)}
              disabled={endingAuctionId === showConfirmClose.auctionId}
              className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-red-600/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {endingAuctionId === showConfirmClose.auctionId
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang xử lý...</>
                : 'Xác nhận đóng'
              }
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────
// CreateAuctionPage (defined OUTSIDE — inputs giữ focus ổn định)
// ─────────────────────────────────────────
const CreateAuctionPage = ({
  setView,
  selectedProduct, setSelectedProduct,
  acceptedProducts,
  loadingProducts, fetchProducts,
  auctionForm, setAuctionForm,
  isSubmitting, handleCreateAuction,
}) => (
  <div className="space-y-12 pb-20">
    {/* Header */}
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

    {/* Bước 1: Chọn sản phẩm */}
    {!selectedProduct ? (
      <div className="space-y-8">
        <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bước 1: Chọn sản phẩm đấu giá</h3>
            <p className="text-slate-400 text-sm">
              Chỉ những sản phẩm đã qua kiểm định (trạng thái <span className="text-green-400 font-bold">Đã duyệt</span>) mới có thể tham gia đấu giá.
            </p>
          </div>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : acceptedProducts.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center bg-slate-900/20 border border-dashed border-white/10 rounded-[3rem] gap-4">
            <ShieldCheck className="w-12 h-12 text-slate-700" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs text-center px-4">
              Không có sản phẩm nào đã được duyệt để tạo đấu giá
            </p>
            <button
              onClick={fetchProducts}
              className="mt-2 flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Tải lại
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedProducts.map((product) => (
              <div
                key={product.productId}
                className="group bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 hover:border-blue-500/30 transition-all cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square rounded-3xl overflow-hidden mb-6 border border-white/5 relative bg-slate-800">
                  {product.imageUrl
                    ? <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.productName} />
                    : <div className="w-full h-full flex items-center justify-center text-slate-600"><PackageX className="w-12 h-12" /></div>
                  }
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-xl shadow-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{product.productName}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase flex items-center gap-2">
                  <Clock className="w-3 h-3 text-blue-500" />
                  {product.createdAt ? formatDateTime(product.createdAt) : '—'}
                </p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 inline-flex items-center gap-2 transition-transform">
                    Chọn sản phẩm này <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : (
      /* Bước 2: Thiết lập form */
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cột trái */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-8">
            <div className="aspect-square rounded-[3rem] overflow-hidden border-4 border-slate-900 shadow-2xl relative bg-slate-800">
              {selectedProduct.imageUrl
                ? <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt="Focus" />
                : <div className="w-full h-full flex items-center justify-center text-slate-600"><PackageX className="w-16 h-16" /></div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 uppercase tracking-widest">
                  #{selectedProduct.productId}
                </span>
                <h3 className="text-2xl font-black text-white mt-2 leading-tight uppercase italic">{selectedProduct.productName}</h3>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Trạng thái</p>
                <p className="text-xs font-bold text-green-400 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Đã kiểm định</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ngày ký gửi</p>
                <p className="text-xs font-bold text-slate-300">
                  {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString('vi-VN') : '—'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Đổi sản phẩm
            </button>
          </div>
        </div>

        {/* Cột phải: Form */}
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
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-blue-500 font-bold text-lg transition-all text-white"
                  placeholder="Ví dụ: 10000000"
                  value={auctionForm.startPrice}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setAuctionForm((prev) => ({ ...prev, startPrice: raw }));
                  }}
                />
              </div>
            </FieldWrapper>

            <FieldWrapper label="Bước giá nhảy (VNĐ)">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-purple-500/10 rounded-xl group-focus-within:bg-purple-600 transition-all">
                  <Zap className="w-4 h-4 text-purple-500 group-focus-within:text-white" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-purple-500 font-bold text-lg transition-all text-white"
                  placeholder="Ví dụ: 500000"
                  value={auctionForm.bidStep}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setAuctionForm((prev) => ({ ...prev, bidStep: raw }));
                  }}
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
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-emerald-500 font-bold transition-all text-white"
                  value={auctionForm.endDate}
                  onChange={(e) => setAuctionForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </FieldWrapper>

            <FieldWrapper label="Giờ kết thúc">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-orange-500/10 rounded-xl group-focus-within:bg-orange-600 transition-all">
                  <Clock className="w-4 h-4 text-orange-500 group-focus-within:text-white" />
                </div>
                <input
                  type="time"
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-orange-500 font-bold transition-all text-white"
                  value={auctionForm.endTime}
                  onChange={(e) => setAuctionForm((prev) => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </FieldWrapper>
          </div>

          {/* Preview giá */}
          {auctionForm.startPrice && (
            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[2rem] flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Giá khởi điểm</p>
                <p className="text-2xl font-black text-blue-400">{formatVND(auctionForm.startPrice)}</p>
              </div>
              {auctionForm.bidStep && (
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Bước giá</p>
                  <p className="text-xl font-black text-purple-400">+{formatVND(auctionForm.bidStep)}</p>
                </div>
              )}
            </div>
          )}

          {/* Lưu ý */}
          <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem] space-y-4">
            <h4 className="flex items-center gap-2 text-blue-400 font-black uppercase text-[11px] tracking-widest">
              <Info className="w-4 h-4" /> Lưu ý đấu giá phổ thông
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-400 font-medium italic">
              {['Phiên đấu giá sẽ tự động công khai sau khi xác nhận.', 'Phí nền tảng 5% sẽ khấu trừ khi giao dịch thành công.', 'Thời gian kết thúc phải ở tương lai.', 'Bước giá phải là số dương nguyên.'].map((note, i) => (
                <li key={i} className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shrink-0" /> {note}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleCreateAuction}
            disabled={isSubmitting}
            className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting
              ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              : <><Gavel className="w-5 h-5" /> Kích hoạt phiên đấu giá</>
            }
          </button>
        </div>
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────
// Main Controller Component
// ─────────────────────────────────────────
const CreateNormalAuction = () => {
  const [view, setView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('tracking');

  const [productList, setProductList] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingAuctions, setLoadingAuctions] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [auctionForm, setAuctionForm] = useState({ startPrice: '', bidStep: '', endDate: '', endTime: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showConfirmClose, setShowConfirmClose] = useState(null);
  const [endingAuctionId, setEndingAuctionId] = useState(null); // ID đang xử lý kết thúc
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await getProductsForAuction();
      setProductList(res?.data ?? []);
    } catch (err) {
      showToast(err?.message || 'Không thể tải danh sách sản phẩm', 'error');
      setProductList([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [showToast]);

  const fetchMyAuctions = useCallback(async () => {
    setLoadingAuctions(true);
    try {
      const res = await getMyNormalAuctions();
      setActiveAuctions(res?.data ?? []);
    } catch (err) {
      showToast(err?.message || 'Không thể tải danh sách phiên đấu giá', 'error');
      setActiveAuctions([]);
    } finally {
      setLoadingAuctions(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProducts();
    fetchMyAuctions();
  }, [fetchProducts, fetchMyAuctions]);

  const acceptedProducts = useMemo(
    () => productList.filter((p) => p.itemStatus === 'APPROVED'),
    [productList]
  );

  const handleCreateAuction = async () => {
    if (!selectedProduct) return;
    if (!auctionForm.startPrice || Number(auctionForm.startPrice) <= 0) {
      showToast('Vui lòng nhập giá khởi điểm hợp lệ', 'error'); return;
    }
    if (!auctionForm.bidStep || Number(auctionForm.bidStep) <= 0) {
      showToast('Vui lòng nhập bước giá hợp lệ', 'error'); return;
    }
    if (!auctionForm.endDate || !auctionForm.endTime) {
      showToast('Vui lòng chọn ngày và giờ kết thúc', 'error'); return;
    }
    const endTimeISO = `${auctionForm.endDate}T${auctionForm.endTime}:00`;
    if (new Date(endTimeISO) <= new Date()) {
      showToast('Thời gian kết thúc phải ở tương lai', 'error'); return;
    }

    setIsSubmitting(true);
    try {
      await createNormalAuction({
        productId: selectedProduct.productId,
        startPrice: Number(auctionForm.startPrice),
        stepPrice: Number(auctionForm.bidStep),
        endTime: endTimeISO,
      });
      showToast('Tạo phiên đấu giá thành công!', 'success');
      setSelectedProduct(null);
      setAuctionForm({ startPrice: '', bidStep: '', endDate: '', endTime: '' });
      setView('dashboard');
      setActiveTab('active');
      await Promise.all([fetchProducts(), fetchMyAuctions()]);
    } catch (err) {
      showToast(err?.message || 'Tạo phiên đấu giá thất bại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndAuctionEarly = async (auctionId) => {
    setEndingAuctionId(auctionId);
    try {
      await endAuctionEarlyApi(auctionId);
      showToast('Đã kết thúc phiên đấu giá thành công!', 'success');
      setShowConfirmClose(null);
      // Refresh cả 2 danh sách
      await Promise.all([fetchProducts(), fetchMyAuctions()]);
    } catch (err) {
      showToast(err?.message || 'Không thể kết thúc phiên đấu giá', 'error');
    } finally {
      setEndingAuctionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-10 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[5%] right-[5%] w-[35%] h-[35%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {view === 'dashboard' ? (
          <Dashboard
            activeTab={activeTab} setActiveTab={setActiveTab}
            productList={productList} activeAuctions={activeAuctions}
            loadingProducts={loadingProducts} loadingAuctions={loadingAuctions}
            fetchProducts={fetchProducts} fetchMyAuctions={fetchMyAuctions}
            setView={setView} setSelectedProduct={setSelectedProduct}
            showConfirmClose={showConfirmClose} setShowConfirmClose={setShowConfirmClose}
            handleEndAuctionEarly={handleEndAuctionEarly}
            endingAuctionId={endingAuctionId}
          />
        ) : (
          <CreateAuctionPage
            setView={setView}
            selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}
            acceptedProducts={acceptedProducts}
            loadingProducts={loadingProducts} fetchProducts={fetchProducts}
            auctionForm={auctionForm} setAuctionForm={setAuctionForm}
            isSubmitting={isSubmitting} handleCreateAuction={handleCreateAuction}
          />
        )}
      </div>

      <Toast toast={toast} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default CreateNormalAuction;