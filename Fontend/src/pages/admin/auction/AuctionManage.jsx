import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, X, Plus, Calendar, DollarSign,
  TrendingUp, Clock, CheckCircle2, AlertTriangle, Edit3, Trash2, 
  ChevronRight, Sparkles, Filter, RefreshCw, Layers, ArrowUpRight, 
  Check, Play, Ban, Info, Package,
  FileText, Activity, Hash, Shield, 
  AlertCircle, Loader2
} from 'lucide-react';
import {
  adminFilterAuctionsApi,
  adminGetProductsReadyApi,
  adminCreateNormalAuctionApi,
  adminUpdateAuctionStatusApi,
  adminDeleteAuctionApi,
  adminGetAuctionStatsApi,
} from '../../../services/api/adminAuctionApi';

// ─── Toast Notification ─────────────────────────────────────────────────────
function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold pointer-events-auto animate-in slide-in-from-right-4 duration-300
            ${t.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : ''}
            ${t.type === 'error' ? 'bg-red-600 border-red-500 text-white' : ''}
            ${t.type === 'info' ? 'bg-blue-600 border-blue-500 text-white' : ''}
          `}
        >
          {t.type === 'success' && <CheckCircle2 size={14} />}
          {t.type === 'error' && <AlertCircle size={14} />}
          {t.type === 'info' && <Info size={14} />}
          <span>{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="ml-auto opacity-70 hover:opacity-100">
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── AuctionStatusBadge ─────────────────────────────────────────────────────
function AuctionStatusBadge({ status }) {
  const configs = {
    ACTIVE: { bg: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30', text: 'ĐANG LIVE' },
    SCHEDULED: { bg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20', text: 'Đã lên lịch' },
    PENDING: { bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', text: 'Chờ duyệt' },
    ENDED: { bg: 'bg-slate-500/10 text-slate-400 border border-slate-500/20', text: 'Đã kết thúc' },
    CANCELLED: { bg: 'bg-red-500/10 text-red-500 border border-red-500/20', text: 'Đã hủy' },
  };
  const config = configs[status] || { bg: 'bg-slate-500/10 text-slate-500 border-slate-500/10', text: status };
  return (
    <span className={`px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider ${config.bg}`}>
      {config.text}
    </span>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function AuctionManage() {
  // ── State: Data ───────────────────────────────────────────────────────────
  const [auctions, setAuctions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, ended: 0, cancelled: 0 });
  const [availableProducts, setAvailableProducts] = useState([]);

  // ── State: UI ─────────────────────────────────────────────────────────────
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [detailTab, setDetailTab] = useState('INFO');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── State: Filters ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  // ── State: Modal ──────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('CREATE');

  // ── State: Form ──────────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formStartPrice, setFormStartPrice] = useState('');
  const [formStepPrice, setFormStepPrice] = useState('');
  const [formEndTime, setFormEndTime] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // ── State: Toasts ─────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // ── Fetch auctions ────────────────────────────────────────────────────────
  const fetchAuctions = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const res = await adminFilterAuctionsApi({
        keyword: searchQuery || null,
        auctionStatus: filterStatus === 'ALL' ? null : filterStatus,
        auctionType: filterType === 'ALL' ? null : filterType,
        sortBy: 'newest',
      }, page);
      const data = res?.data;
      setAuctions(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
      setCurrentPage(data?.pageNumber || 0);
    } catch (err) {
      addToast(err?.message || 'Không thể tải danh sách phiên đấu giá', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterStatus, filterType, addToast]);

  // ── Fetch stats ───────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await adminGetAuctionStatsApi();
      setStats(res?.data || { total: 0, active: 0, ended: 0, cancelled: 0 });
    } catch {
      // silent
    }
  }, []);

  // ── Fetch products ready ──────────────────────────────────────────────────
  const fetchProductsReady = useCallback(async () => {
    try {
      const res = await adminGetProductsReadyApi();
      setAvailableProducts(res?.data || []);
    } catch {
      setAvailableProducts([]);
    }
  }, []);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => { fetchAuctions(0); }, [fetchAuctions]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatVND = (value) => {
    if (value === undefined || value === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // ── Open Create Modal ─────────────────────────────────────────────────────
  const handleOpenCreate = async () => {
    setModalType('CREATE');
    setSelectedProduct(null);
    setProductSearchQuery('');
    setFormStartPrice('');
    setFormStepPrice('');
    const future = new Date();
    future.setDate(future.getDate() + 5);
    setFormEndTime(future.toISOString().slice(0, 16));
    await fetchProductsReady();
    setIsModalOpen(true);
  };

  // ── Select product in form ────────────────────────────────────────────────
  const handleSelectProductInForm = (prod) => {
    setSelectedProduct(prod);
    if (prod.basePrice) {
      setFormStartPrice(prod.basePrice.toString());
      setFormStepPrice(Math.round(prod.basePrice * 0.02).toString());
    }
  };

  // ── Submit Form ───────────────────────────────────────────────────────────
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      addToast('Vui lòng chọn một sản phẩm!', 'error');
      return;
    }
    const startP = parseFloat(formStartPrice);
    const stepP = parseFloat(formStepPrice);
    if (isNaN(startP) || startP <= 0) {
      addToast('Giá khởi điểm phải lớn hơn 0', 'error');
      return;
    }
    if (isNaN(stepP) || stepP <= 0) {
      addToast('Bước nhảy phải lớn hơn 0', 'error');
      return;
    }
    if (!formEndTime) {
      addToast('Vui lòng chọn thời gian kết thúc', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminCreateNormalAuctionApi({
        productId: selectedProduct.productId,
        startPrice: startP,
        stepPrice: stepP,
        endTime: new Date(formEndTime).toISOString().replace('Z', ''),
      });
      addToast('Tạo phiên đấu giá thành công!', 'success');
      setIsModalOpen(false);
      fetchAuctions(0);
      fetchStats();
    } catch (err) {
      addToast(err?.message || 'Tạo phiên đấu giá thất bại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Update Status ─────────────────────────────────────────────────────────
  const handleUpdateStatus = async (auctionId, newStatus) => {
    try {
      await adminUpdateAuctionStatusApi(auctionId, newStatus);
      addToast(`Cập nhật trạng thái → ${newStatus} thành công`, 'success');
      // Update local state immediately
      setAuctions(prev => prev.map(a =>
        a.auctionId === auctionId ? { ...a, auctionStatus: newStatus } : a
      ));
      if (selectedAuction?.auctionId === auctionId) {
        setSelectedAuction(prev => ({ ...prev, auctionStatus: newStatus }));
      }
      fetchStats();
    } catch (err) {
      addToast(err?.message || 'Cập nhật trạng thái thất bại', 'error');
    }
  };

  // ── Delete Auction ────────────────────────────────────────────────────────
  const handleDeleteAuction = async (auctionId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phiên đấu giá này?')) return;
    try {
      await adminDeleteAuctionApi(auctionId);
      addToast('Xóa phiên đấu giá thành công', 'success');
      setAuctions(prev => prev.filter(a => a.auctionId !== auctionId));
      if (selectedAuction?.auctionId === auctionId) setSelectedAuction(null);
      fetchStats();
    } catch (err) {
      addToast(err?.message || 'Xóa phiên đấu giá thất bại', 'error');
    }
  };

  // ── Filter products in form ───────────────────────────────────────────────
  const searchedProducts = useMemo(() => {
    if (!productSearchQuery.trim()) return availableProducts;
    const q = productSearchQuery.toLowerCase();
    return availableProducts.filter(p =>
      p.productName?.toLowerCase().includes(q) ||
      p.productId?.toString().includes(q)
    );
  }, [availableProducts, productSearchQuery]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="font-sans">
      <Toast toasts={toasts} onRemove={removeToast} />

      <main className="max-w-[1600px] mx-auto p-6 space-y-8">

        {/* ── DASHBOARD STATS ─────────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Tổng phiên đấu giá', value: `${stats.total || totalElements} phiên`, icon: Layers, color: 'blue' },
            { label: 'Đang hoạt động', value: `${stats.active ?? 0} Live`, icon: Play, color: 'emerald', pulse: true },
            { label: 'Đã kết thúc', value: `${stats.ended ?? 0} phiên`, icon: CheckCircle2, color: 'indigo' },
            { label: 'Đã hủy', value: `${stats.cancelled ?? 0} phiên`, icon: Ban, color: 'red' },
          ].map(({ label, value, icon: Icon, color, pulse }) => (
            <div key={label} className="p-5 rounded-3xl border bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-1">{label}</span>
                  <span className={`text-2xl font-black italic tracking-tight text-${color}-500`}>{value}</span>
                </div>
                <div className={`p-3 bg-${color}-500/10 text-${color}-500 rounded-2xl ${pulse ? 'animate-pulse' : ''}`}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ── TOOLBAR ──────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-6 p-6 rounded-3xl border bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight">Hệ thống quản lý đấu giá</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Giám sát và điều phối toàn bộ phiên đấu giá trong hệ thống</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm tên sản phẩm, tên người bán..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchAuctions(0)}
                  className="w-full border rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:border-blue-500 transition-all bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>
              {/* Refresh */}
              <button
                onClick={() => fetchAuctions(0)}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 border rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5 hover:border-blue-500 text-slate-500 dark:text-slate-300 disabled:opacity-50"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              </button>
              {/* Create Button */}
              <button
                onClick={handleOpenCreate}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 active:scale-95 whitespace-nowrap"
              >
                <Plus size={14} /> Tạo đấu giá mới
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-start gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Filter size={12} /> Trạng thái:
              </span>
              {['ALL', 'ACTIVE', 'ENDED', 'CANCELLED', 'PENDING', 'SCHEDULED'].map(code => (
                <button
                  key={code}
                  onClick={() => { setFilterStatus(code); setCurrentPage(0); }}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${
                    filterStatus === code
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5 text-slate-500'
                  }`}
                >
                  {code === 'ALL' ? 'Tất cả' : code === 'ACTIVE' ? 'Đang live' : code === 'ENDED' ? 'Kết thúc' : code === 'CANCELLED' ? 'Đã hủy' : code === 'PENDING' ? 'Chờ duyệt' : 'Đã lên lịch'}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Shield size={12} /> Loại:
              </span>
              {['ALL', 'NORMAL', 'LIVE'].map(code => (
                <button
                  key={code}
                  onClick={() => { setFilterType(code); setCurrentPage(0); }}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${
                    filterType === code
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5 text-slate-500'
                  }`}
                >
                  {code === 'ALL' ? 'Tất cả' : code === 'NORMAL' ? 'Thường' : 'Trực tiếp'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN WORKSPACE ────────────────────────────────────────────── */}
        <section className="flex flex-col xl:flex-row gap-6">

          {/* ── AUCTION TABLE ───────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="rounded-3xl border bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5 overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                  <p className="text-xs font-black uppercase tracking-widest">Đang tải dữ liệu...</p>
                </div>
              ) : auctions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
                  <AlertTriangle size={36} className="opacity-30 text-amber-500" />
                  <p className="text-xs font-black uppercase tracking-widest italic">Không tìm thấy phiên đấu giá nào</p>
                  <p className="text-[10px] text-slate-500">Thử thay đổi bộ lọc hoặc tạo phiên đấu giá mới</p>
                  <button onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); setFilterType('ALL'); }}
                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/5">
                          <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm & Người bán</th>
                          <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Giá sàn / Hiện tại</th>
                          <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Loại</th>
                          <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                          <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Thời gian kết thúc</th>
                          <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {auctions.map((auc) => (
                          <tr
                            key={auc.auctionId}
                            onClick={() => { setSelectedAuction(auc); setDetailTab('INFO'); }}
                            className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedAuction?.auctionId === auc.auctionId ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={auc.imageUrl}
                                  alt=""
                                  className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-white/10 flex-shrink-0"
                                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100"; }}
                                />
                                <div className="max-w-[200px]">
                                  <p className="text-xs font-black dark:text-white truncate" title={auc.productName}>{auc.productName}</p>
                                  <p className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                                    <span>#{auc.productId}</span>
                                    <span className="opacity-40">•</span>
                                    <span className="text-blue-500">@{auc.sellerUsername}</span>
                                  </p>
                                  {auc.totalBids > 0 && (
                                    <span className="text-[8px] text-emerald-500 font-bold">{auc.totalBids} lượt thầu</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 font-mono">
                              <div className="text-xs font-bold dark:text-white">{formatVND(auc.currentPrice)}</div>
                              <div className="text-[9px] text-slate-400 mt-0.5">Sàn: {formatVND(auc.startPrice)}</div>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${auc.auctionType === 'LIVE' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-400'}`}>
                                {auc.auctionType === 'LIVE' ? 'Trực tiếp' : 'Thường'}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <AuctionStatusBadge status={auc.auctionStatus} />
                            </td>

                            <td className="px-5 py-4 text-center">
                              <div className="text-[10px] text-slate-500 font-mono">
                                {new Date(auc.endTime).toLocaleDateString('vi-VN')}
                              </div>
                              <div className="text-[9px] text-slate-400">
                                {new Date(auc.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleDeleteAuction(auc.auctionId)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Xóa phiên đấu giá"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <button
                                  onClick={() => { setSelectedAuction(auc); setDetailTab('INFO'); }}
                                  className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                                  title="Xem chi tiết"
                                >
                                  <ChevronRight size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Trang {currentPage + 1} / {totalPages} • {totalElements} phiên
                      </span>
                      <div className="flex gap-2">
                        <button
                          disabled={currentPage === 0}
                          onClick={() => { const p = currentPage - 1; setCurrentPage(p); fetchAuctions(p); }}
                          className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border border-slate-200 dark:border-white/5 disabled:opacity-40 hover:border-blue-500 transition-all"
                        >
                          ← Trước
                        </button>
                        <button
                          disabled={currentPage >= totalPages - 1}
                          onClick={() => { const p = currentPage + 1; setCurrentPage(p); fetchAuctions(p); }}
                          className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border border-slate-200 dark:border-white/5 disabled:opacity-40 hover:border-blue-500 transition-all"
                        >
                          Tiếp →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── DETAIL PANEL ────────────────────────────────────────────── */}
          {selectedAuction && (
            <div className="w-full xl:w-[420px] flex-shrink-0 animate-in slide-in-from-right-4 duration-300">
              <div className="border rounded-3xl p-6 shadow-xl bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5 sticky top-24">
                <button
                  onClick={() => setSelectedAuction(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-500/5"
                >
                  <X size={16} />
                </button>

                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={selectedAuction.imageUrl}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-white/10 flex-shrink-0"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase bg-blue-500/10 text-blue-500 tracking-wider">
                      {selectedAuction.categoryName}
                    </span>
                    <h3 className="text-sm font-black dark:text-white uppercase italic leading-tight mt-1 mb-0.5 truncate">
                      {selectedAuction.productName}
                    </h3>
                    <p className="text-[9px] text-slate-500 font-mono">
                      Mã phiên: #{selectedAuction.auctionId} | Mã SP: {selectedAuction.productId}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-white/5 mb-5">
                  {[['INFO', FileText, 'Thông tin'], ['STATUS', Activity, 'Điều chỉnh']].map(([tab, Icon, label]) => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                        detailTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>

                {/* Tab: INFO */}
                {detailTab === 'INFO' && (
                  <div className="space-y-4">
                    {/* Product specs */}
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2.5">
                      <p className="text-[9px] font-black uppercase text-blue-500 tracking-wider flex items-center gap-1.5">
                        <Package size={12} /> Thông số vật phẩm
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-slate-400">Thương hiệu:</span> <strong className="dark:text-white">{selectedAuction.brand || '—'}</strong></div>
                        <div><span className="text-slate-400">Xuất xứ:</span> <strong className="dark:text-white">{selectedAuction.origin || '—'}</strong></div>
                        <div>
                          <span className="text-slate-400">Tình trạng:</span>
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase">
                            {selectedAuction.productCondition || '—'}
                          </span>
                        </div>
                        <div><span className="text-slate-400">Giá cơ sở:</span> <strong className="dark:text-white">{formatVND(selectedAuction.basePrice)}</strong></div>
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Giá hiện tại</p>
                        <p className="text-sm font-black text-emerald-500 font-mono">{formatVND(selectedAuction.currentPrice)}</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Bước nhảy</p>
                        <p className="text-sm font-black text-blue-500 font-mono">{formatVND(selectedAuction.stepPrice)}</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Bắt đầu</p>
                        <p className="text-[10px] font-bold dark:text-slate-200">{new Date(selectedAuction.startTime).toLocaleString('vi-VN')}</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Kết thúc</p>
                        <p className="text-[10px] font-bold dark:text-slate-200">{new Date(selectedAuction.endTime).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>

                    {/* Seller */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase">Người bán</p>
                        <p className="text-xs font-black dark:text-white mt-0.5">@{selectedAuction.sellerUsername}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">{selectedAuction.sellerEmail}</span>
                    </div>

                    {/* Winner */}
                    {selectedAuction.winnerUsername ? (
                      <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-black text-emerald-500 uppercase">Người thắng thầu</p>
                          <p className="text-xs font-black text-emerald-500 mt-0.5">@{selectedAuction.winnerUsername}</p>
                        </div>
                        <span className="text-xs font-black text-emerald-500 font-mono">{formatVND(selectedAuction.currentPrice)}</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-center text-slate-400 text-[10px] italic">
                        Chưa có người thắng thầu
                      </div>
                    )}

                    {/* Total bids */}
                    {selectedAuction.totalBids > 0 && (
                      <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hash size={14} className="text-blue-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase">Tổng lượt thầu</span>
                        </div>
                        <span className="text-sm font-black text-blue-500">{selectedAuction.totalBids} lượt</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: STATUS */}
                {detailTab === 'STATUS' && (
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Trạng thái hiện tại</p>
                    <div className="flex justify-center">
                      <AuctionStatusBadge status={selectedAuction.auctionStatus} />
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {/* ACTIVE */}
                      <button
                        onClick={() => handleUpdateStatus(selectedAuction.auctionId, 'ACTIVE')}
                        disabled={selectedAuction.auctionStatus === 'ACTIVE'}
                        className={`py-2.5 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 border ${
                          selectedAuction.auctionStatus === 'ACTIVE'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500'
                        } disabled:cursor-not-allowed`}
                      >
                        <Play size={11} /> Kích hoạt (ACTIVE)
                      </button>

                      {/* ENDED */}
                      <button
                        onClick={() => handleUpdateStatus(selectedAuction.auctionId, 'ENDED')}
                        disabled={selectedAuction.auctionStatus === 'ENDED'}
                        className={`py-2.5 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 border ${
                          selectedAuction.auctionStatus === 'ENDED'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500'
                        } disabled:cursor-not-allowed`}
                      >
                        <CheckCircle2 size={11} /> Kết thúc phiên (ENDED)
                      </button>

                      {/* CANCELLED */}
                      <button
                        onClick={() => handleUpdateStatus(selectedAuction.auctionId, 'CANCELLED')}
                        disabled={selectedAuction.auctionStatus === 'CANCELLED'}
                        className={`py-2.5 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 border ${
                          selectedAuction.auctionStatus === 'CANCELLED'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-red-500/10 hover:border-red-500'
                        } disabled:cursor-not-allowed`}
                      >
                        <Ban size={11} /> Hủy phiên (CANCELLED)
                      </button>
                    </div>

                    {/* Delete */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-wider mb-2">Vùng nguy hiểm</p>
                      <button
                        onClick={() => handleDeleteAuction(selectedAuction.auctionId)}
                        disabled={selectedAuction.auctionStatus === 'ACTIVE'}
                        className="w-full py-2.5 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={11} /> Xóa vĩnh viễn phiên đấu giá này
                      </button>
                      {selectedAuction.auctionStatus === 'ACTIVE' && (
                        <p className="text-[9px] text-slate-400 italic mt-1.5 text-center">
                          * Cần kết thúc hoặc hủy phiên trước khi xóa
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ── CREATE MODAL ───────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />

          <div className="border rounded-3xl p-6 shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5">
            <button
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2 text-blue-500">
              <Sparkles /> Tạo phiên đấu giá NORMAL mới
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-6">

              {/* Section 1: Chọn sản phẩm */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-500 flex items-center justify-between border-b dark:border-white/5 pb-2">
                  <span className="flex items-center gap-1.5"><Package size={14} /> 1. Chọn sản phẩm từ kho (APPROVED) *</span>
                  {selectedProduct && (
                    <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                      <Check size={12} /> #{selectedProduct.productId}
                    </span>
                  )}
                </p>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên sản phẩm hoặc mã SP..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full py-1.5 pl-9 pr-4 text-xs rounded-lg border focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5"
                  />
                </div>

                {availableProducts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    <Package size={24} className="mx-auto mb-2 opacity-30" />
                    Không có sản phẩm nào được duyệt (APPROVED) sẵn sàng để đấu giá
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                    {searchedProducts.map((prod) => {
                      const isSelected = selectedProduct?.productId === prod.productId;
                      return (
                        <div
                          key={prod.productId}
                          onClick={() => handleSelectProductInForm(prod)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-blue-500/10 border-blue-500 shadow-md shadow-blue-500/5'
                              : 'bg-white dark:bg-black/20 border-slate-200 dark:border-white/5 hover:border-slate-400'
                          }`}
                        >
                          <img
                            src={prod.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100"; }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-black truncate ${isSelected ? 'text-blue-500' : 'dark:text-white'}`}>
                              {prod.productName}
                            </h4>
                            <div className="flex items-center justify-between text-[9px] text-slate-400 mt-0.5 font-mono">
                              <span>#{prod.productId}</span>
                              <span className="text-emerald-500 font-bold">{prod.itemStatus}</span>
                            </div>
                          </div>
                          {isSelected && <Check size={14} className="text-blue-500 flex-shrink-0" />}
                        </div>
                      );
                    })}
                    {searchedProducts.length === 0 && productSearchQuery && (
                      <div className="col-span-2 p-6 text-center text-slate-400 text-[10px] italic">
                        Không tìm thấy sản phẩm phù hợp
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 2: Giá */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 border-b dark:border-white/5 pb-2">
                  <DollarSign size={14} /> 2. Thiết lập tài chính (VNĐ)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Giá khởi điểm *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formStartPrice}
                      onChange={(e) => setFormStartPrice(e.target.value)}
                      placeholder="VD: 5000000"
                      className="w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5"
                    />
                    <p className="text-[8px] text-slate-500 mt-1 italic">Mặc định theo giá cơ sở sản phẩm</p>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Bước nhảy tối thiểu *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formStepPrice}
                      onChange={(e) => setFormStepPrice(e.target.value)}
                      placeholder="VD: 100000"
                      className="w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5"
                    />
                    <p className="text-[8px] text-slate-500 mt-1 italic">Gợi ý: 2% giá khởi điểm</p>
                  </div>
                </div>

                {formStartPrice && formStepPrice && (
                  <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-xs flex justify-between">
                    <span className="text-slate-400">Giá khởi điểm:</span>
                    <strong className="text-blue-500 font-mono">{formatVND(parseFloat(formStartPrice) || 0)}</strong>
                  </div>
                )}
              </div>

              {/* Section 3: Thời gian */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 border-b dark:border-white/5 pb-2">
                  <Calendar size={14} /> 3. Thời gian kết thúc phiên
                </p>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Thời gian kết thúc *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                    className="w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5"
                  />
                  <p className="text-[8px] text-slate-500 mt-1 italic">
                    Phiên sẽ bắt đầu ngay khi được tạo (ACTIVE). Thời gian kết thúc phải trong tương lai.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedProduct}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={14} className="animate-spin" /> Đang tạo...</>
                  ) : (
                    <><Sparkles size={14} /> Khởi tạo phiên đấu giá</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}