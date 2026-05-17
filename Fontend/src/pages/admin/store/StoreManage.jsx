import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Gavel, Users, CreditCard, 
  Settings, Bell, Search, TrendingUp, 
  ArrowUpRight, ArrowDownRight, MoreVertical, 
  Clock, Radio, Menu, X,
  ChevronLeft, ChevronRight, Activity, Calendar,
  BarChart3, Moon, Sun, ExternalLink, LogOut,
  Shield, Trash2, Mail, Phone, Briefcase, Info,
  AlertTriangle, Crown, Store as StoreIcon, Truck, User,
  Plus, Edit3, CheckCircle2
} from 'lucide-react';

// --- MOCK DATA BASED ON USER ENTITY ---
const MOCK_USERS = [
  {
    userId: 1,
    username: "admin_vu",
    email: "vu@auction.com",
    reputationScore: 100,
    status: "ACTIVE",
    role: "ADMIN",
    createdAt: "2024-01-15T10:00:00",
    profile: {
      fullName: "Nguyễn Hoàng Vũ",
      phone: "0901234567",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      gender: "MALE",
      job: "Hệ thống quản trị",
      bio: "Chịu trách nhiệm vận hành sàn đấu giá."
    }
  },
  {
    userId: 2,
    username: "seller_gia_bao",
    email: "giabao@antique.vn",
    reputationScore: 95,
    status: "ACTIVE",
    role: "SELLER",
    createdAt: "2024-02-10T08:30:00",
    profile: {
      fullName: "Trần Gia Bảo",
      phone: "0988776655",
      avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
      gender: "MALE",
      job: "Kinh doanh đồ cổ",
      bio: "Chuyên cung cấp các mặt hàng gốm sứ thời Lê - Nguyễn."
    }
  },
  {
    userId: 3,
    username: "staff_lan",
    email: "lan.nguyen@warehouse.com",
    reputationScore: 88,
    status: "ACTIVE",
    role: "WAREHOUSE_STAFF",
    createdAt: "2024-03-05T14:20:00",
    profile: {
      fullName: "Nguyễn Thị Lan",
      phone: "0345678901",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      gender: "FEMALE",
      job: "Nhân viên kho",
      bio: "Quản lý xuất nhập kho khu vực phía Nam."
    }
  },
  {
    userId: 4,
    username: "bad_bidder_99",
    email: "scam@test.com",
    reputationScore: 30,
    status: "BANNED",
    role: "USER",
    createdAt: "2024-03-20T11:15:00",
    profile: {
      fullName: "Lê Văn Tèo",
      phone: "0123456789",
      avatarUrl: null,
      gender: "MALE",
      job: "Tự do",
      bio: "Người chơi bị cấm do bùng kèo nhiều lần."
    }
  }
];

// --- MOCK DATA FOR PROVINCES & WARDS ---
const PROVINCES = [
  { provinceId: 1, name: "Thành phố Hồ Chí Minh" },
  { provinceId: 2, name: "Thành phố Hà Nội" },
  { provinceId: 3, name: "Thành phố Đà Nẵng" }
];

const WARDS = [
  // TPHCM
  { wardId: 1, name: "Phường Bến Nghé", provinceId: 1 },
  { wardId: 2, name: "Phường Đa Kao", provinceId: 1 },
  { wardId: 3, name: "Phường Võ Thị Sáu", provinceId: 1 },
  // Hà Nội
  { wardId: 4, name: "Phường Tràng Tiền", provinceId: 2 },
  { wardId: 5, name: "Phường Hàng Bạc", provinceId: 2 },
  // Đà Nẵng
  { wardId: 6, name: "Phường Hải Châu I", provinceId: 3 },
  { wardId: 7, name: "Phường Thạch Thang", provinceId: 3 }
];

