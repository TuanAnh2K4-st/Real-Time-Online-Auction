import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Gavel, Users, CreditCard, 
  Settings, Bell, Search, TrendingUp, 
  ArrowUpRight, ArrowDownRight, MoreVertical, 
  Clock, Radio, Menu, X,
  ChevronLeft, ChevronRight, Activity, Calendar,
  BarChart3, Moon, Sun, ExternalLink, LogOut
} from 'lucide-react';

// --- MOCK DATA ---
const STATS = [
  { label: 'Tổng doanh thu', value: '1.240.000.000 ₫', trend: '+12.5%', isUp: true, icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Phiên đấu đang chạy', value: '42', sub: '12 Live - 30 Normal', icon: <Gavel className="w-5 h-5" /> },
  { label: 'Người dùng mới', value: '156', trend: '+18%', isUp: true, icon: <Users className="w-5 h-5" /> },
  { label: 'Gói VIP Active', value: '89', trend: '-2%', isUp: false, icon: <CreditCard className="w-5 h-5" /> },
];

const MOCK_AUCTIONS = [
  { id: 1, product: "Rolex Submariner 2023", seller: "Hoàng Gia Luxury", currentPrice: 450000000, status: "ACTIVE", type: "LIVE" },
  { id: 2, product: "Tranh sơn mài Cổ", seller: "Antique Heritage", currentPrice: 85000000, status: "PENDING", type: "NORMAL" },
  { id: 3, product: "iPhone 15 Pro Max Gold", seller: "TechWorld VN", currentPrice: 32000000, status: "COMPLETED", type: "NORMAL" },
];

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
};

const SidebarItem = ({ icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 group relative ${
      active 
        ? 'bg-blue-600/10 border-r-4 border-blue-500 text-blue-500' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-500'
    }`}
  >
    <div className="flex items-center justify-center min-w-[24px]">
      <span className={`${active ? 'text-blue-500' : 'group-hover:text-blue-500'}`}>{icon}</span>
    </div>
    {!collapsed && (
      <span className="font-bold text-sm uppercase tracking-wider whitespace-nowrap">
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
    { name: 'Basic', value: 45, color: '#6366f1' },
    { name: 'Pro', value: 78, color: '#3b82f6' },
    { name: 'VIP', value: 32, color: '#06b6d4' },
  ];
  return (
    <div className="flex items-end justify-around h-32 mt-6 gap-2">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center w-full gap-2">
          <div className="w-full flex items-end justify-center h-24">
             <div className="w-6 rounded-t-lg transition-all" style={{ height: `${item.value}%`, backgroundColor: item.color }}></div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans">
        
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-white/5 transition-all duration-300 ease-in-out 
          ${collapsed ? 'w-20' : 'w-64'}`}>
          
          <div className={`p-6 flex items-center transition-all ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Gavel className="w-5 h-5" />
            </div>
            {!collapsed && <span className="text-lg font-black uppercase italic tracking-tighter dark:text-white">Admin</span>}
          </div>

          <nav className="mt-4">
            <SidebarItem icon={<LayoutDashboard size={20}/>} label="Tổng quan" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={collapsed} />
            <SidebarItem icon={<Gavel size={20}/>} label="Phiên đấu" active={activeTab === 'auctions'} onClick={() => setActiveTab('auctions')} collapsed={collapsed} />
            <SidebarItem icon={<Users size={20}/>} label="Người dùng" active={activeTab === 'users'} onClick={() => setActiveTab('users')} collapsed={collapsed} />
            <SidebarItem icon={<CreditCard size={20}/>} label="Tài chính" active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} collapsed={collapsed} />
            <SidebarItem icon={<Settings size={20}/>} label="Cài đặt" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={collapsed} />
          </nav>

          <div className="absolute bottom-6 w-full px-4">
             <button className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                <LogOut size={20} />
                {!collapsed && <span className="text-xs font-black uppercase">Đăng xuất</span>}
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          {/* Top Navbar */}
          <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0b1120]/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              {/* Nút ẩn hiện menu duy nhất */}
              <button 
                onClick={() => setCollapsed(!collapsed)} 
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-all"
              >
                {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
              </button>

              {/* Nút chuyển đến trang web */}
              <a 
                href="/" 
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase hover:bg-blue-100 transition-all border border-blue-200 dark:border-blue-500/20"
              >
                <ExternalLink size={14} />
                Xem trang web
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Nút chuyển đổi giao diện sáng/tối */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-500 rounded-lg transition-all"
                title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic">Quản trị viên</p>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase">Online</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">V</div>
              </div>
            </div>
          </header>

          <div className="p-8">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-1">
                <Activity className="w-5 h-5 text-blue-500" />
                <h1 className="text-2xl font-black dark:text-white tracking-tight uppercase italic">Tổng quan hệ thống</h1>
              </div>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Cập nhật lúc: {new Date().toLocaleTimeString()}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 p-5 rounded-3xl group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
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
                  <CreditCard size={16} className="text-cyan-500"/> Gói đăng ký
                </h2>
                <SubscriptionChart />
              </div>

              {/* Table */}
              <div className="lg:col-span-12 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5">
                  <h2 className="text-sm font-black dark:text-white uppercase">Sản phẩm đang đấu giá</h2>
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
                        <tr key={auction.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="px-6 py-4 font-bold text-xs dark:text-white">{auction.product}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[9px] font-black px-2 py-1 rounded ${auction.type === 'LIVE' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'}`}>
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
        </main>
      </div>
    </div>
  );
}