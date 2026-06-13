import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Gavel, Users, CreditCard, 
  Settings, Bell, Search, TrendingUp, 
  ArrowUpRight, ArrowDownRight, MoreVertical, 
  Clock, Radio, Menu, X,
  ChevronLeft, ChevronRight, ChevronDown, Activity, Calendar,
  BarChart3, Moon, Sun, ExternalLink, LogOut,
  Shield, Trash2, Mail, Phone, Briefcase, Info,
  AlertTriangle, Crown, Store as StoreIcon, Truck, User,
  Plus, Edit3, CheckCircle2, Box, Eye, Check, AlertCircle, FileText, Image as ImageIcon, Upload, Trash, UserPlus
} from 'lucide-react';
import { filterStoresApi, createStoreApi, updateStoreApi} from "../../../services/api/adminStoreApi";
import { getProvinces, getWardsByProvince } from "../../../services/api/addressApi";

// --- MOCK SUBCATEGORY TEMPLATES FOR JSON ATTRIBUTES ---
const SUBCATEGORY_TEMPLATES = {
  laptop: {
    label: 'Laptop',
    fields: [
      { name: 'cpu', label: 'CPU', placeholder: 'ví dụ: Apple M3, i9-14900H', required: true },
      { name: 'ram', label: 'RAM', placeholder: 'ví dụ: 16GB, 64GB', required: true },
      { name: 'storage', label: 'Ổ cứng', placeholder: 'ví dụ: 1TB SSD', required: true }
    ]
  },
  phone: {
    label: 'Điện thoại',
    fields: [
      { name: 'screen', label: 'Màn hình', placeholder: 'ví dụ: 6.8 inch ProMotion', required: true },
      { name: 'battery', label: 'Pin', placeholder: 'ví dụ: 4500mAh', required: true }
    ]
  },
  mechanical: {
    label: 'Đồng hồ cơ',
    fields: [
      { name: 'movement', label: 'Bộ máy', placeholder: 'ví dụ: Calibre 3235', required: true },
      { name: 'caseSize', label: 'Kích thước', placeholder: 'ví dụ: 40mm', required: true }
    ]
  }
};

// --- MOCK DATA FOR PROVINCES & WARDS ---
const PROVINCES = [
  { provinceId: 1, name: "Thành phố Hồ Chí Minh" },
  { provinceId: 2, name: "Thành phố Hà Nội" }
];

const WARDS = [
  { wardId: 1, name: "Phường Bến Nghé", provinceId: 1 },
  { wardId: 4, name: "Phường Tràng Tiền", provinceId: 2 }
];

// --- MOCK DATA FOR STORES ---
const INITIAL_STORES = [
  {
    storeId: 1,
    storeName: "Kho Trung tâm Miền Nam",
    storeStatus: "ACTIVE",
    createdAt: "2024-01-20T08:00:00",
    address: { addressId: 101, street: "120 Lê Lợi", province: PROVINCES[0], ward: WARDS[0] }
  },
  {
    storeId: 2,
    storeName: "Kho Hà Nội Đống Đa",
    storeStatus: "ACTIVE",
    createdAt: "2024-02-15T09:30:00",
    address: { addressId: 102, street: "88 Nguyễn Lương Bằng", province: PROVINCES[1], ward: WARDS[1] }
  }
];

// --- MOCK DATA FOR CATEGORIES ---
const MOCK_CATEGORIES = [
  { categoryId: 1, name: "Điện thoại", key: "phone" },
  { categoryId: 2, name: "Laptop", key: "laptop" },
  { categoryId: 3, name: "Đồng hồ cơ", key: "mechanical" }
];

