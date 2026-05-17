import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Gavel, Users, CreditCard, 
  Settings, Bell, Search, TrendingUp, 
  ArrowUpRight, ArrowDownRight, MoreVertical, 
  Clock, Radio, Menu, X, Plus, Edit3, Trash2,
  ChevronLeft, ChevronRight, Activity, Calendar,
  BarChart3, Moon, Sun, ExternalLink, LogOut,
  ShieldCheck, Layers, DollarSign, Eye, RefreshCw,
  PlusCircle, Filter, CheckCircle, XCircle, AlertCircle, Info,
  Sparkles, ShieldAlert, Award, Gem, HelpCircle, Check
} from 'lucide-react';

// --- MOCK DATA BAN ĐẦU ---
const INITIAL_STATS = [
  { label: 'Tổng doanh thu gói VIP', value: '1.240.000.000 ₫', trend: '+12.5%', isUp: true, icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Phiên đấu đang chạy', value: '42', sub: '12 Live - 30 Normal', icon: <Gavel className="w-5 h-5" /> },
  { label: 'Thành viên trả phí', value: '124', trend: '+18%', isUp: true, icon: <Users className="w-5 h-5" /> },
  { label: 'Gói VIP Active', value: '89', trend: '-2%', isUp: false, icon: <CreditCard className="w-5 h-5" /> },
];

const MOCK_AUCTIONS = [
  { id: 1, product: "Rolex Submariner 2023", seller: "Hoàng Gia Luxury", currentPrice: 450000000, status: "ACTIVE", type: "LIVE" },
  { id: 2, product: "Tranh sơn mài Cổ", seller: "Antique Heritage", currentPrice: 85000000, status: "PENDING", type: "NORMAL" },
  { id: 3, product: "iPhone 15 Pro Max Gold", seller: "TechWorld VN", currentPrice: 32000000, status: "COMPLETED", type: "NORMAL" },
];

const INITIAL_PLANS = [
  { id: 1, name: "Gói Đấu Giá Bạc (Silver)", price: 199000, durationDays: 30, maxLiveRooms: 3, tier: 'silver' },
  { id: 2, name: "Gói Đấu Giá Vàng (Gold Pro)", price: 549000, durationDays: 90, maxLiveRooms: 10, tier: 'gold' },
  { id: 3, name: "Gói Kim Cương (Diamond Live)", price: 1499000, durationDays: 180, maxLiveRooms: 35, tier: 'diamond' },
];

const INITIAL_USER_SUBSCRIPTIONS = [
  { 
    id: 1, 
    user: { id: 101, name: "Trần Thế Anh", email: "theanh.tran@gmail.com", avatar: "A" }, 
    plan: INITIAL_PLANS[2], 
    startDate: "2026-03-01T08:00:00", 
    endDate: "2026-08-28T08:00:00", 
    status: "ACTIVE" 
  },
  { 
    id: 2, 
    user: { id: 102, name: "Nguyễn Thị Mai Chi", email: "maichi99@yahoo.com", avatar: "M" }, 
    plan: INITIAL_PLANS[1], 
    startDate: "2026-01-15T14:30:00", 
    endDate: "2026-04-15T14:30:00", 
    status: "EXPIRED" 
  },
  { 
    id: 3, 
    user: { id: 103, name: "Lê Hoàng Long", email: "longlh.tech@gmail.com", avatar: "L" }, 
    plan: INITIAL_PLANS[0], 
    startDate: "2026-05-10T10:00:00", 
    endDate: "2026-06-09T10:00:00", 
    status: "ACTIVE" 
  },
  { 
    id: 4, 
    user: { id: 104, name: "Phạm Hải Đăng", email: "haidang.bds@hotmail.com", avatar: "Đ" }, 
    plan: INITIAL_PLANS[1], 
    startDate: "2026-02-10T09:15:00", 
    endDate: "2026-05-11T09:15:00", 
    status: "CANCELLED" 
  }
];

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
};

