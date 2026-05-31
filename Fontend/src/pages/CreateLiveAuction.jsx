import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  MonitorPlay,
  Trash2,
  Clock,
  Radio,
  ListOrdered,
  PlusCircle,
  TrendingUp,
  Tag,
  Calendar,
  LayoutGrid,
  ChevronDown,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { getProductsForAuction } from '../services/api/createNormalAuctionApi';
import {
  getLiveEligibility,
  getMyLiveRooms,
  createLiveRoom,
  getMyLiveSessions,
  createLiveSession,
} from '../services/api/createLiveAuctionApi';

const formatSessionTime = (iso) => {
  if (!iso) return '---';
  return new Date(iso).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Nhận chuỗi datetime-local "YYYY-MM-DDTHH:mm"
const resolveSessionDateTime = (datetimeLocal) => {
  if (!datetimeLocal) return { sessionDate: '', startTime: '' };
  const [datePart, timePart] = datetimeLocal.split('T');
  return { sessionDate: datePart, startTime: timePart };
};

// Helpers định dạng tiền VND
const formatVND = (num) => {
  const n = Number(String(num).replace(/\D/g, ''));
  if (!n && n !== 0) return '';
  return new Intl.NumberFormat('vi-VN').format(n);
};
const parseVND = (str) => Number(String(str).replace(/\D/g, '')) || 0;

const mapProductForUi = (p) => ({
  id: p.productId,
  title: p.productName,
  store: p.itemStatus === 'APPROVED' ? 'Đã duyệt' : p.itemStatus,
  image: p.imageUrl || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=400',
});

// ── PriceInput: ô nhập giá rõ ràng, format VND tự động ──
const PriceInput = ({ label, icon, value, onChange }) => {
  const [raw, setRaw] = React.useState(value ? formatVND(value) : '');
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    setRaw(value ? formatVND(value) : '');
  }, [value]);

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setRaw(digits ? formatVND(digits) : '');
    onChange(digits ? Number(digits) : 0);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <label className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${
        focused ? 'text-red-400' : 'text-slate-400'
      }`}>
        <span className={`p-1.5 rounded-lg transition-colors ${
          focused ? 'bg-red-600/20 text-red-400' : 'bg-white/5 text-slate-400'
        }`}>{icon}</span>
        {label}
      </label>

      {/* Input */}
      <div className={`relative rounded-2xl transition-all duration-200 ${
        focused
          ? 'shadow-[0_0_0_2px_rgba(220,38,38,0.6),0_0_30px_rgba(220,38,38,0.1)] bg-[#1a0a0a]'
          : 'shadow-[0_0_0_1.5px_rgba(255,255,255,0.12)] bg-slate-900 hover:shadow-[0_0_0_1.5px_rgba(255,255,255,0.22)]'
      }`}>
        <input
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="0"
          className="w-full bg-transparent px-5 pt-4 pb-3 text-2xl font-black text-white outline-none placeholder:text-slate-700 tracking-tight leading-none"
        />
        {/* Đơn vị */}
        <div className="px-5 pb-3">
          {value > 0 ? (
            <p className={`text-sm font-bold transition-colors ${
              focused ? 'text-red-400' : 'text-slate-400'
            }`}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
            </p>
          ) : (
            <p className="text-sm text-slate-700 font-bold">0 ₫</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── SelectField ──
const SelectField = ({ label, icon, value, onChange, options }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-400">
      <span className="p-1.5 rounded-lg bg-white/5 text-slate-400">{icon}</span>
      {label}
    </label>
    <div className="relative rounded-2xl shadow-[0_0_0_1.5px_rgba(255,255,255,0.12)] bg-slate-900 hover:shadow-[0_0_0_1.5px_rgba(255,255,255,0.22)] transition-all">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent px-5 pt-4 pb-3 text-2xl font-black text-white outline-none appearance-none cursor-pointer leading-none"
        style={{ paddingBottom: '0.75rem' }}
      >
        {options.map(({ label: optLabel, value: optVal }) => (
          <option key={optVal} value={optVal} className="bg-slate-900 text-white text-base">{optLabel}</option>
        ))}
      </select>
      {/* Fake bottom line để cân bằng với PriceInput */}
      <div className="px-5 pb-3">
        <p className="text-sm text-slate-600 font-bold">Chọn thời gian</p>
      </div>
      <ChevronDown className="absolute right-4 top-5 w-5 h-5 text-slate-500 pointer-events-none" />
    </div>
  </div>
);

const SubscriptionGate = ({ eligibility }) => (
  <div className="max-w-2xl mx-auto py-24 text-center space-y-8 animate-in fade-in duration-700">
    <div className="w-24 h-24 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
      <AlertCircle className="w-12 h-12 text-amber-500" />
    </div>
    <div className="space-y-4">
      <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
        Cần <span className="text-red-600">gói Live</span>
      </h1>
      <p className="text-slate-500 font-medium text-lg leading-relaxed px-4">
        {eligibility?.message ||
          'Chỉ tài khoản đã đăng ký gói live và còn hạn sử dụng mới được tạo phiên đấu giá trực tiếp.'}
      </p>
    </div>
    <Link
      to="/subscription"
      className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-105 shadow-2xl shadow-red-600/30"
    >
      Đăng ký gói ngay
    </Link>
  </div>
);

const Dashboard = ({ liveSessions, setView, eligibility, loading, navigate }) => (
  <div className="space-y-12 animate-in fade-in duration-700">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
      <div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
          QUẢN LÝ <span className="text-red-600">LIVE</span>
        </h1>
        <p className="text-slate-500 mt-3 font-medium text-lg tracking-tight">
          Hệ thống điều phối đấu giá trực tuyến chuyên nghiệp.
        </p>
        {eligibility?.canCreateLive && (
          <p className="text-emerald-500/90 text-xs font-black uppercase tracking-widest mt-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Gói {eligibility.planName} · hết hạn{' '}
            {eligibility.subscriptionEndDate
              ? new Date(eligibility.subscriptionEndDate).toLocaleDateString('vi-VN')
              : '—'}
            · {eligibility.currentRoomCount}/{eligibility.maxLiveRooms} phòng
          </p>
        )}
      </div>
      <button
        onClick={() => setView('create-live')}
        className="flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/30"
      >
        <PlusCircle className="w-5 h-5" /> Thiết lập Live mới
      </button>
    </div>

    {loading ? (
      <div className="flex justify-center py-32">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {liveSessions.length === 0 ? (
          <div className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center text-slate-700 bg-slate-900/10">
            <MonitorPlay className="w-16 h-16 mb-6 opacity-20" />
            <p className="font-black uppercase tracking-[0.3em] text-sm">Chưa có phiên Live nào được tạo</p>
          </div>
        ) : (
          liveSessions.map((session) => (
            <div
              key={session.sessionCode}
              className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 space-y-6 hover:bg-slate-900/60 transition-all border-b-red-600/20 border-b-4"
            >
              <div className="flex justify-between items-center">
                <span className="px-4 py-1.5 bg-red-600/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                  {session.roomCode}
                </span>
                <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  {formatSessionTime(session.startTime)}
                </div>
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic truncate">{session.title}</h3>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {(session.items || []).slice(0, 4).map((item, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-full border-4 border-[#020617] overflow-hidden">
                      <img src={item.imageUrl} className="w-full h-full object-cover" alt="product" />
                    </div>
                  ))}
                </div>
                {(session.items || []).length > 4 && (
                  <span className="text-[10px] font-black text-slate-500">
                    +{session.items.length - 4} items
                  </span>
                )}
              </div>
              <button
              type="button"
              onClick={() => navigate(`/live-auction/${session.roomCode}`)}
              className="w-full bg-white hover:bg-red-600 text-black hover:text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg"
            >
              Vào phòng Live
            </button>
            </div>
          ))
        )}
      </div>
    )}
  </div>
);

const CreateLivePage = ({
  setView,
  newLive,
  setNewLive,
  userRooms,
  setIsAddingRoom,
  addItemToLive,
  updateItemConfig,
  handleCreateLive,
  products,
  loadingProducts,
  isSubmitting,
}) => (
  <div className="animate-in slide-in-from-right-10 duration-700 space-y-10 pb-20">
    <div className="flex items-center justify-between border-b border-white/5 pb-8">
      <button
        onClick={() => setView('dashboard')}
        className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group"
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center group-hover:border-red-500/50">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-black uppercase text-[11px] tracking-[0.2em]">Hệ thống Quản lý</span>
      </button>
      <div className="text-right">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Cấu hình Phiên đấu giá</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Workspace / Live Settings</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-10">
        <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-6 space-y-6 backdrop-blur-md">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-red-600" /> Kho Sản Phẩm
            </h3>
            <span className="bg-red-600/10 text-red-500 text-[9px] font-black px-2 py-0.5 rounded-md">
              {products.length}
            </span>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {products.length === 0 ? (
                <p className="text-center text-[10px] text-slate-600 font-bold uppercase py-8">
                  Không có sản phẩm đã duyệt
                </p>
              ) : (
                products.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => addItemToLive(p)}
                    className="flex items-center gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-3xl hover:border-red-600/40 cursor-pointer group transition-all active:scale-95"
                  >
                    <div className="relative shrink-0">
                      <img src={p.image} className="w-12 h-12 rounded-2xl object-cover" alt={p.title} />
                      <div className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-white truncate leading-tight">{p.title}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-tighter mt-1">#{p.id}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-9 space-y-8">
        <div className="bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-10 lg:p-14 space-y-12 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 items-end">
            <div className="md:col-span-6 space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                <Tag className="w-4 h-4 text-red-600" /> Tên phiên Live
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Đấu giá Đồ Gia Dụng Tết 2024..."
                className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl px-8 py-6 font-bold text-lg text-white outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 transition-all placeholder:text-slate-800"
                value={newLive.title}
                onChange={(e) => setNewLive({ ...newLive, title: e.target.value })}
              />
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between px-4">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <MonitorPlay className="w-4 h-4 text-red-600" /> Room Code
                </label>
                <button
                  onClick={() => setIsAddingRoom(true)}
                  className="flex items-center gap-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  <Plus className="w-3 h-3" /> Mới
                </button>
              </div>
              <div className="relative group">
                <select
                  className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl px-8 py-6 font-bold text-white outline-none focus:border-red-600/50 appearance-none cursor-pointer group-hover:border-white/10 transition-all"
                  value={newLive.roomId}
                  onChange={(e) => setNewLive({ ...newLive, roomId: e.target.value })}
                >
                  <option value="">Chọn Room</option>
                  {userRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.code} - {room.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover:text-red-500 transition-colors">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                <Calendar className="w-4 h-4 text-red-600" /> Ngày &amp; Giờ bắt đầu
              </label>
              <input
                type="datetime-local"
                className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl px-8 py-6 font-bold text-white outline-none focus:border-red-600/50 transition-all color-scheme-dark"
                value={newLive.sessionDateTime}
                min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
                onChange={(e) => setNewLive({ ...newLive, sessionDateTime: e.target.value })}
              />
              {newLive.sessionDateTime && (
                <p className="text-[10px] font-bold text-red-400 px-4">
                  {new Date(newLive.sessionDateTime).toLocaleString('vi-VN', {
                    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 px-2">
              <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                <ListOrdered className="w-6 h-6 text-red-600" /> Danh sách đấu giá
              </h3>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                {newLive.selectedItems.length} Sản phẩm đã chọn
              </span>
            </div>

            <div className="space-y-5">
              {newLive.selectedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-white/5 rounded-3xl overflow-hidden hover:border-red-600/20 transition-all group"
                >
                  <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-red-600/10 text-red-500 flex items-center justify-center font-black text-sm shrink-0 border border-red-600/20">
                      {idx + 1}
                    </div>
                    <img
                      src={item.product.image}
                      className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                      alt="thumb"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-white truncate uppercase italic">{item.product.title}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{item.product.store}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNewLive({
                          ...newLive,
                          selectedItems: newLive.selectedItems.filter((_, i) => i !== idx),
                        })
                      }
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-red-600/15 text-slate-500 hover:text-red-400 transition-all shrink-0 border border-white/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 bg-slate-950/30">
                    <div className="bg-slate-950/80 rounded-2xl p-5 flex flex-col">
                      <PriceInput
                        label="Giá sàn"
                        icon={<Tag className="w-3 h-3" />}
                        value={item.startPrice}
                        onChange={(v) => updateItemConfig(idx, 'startPrice', v)}
                      />
                    </div>

                    <div className="bg-slate-950/80 rounded-2xl p-5 flex flex-col">
                      <PriceInput
                        label="Bước giá"
                        icon={<Tag className="w-3 h-3" />}
                        value={item.bidStep}
                        onChange={(v) => updateItemConfig(idx, 'bidStep', v)}
                      />
                    </div>

                    <div className="bg-slate-950/80 rounded-2xl p-5">
                      <SelectField
                        label="Thời gian đấu"
                        icon={<Clock className="w-3 h-3" />}
                        value={item.duration}
                        onChange={(v) => updateItemConfig(idx, 'duration', Number(v))}
                        options={[
                          { value: 1, label: '1 phút' },
                          { value: 2, label: '2 phút' },
                          { value: 3, label: '3 phút' },
                          { value: 5, label: '5 phút' },
                          { value: 10, label: '10 phút' },
                        ]}
                      />
                    </div>

                    <div className="bg-slate-950/80 rounded-2xl p-5">
                      <SelectField
                        label="Nghỉ giữa"
                        icon={<Radio className="w-3 h-3" />}
                        value={item.gapTime}
                        onChange={(v) => updateItemConfig(idx, 'gapTime', Number(v))}
                        options={[
                          { value: 0, label: 'Không nghỉ' },
                          { value: 1, label: '1 phút' },
                          { value: 2, label: '2 phút' },
                          { value: 5, label: '5 phút' },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {newLive.selectedItems.length === 0 && (
                <div className="py-32 border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-slate-700 bg-slate-950/20">
                  <Tag className="w-16 h-16 mb-6 opacity-10" />
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] italic">
                    Chọn sản phẩm từ danh sách bên trái để bắt đầu
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCreateLive}
            disabled={
              isSubmitting ||
              !newLive.title ||
              !newLive.roomId ||
              !newLive.sessionDateTime ||
              newLive.selectedItems.length === 0
            }
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-20 text-white py-8 rounded-[3rem] font-black uppercase text-md tracking-[0.4em] shadow-[0_30px_60px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-6"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              'Lưu & Hoàn Tất Phiên Live'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CreateLiveAuction = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('dashboard');
  const [liveSessions, setLiveSessions] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [products, setProducts] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [toast, setToast] = useState(null);

  const [newLive, setNewLive] = useState({
    title: '',
    roomId: '',
    sessionDateTime: '',   // datetime-local string: "YYYY-MM-DDTHH:mm"
    selectedItems: [],
  });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const res = await getMyLiveSessions();
      setLiveSessions(res?.data ?? []);
    } catch (err) {
      showToast(err?.message || 'Không tải được danh sách phiên live', 'error');
      setLiveSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, [showToast]);

  const loadRooms = useCallback(async () => {
    try {
      const res = await getMyLiveRooms();
      const rooms = (res?.data ?? []).map((r) => ({
        id: r.roomId,
        code: r.roomCode,
        name: r.roomName,
      }));
      setUserRooms(rooms);
    } catch (err) {
      showToast(err?.message || 'Không tải được danh sách phòng', 'error');
      setUserRooms([]);
    }
  }, [showToast]);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await getProductsForAuction();
      const approved = (res?.data ?? []).filter((p) => p.itemStatus === 'APPROVED');
      setProducts(approved.map(mapProductForUi));
    } catch (err) {
      showToast(err?.message || 'Không tải được sản phẩm', 'error');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [showToast]);

  useEffect(() => {
    const init = async () => {
      setLoadingInit(true);
      try {
        const eligRes = await getLiveEligibility();
        const elig = eligRes?.data;
        setEligibility(elig);

        if (elig?.canCreateLive) {
          await Promise.all([loadSessions(), loadRooms(), loadProducts()]);
        }
      } catch (err) {
        showToast(err?.message || 'Không kiểm tra được quyền tạo live', 'error');
        setEligibility({ canCreateLive: false, message: err?.message });
      } finally {
        setLoadingInit(false);
      }
    };
    init();
  }, [loadSessions, loadRooms, loadProducts, showToast]);

  const registerNewRoom = async () => {
    if (!newRoomName?.trim() || !agreedToTerms) return;
    setIsCreatingRoom(true);
    try {
      const res = await createLiveRoom(newRoomName.trim());
      const room = res?.data;
      if (room) {
        setUserRooms((prev) => [
          ...prev,
          { id: room.roomId, code: room.roomCode, name: room.roomName },
        ]);
        setNewLive((prev) => ({ ...prev, roomId: String(room.roomId) }));
      }
      setNewRoomName('');
      setAgreedToTerms(false);
      setIsAddingRoom(false);
      showToast('Tạo phòng live thành công', 'success');
      const eligRes = await getLiveEligibility();
      setEligibility(eligRes?.data);
    } catch (err) {
      showToast(err?.message || 'Tạo phòng thất bại', 'error');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const addItemToLive = (product) => {
    if (newLive.selectedItems.find((i) => i.product.id === product.id)) return;
    setNewLive({
      ...newLive,
      selectedItems: [
        ...newLive.selectedItems,
        {
          product,
          duration: 3,
          gapTime: 1,
          startPrice: 1000000,
          bidStep: 100000,
        },
      ],
    });
  };

  const updateItemConfig = (index, field, value) => {
    const updated = [...newLive.selectedItems];
    updated[index][field] = value;
    setNewLive({ ...newLive, selectedItems: updated });
  };

  const handleCreateLive = async () => {
    if (!newLive.title || !newLive.roomId || !newLive.sessionDateTime || newLive.selectedItems.length === 0) {
      return;
    }

    const { sessionDate, startTime } = resolveSessionDateTime(newLive.sessionDateTime);

    setIsSubmitting(true);
    try {
      await createLiveSession({
        title: newLive.title.trim(),
        roomId: Number(newLive.roomId),
        sessionDate,
        startTime,
        items: newLive.selectedItems.map((item) => ({
          productId: item.product.id,
          startPrice: Number(item.startPrice),
          stepPrice: Number(item.bidStep),
          durationMinutes: Number(item.duration),
          gapMinutes: Number(item.gapTime),
        })),
      });
      showToast('Tạo phiên live thành công!', 'success');
      setNewLive({ title: '', roomId: '', sessionDateTime: '', selectedItems: [] });
      setView('dashboard');
      await loadSessions();
      await loadProducts();
    } catch (err) {
      showToast(err?.message || 'Tạo phiên live thất bại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans selection:bg-red-600/40 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-600/5 blur-[200px] rounded-full" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {loadingInit ? (
          <div className="flex justify-center py-40">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
          </div>
        ) : !eligibility?.canCreateLive ? (
          <SubscriptionGate eligibility={eligibility} />
        ) : view === 'dashboard' ? (
          <Dashboard
            liveSessions={liveSessions}
            setView={setView}
            eligibility={eligibility}
            loading={loadingSessions}
            navigate={navigate}
          />
        ) : (
          <CreateLivePage
            setView={setView}
            newLive={newLive}
            setNewLive={setNewLive}
            userRooms={userRooms}
            setIsAddingRoom={setIsAddingRoom}
            addItemToLive={addItemToLive}
            updateItemConfig={updateItemConfig}
            handleCreateLive={handleCreateLive}
            products={products}
            loadingProducts={loadingProducts}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {isAddingRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
          <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[4rem] p-10 md:p-14 space-y-8 animate-in zoom-in-95 shadow-[0_0_150px_rgba(0,0,0,0.8)]">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center mx-auto mb-2 shadow-2xl shadow-red-600/30">
                <MonitorPlay className="w-10 h-10" />
              </div>
              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                Tạo Room Live Mới
              </h3>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[12px] font-black uppercase tracking-[0.1em]">
                  Theo gói: {eligibility?.currentRoomCount}/{eligibility?.maxLiveRooms} phòng
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-6 italic">
                  Tên phòng gợi nhớ
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl px-8 py-6 font-black text-lg text-white outline-none focus:border-red-600 transition-all placeholder:text-slate-800"
                  placeholder="VD: Showroom Quận 1 - Tầng 2"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
              </div>

              <div className="bg-slate-950/80 p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <p className="text-[11px] text-white font-black uppercase tracking-widest">Hệ thống tự động</p>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
                      Mã Room Code sẽ được hệ thống khởi tạo ngẫu nhiên sau khi xác nhận. Số phòng tối đa phụ thuộc gói
                      đăng ký còn hạn.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all border border-white/5 group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-6 h-6 border-2 border-slate-700 rounded-lg checked:bg-red-600 checked:border-red-600 transition-all"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <Plus className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none rotate-45" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-tight leading-tight">
                    Tôi xác nhận tạo phòng trong phạm vi gói live đang sử dụng
                  </span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => setIsAddingRoom(false)}
                className="flex-1 py-6 rounded-3xl bg-white/5 text-white font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all border border-white/5"
              >
                Quay lại
              </button>
              <button
                onClick={registerNewRoom}
                disabled={!newRoomName?.trim() || !agreedToTerms || isCreatingRoom}
                className="flex-[1.5] py-6 rounded-3xl bg-red-600 disabled:opacity-20 disabled:grayscale text-white font-black uppercase text-[11px] tracking-[0.2em] hover:bg-red-500 shadow-2xl shadow-red-600/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isCreatingRoom ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác nhận Đăng ký'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl text-white font-black text-sm shadow-2xl ${
            toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        .animate-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .zoom-in-95 { animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(220,38,38,0.2); }
        select { background-image: none; }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; cursor: pointer; scale: 1.2; }
        input[type="datetime-local"]::-webkit-datetime-edit { color: white; }
        input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper { color: white; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .color-scheme-dark { color-scheme: dark; }
      `}</style>
    </div>
  );
};

export default CreateLiveAuction;
