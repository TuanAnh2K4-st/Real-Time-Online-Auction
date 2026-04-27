import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Gavel, Clock, Zap, FileText, 
  MessageCircle, Send, History,
  Tag, Coins, Loader2, AlertCircle
} from 'lucide-react';
import normalAuctionDetailApi from '../services/api/normalAuctionDetailApi';
import { connectWebSocket, disconnectWebSocket, sendBid, sendChatMessage } from '../services/websocket';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';

const formatCurrency = (amount) => {
  if (!amount) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatInputNumber = (val) => {
  if (!val) return "";
  const number = val.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseInputNumber = (val) => {
  if (!val) return 0;
  return parseInt(val.replace(/\./g, ""), 10) || 0;
};

const formatTimeLeft = (endTime) => {
  if (!endTime) return "00:00:00";
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;
  if (diff <= 0) return "00:00:00";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

const formatTimeSince = (time) => {
  if (!time) return "";
  const diff = Date.now() - new Date(time).getTime();
  if (diff < 60000) return "Vừa xong";
  if (diff < 3600000) return `${Math.floor(diff/60000)} phút trước`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)} giờ trước`;
  return new Date(time).toLocaleString("vi-VN");
};

const NormalAuctionDetail = () => {
  const { auctionId } = useParams();
  const { user } = useContext(AuthContext);

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [manualBid, setManualBid] = useState("");
  const [bidding, setBidding] = useState(false);
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");

  const [activeTab, setActiveTab] = useState('history');
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [isEnded, setIsEnded] = useState(false);

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const chatEndRef = useRef(null);

  // 1. Fetch auction detail
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await normalAuctionDetailApi.getAuctionDetail(auctionId);
        const data = res?.data || res;
        setAuction(data);
        setIsEnded(data.auctionStatus !== 'ACTIVE');
        if (data.chatHistory) {
          setMessages(data.chatHistory.map((m, i) => ({
            id: i, sender: m.sender, text: m.content, type: 'user', createdAt: m.createdAt
          })));
        }
      } catch (err) {
        setError("Không thể tải thông tin phiên đấu giá");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [auctionId]);

  // 2. WebSocket connection
  useEffect(() => {
    if (!auctionId) return;
    connectWebSocket(auctionId, (data) => {
      if (data.type === 'NEW_BID') {
        setAuction(prev => {
          if (!prev) return prev;
          const newBid = { bidder: data.bidder, amount: data.price, bidTime: data.bidTime };
          return {
            ...prev,
            currentPrice: data.price,
            totalBids: (prev.totalBids || 0) + 1,
            bidHistory: [newBid, ...(prev.bidHistory || [])].slice(0, 20)
          };
        });
      } else if (data.type === 'AUCTION_ENDED') {
        setIsEnded(true);
        setAuction(prev => prev ? { ...prev, auctionStatus: 'ENDED' } : prev);
      } else if (data.type === 'ERROR') {
        setBidError(data.message || "Có lỗi xảy ra");
        setTimeout(() => setBidError(""), 4000);
      } else if (data.type === 'CHAT') {
        setMessages(prev => [...prev, {
          id: Date.now(), sender: data.sender, text: data.content, type: 'user', createdAt: data.createdAt
        }]);
      }
    });
    return () => disconnectWebSocket();
  }, [auctionId]);

  // 3. Countdown timer
  useEffect(() => {
    if (!auction?.endTime) return;
    const timer = setInterval(() => {
      const tl = formatTimeLeft(auction.endTime);
      setTimeLeft(tl);
      if (tl === "00:00:00") setIsEnded(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [auction?.endTime]);

  // 4. Image carousel
  useEffect(() => {
    if (!auction?.images?.length) return;
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % auction.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [auction?.images?.length]);

  // 5. Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handlers
  const handlePlaceBid = () => {
    if (!user) { setBidError("Vui lòng đăng nhập để đặt giá"); return; }
    if (isEnded) { setBidError("Phiên đấu giá đã kết thúc"); return; }
    const amount = parseInputNumber(manualBid);
    if (!amount) { setBidError("Vui lòng nhập giá"); return; }
    const minBid = (auction?.currentPrice || 0) + (auction?.stepPrice || 0);
    if (amount < minBid) { setBidError(`Giá phải >= ${formatCurrency(minBid)}`); return; }

    setBidding(true); setBidError("");
    sendBid({ auctionId: parseInt(auctionId), bidAmount: amount });
    setBidSuccess("Đã gửi giá thầu!");
    setManualBid("");
    setTimeout(() => { setBidding(false); setBidSuccess(""); }, 2000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !user) return;
    sendChatMessage({ auctionId: parseInt(auctionId), content: chatInput });
    setChatInput("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-slate-400 font-bold">Đang tải phiên đấu giá...</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-slate-400 font-bold">{error || "Không tìm thấy phiên đấu giá"}</p>
        </div>
      </div>
    );
  }

  const images = auction.images || [];
  const bidHistory = auction.bidHistory || [];
  const specs = [];
  if (auction.brand) specs.push({ label: "Thương hiệu", value: auction.brand });
  if (auction.origin) specs.push({ label: "Xuất xứ", value: auction.origin });
  if (auction.productCondition) specs.push({ label: "Tình trạng", value: auction.productCondition });
  try {
    if (auction.attributesJson) {
      const attrs = JSON.parse(auction.attributesJson);
      if (Array.isArray(attrs)) attrs.forEach(a => specs.push({ label: a.label || a.key, value: a.value }));
      else Object.entries(attrs).forEach(([k,v]) => specs.push({ label: k, value: v }));
    }
  } catch(e) {}

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 pb-10">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Images & Product Info */}
          <div className="lg:col-span-7 space-y-10">
            {/* Image */}
            <div className="relative group">
              <div className="aspect-square rounded-[3.5rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl relative">
                {images.length > 0 ? images.map((img, idx) => (
                  <img key={idx} src={img} className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} alt="Auction" />
                )) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600"><Gavel className="w-20 h-20" /></div>
                )}
                {images.length > 1 && (
                  <div className="absolute inset-x-0 bottom-10 flex justify-center gap-2.5 z-10">
                    {images.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImageIndex ? 'w-10 bg-blue-500' : 'w-2.5 bg-white/30'}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description & Specs */}
            <div className="space-y-8">
              {auction.description && (
                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/10 rounded-lg"><FileText className="w-5 h-5 text-blue-500" /></div>
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Mô tả tài sản</h3>
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-transparent w-full" />
                  <p className="text-slate-400 leading-relaxed text-sm font-medium">{auction.description}</p>
                </div>
              )}

              {specs.length > 0 && (
                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/10 rounded-lg"><Tag className="w-5 h-5 text-blue-500" /></div>
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Thông số</h3>
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-transparent w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {specs.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{spec.label}</span>
                        <span className="text-[11px] font-black text-white">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seller */}
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl">
                {auction.sellerUsername?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div>
                <h4 className="text-lg font-black text-white italic">{auction.sellerUsername}</h4>
                <p className="text-xs text-slate-500 font-bold">Người bán</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Bidding */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-gradient-to-br from-blue-600/20 to-slate-950 rounded-[3rem] border border-blue-500/30 space-y-8 shadow-2xl">
              
              {/* Title */}
              <div>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{auction.category}</span>
                <h2 className="text-xl font-black text-white mt-1 leading-tight">{auction.productName}</h2>
              </div>

              {/* Price & Time */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Giá hiện tại</p>
                  <p className="text-4xl font-black text-white tracking-tighter">{formatCurrency(auction.currentPrice)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> Kết thúc
                  </p>
                  <p className={`text-xl font-black tabular-nums ${isEnded ? 'text-red-400' : 'text-white'}`}>{timeLeft}</p>
                </div>
              </div>

              {/* Start price & step */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg"><Tag className="w-4 h-4 text-blue-400" /></div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Giá khởi điểm</p>
                    <p className="text-xs font-black text-white">{formatCurrency(auction.startPrice)}</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg"><Coins className="w-4 h-4 text-yellow-400" /></div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Bước giá</p>
                    <p className="text-xs font-black text-white">{formatCurrency(auction.stepPrice)}</p>
                  </div>
                </div>
              </div>

              {/* Bid input */}
              {!isEnded && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nhập giá đặt mua (VNĐ)</p>
                    <div className="relative">
                      <input 
                        type="text" value={manualBid}
                        onChange={e => setManualBid(formatInputNumber(e.target.value))}
                        placeholder={`Tối thiểu: ${formatCurrency((auction.currentPrice || 0) + (auction.stepPrice || 0))}`}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-xl font-black text-white focus:border-blue-500 outline-none pr-16 shadow-inner"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-slate-700 italic">VNĐ</span>
                    </div>
                  </div>

                  {bidError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">{bidError}</div>
                  )}
                  {bidSuccess && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs font-bold">{bidSuccess}</div>
                  )}

                  <button 
                    onClick={handlePlaceBid} disabled={bidding}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl text-base font-black uppercase italic tracking-widest shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    {bidding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Gavel className="w-6 h-6" />}
                    {bidding ? "Đang gửi..." : "Xác nhận đặt giá"}
                  </button>
                </div>
              )}

              {isEnded && (
                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
                  <p className="text-red-400 font-black uppercase tracking-widest text-sm">Phiên đấu giá đã kết thúc</p>
                </div>
              )}
            </div>

            {/* Tabs: History & Chat */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-[500px]">
              <div className="flex border-b border-white/5">
                <button onClick={() => setActiveTab('history')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-blue-400' : 'text-slate-500'}`}>
                  <div className="flex items-center justify-center gap-2"><History className="w-3 h-3" /> Nhật ký ({auction.totalBids || 0})</div>
                  {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />}
                </button>
                <button onClick={() => setActiveTab('chat')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'chat' ? 'text-blue-400' : 'text-slate-500'}`}>
                  <div className="flex items-center justify-center gap-2"><MessageCircle className="w-3 h-3" /> Chat</div>
                  {activeTab === 'chat' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'history' ? (
                  <div className="space-y-3">
                    {bidHistory.length === 0 && <p className="text-slate-600 text-sm text-center py-8">Chưa có lượt đấu giá nào</p>}
                    {bidHistory.map((bid, i) => (
                      <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${i === 0 ? 'bg-blue-600/10 border-blue-500/30 ring-1 ring-blue-500/20' : 'bg-white/5 border-transparent opacity-60'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>{i + 1}</div>
                          <div>
                            <p className="text-xs font-black text-white flex items-center gap-2">
                              {bid.bidder}
                              {i === 0 && <span className="text-[8px] bg-green-500 text-white px-1 rounded uppercase tracking-tighter">Dẫn đầu</span>}
                            </p>
                            <p className="text-[9px] text-slate-500 font-bold">{formatTimeSince(bid.bidTime)}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-black ${i === 0 ? 'text-blue-400' : 'text-white'}`}>{formatCurrency(bid.amount)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                      {messages.length === 0 && <p className="text-slate-600 text-sm text-center py-8">Chưa có tin nhắn</p>}
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === user?.username ? 'items-end' : 'items-start'}`}>
                          <span className="text-[8px] font-black text-slate-500 uppercase mb-1 px-2">{msg.sender}</span>
                          <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] font-bold ${
                            msg.sender === user?.username ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                          }`}>{msg.text}</div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    {user && !isEnded && (
                      <div className="relative mt-auto">
                        <input 
                          type="text" value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Nhắn tin..."
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-blue-500"
                        />
                        <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NormalAuctionDetail;