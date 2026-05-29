import React, { useState, useEffect, useCallback, useMemo, useContext, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Send,
  Award,
  Package,
  Timer,
  MessageSquare,
  Activity,
  History,
  Coins,
  Gavel,
  FileText,
  CalendarDays,
  CheckCircle2,
  PlayCircle,
  Clock,
  Hammer,
  Loader2,
  AlertCircle,
  Landmark,
} from 'lucide-react';
import { getLiveRoomDetail } from '../services/api/liveAuctionDetailApi';
import normalAuctionDetailApi from '../services/api/normalAuctionDetailApi';
import { connectWebSocket, disconnectWebSocket, sendBid, sendChatMessage } from '../services/websocket';
import { AuthContext } from '../context/AuthContext';

const formatPrice = (val) => {
  if (val == null) return '0 đ';
  return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
};

const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatInputNumber = (val) => {
  if (!val) return '';
  const number = String(val).replace(/\D/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseInputNumber = (val) => {
  if (!val) return 0;
  return parseInt(String(val).replace(/\./g, ''), 10) || 0;
};

const formatTimeSince = (time) => {
  if (!time) return '';
  const diff = Date.now() - new Date(time).getTime();
  if (diff < 60000) return 'Vừa xong';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
  return new Date(time).toLocaleString('vi-VN');
};

const mapScheduleToProduct = (item) => ({
  id: item.productId,
  auctionId: item.auctionId,
  title: item.title,
  description: item.description || '',
  images: item.images?.length
    ? item.images
    : ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800'],
  specs: item.specs || [],
  startPrice: Number(item.startPrice),
  minBidStep: Number(item.stepPrice),
  startTime: item.startTime,
  endTime: item.endTime,
  auctionStatus: item.auctionStatus,
});

const LiveAuctionDetail = () => {
  const { roomCode: roomCodeParam } = useParams();
  const [searchParams] = useSearchParams();
  const roomCode = roomCodeParam || searchParams.get('roomCode');
  const { user } = useContext(AuthContext);

  const [roomDetail, setRoomDetail] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [roomError, setRoomError] = useState(null);

  const [auction, setAuction] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [imageIndex, setImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('history');

  const [customBid, setCustomBid] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [bidding, setBidding] = useState(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const sessionStatus = roomDetail?.sessionStatus || 'loading';
  const currentAuctionId = roomDetail?.currentAuctionId;

  const schedule = roomDetail?.schedule || [];

  const currentProduct = useMemo(() => {
    if (!schedule.length) return null;
    if (currentAuctionId) {
      const active = schedule.find((s) => s.auctionId === currentAuctionId);
      if (active) return mapScheduleToProduct(active);
    }
    const now = Date.now();
    const next = schedule.find((s) => new Date(s.startTime).getTime() > now);
    if (next && (sessionStatus === 'break' || sessionStatus === 'waiting')) {
      return mapScheduleToProduct(next);
    }
    return mapScheduleToProduct(schedule[schedule.length - 1]);
  }, [schedule, currentAuctionId, sessionStatus]);

  const loadRoomDetail = useCallback(async () => {
    if (!roomCode) return;
    try {
      const res = await getLiveRoomDetail(roomCode);
      setRoomDetail(res?.data);
      setRoomError(null);
    } catch (err) {
      setRoomError(err?.message || 'Không tải được phòng live');
    } finally {
      setLoadingRoom(false);
    }
  }, [roomCode]);

  const loadAuctionDetail = useCallback(async () => {
    if (!currentAuctionId) {
      setAuction(null);
      return;
    }
    try {
      const res = await normalAuctionDetailApi.getAuctionDetail(currentAuctionId);
      const data = res?.data || res;
      setAuction(data);
      if (data.chatHistory) {
        setMessages(
          data.chatHistory.map((m, i) => ({
            id: i,
            user: m.sender,
            message: m.content,
            type: 'user',
            createdAt: m.createdAt,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, [currentAuctionId]);

  useEffect(() => {
    loadRoomDetail();
    const interval = setInterval(loadRoomDetail, 5000);
    return () => clearInterval(interval);
  }, [loadRoomDetail]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAuctionDetail();
  }, [loadAuctionDetail]);

  useEffect(() => {
    if (!currentAuctionId || sessionStatus !== 'live') {
      disconnectWebSocket();
      return;
    }

    connectWebSocket(currentAuctionId, (data) => {
      if (data.type === 'NEW_BID') {
        setAuction((prev) => {
          if (!prev) return prev;
          const newBid = { bidder: data.bidder, amount: data.price, bidTime: data.bidTime };
          return {
            ...prev,
            currentPrice: data.price,
            totalBids: (prev.totalBids || 0) + 1,
            bidHistory: [newBid, ...(prev.bidHistory || [])].slice(0, 20),
          };
        });
        setActiveTab('history');
      } else if (data.type === 'AUCTION_ENDED') {
        loadRoomDetail();
        loadAuctionDetail();
      } else if (data.type === 'ERROR') {
        setBidError(data.message || 'Có lỗi xảy ra');
        setTimeout(() => setBidError(''), 4000);
      } else if (data.type === 'CHAT') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            user: data.sender,
            message: data.content,
            type: 'user',
            createdAt: data.createdAt,
          },
        ]);
      }
    });

    return () => disconnectWebSocket();
  }, [currentAuctionId, sessionStatus, loadRoomDetail, loadAuctionDetail]);

  useEffect(() => {
    if (sessionStatus !== 'live' || !currentProduct?.images?.length) return;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % currentProduct.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentProduct, sessionStatus]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isViewerSeller =
    user && roomDetail && String(user.userId) === String(roomDetail.sellerId);

  const needsDeposit =
    user &&
    auction &&
    sessionStatus === 'live' &&
    !isViewerSeller &&
    auction.hasPaidDeposit !== true &&
    auction.auctionStatus === 'ACTIVE';

  const handlePlaceDeposit = async () => {
    if (!currentAuctionId) return;
    setDepositLoading(true);
    setBidError('');
    try {
      await normalAuctionDetailApi.placeAuctionDeposit(currentAuctionId);
      await loadAuctionDetail();
      setBidSuccess('Đặt cọc thành công — bạn có thể đặt giá.');
      setTimeout(() => setBidSuccess(''), 5000);
    } catch (err) {
      setBidError(err?.message || 'Không thể đặt cọc');
    } finally {
      setDepositLoading(false);
    }
  };

  const getCountdown = () => {
    if (!currentProduct) return '00:00';
    let targetTime = null;
    if (sessionStatus === 'live') targetTime = new Date(currentProduct.endTime);
    else if (sessionStatus === 'break' || sessionStatus === 'waiting')
      targetTime = new Date(currentProduct.startTime);
    else return '00:00';

    const diff = Math.max(0, Math.floor((targetTime.getTime() - currentTime.getTime()) / 1000));
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCustomBidChange = (e) => {
    setCustomBid(formatInputNumber(e.target.value));
  };

  const executeBid = (amount) => {
    if (sessionStatus !== 'live' || !currentAuctionId) return;
    if (!user) {
      setBidError('Vui lòng đăng nhập để đặt giá');
      return;
    }
    if (needsDeposit) {
      setBidError(
        `Bạn cần đặt cọc ${formatCurrency(auction.depositRequiredAmount)} trước khi đặt giá.`
      );
      return;
    }
    if (isViewerSeller) {
      setBidError('Người bán không thể tự đặt giá');
      return;
    }

    const minBid = (auction?.currentPrice || currentProduct.startPrice) + currentProduct.minBidStep;
    if (amount < minBid) {
      setBidError(`Giá phải >= ${formatCurrency(minBid)}`);
      return;
    }

    setBidding(true);
    setBidError('');
    sendBid({ auctionId: currentAuctionId, bidAmount: amount });
    setBidSuccess('Đã gửi giá thầu!');
    setCustomBid('');
    setTimeout(() => {
      setBidding(false);
      setBidSuccess('');
    }, 2000);
    setActiveTab('history');
  };

  const bidHistory = auction?.bidHistory || [];
  const displayPrice = auction?.currentPrice ?? currentProduct?.startPrice ?? 0;
  const topBidder = bidHistory[0]?.bidder;

  if (!roomCode) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <p>Thiếu mã phòng live. Vui lòng truy cập từ danh sách phiên live.</p>
          <Link to="/list-live-auctions" className="text-blue-400 font-bold underline">
            Xem danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (loadingRoom && !roomDetail) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (roomError || !roomDetail || !currentProduct) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <p>{roomError || 'Không tìm thấy phòng live'}</p>
          <Link to="/list-live-auctions" className="text-blue-400 font-bold underline">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col overflow-hidden">
      <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-slate-950/60 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white uppercase italic">
              AUCTION <span className="text-blue-500">LIVE</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase">
              {roomDetail.roomCode} · {roomDetail.sessionTitle}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-4 px-4 py-1.5 rounded-xl border transition-all ${
            sessionStatus === 'live' ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-900 border-white/10'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              sessionStatus === 'live' ? 'bg-red-500 animate-pulse' : 'bg-slate-600'
            }`}
          />
          <span className="text-white font-mono text-lg font-bold uppercase">
            {sessionStatus === 'break' || sessionStatus === 'waiting' ? 'Chờ phiên kế: ' : ''}
            {getCountdown()}
          </span>
        </div>
      </header>

      {(sessionStatus === 'break' || sessionStatus === 'waiting') && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center">
          <Timer className="w-16 h-16 text-blue-500 animate-pulse mb-4" />
          <h2 className="text-3xl font-black text-white uppercase mb-2">
            {sessionStatus === 'waiting' ? 'Phiên sắp bắt đầu' : 'Đang chuẩn bị sản phẩm mới'}
          </h2>
          <p className="text-slate-400 mb-8 max-w-md text-sm italic">
            Vui lòng đợi trong giây lát, siêu phẩm tiếp theo sắp xuất hiện...
          </p>
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-4 w-full max-w-sm">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Sắp lên sóng</span>
            <img
              src={currentProduct.images[0]}
              className="w-32 h-32 rounded-2xl object-cover shadow-2xl"
              alt="next"
            />
            <p className="text-white font-bold px-4">{currentProduct.title}</p>
            <div className="text-4xl font-mono text-white font-black">{getCountdown()}</div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-[60%] overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8 bg-slate-950/20">
          <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-900 group">
            {sessionStatus === 'live' && (
              <img
                src={currentProduct.images[imageIndex]}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                alt="product"
              />
            )}
            {sessionStatus !== 'live' && (
              <img
                src={currentProduct.images[0]}
                className="w-full h-full object-cover opacity-60"
                alt="preview"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <h2 className="text-2xl lg:text-4xl font-black text-white uppercase italic drop-shadow-2xl max-w-2xl">
                {currentProduct.title}
              </h2>
              <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">{roomDetail.roomName}</span>
              </div>
            </div>
            {sessionStatus === 'live' && (
              <div className="absolute top-8 left-8 flex items-center gap-2 bg-red-600 px-3 py-1 rounded text-[10px] font-bold animate-pulse">
                LIVE
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText className="w-4 h-4" /> Mô tả sản phẩm
              </h3>
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl min-h-[180px]">
                <p className="text-sm text-slate-400 leading-relaxed italic">{currentProduct.description}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Package className="w-4 h-4" /> Thông số kỹ thuật
              </h3>
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl min-h-[180px] space-y-3">
                {currentProduct.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{spec.label}</span>
                    <span className="text-xs text-slate-200 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Lịch trình phiên đấu giá
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase italic">
                {schedule.length} Sản phẩm
              </span>
            </div>

            <div className="space-y-3">
              {schedule.map((item, index) => {
                const mapped = mapScheduleToProduct(item);
                const isNow = item.auctionId === currentAuctionId && sessionStatus === 'live';
                const isPast =
                  item.auctionStatus === 'ENDED' ||
                  new Date(item.endTime).getTime() < currentTime.getTime();

                return (
                  <div key={item.auctionId} className="relative group">
                    {index !== schedule.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-[-12px] w-[2px] bg-white/5 z-0" />
                    )}
                    <div
                      className={`relative z-10 flex items-center gap-5 p-4 rounded-2xl border transition-all duration-300 ${
                        isNow
                          ? 'bg-blue-600/10 border-blue-500/40 ring-1 ring-blue-500/20 translate-x-2'
                          : 'bg-white/[0.02] border-white/5'
                      }`}
                    >
                      <div
                        className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          isNow ? 'bg-blue-600 shadow-xl shadow-blue-600/40 scale-110' : 'bg-slate-800'
                        }`}
                      >
                        {isPast ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : isNow ? (
                          <PlayCircle className="w-6 h-6 text-white animate-pulse" />
                        ) : (
                          <Clock className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 grid md:grid-cols-4 items-center gap-4">
                        <div className="md:col-span-2">
                          <p
                            className={`text-[11px] font-black uppercase truncate ${
                              isNow ? 'text-white' : 'text-slate-500'
                            }`}
                          >
                            {mapped.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                isNow
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-slate-800 text-slate-600'
                              }`}
                            >
                              {isPast ? 'ĐÃ KẾT THÚC' : isNow ? 'ĐANG DIỄN RA' : 'CHỜ PHIÊN'}
                            </span>
                          </div>
                        </div>
                        <div className="hidden md:block text-center">
                          <p className="text-[9px] text-slate-600 font-bold uppercase mb-0.5">Thời gian</p>
                          <p
                            className={`text-[10px] font-mono font-bold ${
                              isNow ? 'text-blue-400' : 'text-slate-500'
                            }`}
                          >
                            {new Date(item.startTime).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {new Date(item.endTime).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-600 font-bold uppercase mb-0.5">Khởi điểm</p>
                          <p className={`text-[11px] font-black ${isNow ? 'text-white' : 'text-slate-500'}`}>
                            {formatPrice(mapped.startPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:w-[40%] flex flex-col border-l border-white/5 bg-slate-950/60 backdrop-blur-xl">
          <div className="p-6 border-b border-white/5 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2rem] p-7 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">
                  Đấu giá hiện tại
                </p>
                <h3 className="text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tighter">
                  {formatPrice(displayPrice)}
                </h3>
                <div className="mt-4 inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-black text-white uppercase">
                    {topBidder || 'Đang chờ lượt đầu'}
                  </span>
                </div>
              </div>
              <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Giá khởi điểm</p>
                <p className="text-sm font-bold text-slate-300">{formatPrice(currentProduct.startPrice)}</p>
              </div>
              <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                <p className="text-[9px] text-blue-500 uppercase font-bold mb-1">Bước giá tối thiểu</p>
                <p className="text-sm font-bold text-blue-400">+{formatPrice(currentProduct.minBidStep)}</p>
              </div>
            </div>

            {sessionStatus === 'live' && needsDeposit && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                      Đặt cọc tham gia
                    </p>
                    <p className="text-sm text-amber-100/90 font-medium mt-1 leading-snug">
                      Để đặt giá, bạn cần đặt cọc{' '}
                      <span className="font-black text-white">
                        {formatCurrency(auction?.depositRequiredAmount)}
                      </span>{' '}
                      (10% giá khởi điểm). Số tiền được giữ trong ví cho đến khi phiên kết thúc.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePlaceDeposit}
                  disabled={depositLoading}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {depositLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Coins className="w-4 h-4" />
                  )}
                  {depositLoading ? 'Đang xử lý...' : 'Đặt cọc ngay'}
                </button>
              </div>
            )}

            {isViewerSeller && sessionStatus === 'live' && (
              <div className="p-3 rounded-xl bg-slate-800/50 border border-white/10 text-[11px] text-slate-400 font-bold">
                Bạn là người bán — không cần đặt cọc và không thể tự đặt giá.
              </div>
            )}

            {bidError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">
                {bidError}
              </div>
            )}
            {bidSuccess && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs font-bold">
                {bidSuccess}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() =>
                  executeBid(displayPrice + currentProduct.minBidStep)
                }
                disabled={
                  sessionStatus !== 'live' || needsDeposit || isViewerSeller || bidding
                }
                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-20"
              >
                <Hammer className="w-4 h-4 fill-current" /> Đấu giá ngay:{' '}
                {formatPrice(displayPrice + currentProduct.minBidStep)}
              </button>

              <div className="relative flex items-center gap-2">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    value={customBid}
                    onChange={handleCustomBidChange}
                    placeholder="Nhập giá bạn muốn..."
                    disabled={sessionStatus !== 'live' || needsDeposit || isViewerSeller}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-10 text-[11px] font-bold text-white focus:border-blue-500 outline-none transition-all disabled:opacity-40"
                  />
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500" />
                </div>
                <button
                  onClick={() => {
                    const val = parseInputNumber(customBid);
                    if (val > 0) executeBid(val);
                  }}
                  disabled={
                    !customBid || sessionStatus !== 'live' || needsDeposit || isViewerSeller || bidding
                  }
                  className="bg-blue-600 px-5 py-4 rounded-xl text-white disabled:opacity-30 active:scale-90 transition-all shadow-lg flex items-center justify-center"
                >
                  <Gavel className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex border-b border-white/5">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'history'
                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <History className="w-4 h-4" /> Lịch sử ({bidHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'chat'
                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Chat trực tiếp
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-black/10">
              {activeTab === 'history' ? (
                <div className="space-y-3">
                  {bidHistory.map((bid, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 rounded-2xl border animate-in slide-in-from-right duration-500 ${
                        i === 0
                          ? 'bg-blue-600/10 border-blue-500/30 shadow-lg'
                          : 'bg-white/[0.02] border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black ${
                            i === 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {bid.bidder?.[0] || '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black">{bid.bidder}</span>
                          <span className="text-[9px] text-slate-600 font-bold">
                            {formatTimeSince(bid.bidTime)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[13px] font-black tabular-nums ${
                          i === 0 ? 'text-blue-400' : 'text-slate-500'
                        }`}
                      >
                        {formatPrice(bid.amount)}
                      </span>
                    </div>
                  ))}
                  {bidHistory.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-700">
                      <Activity className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        Đang chờ lượt đấu đầu tiên...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((chat) => (
                    <div
                      key={chat.id}
                      className={chat.type === 'system' ? 'text-center' : 'flex flex-col'}
                    >
                      {chat.type === 'system' ? (
                        <span className="text-[9px] font-black text-slate-600 uppercase italic bg-white/5 px-4 py-1.5 rounded-full inline-block">
                          {chat.message}
                        </span>
                      ) : (
                        <div className="flex flex-col items-start">
                          <span className="text-[9px] font-black text-slate-600 uppercase mb-1 ml-1">
                            {chat.user}
                          </span>
                          <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-2xl rounded-tl-none max-w-[85%]">
                            <p className="text-xs text-slate-300 leading-relaxed">{chat.message}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {activeTab === 'chat' && sessionStatus === 'live' && (
              <div className="p-4 bg-slate-950 border-t border-white/5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMessage.trim() || !user || !currentAuctionId) return;
                    sendChatMessage({
                      auctionId: currentAuctionId,
                      content: newMessage.trim(),
                    });
                    setNewMessage('');
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder={user ? 'Tham gia thảo luận...' : 'Đăng nhập để chat'}
                    disabled={!user}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-5 text-xs text-white outline-none focus:border-blue-500 transition-all pr-14 shadow-inner disabled:opacity-50"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!user}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.4); }
      `}</style>
    </div>
  );
};

export default LiveAuctionDetail;
