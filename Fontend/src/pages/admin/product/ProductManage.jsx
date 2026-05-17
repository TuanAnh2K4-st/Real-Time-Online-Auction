import React, { useState } from 'react';
import {
  LayoutDashboard, Gavel, Users, CreditCard, 
  Settings, Bell, Search, TrendingUp, 
  ArrowUpRight, ArrowDownRight, MoreVertical, 
  Clock, Radio, Menu, X,
  ChevronLeft, ChevronRight, Activity, Calendar,
  BarChart3, Moon, Sun, ExternalLink, LogOut,
  Shield, Trash2, Mail, Phone, Briefcase, Info,
  AlertTriangle, Crown, Store as StoreIcon, Truck, User,
  Plus, Edit3, CheckCircle2, Box, Eye, Check, AlertCircle, FileText, Image as ImageIcon, Upload, Trash
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

// --- VIEW: STORE ITEM MANAGEMENT ---
const StoreItemManagement = () => {
  const [storeItems, setStoreItems] = useState(INITIAL_STORE_ITEMS);
  const [searchStoreName, setSearchStoreName] = useState('');
  const [searchProductName, setSearchProductName] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('ALL');
  
  // Trạng thái tách biệt Form Xem Thông tin & Form Đánh giá
  const [selectedItem, setSelectedItem] = useState(null); // Sử dụng cho Drawer xem chi tiết bên phải
  const [auditItem, setAuditItem] = useState(null);       // Sử dụng cho Modal Đánh giá riêng biệt
  
  // Trạng thái cho Modal nhập mới sản phẩm
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '', brand: '', origin: '', productCondition: 'NEW', // Chỉ NEW, USED
    basePrice: '', description: '', storeId: 1, categoryId: 1,
    primaryImageUrl: '',
    subImages: ['', '', '']
  });

  // Lưu trữ dữ liệu thuộc tính động (attributesJson) khi tạo mới
  const [dynamicAttrs, setDynamicAttrs] = useState({});

  // Trạng thái cho việc Đánh giá, Thẩm định (Kiểm định) trong Modal riêng
  const [auditStatus, setAuditStatus] = useState('PENDING');
  const [auditNote, setAuditNote] = useState('');

  // Tính số lượng badge hiển thị ở bộ lọc Tab nhanh
  const countByStatus = {
    ALL: storeItems.length,
    PENDING: storeItems.filter(i => i.itemStatus === 'PENDING').length,
    RECEIVED: storeItems.filter(i => i.itemStatus === 'RECEIVED').length,
    APPROVED: storeItems.filter(i => i.itemStatus === 'APPROVED').length,
    REJECTED: storeItems.filter(i => i.itemStatus === 'REJECTED').length
  };

  const QC_TEMPLATES = [
    "Sản phẩm còn mới nguyên seal, tem bảo hành chính hãng đầy đủ.",
    "Trầy xước cực nhẹ ở viền, các nút bấm nhạy, màn hình không trầy.",
    "Đồng hồ có xước dăm vỏ thép, kim chạy chuẩn xác, lịch nhảy đều.",
    "Sản phẩm không vượt qua kiểm định (máy có dấu hiệu cạy mở, thay linh kiện)."
  ];

  // Lọc kép nâng cao: Tên kho hàng + Tên sản phẩm + Tab trạng thái
  const filteredItems = storeItems.filter(item => {
    const matchStore = item.store.storeName.toLowerCase().includes(searchStoreName.toLowerCase().trim());
    const matchProductName = item.product.productName.toLowerCase().includes(searchProductName.toLowerCase().trim());
    const matchStatusTab = activeStatusTab === 'ALL' || item.itemStatus === matchStatusTab;
    return matchStore && matchProductName && matchStatusTab;
  });

  // Cập nhật Đánh giá chất lượng sản phẩm từ Modal Đánh giá riêng
  const handleUpdateAudit = (id) => {
    setStoreItems(storeItems.map(item => {
      if (item.storeItemId === id) {
        const updated = {
          ...item,
          itemStatus: auditStatus,
          conditionNote: auditNote
        };
        // Đồng bộ dữ liệu hiển thị tức thời nếu đang xem chi tiết ở Drawer
        if (selectedItem && selectedItem.storeItemId === id) {
          setSelectedItem(updated);
        }
        return updated;
      }
      return item;
    }));
    setAuditItem(null); // Đóng modal đánh giá
    alert("Đã cập nhật tình trạng kiểm định thành công!");
  };

  // Tạo mới hàng ký gửi & Sản phẩm kèm ảnh chính/phụ và thuộc tính động JSON
  const handleAddStoreItem = (e) => {
    e.preventDefault();
    if (!newProduct.productName || !newProduct.basePrice || !newProduct.primaryImageUrl) {
      alert("Vui lòng nhập tên sản phẩm, giá khởi điểm và tải ảnh chính lên!");
      return;
    }

    const matchedStore = INITIAL_STORES.find(s => s.storeId === parseInt(newProduct.storeId));
    const matchedCategory = MOCK_CATEGORIES.find(c => c.categoryId === parseInt(newProduct.categoryId));
    const generatedProductId = Math.floor(100 + Math.random() * 900);
    const generatedStoreItemId = Math.floor(1000 + Math.random() * 9000);

    // Chuẩn bị mảng ProductImages (gồm ảnh chính và các ảnh phụ)
    const productImages = [
      { imageId: Date.now(), imageUrl: newProduct.primaryImageUrl, isPrimary: true }
    ];
    newProduct.subImages.forEach((url, index) => {
      if (url.trim() !== '') {
        productImages.push({ imageId: Date.now() + index + 1, imageUrl: url.trim(), isPrimary: false });
      }
    });

    const newItem = {
      storeItemId: generatedStoreItemId,
      store: matchedStore,
      itemStatus: "PENDING",
      conditionNote: "Chờ kho nhận hàng thực tế và tiến hành quy trình thẩm duyệt.",
      product: {
        productId: generatedProductId,
        productName: newProduct.productName,
        brand: newProduct.brand || "N/A",
        origin: newProduct.origin || "N/A",
        productCondition: newProduct.productCondition,
        basePrice: parseFloat(newProduct.basePrice),
        description: newProduct.description || "Chưa có mô tả chi tiết.",
        createdAt: new Date().toISOString(),
        user: MOCK_USERS[1], // Gán cho seller mặc định
        category: matchedCategory,
        attributesJson: JSON.stringify(dynamicAttrs),
        images: productImages
      }
    };

    setStoreItems([newItem, ...storeItems]);
    setIsAddModalOpen(false);

    // Reset Forms
    setNewProduct({
      productName: '', brand: '', origin: '', productCondition: 'NEW',
      basePrice: '', description: '', storeId: 1, categoryId: 1,
      primaryImageUrl: '',
      subImages: ['', '', '']
    });
    setDynamicAttrs({});
  };

  // Hàm xử lý Upload ảnh chính (Chuyển đổi thành Object URL cục bộ để hiển thị ngay)
  const handlePrimaryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewProduct(prev => ({ ...prev, primaryImageUrl: url }));
    }
  };

  // Hàm xử lý Upload ảnh phụ (Chuyển đổi thành Object URL cục bộ)
  const handleSubImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const updatedSubImages = [...newProduct.subImages];
      updatedSubImages[index] = url;
      setNewProduct(prev => ({ ...prev, subImages: updatedSubImages }));
    }
  };

  // Hàm xóa ảnh phụ đã tải lên
  const handleRemoveSubImage = (index) => {
    const updatedSubImages = [...newProduct.subImages];
    updatedSubImages[index] = '';
    setNewProduct(prev => ({ ...prev, subImages: updatedSubImages }));
  };

  // Mở riêng Modal Đánh giá
  const handleOpenAudit = (e, item) => {
    e.stopPropagation(); // Tránh kích hoạt sự kiện click dòng mở Drawer
    setAuditItem(item);
    setAuditStatus(item.itemStatus);
    setAuditNote(item.conditionNote);
  };

  const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const getProductConditionBadge = (cond) => {
    const configs = {
      NEW: { label: "Mới 100%", dot: "bg-emerald-500", style: "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" },
      USED: { label: "Đã sử dụng", dot: "bg-amber-500", style: "bg-amber-500/5 text-amber-500 border-amber-500/20" }
    };
    return configs[cond] || { label: cond, dot: "bg-slate-400", style: "bg-slate-500/5 text-slate-400" };
  };

  // Helper lấy cấu hình template động theo category được chọn
  const getSelectedTemplate = () => {
    const matchedCat = MOCK_CATEGORIES.find(c => c.categoryId === parseInt(newProduct.categoryId));
    if (!matchedCat) return null;
    return SUBCATEGORY_TEMPLATES[matchedCat.key] || null;
  };

  const selectedTemplate = getSelectedTemplate();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Khung điều khiển & Tìm kiếm */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black dark:text-white uppercase italic tracking-tight">Kiểm định hàng ký gửi</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Giám định chất lượng, xem chi tiết và phê duyệt đưa lên sàn</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {/* Nhập tên sản phẩm để tìm kiếm */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Nhập tên sản phẩm cần tìm..."
              value={searchProductName}
              onChange={(e) => setSearchProductName(e.target.value)}
              className="w-full bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-8 text-xs focus:outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-slate-200"
            />
            {searchProductName && (
              <button onClick={() => setSearchProductName('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tìm tên cửa hàng kho lưu trữ */}
          <div className="relative flex-1 sm:w-56">
            <StoreIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Lọc tên kho..."
              value={searchStoreName}
              onChange={(e) => setSearchStoreName(e.target.value)}
              className="w-full bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:border-blue-500/50 transition-all text-slate-900 dark:text-slate-200"
            />
            {searchStoreName && (
              <button onClick={() => setSearchStoreName('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={14} />
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={14} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Lọc nhanh theo Tab kèm số lượng trong ngoặc */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit">
        {[
          { key: 'ALL', label: 'Tất cả' },
          { key: 'PENDING', label: 'Chờ duyệt' },
          { key: 'RECEIVED', label: 'Đã nhận kho' },
          { key: 'APPROVED', label: 'Thông qua' },
          { key: 'REJECTED', label: 'Từ chối' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveStatusTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all flex items-center gap-1.5 ${
              activeStatusTab === tab.key
                ? 'bg-white dark:bg-[#0b1120] text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
              activeStatusTab === tab.key
                ? 'bg-blue-500/10 text-blue-600'
                : 'bg-slate-200 dark:bg-white/10 text-slate-500'
            }`}>
              {countByStatus[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid danh sách & Side Panel xem chi tiết kiểm định */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Bảng Danh sách hàng ký gửi trong kho */}
        <div className={`${selectedItem ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm transition-all duration-500`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm ký gửi</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tình trạng</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh mục</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kho lưu</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Giá khởi điểm</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái kho</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredItems.map((item) => {
                  const statusConf = getStatusStyle(item.itemStatus);
                  const primaryImg = item.product.images.find(img => img.isPrimary)?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100";
                  return (
                    <tr 
                      key={item.storeItemId}
                      onClick={() => setSelectedItem(item)}
                      className={`hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedItem?.storeItemId === item.storeItemId ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/10 shadow-sm">
                            <img src={primaryImg} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-black dark:text-white leading-tight line-clamp-1">{item.product.productName}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Hãng: <span className="font-bold dark:text-slate-300">{item.product.brand}</span> • SP ID: <span className="font-bold dark:text-slate-300">#{item.product.productId}</span></p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-[10px] font-black rounded-lg ${item.product.productCondition === 'NEW' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 'bg-amber-500/10 text-amber-500 border border-amber-500/10'}`}>
                          {item.product.productCondition === 'NEW' ? 'Mới (NEW)' : 'Cũ (USED)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                        {item.product.category?.name || "Chưa phân loại"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs dark:text-slate-300 font-semibold">
                          <StoreIcon size={12} className="text-blue-500 shrink-0" />
                          <span className="line-clamp-1">{item.store.storeName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-black dark:text-white">
                        {formatVND(item.product.basePrice)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${statusConf.style}`}>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 justify-center">
                          <button 
                            onClick={() => setSelectedItem(item)}
                            className="p-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 rounded-lg transition-all"
                            title="Xem chi tiết sản phẩm"
                          >
                            <Eye size={13} />
                          </button>
                          <button 
                            onClick={(e) => handleOpenAudit(e, item)}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1"
                          >
                            <Shield size={11} />
                            Đánh giá
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
               <AlertTriangle size={36} className="mb-3 opacity-30 text-amber-500 animate-pulse" />
               <p className="text-xs font-black uppercase tracking-widest italic mb-2">Không tìm thấy sản phẩm phù hợp</p>
               <p className="text-[10px] text-slate-500 dark:text-slate-600">Thử gõ lại từ khóa tên sản phẩm hoặc bộ lọc</p>
            </div>
          )}
        </div>

        {/* FORM 1: Sidebar Drawer Xem Chi Tiết Sản Phẩm (Đã tách rời hoàn toàn khỏi Form Đánh Giá) */}
        {selectedItem && (
          <div className="lg:col-span-5 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-xl animate-in slide-in-from-right-4 duration-300 relative h-fit sticky top-24">
            
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-500/5"
            >
              <X size={18} />
            </button>

            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Box size={14} className="text-blue-500" />
              Chi tiết sản phẩm lưu kho
            </h3>
            
            <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex-shrink-0 shadow-inner">
                <img 
                  src={selectedItem.product.images.find(img => img.isPrimary)?.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest italic">Mã sản phẩm: #{selectedItem.product.productId}</span>
                <h4 className="text-md font-black dark:text-white mt-0.5 leading-tight">{selectedItem.product.productName}</h4>
                <p className="text-xs font-bold text-slate-500 mt-1">Sở hữu: <span className="text-blue-500">@{selectedItem.product.user.username}</span></p>
              </div>
            </div>

            {/* Thông số kỹ thuật sản phẩm & JSON Attributes */}
            <div className="py-4 border-b border-slate-100 dark:border-white/5 text-xs">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Thương hiệu</p>
                  <p className="font-bold dark:text-slate-200">{selectedItem.product.brand}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Xuất xứ</p>
                  <p className="font-bold dark:text-slate-200">{selectedItem.product.origin}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Giá trị đề xuất</p>
                  <p className="font-black text-emerald-500">{formatVND(selectedItem.product.basePrice)}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Tình trạng vật lý</p>
                  <span className="font-bold dark:text-slate-200">
                    {selectedItem.product.productCondition === 'NEW' ? 'Mới (NEW)' : 'Đã sử dụng (USED)'}
                  </span>
                </div>
              </div>

              {/* Hiển thị chi tiết thuộc tính JSON */}
              {selectedItem.product.attributesJson && (
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 mt-3">
                  <p className="text-[8px] font-black text-blue-500 uppercase mb-2">Thông số kỹ thuật cụ thể (JSON Attributes)</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {Object.entries(JSON.parse(selectedItem.product.attributesJson)).map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-slate-400 capitalize">{key}:</span>
                        <span className="font-bold dark:text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trạng thái duyệt kho thực tế & Ghi chú kiểm định hiện tại */}
            <div className="py-4 border-b border-slate-100 dark:border-white/5 text-xs space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase">Trạng thái & ghi chú thẩm định hiện thời</p>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Trạng thái:</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getStatusStyle(selectedItem.itemStatus).style}`}>
                  {getStatusStyle(selectedItem.itemStatus).label}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 italic">
                <p className="text-[9px] font-black text-slate-400 uppercase not-italic mb-1">Condition Note:</p>
                "{selectedItem.conditionNote || "Chưa có ghi chú kiểm định chất lượng."}"
              </div>
            </div>

            {/* Bộ sưu tập hình ảnh đầy đủ (Ảnh chính & Ảnh phụ) */}
            <div className="py-4">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Bộ sưu tập hình ảnh</p>
              <div className="flex flex-wrap gap-2">
                {selectedItem.product.images.map((img) => (
                  <div key={img.imageId} className={`w-14 h-14 rounded-lg overflow-hidden border bg-slate-800 shrink-0 relative ${img.isPrimary ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-200 dark:border-white/10'}`}>
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    {img.isPrimary && (
                      <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-[8px] font-bold text-center text-white py-0.5">ẢNH CHÍNH</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nút hành động mở Form Đánh giá nhanh từ Drawer */}
            <button
              onClick={(e) => {
                handleOpenAudit(e, selectedItem);
                setSelectedItem(null); // Đóng drawer xem để mở modal đánh giá gọn gàng
              }}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1"
            >
              <Shield size={14} /> Đi tới Form thẩm định sản phẩm này
            </button>
          </div>
        )}
      </div>

      {/* FORM 2: MODAL ĐÁNH GIÁ CHẤT LƯỢNG SẢN PHẨM (DÀNH RIÊNG BIỆT) */}
      {auditItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAuditItem(null)}></div>
          
          <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setAuditItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black dark:text-white uppercase italic mb-4 flex items-center gap-1.5">
              <Shield className="text-blue-500" /> Thẩm định sản phẩm: {auditItem.product.productName}
            </h3>
            
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-6">Mã Store Item: #{auditItem.storeItemId} • Giá sàn đề xuất: {formatVND(auditItem.product.basePrice)}</p>

            <div className="space-y-4">
              {/* Chọn trạng thái */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2">Trạng thái chất lượng thẩm duyệt *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { status: 'PENDING', label: 'Chờ duyệt' },
                    { status: 'RECEIVED', label: 'Đã nhận kho' },
                    { status: 'APPROVED', label: 'Đạt kiểm định' },
                    { status: 'REJECTED', label: 'Từ chối phê duyệt' }
                  ].map(btn => (
                    <button
                      key={btn.status}
                      type="button"
                      onClick={() => setAuditStatus(btn.status)}
                      className={`py-2.5 px-3 text-[10px] font-black rounded-xl border text-center transition-all ${
                        auditStatus === btn.status 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'bg-transparent dark:bg-white/5 hover:border-slate-500 text-slate-400'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gợi ý mẫu thẩm định nhanh */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1.5">Gợi ý nhận xét nhanh</label>
                <div className="flex flex-col gap-1">
                  {QC_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAuditNote(tpl)}
                      className="text-[9px] font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all text-left truncate"
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nhập ghi chú nhận xét */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Nhận xét chất lượng & tình trạng sản phẩm chi tiết *</label>
                <textarea
                  rows="3"
                  value={auditNote}
                  onChange={(e) => setAuditNote(e.target.value)}
                  placeholder="Nhập nhận xét kiểm duyệt kỹ thuật, tình trạng lỗi hỏng nếu có..."
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 leading-normal"
                ></textarea>
              </div>

              {/* Các nút bấm thao tác */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAuditItem(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl text-xs font-black uppercase hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Đóng
                </button>
                <button
                  onClick={() => handleUpdateAudit(auditItem.storeItemId)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20"
                >
                  Xác nhận thẩm định
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NHẬP MỚI SẢN PHẨM KÝ GỬI (Giao diện upload tệp cục bộ ảnh chính/phụ rõ ràng) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          
          <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-xl relative z-10 my-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black dark:text-white uppercase italic mb-6 flex items-center gap-2">
              <Box className="text-blue-500" /> Nhập mới sản phẩm lưu kho
            </h3>

            <form onSubmit={handleAddStoreItem} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              
              {/* Tên sản phẩm & Thương hiệu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                    placeholder="ví dụ: Laptop Dell XPS 15 2024"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Thương hiệu / Hãng *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    placeholder="ví dụ: Dell"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Xuất xứ & Tình trạng (Chỉ NEW, USED) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Xuất xứ / Nguồn gốc</label>
                  <input
                    type="text"
                    value={newProduct.origin}
                    onChange={(e) => setNewProduct({ ...newProduct, origin: e.target.value })}
                    placeholder="ví dụ: Mỹ"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tình trạng vật lý *</label>
                  <select
                    value={newProduct.productCondition}
                    onChange={(e) => setNewProduct({ ...newProduct, productCondition: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="NEW">Mới (NEW) - Hàng nguyên hộp</option>
                    <option value="USED">Đã sử dụng (USED)</option>
                  </select>
                </div>
              </div>

              {/* Danh mục (Category) - Quyết định các trường JSON Attributes động */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Phân loại danh mục *</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, categoryId: e.target.value });
                      setDynamicAttrs({}); // Reset thuộc tính khi đổi category
                    }}
                    className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {MOCK_CATEGORIES.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Kho gán lưu trữ & Giá khởi điểm đề xuất */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Gán vào Kho lưu trữ *</label>
                  <select
                    value={newProduct.storeId}
                    onChange={(e) => setNewProduct({ ...newProduct, storeId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {INITIAL_STORES.map(s => (
                      <option key={s.storeId} value={s.storeId}>{s.storeName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* THÔNG SỐ ĐỘNG (JSON attributes) TÙY THEO CATEGORY ĐƯỢC CHỌN */}
              {selectedTemplate && (
                <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-3">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                    <FileText size={12} /> Thuộc tính chi tiết ({selectedTemplate.label})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTemplate.fields.map(f => (
                      <div key={f.name}>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{f.label} {f.required && '*'}</label>
                        <input
                          type="text"
                          required={f.required}
                          placeholder={f.placeholder}
                          value={dynamicAttrs[f.name] || ''}
                          onChange={(e) => setDynamicAttrs({ ...dynamicAttrs, [f.name]: e.target.value })}
                          className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-lg py-2 px-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Giá trị khởi điểm */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Giá khởi điểm sàn đề xuất (VND) *</label>
                <input
                  type="number"
                  required
                  value={newProduct.basePrice}
                  onChange={(e) => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                  placeholder="ví dụ: 15000000"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* KHU VỰC TẢI ẢNH CHÍNH RIÊNG BIỆT (Primary Image) */}
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                  <ImageIcon size={12} className="text-blue-500" /> Tải lên ảnh chính sản phẩm * (Bắt buộc)
                </label>
                
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111827] relative hover:border-blue-500 transition-colors">
                  {newProduct.primaryImageUrl ? (
                    <div className="text-center">
                      <img src={newProduct.primaryImageUrl} alt="Ảnh chính" className="max-h-32 object-cover rounded-xl mb-3 shadow-md" />
                      <button 
                        type="button" 
                        onClick={() => setNewProduct(prev => ({ ...prev, primaryImageUrl: '' }))}
                        className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1 mx-auto"
                      >
                        <Trash size={12} /> Xóa & Thay đổi
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-center w-full block py-4">
                      <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2 animate-bounce" />
                      <span className="text-xs font-bold text-blue-500 dark:text-blue-400 hover:underline">Chọn ảnh từ máy tính</span>
                      <p className="text-[9px] text-slate-500 mt-1">Hỗ trợ các định dạng tệp ảnh PNG, JPG, WEBP</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        required 
                        onChange={handlePrimaryImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* KHU VỰC TẢI ẢNH PHỤ RIÊNG BIỆT (Tối đa 3 ảnh) */}
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                  <ImageIcon size={12} className="text-purple-500" /> Tải lên ảnh phụ bổ sung (Tối đa 3 ảnh phụ)
                </label>
                
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => {
                    const imgUrl = newProduct.subImages[idx];
                    return (
                      <div key={idx} className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#111827] aspect-square relative hover:border-purple-500 transition-colors">
                        {imgUrl ? (
                          <div className="absolute inset-0 p-1 flex flex-col items-center justify-center">
                            <img src={imgUrl} alt={`Ảnh phụ ${idx + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
                            <button
                              type="button"
                              onClick={() => handleRemoveSubImage(idx)}
                              className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full hover:scale-110 transition-transform shadow-md"
                              title="Xóa ảnh"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer text-center flex flex-col items-center justify-center h-full w-full">
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-[9px] font-black text-slate-500 uppercase">Ảnh phụ {idx + 1}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleSubImageUpload(e, idx)} 
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mô tả đặc điểm */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mô tả đặc điểm sản phẩm</label>
                <textarea
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Nhập thông số, phụ kiện đi kèm nếu có..."
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 leading-normal"
                ></textarea>
              </div>

              {/* Thao tác nút bấm */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20"
                >
                  Xác nhận ký gửi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- VIEW: STORE MANAGEMENT ---
const StoreManagement = () => {
  const [stores, setStores] = useState(INITIAL_STORES);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  
  const [formStoreName, setFormStoreName] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedWardId, setSelectedWardId] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');

  const filteredWards = WARDS.filter(w => w.provinceId === parseInt(selectedProvinceId));

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
    setFormStreet(store.address.street);
    setSelectedProvinceId(store.address.province.provinceId.toString());
    setSelectedWardId(store.address.ward.wardId.toString());
    setFormStatus(store.storeStatus);
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formStoreName || !formStreet || !selectedProvinceId || !selectedWardId) {
      alert("Vui lòng nhập đầy đủ thông tin kho hàng bắt buộc!");
      return;
    }

    const provinceObj = PROVINCES.find(p => p.provinceId === parseInt(selectedProvinceId));
    const wardObj = WARDS.find(w => w.wardId === parseInt(selectedWardId));

    if (editingStore) {
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

  const handleDeleteStore = (storeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn kho hàng này?")) {
      setStores(stores.filter(s => s.storeId !== storeId));
    }
  };

  const filteredStores = stores.filter(s => {
    const matchStatus = filterStatus === 'ALL' || s.storeStatus === filterStatus;
    const matchSearch = s.storeName.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
                        s.address.street.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchStatus && matchSearch;
  });

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
                      {store.storeId === 1 ? 1420 : store.storeId === 2 ? 850 : 0} Items
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
                      setSelectedProvinceId(e.target.value);
                      setSelectedWardId('');
                    }}
                    className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Chọn tỉnh thành --</option>
                    {PROVINCES.map(p => (
                      <option key={p.provinceId} value={p.provinceId}>{p.name}</option>
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
                    {filteredWards.map(w => (
                      <option key={w.wardId} value={w.wardId}>{w.name}</option>
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
              {renderStatIcon(stat.icon)}
            </div>
            {stat.trend && (
              <span className={`text-[10px] font-black ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase">{stat.label}</p>
          <h3 className="text-xl font-black dark:text-white mt-1">{stat.value}</h3>
          {stat.sub && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">{stat.sub}</p>
          )}
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
            <SidebarItem icon={<Box size={20}/>} label="Sản phẩm kho" active={activeTab === 'store-items'} onClick={() => setActiveTab('store-items')} collapsed={collapsed} />
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
            {activeTab === 'store-items' && <StoreItemManagement />}
            
            {/* Fallback mock UI for other tabs */}
            {['auctions', 'subscriptions', 'settings'].includes(activeTab) && (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-white/5">
                <Activity className="w-12 h-12 text-blue-500 animate-pulse mb-4" />
                <h3 className="text-sm font-black uppercase tracking-widest italic">Tính năng đang đồng bộ</h3>
                <p className="text-[10px] text-slate-500 mt-1">Vui lòng quay lại các Tab chính để trải nghiệm</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}