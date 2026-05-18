import React, { useState } from 'react';
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
export default function UserManagement () {
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

  // States for CREATE USER MODAL (MỚI THÊM)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    fullName: '',
    phone: '',
    avatarUrl: ''
  });

  const filteredUsers = users.filter(u => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchSearch = u.username.toLowerCase().includes(searchUsername.toLowerCase().trim());
    return matchRole && matchSearch;
  });

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormReputation(user.reputationScore);
    setFormUserStatus(user.status);
    setIsUserModalOpen(true);
  };

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

  // Thay đổi quyền hạn trực tiếp từ Selector trong bảng
  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map(u => u.userId === userId ? { ...u, role: newRole } : u);
    setUsers(updatedUsers);
    
    // Đồng bộ nếu tài khoản đó đang mở Sidebar Profile
    if (selectedUser && selectedUser.userId === userId) {
      setSelectedUser(prev => ({ ...prev, role: newRole }));
    }
  };

  // Hàm xử lý khi gửi yêu cầu TẠO TÀI KHOẢN MỚI
  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra các trường bắt buộc (AdminRegisterUserRequest validation)
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Tên tài khoản, Email và Mật khẩu không được để trống!");
      return;
    }

    // Kiểm tra trùng lặp cơ bản
    const isUsernameDup = users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase().trim());
    const isEmailDup = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase().trim());
    
    if (isUsernameDup) {
      alert("Tên đăng ký đã tồn tại trong hệ thống!");
      return;
    }
    if (isEmailDup) {
      alert("Địa chỉ email đã được đăng ký tài khoản khác!");
      return;
    }

    const generatedUserId = Math.floor(100 + Math.random() * 900);
    const createdAccount = {
      userId: generatedUserId,
      username: newUser.username.trim(),
      email: newUser.email.trim(),
      password: newUser.password, // Simulated encrypted password
      reputationScore: 80,       // Mặc định điểm uy tín là 80 như Entity yêu cầu
      status: "ACTIVE",          // Mặc định ACTIVE khi tạo
      role: newUser.role,
      createdAt: new Date().toISOString(),
      profile: {
        fullName: newUser.fullName.trim() !== '' ? newUser.fullName.trim() : "Chưa cập nhật",
        phone: newUser.phone.trim() !== '' ? newUser.phone.trim() : "N/A",
        avatarUrl: newUser.avatarUrl !== '' ? newUser.avatarUrl : null,
        gender: "MALE",
        job: "Ký gửi tự do",
        bio: "Thành viên đăng ký mới bởi ban quản trị."
      }
    };

    setUsers([createdAccount, ...users]);
    setIsAddUserModalOpen(false);
    
    // Reset Form Đăng ký mới
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: 'USER',
      fullName: '',
      phone: '',
      avatarUrl: ''
    });

    alert(`Tạo thành công tài khoản @${createdAccount.username}!`);
  };

  // Xử lý upload ảnh đại diện (giả lập tệp cục bộ)
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewUser(prev => ({ ...prev, avatarUrl: url }));
    }
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
          {/* Ô Tìm kiếm */}
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

          {/* Lọc Role */}
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

          {/* Nút Tạo tài khoản mới */}
          <button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <UserPlus size={14} /> Tạo tài khoản
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`${selectedUser ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm transition-all duration-500`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người dùng</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quyền hạn (Chọn nhanh)</th>
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
                            <img src={user.profile.avatarUrl} alt="" onError={(e) => { e.target.src = "/default-avatar.png";}}className="w-full h-full object-cover"/>
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
                    {/* ĐỔI THÀNH INLINE ROLE SELECTOR (CÓ CHỌN ROLE LUÔN TRÊN BẢNG) */}
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <RoleSelector role={user.role} onChange={(newRole) => handleRoleChange(user.userId, newRole)} />
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
                  <Info size={12} />  Tiểu sử cá nhân
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

      {/* CREATE NEW USER MODAL (MỚI THÊM) */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddUserModalOpen(false)}></div>
          
          <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200 my-8">
            <button 
              onClick={() => setIsAddUserModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black dark:text-white uppercase italic mb-6 flex items-center gap-2">
              <UserPlus className="text-blue-500" /> Tạo tài khoản thành viên mới
            </h3>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              {/* Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tên tài khoản (Username) *</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="ví dụ: alex_vu"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email liên lạc *</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="ví dụ: alex@auction.com"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Password & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mật khẩu *</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Nhập mật khẩu an toàn..."
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Quyền hạn (Role) *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="USER">Thành viên (USER)</option>
                    <option value="SELLER">Người bán (SELLER)</option>
                    <option value="WAREHOUSE_STAFF">Nhân viên kho (WAREHOUSE_STAFF)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  </select>
                </div>
              </div>

              {/* Profile: Họ và tên & Số điện thoại */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    placeholder="ví dụ: Alex Vũ"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="ví dụ: 0901234567"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tải lên ảnh đại diện (Simulated Avatar Upload) */}
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                  <ImageIcon size={12} className="text-blue-500" /> Tải lên ảnh đại diện
                </label>
                
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111827] relative hover:border-blue-500 transition-colors">
                  {newUser.avatarUrl ? (
                    <div className="text-center">
                      <img src={newUser.avatarUrl} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover mb-2 shadow-md border-2 border-blue-500" />
                      <button 
                        type="button" 
                        onClick={() => setNewUser(prev => ({ ...prev, avatarUrl: '' }))}
                        className="text-[10px] text-red-500 font-bold hover:underline flex items-center gap-1 mx-auto"
                      >
                        <Trash size={10} /> Xóa ảnh
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-center w-full block py-2">
                      <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1 animate-pulse" />
                      <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 hover:underline uppercase">Chọn ảnh đại diện</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarUpload} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Thao tác nút bấm */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl text-xs font-black uppercase hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20"
                >
                  Xác nhận Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}