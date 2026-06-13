import React, { useState, useEffect } from 'react';
import {
  Gavel, Radio, ChevronLeft, ChevronRight,
  Layers, Package, Calendar,
  BellRing, CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LiveSessionProductsModal from '../components/LiveSessionProductsModal';
import { getPublicLiveSessions } from '../services/api/createLiveAuctionApi';

// ── constants ──────────────────────────────────────────────
const FALLBACK_LIVE_IMAGE =
  'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800';
const PAGE_SIZE = 6;

// ── LiveAuctionCard (identical to Home.jsx) ─────────────────
const LiveAuctionCard = ({ session, onEnterRoom, onViewProducts }) => {
  const isLive = session.live;
  const isEnded = session.sessionStatus === 'ended';
  const image = session.imageUrl || FALLBACK_LIVE_IMAGE;

  return (
    <div className="relative group bg-slate-900/50 rounded-[2.5rem] p-4 border border-white/5 shadow-2xl hover:border-blue-500/30 transition-all duration-500">
      <div className="relative h-80 rounded-[2rem] overflow-hidden mb-6">
        <img
          src={image}
          alt={session.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div
          className={`absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-widest shadow-lg ${
            isLive
              ? 'bg-red-500 text-white shadow-red-900/40'
              : isEnded
              ? 'bg-slate-700 text-slate-300'
              : 'bg-blue-600/90 text-white shadow-blue-900/30'
          }`}
        >
          {isLive && <span className="w-2 h-2 bg-white rounded-full animate-ping" />}
          {session.timeLabel}
        </div>
        <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-bold flex items-center gap-2 border border-white/10">
          <Radio className="w-4 h-4 text-blue-400" />
          {session.roomCode}
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{session.host}</p>
          <h3 className="text-2xl font-black text-white leading-tight mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
            {session.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2">{session.description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-2 pb-2">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sản phẩm trong phiên</p>
              <p className="text-sm font-black text-white">{session.productCount} vật phẩm</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onEnterRoom(session.roomCode)}
            disabled={isEnded}
            className="py-4 bg-blue-600 disabled:opacity-40 text-white rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group"
          >
            Vào phòng
            <Gavel className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
          <button
            type="button"
            onClick={() => onViewProducts(session)}
            className="py-4 bg-white/5 text-white rounded-2xl font-black text-sm hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4 text-slate-400" />
            Xem sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Pagination ──────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const withEllipsis = [];
  let prev = null;
  for (const p of visiblePages) {
    if (prev !== null && p - prev > 1) withEllipsis.push('...');
    withEllipsis.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {withEllipsis.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-600 font-bold">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-11 h-11 rounded-2xl font-black text-sm transition-all ${
              p === currentPage
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/40'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// ── Skeleton ────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="h-[520px] rounded-[2.5rem] bg-slate-900/40 border border-white/5 animate-pulse" />
);

// ── Main Page ───────────────────────────────────────────────
export default function ListLiveAuction() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsModal, setProductsModal] = useState(null);

  // Fetch all sessions then paginate client-side
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        // Lấy tất cả sessions (limit lớn để lấy hết)
        const res = await getPublicLiveSessions(999);
        const data = res?.data ?? [];
        setSessions(Array.isArray(data) ? data : []);
        setTotalPages(Math.max(1, Math.ceil((Array.isArray(data) ? data.length : 0) / PAGE_SIZE)));
      } catch (err) {
        console.error('Load live sessions error:', err);
        setSessions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const paginatedSessions = sessions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      <Header />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* ── Page Header ── */}
        <section className="mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
              <Calendar className="w-3 h-3" /> Lịch đấu giá trực tuyến
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              ĐỪNG BỎ LỠ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 italic">
                NHỮNG KHOẢNH KHẮC
              </span>
            </h1>
            <p className="text-slate-500 max-w-xl font-medium">
              Toàn bộ phiên đấu giá live đang diễn ra và sắp tới. Vào phòng để tham gia đấu giá
              hoặc xem trước danh sách sản phẩm của mỗi phiên.
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="relative">
          {/* glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-600/5 rounded-full blur-[150px] -z-10" />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-32 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-slate-900/20">
              <Radio className="w-16 h-16 text-slate-700 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">Chưa có phiên live nào</h3>
              <p className="text-slate-600">Hãy quay lại sau!</p>
            </div>
          ) : (
            <>
              {/* result count */}
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                  Tổng cộng{' '}
                  <span className="text-white">{sessions.length}</span> phiên live
                </p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Trang {currentPage} / {totalPages}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {paginatedSessions.map((session) => (
                  <LiveAuctionCard
                    key={session.sessionCode ?? session.id}
                    session={session}
                    onEnterRoom={(code) => navigate(`/live-auction/${code}`)}
                    onViewProducts={(s) =>
                      setProductsModal({ roomCode: s.roomCode, title: s.title })
                    }
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>

        {/* ── CTA Newsletter ── */}
        <section className="mt-32 relative overflow-hidden rounded-[3rem] p-12 lg:p-20 border border-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-950 -z-10" />
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <BellRing className="w-64 h-64 text-blue-500 rotate-12" />
          </div>
          <div className="max-w-2xl space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              NHẬN THÔNG BÁO <br />
              <span className="text-blue-400">TRƯỚC 15 PHÚT</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              Đăng ký bản tin đấu giá để cập nhật các siêu phẩm hiếm có và lịch đấu giá độc quyền
              mỗi tuần qua Email hoặc SMS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Địa chỉ Email của bạn..."
                className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none backdrop-blur-md"
              />
              <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 whitespace-nowrap">
                Đăng ký ngay
              </button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> Không spam
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> Hủy bất cứ lúc nào
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Products Modal ── */}
      {productsModal && (
        <LiveSessionProductsModal
          roomCode={productsModal.roomCode}
          sessionTitle={productsModal.title}
          onClose={() => setProductsModal(null)}
          onEnterRoom={(code) => {
            setProductsModal(null);
            navigate(`/live-auction/${code}`);
          }}
        />
      )}

      {/* ── Footer ── */}
      <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white uppercase tracking-tighter italic">
                  DauGiaViet
                </span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                Nền tảng đấu giá trực tuyến tiên phong tại Việt Nam, mang lại sự minh bạch, an toàn
                và chuyên nghiệp trong từng phiên đấu.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:col-span-2">
              <div className="space-y-4">
                <h5 className="text-white font-black uppercase text-xs tracking-widest">Dịch vụ</h5>
                <ul className="space-y-2 text-sm text-slate-500 font-bold">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Đấu giá Live</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Ký gửi tài sản</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Kiểm định chuyên sâu</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-white font-black uppercase text-xs tracking-widest">Hỗ trợ</h5>
                <ul className="space-y-2 text-sm text-slate-500 font-bold">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Trung tâm trợ giúp</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Quy tắc sàn</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Chính sách bảo mật</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              © 2026 DauGiaViet - Advanced Auction Tech
            </p>
            <div className="flex gap-6">
              {['FB', 'INSTA', 'TT'].map((s) => (
                <span
                  key={s}
                  className="text-[10px] font-black text-slate-600 hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}