// --- MOCK DATA FOR USERS (SELLERS / BIDDERS) ---
const MOCK_USERS = [
  { userId: 1, username: "admin_vu", email: "vu@auction.com", reputationScore: 100, status: "ACTIVE", role: "ADMIN", createdAt: "2024-01-15T10:00:00", profile: { fullName: "Nguyễn Hoàng Vũ", phone: "0901234567", avatarUrl: null, gender: "MALE", job: "Hệ thống quản trị", bio: "Admin" } },
  { userId: 2, username: "seller_gia_bao", email: "giabao@antique.vn", reputationScore: 95, status: "ACTIVE", role: "SELLER", createdAt: "2024-02-10T08:30:00", profile: { fullName: "Trần Gia Bảo", phone: "0988776655", avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100", gender: "MALE", job: "Kinh doanh đồ cổ", bio: "Đồ cổ Việt Nam" } },
  { userId: 3, username: "staff_lan", email: "lan@warehouse.com", reputationScore: 88, status: "ACTIVE", role: "WAREHOUSE_STAFF", createdAt: "2024-03-05T14:20:00", profile: { fullName: "Nguyễn Thị Lan", phone: "0345678901", avatarUrl: null, gender: "FEMALE", job: "Nhân viên kho", bio: "Staff" } }
];

// --- MOCK DATA FOR STORE ITEMS (PRODUCTS GỬI KHO) ---
const INITIAL_STORE_ITEMS = [
  {
    storeItemId: 1001,
    store: INITIAL_STORES[0],
    itemStatus: "PENDING",
    conditionNote: "Người bán mới gửi yêu cầu, cần kiểm duyệt các chi tiết máy, viền thép Oystersteel và độ nhạy giờ.",
    product: {
      productId: 501,
      productName: "Đồng hồ Rolex Submariner Date Thép",
      brand: "Rolex",
      origin: "Thụy Sĩ",
      productCondition: "USED", // NEW, USED
      basePrice: 380000000,
      description: "Đồng hồ thợ lặn huyền thoại thép 904L, kim giờ phủ dạ quang Chromalight cực sáng, khả năng giữ cót 70 giờ liên tục.",
      createdAt: "2024-05-10T12:00:00",
      user: MOCK_USERS[1],
      category: MOCK_CATEGORIES[2], // Đồng hồ cơ
      attributesJson: JSON.stringify({ movement: "Calibre 3235", caseSize: "41mm" }),
      images: [
        { imageId: 1, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", isPrimary: true },
        { imageId: 2, imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400", isPrimary: false }
      ]
    }
  },
  {
    storeItemId: 1002,
    store: INITIAL_STORES[0],
    itemStatus: "RECEIVED",
    conditionNote: "Hàng thực tế đã nhận tại kho Quận 1. Đang kiểm định hộp phụ kiện, củ sạc nhanh nguyên seal.",
    product: {
      productId: 502,
      productName: "iPhone 15 Pro Max Titanium Natural",
      brand: "Apple",
      origin: "Trung Quốc",
      productCondition: "NEW",
      basePrice: 32000000,
      description: "Thiết kế chất liệu Titanium siêu bền bỉ và nhẹ, nút Action Button thông minh, camera quang học zoom 5x chuyên nghiệp.",
      createdAt: "2024-05-12T14:00:00",
      user: MOCK_USERS[1],
      category: MOCK_CATEGORIES[0], // Điện thoại
      attributesJson: JSON.stringify({ screen: "6.7 inch Super Retina XDR", battery: "4441mAh" }),
      images: [
        { imageId: 3, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", isPrimary: true }
      ]
    }
  },
  {
    storeItemId: 1003,
    store: INITIAL_STORES[1],
    itemStatus: "APPROVED",
    conditionNote: "Sản phẩm đạt chuẩn kiểm định. Chip Apple M3 cực kỳ mượt mà, màn hình sáng bóng không điểm chết.",
    product: {
      productId: 503,
      productName: "MacBook Pro M3 Space Black",
      brand: "Apple",
      origin: "Mỹ",
      productCondition: "NEW",
      basePrice: 48000000,
      description: "MacBook thế hệ mới nhất, trang bị chip xử lý Apple M3 cực mạnh, hoàn thiện vỏ màu đen không gian chống bám vân tay.",
      createdAt: "2024-04-01T09:00:00",
      user: MOCK_USERS[1],
      category: MOCK_CATEGORIES[1], // Laptop
      attributesJson: JSON.stringify({ cpu: "Apple M3 (8-core CPU)", ram: "16GB Unified Memory", storage: "512GB SSD" }),
      images: [
        { imageId: 4, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", isPrimary: true }
      ]
    }
  }
];

const STATS = [
  { label: 'Tổng doanh thu', value: '1.240.000.000 ₫', trend: '+12.5%', isUp: true, icon: 'TrendingUp' },
  { label: 'Phiên đấu đang chạy', value: '42', sub: '12 Live - 30 Normal', icon: 'Gavel' },
  { label: 'Người dùng mới', value: '156', trend: '+18%', isUp: true, icon: 'Users' },
  { label: 'Hệ thống kho active', value: '3/4', trend: 'Mượt mà', isUp: true, icon: 'StoreIcon' },
];

// --- GLOBAL HELPER FUNCTIONS ---

const getStatusStyle = (status) => {
  const configs = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    RECEIVED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20"
  };
  const labels = {
    PENDING: "Chờ duyệt",
    RECEIVED: "Đã nhận kho",
    APPROVED: "Đạt chuẩn",
    REJECTED: "Bị từ chối"
  };
  return { style: configs[status] || "bg-slate-500/10 text-slate-500 border-slate-500/20", label: labels[status] || status };
};

const renderStatIcon = (iconName) => {
  switch (iconName) {
    case 'TrendingUp':
      return <TrendingUp className="w-5 h-5" />;
    case 'Gavel':
      return <Gavel className="w-5 h-5" />;
    case 'Users':
      return <Users className="w-5 h-5" />;
    case 'StoreIcon':
      return <StoreIcon className="w-5 h-5" />;
    default:
      return <Activity className="w-5 h-5" />;
  }
};

// --- BADGE COMPONENTS ---

const RoleBadge = ({ role }) => {
  const configs = {
    ADMIN: { label: "Quản trị", icon: <Crown size={12} />, style: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400" },
    SELLER: { label: "Người bán", icon: <StoreIcon size={12} />, style: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400" },
    WAREHOUSE_STAFF: { label: "Nhân viên kho", icon: <Truck size={12} />, style: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400" },
    USER: { label: "Thành viên", icon: <User size={12} />, style: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400" }
  };
  const config = configs[role] || configs.USER;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${config.style}`}>
      {config.icon} {config.label}
    </div>
  );
};

// --- NEW COMPONENT: INTERACTIVE INLINE ROLE SELECTOR ---
const RoleSelector = ({ role, onChange }) => {
  const configs = {
    ADMIN: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 focus:border-amber-500",
    SELLER: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 focus:border-blue-500",
    WAREHOUSE_STAFF: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400 focus:border-purple-500",
    USER: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400 focus:border-slate-500"
  };

  return (
    <div className="relative inline-block" onClick={e => e.stopPropagation()}>
      <select
        value={role}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none pl-2.5 pr-7 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider cursor-pointer focus:outline-none transition-all ${configs[role] || configs.USER}`}
      >
        <option value="USER" className="bg-white dark:bg-[#0b1120] text-slate-700 dark:text-slate-300">Thành viên</option>
        <option value="SELLER" className="bg-white dark:bg-[#0b1120] text-slate-700 dark:text-slate-300">Người bán</option>
        <option value="WAREHOUSE_STAFF" className="bg-white dark:bg-[#0b1120] text-slate-700 dark:text-slate-300">Nhân viên kho</option>
        <option value="ADMIN" className="bg-white dark:bg-[#0b1120] text-slate-700 dark:text-slate-300">Quản trị viên</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-current">
        <ChevronDown size={10} />
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    BANNED: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border select-none ${styles[status] || "bg-slate-500/10 text-slate-500"}`}>
      {status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
    </span>
  );
};

const StoreStatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    INACTIVE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    BANNED: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  const labels = { ACTIVE: "Hoạt động", INACTIVE: "Tạm ngưng", BANNED: "Đóng cửa" };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border select-none ${styles[status]}`}>
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
export default function StoreManagement () {
  const [stores, setStores] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  
  const [formStoreName, setFormStoreName] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedWardId, setSelectedWardId] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  const loadStores = async () => {
    try {
      const response = await filterStoresApi({
        storeName: searchQuery || null,
        status: filterStatus === "ALL" ? null : filterStatus
      });

      setStores(response.data || []);
    } catch (error) {
      console.error("Lỗi load stores:", error);
    }
  };

  useEffect(() => {
    loadStores();
  }, [searchQuery, filterStatus]);

  const loadProvinces = async () => {
    try {

      const response = await getProvinces();

      setProvinces(response.data || []);

    } catch (error) {
      console.error("Lỗi load provinces:", error);
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadWards = async (provinceId) => {

    if (!provinceId) {
      setWards([]);
      return;
    }

    try {

      const response = await getWardsByProvince(provinceId);

      setWards(response.data || []);

    } catch (error) {
      console.error("Lỗi load wards:", error);
    }
  };

  const resetForm = () => {
    setFormStoreName('');
    setFormStreet('');
    setSelectedProvinceId('');
    setSelectedWardId('');
    setFormStatus('ACTIVE');
    setEditingStore(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (store) => {
    setEditingStore(store);
    setFormStoreName(store.storeName);
    setFormStreet('');
    setSelectedProvinceId('');
    setSelectedWardId('');
    setFormStatus(store.status);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {

      const payload = {
        storeName: formStoreName,
        provinceId: parseInt(selectedProvinceId),
        wardId: parseInt(selectedWardId),
        street: formStreet
      };

      if (editingStore) {

        await updateStoreApi(editingStore.storeId, {
          ...payload,
          status: formStatus
        });

      } else {

        await createStoreApi(payload);

      }

      await loadStores();

      setIsModalOpen(false);
      resetForm();

    } catch (error) {
      console.error("Lỗi save store:", error);
      alert(error?.message || "Có lỗi xảy ra");
    }
  };

  const handleDeleteStore = (storeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn kho hàng này?")) {
      setStores(stores.filter(s => s.storeId !== storeId));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black dark:text-white uppercase italic tracking-tight">Quản lý kho hàng</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Hệ thống phân phối kho bãi và hàng hóa ký gửi</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
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

          <button 
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={14} /> Thêm kho
          </button>
        </div>
      </div>

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
              {stores.map((store) => (
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
                      <p className="text-xs font-medium dark:text-slate-300">{store.address}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold">
                      {store.totalItems} Items
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-xs text-slate-500">{new Date(store.createdAt).toLocaleDateString('vi-VN')}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StoreStatusBadge status={store.status} />
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

        {stores.length === 0 && (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
             <AlertTriangle size={36} className="mb-3 opacity-30 text-amber-500" />
             <p className="text-xs font-black uppercase tracking-widest italic mb-2">Không tìm thấy kho hàng phù hợp</p>
             <p className="text-[10px] text-slate-500 dark:text-slate-600">Thử thay đổi từ khóa tìm kiếm hoặc trạng thái lọc</p>
          </div>
        )}
      </div>

      {/* CREATE & EDIT STORE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tỉnh / Thành phố *</label>
                  <select
                    required
                    value={selectedProvinceId}
                    onChange={(e) => {
                      const provinceId = e.target.value;
                      setSelectedProvinceId(provinceId);
                      setSelectedWardId('');
                      loadWards(provinceId);
                    }}
                    className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Chọn tỉnh thành --</option>
                    {provinces.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

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
                    {wards.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

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
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}