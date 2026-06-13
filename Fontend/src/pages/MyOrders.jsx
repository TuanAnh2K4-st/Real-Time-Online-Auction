import React, { useState, useEffect } from 'react';
import {
  Package, Truck, CheckCircle2, XCircle, Clock,
  ChevronDown, ChevronUp, MapPin, CreditCard,
  ShoppingBag, RefreshCw, Gavel, ExternalLink,
  BadgeCheck, Calendar, Hash, AlertCircle
} from 'lucide-react';
import { getMyOrders } from '../services/api/orderApi';
import { Link } from 'react-router-dom';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount ?? 0);

const formatDate = (dt) => {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ xử lý',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    dot: 'bg-amber-400',
  },
  SHIPPING: {
    label: 'Đang giao hàng',
    icon: <Truck className="w-4 h-4" />,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    dot: 'bg-blue-400',
  },
  COMPLETED: {
    label: 'Đã hoàn thành',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    dot: 'bg-green-400',
  },
  CANCELLED: {
    label: 'Đã hủy',
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    dot: 'bg-red-400',
  },
};

// ─── Timeline Steps ───────────────────────────────────────────────────────────
const TIMELINE_STEPS = ['PENDING', 'SHIPPING', 'COMPLETED'];

function OrderTimeline({ status }) {
  const currentIdx = TIMELINE_STEPS.indexOf(status);
  const isCancelled = status === 'CANCELLED';

  const stepLabels = {
    PENDING: 'Chờ xử lý',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Hoàn thành',
  };

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
        <span className="text-xs font-bold text-red-400">Đơn hàng đã bị hủy</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 w-full">
      {TIMELINE_STEPS.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;
        const cfg = STATUS_CONFIG[step];

        return (
          <React.Fragment key={step}>
            {/* Step */}
            <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                isDone
                  ? 'bg-green-500 border-green-500 text-white'
                  : isActive
                  ? `${cfg.bg} border-current ${cfg.color} shadow-lg`
                  : 'bg-slate-800 border-slate-700 text-slate-600'
              }`}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : cfg.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider text-center leading-tight ${
                isDone ? 'text-green-400' : isActive ? cfg.color : 'text-slate-600'
              }`}>
                {stepLabels[step]}
              </span>
            </div>

            {/* Connector */}
            {idx < TIMELINE_STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mb-5 mx-1">
                <div className={`h-full rounded-full transition-all ${
                  idx < currentIdx ? 'bg-green-500' : 'bg-slate-700'
                }`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Single Order Card ────────────────────────────────────────────────────────
function OrderCard({ order, index }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.orderStatus] ?? STATUS_CONFIG.PENDING;

  const insuranceFee = (order.totalAmount ?? 0) * 0.01;
  const shippingFee = (order.totalAmount ?? 0) > 100000000 ? 0 : 250000;
  const total = (order.totalAmount ?? 0) + insuranceFee + shippingFee;

  return (
    <div
      className="bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-white/10 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* ── Card Header ── */}
      <div className="p-6 flex flex-col md:flex-row gap-5 items-start md:items-center">
        {/* Thumbnail */}
        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-slate-800 border border-white/10">
          {order.imageUrl ? (
            <img src={order.imageUrl} alt={order.productName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
              {order.categoryName ?? 'Sản phẩm'}
            </span>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-black uppercase ${cfg.color} ${cfg.bg} ${cfg.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${order.orderStatus === 'SHIPPING' ? 'animate-pulse' : ''}`} />
              {cfg.label}
            </div>
          </div>
          <h3 className="text-base font-black text-white leading-tight truncate mb-1">
            {order.productName}
          </h3>
          <div className="flex flex-wrap gap-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3" />#{order.orderId}
            </span>
            <span className="flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 text-cyan-500" />{order.sellName ?? 'Người bán'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />{formatDate(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Amount + expand */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Giá thắng thầu</p>
            <p className="text-lg font-black text-white tracking-tighter">{formatCurrency(order.totalAmount)}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            {expanded ? (
              <><ChevronUp className="w-4 h-4" />Thu gọn</>
            ) : (
              <><ChevronDown className="w-4 h-4" />Chi tiết</>
            )}
          </button>
        </div>
      </div>

      {/* ── Timeline Strip ── */}
      <div className="px-6 pb-4">
        <OrderTimeline status={order.orderStatus} />
      </div>

      {/* ── Expanded Detail ── */}
      {expanded && (
        <div className="border-t border-white/5 bg-slate-950/40 px-6 py-5 animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
          {/* Address */}
          {order.addressDetail && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl shrink-0">
                <MapPin className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Địa chỉ giao hàng</p>
                <p className="text-sm font-bold text-slate-200">{order.addressDetail}</p>
              </div>
            </div>
          )}

          {/* Payment breakdown */}
          <div className="bg-slate-900/60 rounded-2xl p-4 space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Chi tiết thanh toán</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-500">Giá thắng thầu</span>
                <span className="text-white">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-500">Bảo hiểm vật phẩm (1%)</span>
                <span className="text-white">{formatCurrency(insuranceFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-500">Phí vận chuyển</span>
                <span className="text-white">{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
              </div>
              <div className="h-px bg-white/5 my-1" />
              <div className="flex justify-between font-black">
                <span className="text-amber-400 text-xs uppercase tracking-widest">Tổng thanh toán</span>
                <span className="text-white text-lg tracking-tighter">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment info */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Thanh toán: {order.paidAt ? formatDate(order.paidAt) : '—'} · {order.paymentMethod ?? 'Ví điện tử'}
              </span>
            </div>
          </div>

          {/* Link to auction */}
          {order.auctionId && (
            <Link
              to={`/auction/${order.auctionId}`}
              className="inline-flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Xem phiên đấu giá
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tab Filter ───────────────────────────────────────────────────────────────
const TABS = [
  { key: '', label: 'Tất cả', icon: <Package className="w-4 h-4" /> },
  { key: 'SHIPPING', label: 'Đang giao', icon: <Truck className="w-4 h-4" /> },
  { key: 'COMPLETED', label: 'Hoàn thành', icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: 'CANCELLED', label: 'Đã hủy', icon: <XCircle className="w-4 h-4" /> },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyOrders() {
  const [activeTab, setActiveTab] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async (status) => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyOrders(status);
      setOrders(res.data ?? []);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const isEmpty = !loading && orders.length === 0;

  // Stats
  const stats = {
    SHIPPING: orders.filter(o => o.orderStatus === 'SHIPPING').length,
    COMPLETED: orders.filter(o => o.orderStatus === 'COMPLETED').length,
    CANCELLED: orders.filter(o => o.orderStatus === 'CANCELLED').length,
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-24 selection:bg-blue-500/30">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 md:pt-16">

        {/* ── Header ── */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 text-[10px] font-black uppercase tracking-widest mb-3">
            <Package className="w-3 h-3" /> Lịch sử giao dịch
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
            ĐƠN HÀNG <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">CỦA TÔI</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Theo dõi trạng thái và lịch sử tất cả đơn hàng thắng thầu của bạn.
          </p>
        </div>

        {/* ── Stats Bar ── */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8 animate-in fade-in duration-500">
            {[
              { label: 'Đang giao', count: stats.SHIPPING, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', dot: 'animate-pulse bg-blue-400' },
              { label: 'Hoàn thành', count: stats.COMPLETED, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', dot: 'bg-green-400' },
              { label: 'Đã hủy', count: stats.CANCELLED, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', dot: 'bg-red-400' },
            ].map(s => (
              <div key={s.label} className={`flex flex-col items-center gap-1 p-4 rounded-2xl border ${s.bg} ${s.border}`}>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className={`text-2xl font-black ${s.color}`}>{s.count}</span>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab Filter ── */}
        <div className="flex items-center gap-2 flex-wrap mb-8 p-1 bg-white/3 rounded-2xl border border-white/5 backdrop-blur-md">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          <button
            onClick={() => fetchOrders(activeTab)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Đang tải đơn hàng...</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm font-bold text-red-400">{error}</p>
          </div>
        )}

        {/* ── Empty ── */}
        {isEmpty && !error && (
          <div className="flex flex-col items-center justify-center py-24 gap-6 bg-slate-900/30 rounded-[2.5rem] border border-white/5">
            <div className="p-6 bg-slate-800/50 rounded-full">
              <ShoppingBag className="w-16 h-16 text-slate-600" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tighter">Chưa có đơn hàng nào</h2>
              <p className="text-sm text-slate-500 max-w-xs">
                {activeTab
                  ? `Bạn chưa có đơn hàng nào ở trạng thái "${TABS.find(t => t.key === activeTab)?.label}".`
                  : 'Bạn chưa có đơn hàng nào. Hãy tham gia đấu giá để sở hữu vật phẩm!'}
              </p>
            </div>
            <a
              href="/"
              className="px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600/30 transition-all flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" /> Khám phá đấu giá
            </a>
          </div>
        )}

        {/* ── Order List ── */}
        {!loading && !isEmpty && (
          <div className="flex flex-col gap-5">
            {orders.map((order, idx) => (
              <OrderCard key={order.orderId} order={order} index={idx} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
