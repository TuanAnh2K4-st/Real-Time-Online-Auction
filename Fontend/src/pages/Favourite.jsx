import { useState, useEffect, useContext, useCallback } from 'react';
import {
  Heart, Gavel, Clock, Search, X,
  LayoutGrid, List, Trash2, TrendingUp,
  ArrowLeft, Loader2, AlertCircle, RefreshCw,
  Tag, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMyWatchlist, removeFromWatchlist } from '../services/api/favouriteApi';

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount ?? 0);

const formatTimeLeft = (endTime) => {
  if (!endTime) return '—';
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return 'Đã kết thúc';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (d > 0) return `${d} ngày ${h} giờ`;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'ACTIVE':   return { label: 'Đang diễn ra', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    case 'ENDED':    return { label: 'Đã kết thúc',  cls: 'bg-red-500/15 text-red-400 border-red-500/30' };
    case 'UPCOMING': return { label: 'Sắp diễn ra',  cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
    default:         return { label: status,          cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30' };
  }
};

// ─── FavouriteCard ───────────────────────────────────────────────────────────
const FavouriteCard = ({ item, onRemove, onNavigate, viewType, removing }) => {
  const status = getStatusStyle(item.auctionStatus);
  const isEnded = item.auctionStatus === 'ENDED';
  const timeLeft = formatTimeLeft(item.endTime);
  // Backend trả về 'thumbnail' (ảnh đầu tiên)
  const image = item.thumbnail || item.primaryImage || item.images?.[0];
  // Tên sản phẩm: backend trả 'productName'
  const displayName = item.productName || item.auctionTitle || '(Không có tên)';

  if (viewType === 'list') {
    return (
      <div className="group relative flex gap-6 items-center bg-slate-900/50 rounded-[2rem] border border-white/5 p-4 hover:border-blue-500/30 hover:bg-slate-900/80 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative w-32 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-800">
          {image ? (
            <img src={image} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700">
              <Gavel className="w-8 h-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/30" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${status.cls}`}>
              {status.label}
            </span>
            {item.categoryName && (
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-2.5 h-2.5" /> {item.categoryName}
              </span>
            )}
          </div>
          <h3 className="text-sm font-black text-white leading-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
            {displayName}
          </h3>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Giá hiện tại</p>
              <p className="text-base font-black text-white">{formatCurrency(item.currentPrice)}</p>
            </div>
            {!isEnded && (
              <div>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> Còn lại
                </p>
                <p className="text-xs font-black text-amber-400 tabular-nums">{timeLeft}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate(item.auctionId)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            Xem <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => onRemove(item.auctionId)}
            disabled={removing === item.auctionId}
            className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
          >
            {removing === item.auctionId
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  // Grid card
  return (
    <div className="group relative bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-4 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-500 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-800 mb-5 shrink-0">
        {image ? (
          <img src={image} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-700">
            <Gavel className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Status badge */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.cls}`}>
          {status.label}
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(item.auctionId)}
          disabled={removing === item.auctionId}
          className="absolute top-4 right-4 p-2.5 bg-slate-950/80 backdrop-blur-md rounded-xl text-red-400 border border-white/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50"
        >
          {removing === item.auctionId
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Trash2 className="w-4 h-4" />}
        </button>

        {/* Timer bottom */}
        {!isEnded && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-xl py-2 px-4 rounded-2xl flex items-center justify-between border border-white/10">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-400" /> Còn lại
            </span>
            <span className="text-xs font-black text-amber-400 tabular-nums">{timeLeft}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-grow space-y-3 px-1">
        {item.categoryName && (
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
            <Tag className="w-2.5 h-2.5" /> {item.categoryName}
          </span>
        )}
        <h3 className="text-base font-black text-white italic tracking-tight leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
          {displayName}
        </h3>

        <div className="flex items-end justify-between pt-3 border-t border-white/5">
          <div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Giá hiện tại</p>
            <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              {formatCurrency(item.currentPrice)}
            </p>
          </div>
          <button
            onClick={() => onNavigate(item.auctionId)}
            disabled={isEnded}
            className="flex items-center gap-2 bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/30 group/btn"
          >
            {isEnded ? 'Đã đóng' : 'Xem'} <Gavel className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Favourite() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [removing, setRemoving]   = useState(null); // auctionId đang xóa
  const [viewType, setViewType]   = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL | ACTIVE | ENDED | UPCOMING

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadFavourites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // axiosClient unwrap response.data → ta nhận được ApiResponse { message, data: [...] }
      // hoặc nếu backend trả thẳng array thì res là array
      const res = await getMyWatchlist('NORMAL');
      let list = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.content)) {
        list = res.content;
      }
      setFavourites(list);
    } catch (err) {
      setError(err?.message || 'Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadFavourites();
  }, [user, loadFavourites, navigate]);

  // ── Remove ─────────────────────────────────────────────────────────────────
  const handleRemove = async (auctionId) => {
    if (!window.confirm('Xóa khỏi danh sách yêu thích?')) return;
    setRemoving(auctionId);
    try {
      await removeFromWatchlist(auctionId, 'NORMAL'); // Sử dụng 'NORMAL' cho đấu giá phổ thông
      setFavourites(prev => prev.filter(f => f.auctionId !== auctionId));
    } catch (err) {
      alert(err?.message || 'Xóa thất bại, vui lòng thử lại');
    } finally {
      setRemoving(null);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = favourites.filter(item => {
    const name = item.productName || item.auctionTitle || '';
    const matchSearch = !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || item.auctionStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL:      favourites.length,
    ACTIVE:   favourites.filter(f => f.auctionStatus === 'ACTIVE').length,
    UPCOMING: favourites.filter(f => f.auctionStatus === 'UPCOMING').length,
    ENDED:    favourites.filter(f => f.auctionStatus === 'ENDED').length,
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Đang tải yêu thích...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-5 p-10 bg-slate-900/50 rounded-[2.5rem] border border-white/5 max-w-sm mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-slate-300 font-bold">{error}</p>
          <button
            onClick={loadFavourites}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      {/* Background deco */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[130px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Trang chủ</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-pink-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                <Heart className="w-7 h-7 text-red-400 fill-red-400/30" />
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                  YÊU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">THÍCH</span>
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                  Đấu giá phổ thông đang theo dõi
                </p>
              </div>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-3">
            <button onClick={loadFavourites} className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Làm mới">
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewType === 'grid' ? 'bg-white/10 text-blue-400' : 'text-slate-500 hover:text-white'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2.5 rounded-xl transition-all ${viewType === 'list' ? 'bg-white/10 text-blue-400' : 'text-slate-500 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Filter bar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm trong yêu thích..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-xs font-bold text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 p-1.5 bg-white/5 rounded-2xl border border-white/5">
            {[
              { key: 'ALL',      label: 'Tất cả' },
              { key: 'ACTIVE',   label: 'Đang diễn ra' },
              { key: 'UPCOMING', label: 'Sắp diễn ra' },
              { key: 'ENDED',    label: 'Đã kết thúc' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterStatus === key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {label}
                <span className="ml-1.5 opacity-60">({counts[key]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        {favourites.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Tổng theo dõi',   value: counts.ALL,      color: 'text-white' },
              { label: 'Đang diễn ra',    value: counts.ACTIVE,   color: 'text-emerald-400' },
              { label: 'Sắp diễn ra',     value: counts.UPCOMING, color: 'text-blue-400' },
              { label: 'Đã kết thúc',     value: counts.ENDED,    color: 'text-red-400' },
            ].map((s, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── List ───────────────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className={viewType === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'flex flex-col gap-4'
          }>
            {filtered.map((item, index) => (
              <div
                key={item.auctionId}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <FavouriteCard
                  item={item}
                  onRemove={handleRemove}
                  onNavigate={(id) => navigate(`/auction/${id}`)}
                  viewType={viewType}
                  removing={removing}
                />
              </div>
            ))}
          </div>
        ) : favourites.length === 0 ? (
          /* Danh sách rỗng hoàn toàn */
          <div className="py-32 flex flex-col items-center justify-center text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5">
            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
              <Heart className="w-10 h-10 text-slate-700" />
            </div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">
              Chưa có gì ở đây
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">
              Hãy thêm đấu giá phổ thông vào danh sách yêu thích để theo dõi
            </p>
            <button
              onClick={() => navigate('/list-normal-auctions')}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/30"
            >
              <TrendingUp className="w-4 h-4" /> Khám phá đấu giá
            </button>
          </div>
        ) : (
          /* Không tìm thấy qua filter */
          <div className="py-24 flex flex-col items-center justify-center text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5">
            <Search className="w-12 h-12 text-slate-700 mb-4" />
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">
              Không tìm thấy kết quả
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
              Thử thay đổi từ khoá hoặc bộ lọc trạng thái
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); }}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </main>
    </div>
  );
}