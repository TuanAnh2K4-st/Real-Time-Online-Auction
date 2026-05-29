import React, { useEffect, useState } from 'react';
import {
  X,
  Package,
  Loader2,
  Clock,
  Tag,
  TrendingUp,
  Gavel,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { getLiveRoomDetail } from '../services/api/liveAuctionDetailApi';

const formatPrice = (val) => {
  if (val == null) return '—';
  return new Intl.NumberFormat('vi-VN').format(Number(val)) + ' đ';
};

const formatTimeRange = (start, end) => {
  if (!start || !end) return '—';
  const opts = { hour: '2-digit', minute: '2-digit' };
  const s = new Date(start).toLocaleTimeString('vi-VN', opts);
  const e = new Date(end).toLocaleTimeString('vi-VN', opts);
  const d = new Date(start).toLocaleDateString('vi-VN');
  return `${s} – ${e} · ${d}`;
};

const statusLabel = (status) => {
  switch (status) {
    case 'ACTIVE':
      return { text: 'Đang đấu', className: 'bg-red-500/20 text-red-400 border-red-500/30' };
    case 'ENDED':
      return { text: 'Đã kết thúc', className: 'bg-slate-700/50 text-slate-400 border-white/10' };
    case 'SCHEDULED':
    default:
      return { text: 'Chờ phiên', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  }
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=400';

export default function LiveSessionProductsModal({
  roomCode,
  sessionTitle,
  onClose,
  onEnterRoom,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomDetail, setRoomDetail] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!roomCode) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getLiveRoomDetail(roomCode);
        setRoomDetail(res?.data);
        setExpandedId(null);
      } catch (err) {
        setError(err?.message || 'Không tải được danh sách sản phẩm');
        setRoomDetail(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [roomCode]);

  const schedule = roomDetail?.schedule ?? [];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-white/10 w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-8 pb-6 border-b border-white/5 shrink-0">
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
              Sản phẩm trong phiên live
            </p>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight truncate">
              {sessionTitle || roomDetail?.sessionTitle || 'Phiên live'}
            </h2>
            {roomCode && (
              <p className="text-[10px] font-bold text-slate-500 uppercase">Phòng {roomCode}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-slate-500 text-sm font-bold">Đang tải sản phẩm...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <p className="text-slate-400 font-bold text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && schedule.length === 0 && (
            <div className="py-16 text-center text-slate-500 font-bold text-sm">
              Phiên này chưa có sản phẩm.
            </div>
          )}

          {!loading &&
            !error &&
            schedule.map((item, index) => {
              const img = item.images?.[0] || FALLBACK_IMAGE;
              const status = statusLabel(item.auctionStatus);
              const isExpanded = expandedId === item.auctionId;

              return (
                <div
                  key={item.auctionId}
                  className="bg-slate-950/60 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/20 transition-all"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : item.auctionId)
                    }
                    className="w-full flex gap-4 p-5 text-left"
                  >
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-lg border border-blue-500/20">
                      {index + 1}
                    </div>
                    <img
                      src={img}
                      alt={item.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${status.className}`}
                        >
                          {status.text}
                        </span>
                        <span className="text-[9px] text-slate-600 font-mono">
                          #{item.productId}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeRange(item.startTime, item.endTime)}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-slate-600 shrink-0 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 space-y-4 border-t border-white/5 mx-5">
                      {item.description && (
                        <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                            <Tag className="w-3 h-3" /> Giá sàn
                          </p>
                          <p className="text-sm font-black text-white">
                            {formatPrice(item.startPrice)}
                          </p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                            <TrendingUp className="w-3 h-3" /> Bước giá
                          </p>
                          <p className="text-sm font-black text-blue-400">
                            {formatPrice(item.stepPrice)}
                          </p>
                        </div>
                      </div>

                      {item.specs?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" /> Thông số
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {item.specs.map((spec, i) => (
                              <div
                                key={i}
                                className="flex justify-between gap-2 text-[11px] py-2 px-3 bg-white/[0.03] rounded-lg border border-white/5"
                              >
                                <span className="text-slate-500 font-bold">{spec.label}</span>
                                <span className="text-slate-200 font-semibold text-right">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.images?.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {item.images.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt=""
                              className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <div className="p-6 md:p-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black uppercase text-[11px] tracking-widest border border-white/10 hover:bg-white/10 transition-all"
          >
            Đóng
          </button>
          {roomDetail?.sessionStatus !== 'ended' && (
            <button
              type="button"
              onClick={() => onEnterRoom?.(roomCode)}
              className="flex-[1.5] py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all"
            >
              <Gavel className="w-4 h-4" />
              Vào phòng đấu giá
            </button>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.25); border-radius: 10px; }
      `}</style>
    </div>
  );
}