// --- MOCK DATA FOR STORES ---
const INITIAL_STORES = [
  {
    storeId: 1,
    storeName: "Kho Trung tâm Miền Nam",
    storeStatus: "ACTIVE",
    createdAt: "2024-01-20T08:00:00",
    itemCount: 1420,
    address: {
      addressId: 101,
      street: "120 Lê Lợi",
      province: PROVINCES[0],
      ward: WARDS[0]
    }
  },
  {
    storeId: 2,
    storeName: "Kho Vực Thủ Đức",
    storeStatus: "ACTIVE",
    createdAt: "2024-02-15T09:30:00",
    itemCount: 850,
    address: {
      addressId: 102,
      street: "45 Võ Văn Ngân",
      province: PROVINCES[0],
      ward: WARDS[1]
    }
  },
  {
    storeId: 3,
    storeName: "Kho Hà Nội Đống Đa",
    storeStatus: "INACTIVE",
    createdAt: "2024-03-01T14:15:00",
    itemCount: 0,
    address: {
      addressId: 103,
      street: "88 Nguyễn Lương Bằng",
      province: PROVINCES[1],
      ward: WARDS[3]
    }
  },
  {
    storeId: 4,
    storeName: "Kho Đà Nẵng Liên Chiểu",
    storeStatus: "BANNED",
    createdAt: "2024-03-10T10:00:00",
    itemCount: 0,
    address: {
      addressId: 104,
      street: "12 Nguyễn Lương Bằng",
      province: PROVINCES[2],
      ward: WARDS[6]
    }
  }
];

const STATS = [
  { label: 'Tổng doanh thu', value: '1.240.000.000 ₫', trend: '+12.5%', isUp: true, icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Phiên đấu đang chạy', value: '42', sub: '12 Live - 30 Normal', icon: <Gavel className="w-5 h-5" /> },
  { label: 'Người dùng mới', value: '156', trend: '+18%', isUp: true, icon: <Users className="w-5 h-5" /> },
  { label: 'Hệ thống kho active', value: '3/4', trend: 'Mượt mà', isUp: true, icon: <StoreIcon className="w-5 h-5" /> },
];

// --- BADGE COMPONENTS ---

const RoleBadge = ({ role }) => {
  const configs = {
    ADMIN: {
      label: "Quản trị viên",
      icon: <Crown size={12} />,
      style: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
    },
    SELLER: {
      label: "Người bán",
      icon: <StoreIcon size={12} />,
      style: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
    },
    WAREHOUSE_STAFF: {
      label: "Nhân viên kho",
      icon: <Truck size={12} />,
      style: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400"
    },
    USER: {
      label: "Thành viên",
      icon: <User size={12} />,
      style: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400"
    }
  };

  const config = configs[role] || configs.USER;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${config.style}`}>
      {config.icon}
      {config.label}
    </div>
  );
};

// Nhãn trạng thái tĩnh thuần hiển thị
const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    BANNED: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return (
    <span 
      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border select-none ${styles[status] || "bg-slate-500/10 text-slate-500"}`}
    >
      {status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
    </span>
  );
};