const SidebarItem = ({ icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 group relative ${
      active 
        ? 'bg-gradient-to-r from-blue-600/15 to-transparent border-r-4 border-blue-500 text-blue-500 dark:text-blue-400 font-bold' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-500'
    }`}
  >
    <div className="flex items-center justify-center min-w-[24px]">
      <span className={`${active ? 'text-blue-500' : 'group-hover:text-blue-500 transition-colors duration-200'}`}>{icon}</span>
    </div>
    {!collapsed && (
      <span className="font-bold text-xs uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
    )}
  </button>
);

// --- CHARTS ---

const RevenueChart = () => (
  <div className="w-full h-48 relative mt-4">
    <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 80 Q 50 20, 100 50 T 200 40 T 300 10 T 400 30 V 100 H 0 Z" fill="url(#chartGradient)" />
      <path d="M0 80 Q 50 20, 100 50 T 200 40 T 300 10 T 400 30" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
      <span>T2</span><span>T4</span><span>T6</span><span>CN</span>
    </div>
  </div>
);

const SubscriptionChart = () => {
  const data = [
    { name: 'Silver', value: 35, color: '#94a3b8' },
    { name: 'Gold', value: 85, color: '#eab308' },
    { name: 'Diamond', value: 50, color: '#06b6d4' },
  ];
  return (
    <div className="flex items-end justify-around h-32 mt-6 gap-2">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center w-full gap-2">
          <div className="w-full flex items-end justify-center h-24">
             <div className="w-6 rounded-t-lg transition-all duration-500" style={{ height: `${item.value}%`, backgroundColor: item.color }}></div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('subscriptions'); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  // States dành cho Quản lý Gói & Đăng ký
  const [subTab, setSubTab] = useState('users-sub'); // 'users-sub' | 'plans'
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [userSubs, setUserSubs] = useState(INITIAL_USER_SUBSCRIPTIONS);
  
  // State Bộ lọc & Tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Toasts Notification state
  const [toasts, setToasts] = useState([]);

  // State quản lý Modals
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null); 
  
  const [showUserSubModal, setShowUserSubModal] = useState(false);
  
  // Custom Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger' // 'danger' | 'info' | 'warning'
  });

  // --- Form States cho Plan ---
  const [planForm, setPlanForm] = useState({
    name: '',
    price: 0,
    durationDays: 30,
    maxLiveRooms: 5
  });

  // --- Form States cho User Subscription ---
  const [userSubForm, setUserSubForm] = useState({
    userName: '',
    userEmail: '',
    planId: INITIAL_PLANS[0]?.id || 1,
    status: 'ACTIVE'
  });

  // Thêm thông báo Toast tiện ích
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Tự động phân cấp hạng gói (Tier) theo giá tiền (UX thông minh, giảm bớt trường nhập liệu cho Admin)
  const getTierByPrice = (price) => {
    if (price < 300000) return 'silver';
    if (price >= 1000000) return 'diamond';
    return 'gold';
  };

  // Tính toán thời gian còn lại (UI Thân thiện hóa)
  const calculateRemainingDays = (endDateStr) => {
    const today = new Date();
    const end = new Date(endDateStr);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // --- HÀM XỬ LÝ CHO GÓI DỊCH VỤ (SubscriptionPlan) ---

  const handleOpenPlanModal = (plan = null) => {
    if (plan) {
      setCurrentPlan(plan);
      setPlanForm({
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays,
        maxLiveRooms: plan.maxLiveRooms
      });
    } else {
      setCurrentPlan(null);
      setPlanForm({
        name: '',
        price: 199000,
        durationDays: 30,
        maxLiveRooms: 5
      });
    }
    setShowPlanModal(true);
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      showToast('Tên gói cước không được bỏ trống', 'warning');
      return;
    }

    const calculatedTier = getTierByPrice(Number(planForm.price));

    if (currentPlan) {
      // Sửa gói cũ
      setPlans(plans.map(p => p.id === currentPlan.id ? { 
        ...p, 
        ...planForm, 
        price: Number(planForm.price),
        tier: calculatedTier 
      } : p));
      showToast(`Đã cập nhật gói cước "${planForm.name}" thành công!`);
    } else {
      // Tạo gói mới
      const newId = plans.length > 0 ? Math.max(...plans.map(p => p.id)) + 1 : 1;
      setPlans([...plans, { 
        id: newId, 
        ...planForm, 
        price: Number(planForm.price),
        tier: calculatedTier 
      }]);
      showToast(`Đã thêm gói cước mới "${planForm.name}" thành công!`);
    }
    setShowPlanModal(false);
  };

  const handleDeletePlan = (id) => {
    const planToDelete = plans.find(p => p.id === id);
    if (!planToDelete) return;

    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa gói cước?',
      message: `Bạn đang thực hiện xóa gói cước "${planToDelete.name}". Những người dùng hiện đang đăng ký gói này vẫn giữ nguyên hạn mức cũ đến khi hết chu kỳ. Thao tác không thể hoàn tác.`,
      type: 'danger',
      onConfirm: () => {
        setPlans(plans.filter(p => p.id !== id));
        setConfirmModal({ ...confirmModal, isOpen: false });
        showToast(`Đã xóa gói "${planToDelete.name}" thành công!`, 'warning');
      }
    });
  };

  // --- HÀM XỬ LÝ LƯỢT ĐĂNG KÝ (UserSubscription) ---

  const handleOpenUserSubModal = () => {
    setUserSubForm({
      userName: '',
      userEmail: '',
      planId: plans[0]?.id || 1,
      status: 'ACTIVE'
    });
    setShowUserSubModal(true);
  };

  const handleSaveUserSub = (e) => {
    e.preventDefault();
    if (!userSubForm.userName.trim() || !userSubForm.userEmail.trim()) return;

    const selectedPlan = plans.find(p => p.id === Number(userSubForm.planId)) || plans[0];
    const newId = userSubs.length > 0 ? Math.max(...userSubs.map(s => s.id)) + 1 : 1;
    
    // Giả lập logic tương tự @PrePersist của Java Entity Backend
    const startDate = new Date().toISOString();
    const endDays = selectedPlan.durationDays;
    const endDateObj = new Date();
    endDateObj.setDate(endDateObj.getDate() + endDays);
    const endDate = endDateObj.toISOString();

    const newSub = {
      id: newId,
      user: {
        id: Math.floor(Math.random() * 900) + 100,
        name: userSubForm.userName,
        email: userSubForm.userEmail,
        avatar: userSubForm.userName.charAt(0).toUpperCase()
      },
      plan: selectedPlan,
      startDate: startDate,
      endDate: endDate,
      status: userSubForm.status
    };

    setUserSubs([newSub, ...userSubs]);
    setShowUserSubModal(false);
    showToast(`Đã kích hoạt thành công gói ${selectedPlan.name} cho khách hàng ${userSubForm.userName}!`);
  };

  const handleChangeSubStatus = (subId, newStatus) => {
    const subObj = userSubs.find(s => s.id === subId);
    if (!subObj) return;

    const statusMapText = {
      ACTIVE: 'Kích hoạt lại',
      CANCELLED: 'Hủy kích hoạt',
      EXPIRED: 'Hết hạn'
    };

    setConfirmModal({
      isOpen: true,
      title: `${statusMapText[newStatus]} VIP cho khách hàng?`,
      message: `Xác nhận chuyển trạng thái gói đăng ký của khách hàng ${subObj.user.name} sang "${newStatus}". Quyền lợi truy cập phòng đấu giá của họ sẽ được điều chỉnh ngay lập tức.`,
      type: newStatus === 'ACTIVE' ? 'info' : 'warning',
      onConfirm: () => {
        setUserSubs(userSubs.map(sub => {
          if (sub.id === subId) {
            return { ...sub, status: newStatus };
          }
          return sub;
        }));
        setConfirmModal({ ...confirmModal, isOpen: false });
        showToast(`Đã chuyển trạng thái sang ${newStatus} cho ${subObj.user.name}.`);
      }
    });
  };

  // --- FILTERING ---
  const filteredUserSubs = userSubs.filter(sub => {
    const matchesSearch = sub.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.plan.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans">
        
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-white/5 transition-all duration-300 ease-in-out 
          ${collapsed ? 'w-20' : 'w-64'}`}>
          
          <div className={`p-6 flex items-center transition-all ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Gavel className="w-5 h-5 animate-pulse" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-tighter dark:text-white flex items-center gap-1">
                  Auction Hub <Sparkles size={12} className="text-amber-500" />
                </span>
                <span className="text-[8px] tracking-widest text-blue-500 font-black uppercase">Quản trị Hệ thống</span>
              </div>
            )}
          </div>

          <nav className="mt-4">
            <SidebarItem icon={<LayoutDashboard size={18}/>} label="Tổng quan" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={collapsed} />
            <SidebarItem icon={<Gavel size={18}/>} label="Phiên đấu" active={activeTab === 'auctions'} onClick={() => setActiveTab('auctions')} collapsed={collapsed} />
            <SidebarItem icon={<Users size={18}/>} label="Người dùng" active={activeTab === 'users'} onClick={() => setActiveTab('users')} collapsed={collapsed} />
            <SidebarItem icon={<CreditCard size={18}/>} label="Tài chính (Subs)" active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} collapsed={collapsed} />
            <SidebarItem icon={<Settings size={18}/>} label="Cài đặt" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={collapsed} />
          </nav>

          <div className="absolute bottom-6 w-full px-4">
             <button className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-semibold">
                <LogOut size={18} />
                {!collapsed && <span className="text-xs font-black uppercase tracking-wider">Đăng xuất</span>}
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          {/* Top Navbar */}
          <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0b1120]/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCollapsed(!collapsed)} 
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-all"
              >
                {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
              </button>

              <a 
                href="/" 
                target="_blank"
                onClick={(e) => e.preventDefault()}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase hover:bg-blue-100 transition-all border border-blue-200 dark:border-blue-500/20"
              >
                <ExternalLink size={12} />
                Xem trang chủ Web
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-500 rounded-lg transition-all shadow-inner"
                title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic">Quản trị viên</p>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">AD</div>
              </div>
            </div>
          </header>

          <div className="p-8">
            
            {/* TAB TỔNG QUAN (DASHBOARD) */}
            {activeTab === 'dashboard' && (
              <div className="animate-fadeIn space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <h1 className="text-2xl font-black dark:text-white tracking-tight uppercase italic">Tổng quan hệ thống</h1>
                  </div>
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Cập nhật lúc: {new Date().toLocaleTimeString()}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {INITIAL_STATS.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 p-5 rounded-3xl group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                          {stat.icon}
                        </div>
                        <span className={`text-[10px] font-black ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">{stat.label}</p>
                      <h3 className="text-xl font-black dark:text-white mt-1">{stat.value}</h3>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Chart Main */}
                  <div className="lg:col-span-8 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-sm font-black dark:text-white uppercase mb-6 flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-500"/> Doanh thu tuần này
                    </h2>
                    <RevenueChart />
                  </div>

                  {/* Chart Side */}
                  <div className="lg:col-span-4 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-sm font-black dark:text-white uppercase mb-6 flex items-center gap-2">
                      <CreditCard size={16} className="text-cyan-500"/> Gói đăng ký VIP
                    </h2>
                    <SubscriptionChart />
                  </div>

                  {/* Table */}
                  <div className="lg:col-span-12 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
                      <h2 className="text-sm font-black dark:text-white uppercase">Sản phẩm đang đấu giá</h2>
                      <span className="text-[10px] bg-blue-500/10 text-blue-500 font-bold px-2 py-1 rounded-full uppercase tracking-wider">3 Đang chạy</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Sản phẩm</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Loại</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Giá</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {MOCK_AUCTIONS.map((auction) => (
                            <tr key={auction.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-bold text-xs dark:text-white">{auction.product}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[9px] font-black px-2 py-1 rounded-md ${auction.type === 'LIVE' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'}`}>
                                  {auction.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs font-black dark:text-white">{formatCurrency(auction.currentPrice)}</td>
                              <td className="px-6 py-4"><StatusBadge status={auction.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB TÀI CHÍNH - QUẢN LÝ SUBSCRIPTIONS */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Header Subscriptions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <ShieldCheck className="w-5 h-5 text-blue-500" />
                      <h1 className="text-2xl font-black dark:text-white tracking-tight uppercase italic">Quản lý Đăng ký & VIP</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      Quản lý Gói dịch vụ (SubscriptionPlan) và Đăng ký từ khách hàng (UserSubscription)
                    </p>
                  </div>

                  {/* Bộ chuyển đổi giữa 2 bảng dữ liệu */}
                  <div className="flex p-1 bg-slate-200 dark:bg-white/5 rounded-2xl border border-slate-300 dark:border-white/5 self-start shadow-inner">
                    <button 
                      onClick={() => setSubTab('users-sub')}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${subTab === 'users-sub' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15' : 'text-slate-500 hover:text-blue-500'}`}
                    >
                      Người dùng đăng ký
                    </button>
                    <button 
                      onClick={() => setSubTab('plans')}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${subTab === 'plans' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15' : 'text-slate-500 hover:text-blue-500'}`}
                    >
                      Cấu hình Gói dịch vụ
                    </button>
                  </div>
                </div>

                {/* TAB CON 1: NHẬT KÝ ĐĂNG KÝ CỦA NGƯỜI DÙNG */}
                {subTab === 'users-sub' && (
                  <div className="space-y-6">
                    {/* Thống kê nhanh tài chính - Tương tác bấm vào lọc */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-md relative overflow-hidden hover:scale-[1.01] transition-all">
                        <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                          <CreditCard size={120} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Doanh thu dự kiến tháng này</span>
                        <h2 className="text-2xl font-black mt-2">124.500.000 ₫</h2>
                        <p className="text-[10px] mt-4 opacity-95 flex items-center gap-1">
                          <Info size={12} /> Tự động tính lũy kế theo chu kỳ mua VIP
                        </p>
                      </div>

                      <div 
                        onClick={() => setStatusFilter(statusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
                        className={`p-6 rounded-3xl shadow-sm border cursor-pointer transition-all hover:border-emerald-500/40 hover:scale-[1.01] ${statusFilter === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/20' : 'bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5'}`}
                        title="Bấm để lọc nhanh tài khoản đang Active"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Đang hoạt động (Active)</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        </div>
                        <h2 className="text-2xl font-black mt-2 text-emerald-500">
                          {userSubs.filter(s => s.status === 'ACTIVE').length} / {userSubs.length} tài khoản
                        </h2>
                        <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full transition-all" 
                            style={{ width: `${(userSubs.filter(s => s.status === 'ACTIVE').length / userSubs.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div 
                        onClick={() => setStatusFilter(statusFilter === 'EXPIRED' ? 'ALL' : 'EXPIRED')}
                        className={`p-6 rounded-3xl shadow-sm border cursor-pointer transition-all hover:border-amber-500/40 hover:scale-[1.01] ${statusFilter === 'EXPIRED' ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/20' : 'bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5'}`}
                        title="Bấm để lọc nhanh tài khoản đã Expired"
                      >
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-amber-500">Sắp hoặc đã hết hạn (Expired)</span>
                        <h2 className="text-2xl font-black mt-2 text-amber-500">
                          {userSubs.filter(s => s.status === 'EXPIRED').length} tài khoản
                        </h2>
                        <p className="text-[10px] text-slate-500 mt-4 flex items-center gap-1">
                          <Clock size={12} className="text-amber-500" /> Cần liên hệ CSKH hỗ trợ gia hạn
                        </p>
                      </div>
                    </div>

                    {/* Bộ lọc và Tìm kiếm */}
                    <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Tìm kiếm nhanh theo tên khách hàng, email hoặc tên gói..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 transition-all"
                          />
                          {searchQuery && (
                            <button 
                              onClick={() => setSearchQuery('')}
                              className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 justify-end">
                          <span className="text-[10px] font-bold text-slate-400 uppercase hidden xl:inline">Lọc trạng thái:</span>
                          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
                            {['ALL', 'ACTIVE', 'EXPIRED', 'CANCELLED'].map((st) => (
                              <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${statusFilter === st ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>

                          <button 
                            onClick={handleOpenUserSubModal}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase hover:bg-blue-700 transition-all shadow-md shadow-blue-500/15"
                          >
                            <PlusCircle size={15} /> Kích hoạt VIP thủ công
                          </button>
                        </div>
                      </div>

                      {/* Bảng danh sách UserSubscription */}
                      <div className="mt-6 overflow-x-auto border border-slate-100 dark:border-white/5 rounded-2xl">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-white/5">
                              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Khách hàng</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Gói sử dụng</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Hạn mức Live</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Hạn hiệu lực</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Giá dịch vụ</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Trạng thái</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Thao tác nhanh</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredUserSubs.length > 0 ? (
                              filteredUserSubs.map((sub) => {
                                const remaining = calculateRemainingDays(sub.endDate);
                                return (
                                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/20 shadow-sm">
                                          {sub.user.avatar}
                                        </div>
                                        <div>
                                          <div className="text-xs font-black dark:text-white flex items-center gap-1.5">
                                            {sub.user.name} 
                                            <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 dark:bg-white/10 text-slate-400 rounded-md font-bold">#{sub.id}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 mt-0.5">{sub.user.email}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                                        {sub.plan.name}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs font-black text-emerald-500">
                                          {sub.plan.maxLiveRooms}
                                        </span>
                                        <span className="text-[10px] text-slate-400">phòng active</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="space-y-1 max-w-[160px]">
                                        <div className="flex justify-between text-[10px]">
                                          <span className="text-slate-400">Thời hạn sử dụng:</span>
                                          {sub.status === 'ACTIVE' && (
                                            <span className={`font-bold ${remaining > 15 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                              Còn {remaining} ngày
                                            </span>
                                          )}
                                          {sub.status === 'EXPIRED' && (
                                            <span className="text-slate-400 font-bold">Hết hạn</span>
                                          )}
                                        </div>
                                        {/* Thanh tiến trình thời gian trực quan (UX cực thân thiện) */}
                                        <div className="w-full bg-slate-100 dark:bg-white/10 h-1 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full ${sub.status === 'ACTIVE' ? (remaining > 15 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-red-500'}`}
                                            style={{ width: `${sub.status === 'ACTIVE' ? Math.min(100, Math.max(0, (remaining / sub.plan.durationDays) * 100)) : 0}%` }}
                                          ></div>
                                        </div>
                                        <div className="text-[9px] text-slate-400 flex items-center gap-1">
                                          <span>Hết vào: {new Date(sub.endDate).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-xs font-black dark:text-white">{formatCurrency(sub.plan.price)}</div>
                                      <div className="text-[9px] text-slate-400 mt-0.5">Trọn gói {sub.plan.durationDays} ngày</div>
                                    </td>
                                    <td className="px-6 py-4">
                                      {sub.status === 'ACTIVE' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase">
                                          <CheckCircle size={10} /> Active
                                        </span>
                                      )}
                                      {sub.status === 'EXPIRED' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border bg-amber-500/10 text-amber-500 border-amber-500/20 uppercase">
                                          <Clock size={10} /> Expired
                                        </span>
                                      )}
                                      {sub.status === 'CANCELLED' && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border bg-red-500/10 text-red-500 border-red-500/20 uppercase">
                                          <XCircle size={10} /> Cancelled
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        {sub.status === 'ACTIVE' ? (
                                          <button 
                                            onClick={() => handleChangeSubStatus(sub.id, 'CANCELLED')}
                                            className="text-[10px] font-bold uppercase text-red-500 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition-all"
                                            title="Tạm ngừng dịch vụ của người dùng"
                                          >
                                            Hủy VIP
                                          </button>
                                        ) : (
                                          <button 
                                            onClick={() => handleChangeSubStatus(sub.id, 'ACTIVE')}
                                            className="text-[10px] font-bold uppercase text-emerald-500 hover:bg-emerald-500/10 px-2.5 py-1 rounded-lg transition-all"
                                            title="Kích hoạt lại dịch vụ"
                                          >
                                            Kích hoạt
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs">
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <ShieldAlert className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                                    <span>Không tìm thấy lượt đăng ký gói nào phù hợp với bộ lọc tìm kiếm.</span>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CON 2: CẤU HÌNH GÓI DỊCH VỤ (SubscriptionPlan) */}
                {subTab === 'plans' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-sm gap-4">
                      <div className="flex items-start gap-3">
                        <Info size={18} className="text-blue-500 mt-1" />
                        <div>
                          <h4 className="text-xs font-bold uppercase dark:text-white">Quy chế hoạt động Gói Đăng Ký (Entity)</h4>
                          <p className="text-slate-400 text-[10px] mt-1 max-w-xl leading-relaxed">
                            Việc chỉnh sửa giá hoặc số ngày của gói sẽ chỉ có hiệu lực với các lượt mua mới. Những hợp đồng hiện hữu của khách hàng vẫn được giữ nguyên tính toàn vẹn thông tin.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleOpenPlanModal()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-blue-700 shadow-md transition-all whitespace-nowrap self-stretch sm:self-auto justify-center"
                      >
                        <Plus size={16} /> Tạo gói dịch vụ mới
                      </button>
                    </div>

                    {/* Danh sách các Plan Card cao cấp */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {plans.map((plan) => {
                        // Xác định Icon cho từng Tier của Gói
                        const isSilver = plan.tier === 'silver';
                        const isGold = plan.tier === 'gold';
                        const isDiamond = plan.tier === 'diamond';

                        return (
                          <div 
                            key={plan.id} 
                            className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 group hover:translate-y-[-2px]"
                          >
                            {/* Thanh màu sắc định nghĩa Tier cao cấp */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${isSilver ? 'bg-slate-400' : isGold ? 'bg-amber-500' : 'bg-cyan-500'}`}></div>
                            
                            <div>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  {isSilver && <Award className="w-5 h-5 text-slate-400" />}
                                  {isGold && <Sparkles className="w-5 h-5 text-amber-500" />}
                                  {isDiamond && <Gem className="w-5 h-5 text-cyan-500 animate-pulse" />}
                                  <h3 className="text-sm font-black dark:text-white uppercase tracking-wide">{plan.name}</h3>
                                </div>
                                <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-md">ID: #{plan.id}</span>
                              </div>

                              <div className="flex items-baseline gap-1 my-5">
                                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(plan.price)}</span>
                                <span className="text-slate-400 text-[10px] font-bold">/{plan.durationDays} ngày</span>
                              </div>

                              <div className="space-y-3 my-6 border-t border-b border-slate-100 dark:border-white/5 py-4 text-xs">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400 font-medium">Thời hạn gói:</span>
                                  <span className="font-bold dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[11px]">{plan.durationDays} Ngày</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400 font-medium">Hạn mức Live cùng lúc:</span>
                                  <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md text-[11px]">{plan.maxLiveRooms} Phòng</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400 font-medium">Hỗ trợ kỹ thuật 24/7:</span>
                                  <span className="font-bold text-blue-500">{isSilver ? 'Thường' : 'Ưu tiên'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Khu vực hành động sửa xóa */}
                            <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-50 dark:border-white/5">
                              <button 
                                onClick={() => handleOpenPlanModal(plan)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-600 dark:text-slate-300 hover:text-blue-500 rounded-xl text-[11px] font-black uppercase transition-all"
                              >
                                <Edit3 size={12} /> Chỉnh sửa
                              </button>
                              <button 
                                onClick={() => handleDeletePlan(plan.id)}
                                className="px-3 py-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all"
                                title="Xóa gói đăng ký"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CÁC TAB KHÁC BẢO TRÌ */}
            {(activeTab === 'auctions' || activeTab === 'users' || activeTab === 'settings') && (
              <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-10 text-center animate-fadeIn">
                <ShieldCheck size={48} className="mx-auto text-blue-500 mb-4 animate-bounce" />
                <h2 className="text-lg font-black uppercase dark:text-white tracking-wide">Tính năng đang phát triển</h2>
                <p className="text-slate-400 text-xs max-w-md mx-auto mt-2 leading-relaxed">
                  Chúng tôi đang tập trung nâng cấp Module <b className="text-blue-500">Tài chính & Subscription</b> của bạn thật thân thiện và hoàn hảo. Hãy tiếp tục khám phá ở mục chính.
                </p>
                <button 
                  onClick={() => setActiveTab('subscriptions')}
                  className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-blue-700 shadow-md transition-all"
                >
                  Quay lại mục Subscription
                </button>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Modal Thêm/Sửa SubscriptionPlan - SIÊU TỐI GIẢN & THÂN THIỆN */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-slate-950/70 dark:bg-[#020617]/90 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-scaleUp flex flex-col lg:flex-row">
            
            {/* Cột trái: Form nhập liệu được tối ưu cực đẹp và tinh giản */}
            <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black dark:text-white uppercase tracking-wider">
                      {currentPlan ? 'Cấu hình gói dịch vụ' : 'Tạo gói dịch vụ mới'}
                    </h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold">Mẫu dữ liệu: SubscriptionPlan</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPlanModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-50 dark:bg-white/5 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePlan} className="space-y-6">
                
                {/* Tên gói */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Tên gói dịch vụ (subscription_name)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <CreditCard size={14} />
                    </div>
                    <input 
                      type="text" 
                      required
                      placeholder="Ví dụ: Gói Đấu Giá Hoàng Gia"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Giá tiền & Ngày sử dụng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Đơn giá thanh toán (price)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                        đ
                      </div>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="1000"
                        placeholder="Ví dụ: 450000"
                        value={planForm.price}
                        onChange={(e) => setPlanForm({...planForm, price: Number(e.target.value)})}
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-700 dark:text-slate-200 transition-all"
                      />
                      <span className="absolute inset-y-0 right-4 flex items-center text-[10px] font-bold text-slate-400 uppercase">VND</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Thời lượng sử dụng (duration_days)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Calendar size={14} />
                      </div>
                      <input 
                        type="number" 
                        required
                        min="1"
                        max="365"
                        placeholder="Ví dụ: 30"
                        value={planForm.durationDays}
                        onChange={(e) => setPlanForm({...planForm, durationDays: Number(e.target.value)})}
                        className="w-full pl-11 pr-14 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-700 dark:text-slate-200 transition-all"
                      />
                      <span className="absolute inset-y-0 right-4 flex items-center text-[10px] font-bold text-slate-400 uppercase">Ngày</span>
                    </div>
                  </div>
                </div>

                {/* Hạn mức live room (Chiều rộng đầy đủ trực quan) */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Hạn mức phòng đấu LIVE song song (max_live_rooms)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Radio size={14} />
                    </div>
                    <input 
                      type="number" 
                      required
                      min="1"
                      placeholder="Ví dụ: 10"
                      value={planForm.maxLiveRooms}
                      onChange={(e) => setPlanForm({...planForm, maxLiveRooms: Number(e.target.value)})}
                      className="w-full pl-11 pr-16 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-700 dark:text-slate-200 transition-all"
                    />
                    <span className="absolute inset-y-0 right-4 flex items-center text-[10px] font-bold text-slate-400 uppercase">Phòng</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-white/5">
                  <button 
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black uppercase transition-all tracking-wider"
                  >
                    Đóng
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25"
                  >
                    {currentPlan ? 'Lưu thay đổi' : 'Tạo gói ngay'}
                  </button>
                </div>
              </form>
            </div>

            {/* Cột phải: Live Preview Thẻ Gói Độc Đáo (Tự phân hạng theo giá tiền) */}
            <div className="w-full lg:w-[360px] bg-slate-50/50 dark:bg-[#070b16]/40 p-8 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute top-6 left-6 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Eye size={12} className="text-blue-500 animate-pulse" /> Xem trước theo thời gian thực
              </div>
              
              {/* Vòng tròn Decor ở nền của cột preview */}
              <div className="absolute right-[-40px] top-[-40px] w-32 h-32 rounded-full bg-blue-500/5 blur-2xl"></div>

              {/* Thẻ Plan hiển thị trực quan sinh động - Tự gán hạng theo giá */}
              {(() => {
                const autoTier = getTierByPrice(planForm.price);
                const isSilver = autoTier === 'silver';
                const isGold = autoTier === 'gold';
                const isDiamond = autoTier === 'diamond';

                return (
                  <div className="w-full max-w-[280px] bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-lg mt-6">
                    {/* Viền đỉnh màu sắc theo hạng tự động */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 ${isSilver ? 'bg-slate-400' : isGold ? 'bg-amber-500' : 'bg-cyan-500'}`}></div>

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        {isSilver && <Award className="w-4 h-4 text-slate-400" />}
                        {isGold && <Sparkles className="w-4 h-4 text-amber-500" />}
                        {isDiamond && <Gem className="w-4 h-4 text-cyan-500 animate-pulse" />}
                        <h4 className="text-[11px] font-black dark:text-white uppercase tracking-wide truncate max-w-[150px]">
                          {planForm.name || "Gói dịch vụ mới"}
                        </h4>
                      </div>
                      <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-50 dark:bg-white/5 text-slate-400 rounded">
                        Bản nháp
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-4">
                      <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                        {formatCurrency(planForm.price || 0)}
                      </span>
                      <span className="text-slate-400 text-[9px] font-bold">
                        /{planForm.durationDays || 30} ngày
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-b border-slate-100 dark:border-white/5 py-3 text-[10px] mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Thiết kế phân hạng:</span>
                        <span className="font-bold dark:text-white uppercase text-[9px] tracking-widest text-slate-500">
                          {isSilver && "Hạng Bạc (Silver)"}
                          {isGold && "Hạng Vàng (Gold Pro)"}
                          {isDiamond && "Hạng Kim Cương (VIP)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Hạn hiệu lực:</span>
                        <span className="font-bold dark:text-white">{planForm.durationDays || 30} Ngày</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Hạn mức Live:</span>
                        <span className="font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                          {planForm.maxLiveRooms || 3} phòng cùng lúc
                        </span>
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center italic mt-4">
                      * Hệ thống tự động phân hạng dựa trên giá gói.
                    </p>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* 2. Modal Tạo mới lượt đăng ký UserSubscription */}
      {showUserSubModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-[#020617]/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-black dark:text-white uppercase tracking-wider">
                  Kích hoạt VIP cho người dùng
                </h3>
              </div>
              <button 
                onClick={() => setShowUserSubModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUserSub} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Tên khách hàng</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nhập tên đầy đủ của người sử dụng..."
                  value={userSubForm.userName}
                  onChange={(e) => setUserSubForm({...userSubForm, userName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@gmail.com"
                  value={userSubForm.userEmail}
                  onChange={(e) => setUserSubForm({...userSubForm, userEmail: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 font-sans">Gói dịch vụ kích hoạt</label>
                <select 
                  value={userSubForm.planId}
                  onChange={(e) => setUserSubForm({...userSubForm, planId: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300 font-bold"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ({formatCurrency(p.price)} / {p.durationDays} ngày)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Trạng thái đăng ký ban đầu (status)</label>
                <select 
                  value={userSubForm.status}
                  onChange={(e) => setUserSubForm({...userSubForm, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300 font-bold"
                >
                  <option value="ACTIVE">ACTIVE (Mở quyền ngay)</option>
                  <option value="CANCELLED">CANCELLED (Tạm đóng)</option>
                </select>
                <span className="text-[9px] text-slate-400 block mt-1 leading-relaxed">
                  * Hệ thống tự gán ngày kích hoạt bắt đầu (`startDate`) là hôm nay, ngày kết thúc (`endDate`) tự động cộng lũy kế số ngày quy định của gói.
                </span>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <button 
                  type="button"
                  onClick={() => setShowUserSubModal(false)}
                  className="flex-1 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black uppercase transition-all"
                >
                  Đóng
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Kích hoạt ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL CONFIRMATION TÙY CHỈNH (Thay thế hoàn toàn 'confirm' mặc định để tăng tính thân thiện) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/70 dark:bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-3 text-red-500 dark:text-red-400 mb-4">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-black dark:text-white uppercase tracking-wider">
                {confirmModal.title}
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {confirmModal.message}
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
              <button 
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="flex-1 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black uppercase transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={confirmModal.onConfirm}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-red-500/15"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TOAST NOTIFICATION CORNER SYSTEM */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border pointer-events-auto animate-slideIn ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                : toast.type === 'warning'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : 'bg-blue-50/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 border-blue-500/20'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <p className="text-xs font-bold leading-normal">{toast.message}</p>
          </div>
        ))}
      </div>

    </div>
  );
}