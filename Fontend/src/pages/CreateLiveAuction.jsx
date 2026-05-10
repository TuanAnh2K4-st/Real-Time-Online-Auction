import React, { useState } from 'react';
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
  CreditCard,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_PRODUCTS = [
  { id: 'PROD-001', title: 'MacBook Pro M3 2024', store: 'Chi nhánh Quận 1', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400' },
  { id: 'PROD-002', title: 'iPhone 15 Pro Max', store: 'Chi nhánh Cầu Giấy', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d256e?auto=format&fit=crop&q=80&w=400' },
  { id: 'PROD-003', title: 'Sony Alpha A7 IV', store: 'Showroom Tân Bình', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400' },
  { id: 'PROD-004', title: 'Rolex Submariner', store: 'Hoàn Kiếm', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=400' },
];

const INITIAL_USER_ROOMS = [
  { id: 'R-ALPHA', name: 'Phòng Alpha - Studio 1' },
  { id: 'R-BETA', name: 'Phòng Beta - Studio 2' },
];

// --- SUB-COMPONENTS ---

const Dashboard = ({ liveSessions, setView }) => (
  <div className="space-y-12 animate-in fade-in duration-700">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
      <div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
          QUẢN LÝ <span className="text-red-600">LIVE</span>
        </h1>
        <p className="text-slate-500 mt-3 font-medium text-lg tracking-tight">Hệ thống điều phối đấu giá trực tuyến chuyên nghiệp.</p>
      </div>
      <button 
        onClick={() => setView('create-live')}
        className="flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/30"
      >
        <PlusCircle className="w-5 h-5" /> Thiết lập Live mới
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {liveSessions.length === 0 ? (
        <div className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center text-slate-700 bg-slate-900/10">
           <MonitorPlay className="w-16 h-16 mb-6 opacity-20" />
           <p className="font-black uppercase tracking-[0.3em] text-sm">Chưa có phiên Live nào được tạo</p>
        </div>
      ) : (
        liveSessions.map(session => (
          <div key={session.id} className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 space-y-6 hover:bg-slate-900/60 transition-all border-b-red-600/20 border-b-4">
            <div className="flex justify-between items-center">
              <span className="px-4 py-1.5 bg-red-600/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                {session.roomCode}
              </span>
              <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase">
                <Clock className="w-3.5 h-3.5" />
                {session.startTime || '---'}
              </div>
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic truncate">{session.title}</h3>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-3">
                  {session.selectedItems.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-full border-4 border-[#020617] overflow-hidden">
                      <img src={item.product.image} className="w-full h-full object-cover" alt="product" />
                    </div>
                  ))}
               </div>
               {session.selectedItems.length > 4 && (
                 <span className="text-[10px] font-black text-slate-500">+{session.selectedItems.length - 4} items</span>
               )}
            </div>
            <button className="w-full bg-white hover:bg-red-600 text-black hover:text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg">
              Kích hoạt Live
            </button>
          </div>
        ))
      )}
    </div>
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
  handleCreateLive 
}) => {
  return (
    <div className="animate-in slide-in-from-right-10 duration-700 space-y-10 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <button onClick={() => setView('dashboard')} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group">
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
        {/* Sidebar: Kho hàng */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-10">
          <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-6 space-y-6 backdrop-blur-md">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-red-600" /> Kho Sản Phẩm
              </h3>
              <span className="bg-red-600/10 text-red-500 text-[9px] font-black px-2 py-0.5 rounded-md">{INITIAL_PRODUCTS.length}</span>
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {INITIAL_PRODUCTS.map(p => (
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
                    <p className="text-[9px] text-slate-500 uppercase tracking-tighter mt-1">{p.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Form */}
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
                  onChange={(e) => setNewLive({...newLive, title: e.target.value})}
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
                    value={newLive.roomCode}
                    onChange={(e) => setNewLive({...newLive, roomCode: e.target.value})}
                  >
                    <option value="">Chọn Room</option>
                    {userRooms.map(room => (
                      <option key={room.id} value={room.id}>{room.id} - {room.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover:text-red-500 transition-colors">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-4">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                  <Calendar className="w-4 h-4 text-red-600" /> Giờ bắt đầu
                </label>
                <input 
                  type="time" 
                  className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl px-8 py-6 font-bold text-white outline-none focus:border-red-600/50 transition-all"
                  value={newLive.startTime}
                  onChange={(e) => setNewLive({...newLive, startTime: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 px-2">
                <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                  <ListOrdered className="w-6 h-6 text-red-600" /> Danh sách đấu giá
                </h3>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{newLive.selectedItems.length} Sản phẩm đã chọn</span>
              </div>
              
              <div className="space-y-5">
                {newLive.selectedItems.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-white/5 rounded-[3rem] p-8 hover:border-red-600/20 transition-all group animate-in slide-in-from-bottom-4">
                     <div className="flex flex-col xl:flex-row gap-10 items-center">
                        <div className="flex items-center gap-6 xl:w-1/4 w-full">
                           <div className="w-12 h-12 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center font-black text-sm shrink-0 border border-red-600/20 shadow-inner">
                              {idx + 1}
                           </div>
                           <img src={item.product.image} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/5 group-hover:border-red-600/30 transition-all" alt="thumb" />
                           <div className="min-w-0">
                              <p className="text-md font-black text-white truncate leading-tight uppercase italic">{item.product.title}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{item.product.store}</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 w-full">
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Tag className="w-3.5 h-3.5" /> Giá sàn (đ)
                              </label>
                              <input 
                                type="number"
                                value={item.startPrice}
                                onChange={(e) => updateItemConfig(idx, 'startPrice', e.target.value)}
                                className="w-full bg-slate-900/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:border-red-600/40"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <TrendingUp className="w-3.5 h-3.5" /> Bước giá (đ)
                              </label>
                              <input 
                                type="number"
                                value={item.bidStep}
                                onChange={(e) => updateItemConfig(idx, 'bidStep', e.target.value)}
                                className="w-full bg-slate-900/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:border-red-600/40"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Clock className="w-3.5 h-3.5" /> Live (Phút)
                              </label>
                              <select 
                                value={item.duration}
                                onChange={(e) => updateItemConfig(idx, 'duration', e.target.value)}
                                className="w-full bg-slate-900/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none appearance-none cursor-pointer"
                              >
                                {[1,2,3,5,10].map(v => <option key={v} value={v}>{v} phút</option>)}
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Radio className="w-3.5 h-3.5" /> Nghỉ (Phút)
                              </label>
                              <select 
                                value={item.gapTime}
                                onChange={(e) => updateItemConfig(idx, 'gapTime', e.target.value)}
                                className="w-full bg-slate-900/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none appearance-none cursor-pointer"
                              >
                                {[0,1,2,5].map(v => <option key={v} value={v}>{v} phút</option>)}
                              </select>
                           </div>
                        </div>

                        <button 
                          onClick={() => setNewLive({...newLive, selectedItems: newLive.selectedItems.filter((_, i) => i !== idx)})}
                          className="p-5 rounded-2xl bg-white/5 hover:bg-red-600/10 text-slate-600 hover:text-red-500 transition-all shrink-0 border border-white/5"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                     </div>
                  </div>
                ))}

                {newLive.selectedItems.length === 0 && (
                  <div className="py-32 border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-slate-700 bg-slate-950/20">
                     <Tag className="w-16 h-16 mb-6 opacity-10" />
                     <p className="text-[11px] font-black uppercase tracking-[0.4em] italic">Chọn sản phẩm từ danh sách bên trái để bắt đầu</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleCreateLive}
              disabled={!newLive.title || !newLive.roomCode || newLive.selectedItems.length === 0}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-20 text-white py-8 rounded-[3rem] font-black uppercase text-md tracking-[0.4em] shadow-[0_30px_60px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-6"
            >
              Lưu & Hoàn Tất Phiên Live
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [view, setView] = useState('dashboard');
  const [liveSessions, setLiveSessions] = useState([]);
  const [userRooms, setUserRooms] = useState(INITIAL_USER_ROOMS);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [newLive, setNewLive] = useState({
    title: '',
    roomCode: '',
    startTime: '',
    selectedItems: []
  });

  const registerNewRoom = () => {
    if (!newRoomName || !agreedToTerms) return;
    
    // Hệ thống tự tạo mã Room ngẫu nhiên chuyên nghiệp
    const generatedId = `RM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    setUserRooms([...userRooms, { id: generatedId, name: newRoomName }]);
    setNewRoomName('');
    setAgreedToTerms(false);
    setIsAddingRoom(false);
  };

  const addItemToLive = (product) => {
    if (newLive.selectedItems.find(i => i.product.id === product.id)) return;
    setNewLive({
      ...newLive,
      selectedItems: [...newLive.selectedItems, {
        product,
        duration: 3,
        gapTime: 1,
        startPrice: 1000000,
        bidStep: 100000
      }]
    });
  };

  const updateItemConfig = (index, field, value) => {
    const updated = [...newLive.selectedItems];
    updated[index][field] = value;
    setNewLive({ ...newLive, selectedItems: updated });
  };

  const handleCreateLive = () => {
    if (!newLive.title || !newLive.roomCode || newLive.selectedItems.length === 0) return;
    const session = {
      id: `LIVE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...newLive,
      status: 'scheduled',
      viewerCount: 0
    };
    setLiveSessions([session, ...liveSessions]);
    setView('dashboard');
    setNewLive({ title: '', roomCode: '', startTime: '', selectedItems: [] });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans selection:bg-red-600/40 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[200px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-600/5 blur-[200px] rounded-full"></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {view === 'dashboard' ? (
          <Dashboard liveSessions={liveSessions} setView={setView} />
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
          />
        )}
      </div>

      {/* Modal: Đăng ký Room - Cập nhật tự động tạo mã & Checkbox xác nhận */}
      {isAddingRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
           <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[4rem] p-10 md:p-14 space-y-8 animate-in zoom-in-95 shadow-[0_0_150px_rgba(0,0,0,0.8)]">
              <div className="text-center space-y-4">
                 <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center mx-auto mb-2 shadow-2xl shadow-red-600/30">
                    <MonitorPlay className="w-10 h-10" />
                 </div>
                 <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Tạo Room Live Mới</h3>
                 
                 <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[12px] font-black uppercase tracking-[0.1em]">Phí dịch vụ: 200.000 VNĐ</span>
                 </div>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-6 italic">Tên phòng gợi nhớ</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl px-8 py-6 font-black text-lg text-white outline-none focus:border-red-600 transition-all placeholder:text-slate-800"
                      placeholder="VD: Showroom Quận 1 - Tầng 2"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                    />
                 </div>

                 {/* Mã Room tự động thông báo */}
                 <div className="bg-slate-950/80 p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-start gap-4">
                       <ShieldCheck className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                       <div className="space-y-1">
                          <p className="text-[11px] text-white font-black uppercase tracking-widest">Hệ thống tự động</p>
                          <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
                            Mã Room Code sẽ được hệ thống khởi tạo ngẫu nhiên và bảo mật sau khi xác nhận thanh toán.
                          </p>
                       </div>
                    </div>
                    
                    {/* Checkbox điều khoản */}
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
                         Tôi đã đọc kĩ và hiểu các điều khoản, đồng ý thanh toán <span className="text-red-500 underline underline-offset-4">200.000 VNĐ</span> cho dịch vụ này.
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
                  disabled={!newRoomName || !agreedToTerms}
                  className="flex-[1.5] py-6 rounded-3xl bg-red-600 disabled:opacity-20 disabled:grayscale text-white font-black uppercase text-[11px] tracking-[0.2em] hover:bg-red-500 shadow-2xl shadow-red-600/40 transition-all active:scale-95"
                 >
                   Xác nhận Đăng ký
                 </button>
              </div>
           </div>
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
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.4; cursor: pointer; scale: 1.3; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
};

export default App;