// Nhãn trạng thái tĩnh thuần hiển thị
const StoreStatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    INACTIVE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    BANNED: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  const labels = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Tạm ngưng",
    BANNED: "Đóng cửa"
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border select-none ${styles[status]}`}
    >
      {labels[status]}
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

// --- VIEW: STORE MANAGEMENT ---
const StoreManagement = () => {
  const [stores, setStores] = useState(INITIAL_STORES);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  
  // Modal form states
  const [formStoreName, setFormStoreName] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedWardId, setSelectedWardId] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');

  // Lọc xã phường tương ứng với tỉnh thành đã chọn
  const filteredWards = WARDS.filter(w => w.provinceId === parseInt(selectedProvinceId));

  // Reset Form
  const resetForm = () => {
    setFormStoreName('');
    setFormStreet('');
    setSelectedProvinceId('');
    setSelectedWardId('');
    setFormStatus('ACTIVE');
    setEditingStore(null);
  };

  // Open Modal for Create
  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (store) => {
    setEditingStore(store);
    setFormStoreName(store.storeName);
    setFormStreet(store.address.street);
    setSelectedProvinceId(store.address.province.provinceId.toString());
    setSelectedWardId(store.address.ward.wardId.toString());
    setFormStatus(store.storeStatus);
    setIsModalOpen(true);
  };

  // Submit Form (Create / Edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formStoreName || !formStreet || !selectedProvinceId || !selectedWardId) {
      alert("Vui lòng điền đầy đủ thông tin kho hàng!");
      return;
    }

    const provinceObj = PROVINCES.find(p => p.provinceId === parseInt(selectedProvinceId));
    const wardObj = WARDS.find(w => w.wardId === parseInt(selectedWardId));

    if (editingStore) {
      // Edit mode
      setStores(stores.map(s => s.storeId === editingStore.storeId ? {
        ...s,
        storeName: formStoreName,
        storeStatus: formStatus,
        address: {
          ...s.address,
          street: formStreet,
          province: provinceObj,
          ward: wardObj
        }
      } : s));
    } else {
      // Create mode
      const newStore = {
        storeId: Date.now(),
        storeName: formStoreName,
        storeStatus: formStatus,
        createdAt: new Date().toISOString(),
        itemCount: 0,
        address: {
          addressId: Date.now() + 1,
          street: formStreet,
          province: provinceObj,
          ward: wardObj
        }
      };
      setStores([...stores, newStore]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  // Xóa kho hàng
  const handleDeleteStore = (storeId) => {
    if (window.confirm("Bạn có chắc muốn xóa kho hàng này vĩnh viễn?")) {
      setStores(stores.filter(s => s.storeId !== storeId));
    }
  };

  // Lọc dữ liệu hiển thị
  const filteredStores = stores.filter(s => {
    const matchStatus = filterStatus === 'ALL' || s.storeStatus === filterStatus;
    const matchSearch = s.storeName.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
                        s.address.street.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchStatus && matchSearch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black dark:text-white uppercase italic tracking-tight">Quản lý kho hàng</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Hệ thống phân phối kho bãi và hàng hóa ký gửi</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên kho, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-slate-200"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Bộ lọc trạng thái */}
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'ACTIVE', 'INACTIVE', 'BANNED'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${
                  filterStatus === status 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                  : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:border-blue-500/50'
                }`}
              >
                {status === 'ALL' ? 'Tất cả' : status === 'ACTIVE' ? 'Hoạt động' : status === 'INACTIVE' ? 'Tạm ngưng' : 'Đóng cửa'}
              </button>
            ))}
          </div>

          {/* Nút thêm mới */}
          <button 
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={14} /> Thêm kho
          </button>
        </div>
      </div>

      {/* Main Grid / List */}
      <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên kho hàng</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ chi tiết</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sức chứa (Vật phẩm)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ngày thành lập</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredStores.map((store) => (
                <tr key={store.storeId} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <StoreIcon size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black dark:text-white leading-none">{store.storeName}</p>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">Mã kho: #{store.storeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="text-xs font-medium dark:text-slate-300">{store.address.street}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{store.address.ward.name}, {store.address.province.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold">
                      {store.itemCount} Items
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-xs text-slate-500">{new Date(store.createdAt).toLocaleDateString('vi-VN')}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StoreStatusBadge status={store.storeStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(store)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Chỉnh sửa thông tin và Trạng thái"
                      >
                        <Edit3 size={15}/>
                      </button>
                      <button 
                        onClick={() => handleDeleteStore(store.storeId)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Xóa kho hàng"
                      >
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStores.length === 0 && (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
             <AlertTriangle size={36} className="mb-3 opacity-30 text-amber-500" />
             <p className="text-xs font-black uppercase tracking-widest italic mb-2">Không tìm thấy kho hàng phù hợp</p>
             <p className="text-[10px] text-slate-500 dark:text-slate-600">Thử thay đổi từ khóa tìm kiếm hoặc trạng thái lọc</p>
          </div>
        )}
      </div>

      {/* CREATE & EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal content */}
          <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black dark:text-white uppercase italic mb-6">
              {editingStore ? "Chỉnh sửa kho hàng" : "Thêm kho hàng mới"}
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Tên kho */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tên kho hàng *</label>
                <input
                  type="text"
                  required
                  value={formStoreName}
                  onChange={(e) => setFormStoreName(e.target.value)}
                  placeholder="Ví dụ: Kho trung chuyển phía Đông"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Địa chỉ: Street */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Số nhà, Tên đường *</label>
                <input
                  type="text"
                  required
                  value={formStreet}
                  onChange={(e) => setFormStreet(e.target.value)}
                  placeholder="Ví dụ: 120 Võ Văn Tần"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Địa chỉ: Tỉnh / Thành phố */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tỉnh / Thành phố *</label>
                  <select
                    required
                    value={selectedProvinceId}
                    onChange={(e) => {
                      setSelectedProvinceId(e.target.value);
                      setSelectedWardId(''); // Reset ward khi đổi province
                    }}
                    className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Chọn tỉnh thành --</option>
                    {PROVINCES.map(p => (
                      <option key={p.provinceId} value={p.provinceId}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Địa chỉ: Phường / Xã */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Phường / Xã *</label>
                  <select
                    required
                    disabled={!selectedProvinceId}
                    value={selectedWardId}
                    onChange={(e) => setSelectedWardId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Chọn phường xã --</option>
                    {filteredWards.map(w => (
                      <option key={w.wardId} value={w.wardId}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Trạng thái kho */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Trạng thái kho hàng</label>
                <div className="flex gap-4 mt-2">
                  {['ACTIVE', 'INACTIVE', 'BANNED'].map(status => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="storeStatus"
                        value={status}
                        checked={formStatus === status}
                        onChange={() => setFormStatus(status)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {status === 'ACTIVE' ? 'Hoạt động' : status === 'INACTIVE' ? 'Tạm ngưng' : 'Đóng cửa'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Thao tác nút bấm */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20"
                >
                  {editingStore ? "Lưu thay đổi" : "Tạo kho mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- VIEW: USER MANAGEMENT ---
const UserManagement = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // States for Edit User Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('USER');
  const [formReputation, setFormReputation] = useState(80);
  const [formUserStatus, setFormUserStatus] = useState('ACTIVE');

  const filteredUsers = users.filter(u => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchSearch = u.username.toLowerCase().includes(searchUsername.toLowerCase().trim());
    return matchRole && matchSearch;
  });

  // Open User Edit Modal
  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormReputation(user.reputationScore);
    setFormUserStatus(user.status);
    setIsUserModalOpen(true);
  };

  // Submit User Edit Form
  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!formUsername || !formEmail) {
      alert("Tên tài khoản và Email không được để trống!");
      return;
    }

    const updatedUsers = users.map(u => u.userId === editingUser.userId ? {
      ...u,
      username: formUsername,
      email: formEmail,
      role: formRole,
      reputationScore: parseInt(formReputation),
      status: formUserStatus
    } : u);

    setUsers(updatedUsers);

    // Update selectedUser sidebar details if currently viewing
    if (selectedUser && selectedUser.userId === editingUser.userId) {
      setSelectedUser({
        ...selectedUser,
        username: formUsername,
        email: formEmail,
        role: formRole,
        reputationScore: parseInt(formReputation),
        status: formUserStatus
      });
    }

    setIsUserModalOpen(false);
  };

  const deleteUser = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này?")) {
      setUsers(users.filter(u => u.userId !== id));
      if (selectedUser?.userId === id) setSelectedUser(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black dark:text-white uppercase italic tracking-tight">Quản lý người dùng</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Hệ thống quản trị thực thể User</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="w-full bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-slate-200"
            />
            {searchUsername && (
              <button onClick={() => setSearchUsername('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'ADMIN', 'SELLER', 'WAREHOUSE_STAFF', 'USER'].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${
                  filterRole === role 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                  : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:border-blue-500/50'
                }`}
              >
                {role === 'ALL' ? 'Tất cả' : role.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`${selectedUser ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm transition-all duration-500`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người dùng</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quyền hạn</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Uy tín</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.userId} 
                    className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedUser?.userId === user.userId ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`} 
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/5 overflow-hidden flex-shrink-0">
                          {user.profile.avatarUrl ? (
                            <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-slate-400 text-xs">{user.username[0].toUpperCase()}</div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black dark:text-white leading-none">{user.username}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="h-1.5 w-16 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${user.reputationScore > 50 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{ width: `${user.reputationScore}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black dark:text-slate-300 italic">{user.reputationScore} PTS</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleOpenEditUser(user)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Chỉnh sửa thông tin & Trạng thái"
                        >
                          <Edit3 size={15}/>
                        </button>
                        <button 
                          onClick={(e) => deleteUser(e, user.userId)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 size={15}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
               <AlertTriangle size={36} className="mb-3 opacity-30 text-amber-500" />
               <p className="text-xs font-black uppercase tracking-widest italic mb-2">Không tìm thấy người dùng phù hợp</p>
               <p className="text-[10px] text-slate-500 dark:text-slate-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
               {searchUsername && (
                 <button onClick={() => setSearchUsername('')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500">
                   Xóa tìm kiếm
                 </button>
               )}
            </div>
          )}
        </div>

        {/* Profile Sidebar */}
        {selectedUser && (
          <div className="lg:col-span-5 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-xl animate-in slide-in-from-right-4 duration-300 relative h-fit sticky top-24">
            <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-500/5">
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-1 mb-4 shadow-xl shadow-blue-500/20">
                <div className="w-full h-full rounded-[1.4rem] bg-white dark:bg-[#0b1120] overflow-hidden">
                  {selectedUser.profile.avatarUrl ? (
                    <img src={selectedUser.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-300 uppercase italic">{selectedUser.username[0]}</div>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-black dark:text-white uppercase italic leading-none">{selectedUser.profile.fullName || 'Chưa cập nhật'}</h3>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] italic">@{selectedUser.username}</p>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <RoleBadge role={selectedUser.role} />
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <StatusBadge status={selectedUser.status} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Điểm uy tín</p>
                  <p className="text-lg font-black text-amber-500 italic">{selectedUser.reputationScore} PTS</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Ngày tham gia</p>
                  <p className="text-xs font-black dark:text-white">{new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Mail size={16} />
                  </div>
                  <span className="text-xs font-bold">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Phone size={16} />
                  </div>
                  <span className="text-xs font-bold">{selectedUser.profile.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Briefcase size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tighter">{selectedUser.profile.job || 'N/A'}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2 italic">
                  <Info size={12} /> Tiểu sử cá nhân
                </p>
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{selectedUser.profile.bio || 'Người dùng này chưa có tiểu sử.'}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)}></div>
          
          <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black dark:text-white uppercase italic mb-6">Chỉnh sửa thông tin thành viên</h3>

            <form onSubmit={handleUserSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tên tài khoản (Username) *</label>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Quyền hạn (Role) *</label>
                <select
                  required
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="USER">Thành viên (USER)</option>
                  <option value="SELLER">Người bán (SELLER)</option>
                  <option value="WAREHOUSE_STAFF">Nhân viên kho (WAREHOUSE_STAFF)</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                </select>
              </div>

              {/* Reputation Score */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Điểm uy tín (Reputation Score)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formReputation}
                  onChange={(e) => setFormReputation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Trạng thái tài khoản</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userStatus"
                      value="ACTIVE"
                      checked={formUserStatus === 'ACTIVE'}
                      onChange={() => setFormUserStatus('ACTIVE')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-300">Hoạt động (ACTIVE)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userStatus"
                      value="BANNED"
                      checked={formUserStatus === 'BANNED'}
                      onChange={() => setFormUserStatus('BANNED')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-300">Khóa tài khoản (BANNED)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN DASHBOARD VIEW ---
const DashboardOverview = () => (
  <div className="animate-in fade-in duration-500">
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-1">
        <Activity className="w-5 h-5 text-blue-500" />
        <h1 className="text-2xl font-black dark:text-white tracking-tight uppercase italic">Tổng quan hệ thống</h1>
      </div>
      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Cập nhật lúc: {new Date().toLocaleTimeString()}</p>
    </div>

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
      <div className="lg:col-span-8 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <h2 className="text-sm font-black dark:text-white uppercase mb-6 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500"/> Doanh thu tuần này
        </h2>
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
        </div>
      </div>

      <div className="lg:col-span-4 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center">
        <h2 className="text-sm font-black dark:text-white uppercase mb-6 self-start flex items-center gap-2">
          <BarChart3 size={16} className="text-cyan-500"/> Phân phối gói
        </h2>
        <div className="flex items-end justify-around h-32 w-full gap-2">
          {[45, 78, 32].map((v, i) => (
            <div key={i} className="w-6 bg-blue-500 rounded-t-lg transition-all" style={{ height: `${v}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans">
        
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-white/5 transition-all duration-300 ease-in-out 
          ${collapsed ? 'w-20' : 'w-64'}`}>
          
          <div className={`p-6 flex items-center transition-all ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30">
              <Gavel className="w-5 h-5" />
            </div>
            {!collapsed && <span className="text-lg font-black uppercase italic tracking-tighter dark:text-white">Auction Admin</span>}
          </div>

          <nav className="mt-4">
            <SidebarItem icon={<LayoutDashboard size={20}/>} label="Tổng quan" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={collapsed} />
            <SidebarItem icon={<Users size={20}/>} label="Người dùng" active={activeTab === 'users'} onClick={() => setActiveTab('users')} collapsed={collapsed} />
            <SidebarItem icon={<StoreIcon size={20}/>} label="Kho hàng" active={activeTab === 'stores'} onClick={() => setActiveTab('stores')} collapsed={collapsed} />
            <SidebarItem icon={<Gavel size={20}/>} label="Phiên đấu" active={activeTab === 'auctions'} onClick={() => setActiveTab('auctions')} collapsed={collapsed} />
            <SidebarItem icon={<CreditCard size={20}/>} label="Tài chính" active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} collapsed={collapsed} />
            <SidebarItem icon={<Settings size={20}/>} label="Cài đặt" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={collapsed} />
          </nav>

          <div className="absolute bottom-6 w-full px-4">
             <button className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                <LogOut size={20} />
                {!collapsed && <span className="text-xs font-black uppercase tracking-widest italic">Đăng xuất</span>}
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
                {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
              </button>

              <a href="/" target="_blank" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase hover:bg-blue-100 transition-all border border-blue-200 dark:border-blue-500/20">
                <ExternalLink size={14} /> Xem trang web
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-500 rounded-lg transition-all"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic tracking-widest">Administrator</p>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-[0.2em]">System Online</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-600/30">V</div>
              </div>
            </div>
          </header>

          <div className="p-8 max-w-[1600px] mx-auto">
            {activeTab === 'dashboard' && <DashboardOverview />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'stores' && <StoreManagement />}
            
            {/* Fallback mock UI for other tabs */}
            {['auctions', 'subscriptions', 'settings'].includes(activeTab) && (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-white/5">
                <Activity className="w-12 h-12 text-blue-500 animate-pulse mb-4" />
                <h3 className="text-sm font-black uppercase tracking-widest italic">Tính năng đang đồng bộ</h3>
                <p className="text-[10px] text-slate-500 mt-1">Vui lòng quay lại Tab "Người dùng" hoặc "Kho hàng" để trải nghiệm</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}