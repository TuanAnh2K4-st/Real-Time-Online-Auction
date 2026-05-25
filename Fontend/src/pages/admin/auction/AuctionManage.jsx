import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, X, Plus, Calendar, DollarSign, Tag, TrendingUp, Users, 
  Clock, ShieldCheck, CheckCircle2, AlertTriangle, Eye, Edit3, Trash2, 
  ChevronRight, Sparkles, Filter, RefreshCw, Layers, ArrowUpRight, 
  Check, Play, Ban, Moon, Sun, Info, Award, Package, ShoppingBag, User,
  FileText, Activity, Hash, ArrowDownUp, Shield, Globe, AwardIcon
} from 'lucide-react';

// Dữ liệu mẫu danh sách sản phẩm sẵn có trong hệ thống (@Entity Product)
const MOCK_PRODUCTS = [
  {
    productId: 501,
    productName: "Đồng hồ Rolex Submariner Date 126610LN",
    brand: "Rolex",
    origin: "Thụy Sĩ",
    productCondition: "LIKE_NEW", // LIKE_NEW, NEW, USED
    description: "Đồng hồ Rolex chính hãng dòng Submariner huyền thoại, đầy đủ hộp sổ thẻ mua năm 2024.",
    basePrice: 290000000,
    category: { categoryId: 1, name: "Đồng hồ xa xỉ" },
    images: [
      { imageId: 1, imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=400", isPrimary: true },
      { imageId: 2, imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400", isPrimary: false }
    ],
    user: { userId: 10, username: "hoang_son_luxury", email: "son.hoang@luxurywatches.vn" }
  },
  {
    productId: 502,
    productName: "Túi xách Hermès Birkin 30 Epsom Gold",
    brand: "Hermès",
    origin: "Pháp",
    productCondition: "NEW",
    description: "Túi Hermès Birkin 30 chất liệu da Epsom màu Gold cao cấp, phụ kiện khóa mạ vàng cứng cáp mới 100%.",
    basePrice: 450000000,
    category: { categoryId: 2, name: "Túi xách thời trang" },
    images: [
      { imageId: 3, imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400", isPrimary: true }
    ],
    user: { userId: 11, username: "mai_phuong_boutique", email: "contact@maiphuongboutique.com" }
  },
  {
    productId: 503,
    productName: "Bức tranh Sơn Dầu cổ điển Phố Phái 1992",
    brand: "Phố Phái",
    origin: "Việt Nam",
    productCondition: "USED",
    description: "Tác phẩm hội họa sơn dầu cổ điển thể hiện phố cổ Hà Nội xưa vẽ năm 1992, có chữ ký gốc của tác giả.",
    basePrice: 110000000,
    category: { categoryId: 3, name: "Tranh & Nghệ thuật" },
    images: [
      { imageId: 4, imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=400", isPrimary: true }
    ],
    user: { userId: 12, username: "vintage_collector_hanoi", email: "long.art@hanoiclassical.vn" }
  },
  {
    productId: 504,
    productName: "Bình Gốm Chu Đậu Khảm Vàng Thời Lê",
    brand: "Gốm Chu Đậu",
    origin: "Việt Nam",
    productCondition: "USED",
    description: "Cổ vật bình gốm tích Chu Đậu thời Lê sơ, được khảm vàng tinh xảo thủ công, có chứng nhận giám định.",
    basePrice: 70000000,
    category: { categoryId: 4, name: "Cổ vật phẩm" },
    images: [
      { imageId: 5, imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=400", isPrimary: true }
    ],
    user: { userId: 13, username: "nguyen_co_vat_hue", email: "dien.nguyen@hueheritage.com" }
  },
  {
    productId: 505,
    productName: "Kính mát mạ vàng Cartier Santos Edition 2025",
    brand: "Cartier",
    origin: "Pháp",
    productCondition: "NEW",
    description: "Kính Santos de Cartier phiên bản đặc biệt mạ vàng 18K, chống tia UV tuyệt đối, mới tinh nguyên seal.",
    basePrice: 28000000,
    category: { categoryId: 1, name: "Đồng hồ xa xỉ" },
    images: [
      { imageId: 6, imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400", isPrimary: true }
    ],
    user: { userId: 10, username: "hoang_son_luxury", email: "son.hoang@luxurywatches.vn" }
  }
];

// Dữ liệu mẫu phiên đấu giá ban đầu
const INITIAL_AUCTIONS = [
  {
    auctionId: 101,
    product: MOCK_PRODUCTS[0],
    seller: MOCK_PRODUCTS[0].user,
    winningBid: {
      bidId: 9001,
      bidAmount: 345000000,
      bidder: { 
        userId: 12,
        username: "dai_gia_quan_1",
        email: "dat.nguyen@saigonholdings.com",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
      },
      bidTime: "2026-05-25T14:30:00"
    },
    winner: {
      userId: 12,
      username: "dai_gia_quan_1",
      email: "dat.nguyen@saigonholdings.com",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    currentPrice: 345000000,
    startPrice: 300000000,
    stepPrice: 5000000,
    auctionStatus: "ACTIVE", // ACTIVE, UPCOMING, COMPLETED, SUSPENDED
    auctionType: "NORMAL", // NORMAL, LIVE
    startTime: "2026-05-24T09:00:00",
    endTime: "2026-05-28T18:00:00",
    bidsHistory: [
      { 
        bidId: 9005, 
        bidAmount: 345000000, 
        bidTime: "2026-05-25T14:30:00",
        bidder: { 
          userId: 12, 
          username: "dai_gia_quan_1", 
          email: "dat.nguyen@saigonholdings.com",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
        }
      },
      { 
        bidId: 9004, 
        bidAmount: 340000000, 
        bidTime: "2026-05-25T12:15:00",
        bidder: { 
          userId: 15, 
          username: "tran_hoang_90", 
          email: "hoang.tran@gmail.com",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
        }
      }
    ]
  },
  {
    auctionId: 102,
    product: MOCK_PRODUCTS[1],
    seller: MOCK_PRODUCTS[1].user,
    winningBid: null,
    winner: null,
    currentPrice: 480000000,
    startPrice: 480000000,
    stepPrice: 10000000,
    auctionStatus: "UPCOMING",
    auctionType: "LIVE",
    startTime: "2026-06-01T10:00:00",
    endTime: "2026-06-05T20:00:00",
    bidsHistory: []
  }
];

export default function AuctionManage() {
  const [auctions, setAuctions] = useState(INITIAL_AUCTIONS);
  const [selectedAuction, setSelectedAuction] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); 

  // Tab Chi tiết (Thông tin chung / Lịch sử thầu)
  const [detailTab, setDetailTab] = useState('INFO');

  // Modal State cho việc Thêm/Sửa Đấu giá
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('CREATE'); 
  const [currentEditId, setCurrentEditId] = useState(null);

  // Form State
  const [selectedProduct, setSelectedProduct] = useState(null); // Thực thể Product được chọn từ danh sách
  const [formStartPrice, setFormStartPrice] = useState('');
  const [formStepPrice, setFormStepPrice] = useState('');
  const [formAuctionType, setFormAuctionType] = useState('NORMAL'); // NORMAL, LIVE
  const [formAuctionStatus, setFormAuctionStatus] = useState('UPCOMING');
  const [formStartTime, setFormStartTime] = useState('');
  const [formEndTime, setFormEndTime] = useState('');

  // Tìm kiếm sản phẩm trong form chọn
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Bộ lọc nâng cao
  const filteredAuctions = useMemo(() => {
    return auctions.filter(auc => {
      const matchSearch = 
        auc.product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auc.product.productId.toString().includes(searchQuery) ||
        auc.seller.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = filterStatus === 'ALL' || auc.auctionStatus === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [auctions, searchQuery, filterStatus]);

  // Thống kê nhanh dịch tiếng Việt
  const stats = useMemo(() => {
    return {
      total: auctions.length,
      active: auctions.filter(a => a.auctionStatus === 'ACTIVE').length,
      pendingAppraisal: auctions.filter(a => a.product.productCondition === 'PENDING').length, // Theo dõi theo độ mới hoặc trạng thái thô
      totalVolume: auctions.filter(a => a.auctionStatus === 'COMPLETED').reduce((acc, curr) => acc + curr.currentPrice, 0)
    };
  }, [auctions]);

  // Phân tích thầu của Đấu giá đang chọn (Bids Analytics)
  const bidStats = useMemo(() => {
    if (!selectedAuction || !selectedAuction.bidsHistory.length) {
      return { totalBids: 0, avgIncrease: 0, uniqueBidders: 0 };
    }
    const history = selectedAuction.bidsHistory;
    const totalBids = history.length;
    const uniqueBidders = new Set(history.map(b => b.bidder.username)).size;
    
    const totalRaise = selectedAuction.currentPrice - selectedAuction.startPrice;
    const avgIncrease = totalBids > 0 ? Math.round(totalRaise / totalBids) : 0;

    return { totalBids, avgIncrease, uniqueBidders };
  }, [selectedAuction]);

  const formatVND = (value) => {
    if (value === undefined || value === null) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Mở modal tạo mới đấu giá
  const handleOpenCreate = () => {
    setModalType('CREATE');
    setSelectedProduct(null); // Reset chọn sản phẩm
    setProductSearchQuery('');
    setFormStartPrice('');
    setFormStepPrice('');
    setFormAuctionType('NORMAL');
    setFormAuctionStatus('UPCOMING');
    
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + 5);
    setFormStartTime(now.toISOString().slice(0, 16));
    setFormEndTime(future.toISOString().slice(0, 16));

    setIsModalOpen(true);
  };

  // Mở modal sửa đổi đấu giá
  const handleOpenEdit = (auction) => {
    setModalType('EDIT');
    setCurrentEditId(auction.auctionId);
    setSelectedProduct(auction.product); // Load sản phẩm của auction đang sửa
    setFormStartPrice(auction.startPrice.toString());
    setFormStepPrice(auction.stepPrice.toString());
    setFormAuctionType(auction.auctionType);
    setFormAuctionStatus(auction.auctionStatus);
    setFormStartTime(new Date(auction.startTime).toISOString().slice(0, 16));
    setFormEndTime(new Date(auction.endTime).toISOString().slice(0, 16));

    setIsModalOpen(true);
  };

  // Chọn nhanh sản phẩm từ danh sách mẫu trong Form
  const handleSelectProductInForm = (prod) => {
    setSelectedProduct(prod);
    setFormStartPrice(prod.basePrice.toString()); // Đặt giá sàn bằng giá cơ sở sản phẩm
    setFormStepPrice(Math.round(prod.basePrice * 0.02).toString()); // Đặt bước nhảy mặc định 2% giá trị sản phẩm
  };

  // Xử lý gửi Form (Thêm hoặc Sửa)
  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert("Vui lòng chọn một sản phẩm để tạo phiên đấu giá!");
      return;
    }

    const startPriceNum = parseFloat(formStartPrice);
    const stepPriceNum = parseFloat(formStepPrice);

    if (modalType === 'CREATE') {
      const newId = auctions.length > 0 ? Math.max(...auctions.map(a => a.auctionId)) + 1 : 100;
      
      const createdAuction = {
        auctionId: newId,
        product: selectedProduct,
        seller: selectedProduct.user,
        winningBid: null,
        winner: null,
        currentPrice: startPriceNum,
        startPrice: startPriceNum,
        stepPrice: stepPriceNum,
        auctionStatus: formAuctionStatus,
        auctionType: formAuctionType,
        startTime: formStartTime,
        endTime: formEndTime,
        bidsHistory: []
      };

      const updatedList = [createdAuction, ...auctions];
      setAuctions(updatedList);
      setSelectedAuction(createdAuction);
    } else {
      const updatedList = auctions.map(auc => {
        if (auc.auctionId === currentEditId) {
          const updated = {
            ...auc,
            product: selectedProduct,
            seller: selectedProduct.user,
            startPrice: startPriceNum,
            stepPrice: stepPriceNum,
            auctionStatus: formAuctionStatus,
            auctionType: formAuctionType,
            startTime: formStartTime,
            endTime: formEndTime
          };
          if (auc.bidsHistory.length === 0) {
            updated.currentPrice = startPriceNum;
          }
          return updated;
        }
        return auc;
      });

      setAuctions(updatedList);
      const updatedSelected = updatedList.find(a => a.auctionId === currentEditId);
      if (updatedSelected) setSelectedAuction(updatedSelected);
    }

    setIsModalOpen(false);
  };

  // Xóa phiên đấu giá
  const handleDeleteAuction = (auctionId) => {
    if (confirm("Bạn có chắc chắn muốn xóa phiên đấu giá này vĩnh viễn không?")) {
      const remaining = auctions.filter(a => a.auctionId !== auctionId);
      setAuctions(remaining);
      if (selectedAuction?.auctionId === auctionId) {
        setSelectedAuction(null);
      }
    }
  };

  // Đổi nhanh trạng thái Phiên đấu giá
  const handleUpdateAuctionStatus = (auctionId, newStatus) => {
    const updated = auctions.map(auc => {
      if (auc.auctionId === auctionId) {
        return { ...auc, auctionStatus: newStatus };
      }
      return auc;
    });
    setAuctions(updated);
    setSelectedAuction(updated.find(a => a.auctionId === auctionId));
  };

  // Lọc danh sách sản phẩm mẫu theo từ khóa nhập trong form
  const searchedProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => 
      p.productName.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.productId.toString().includes(productSearchQuery)
    );
  }, [productSearchQuery]);

  return (
    <div className="font-sans transition-colors duration-300">

      {/* CHỈ SỐ DASHBOARD NHANH */}
      <main className="max-w-[1600px] mx-auto p-6 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-3xl border transition-all bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-1">Tổng số phiên đấu giá</span>
                <span className="text-2xl font-black italic tracking-tight">{stats.total} phiên</span>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                <Layers size={18} />
              </div>
            </div>
          </div>
          <div className={`p-5 rounded-3xl border transition-all bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-1">Phiên đang diễn ra</span>
                <span className="text-2xl font-black italic text-emerald-500 tracking-tight">{stats.active} Live</span>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl animate-pulse">
                <Play size={18} />
              </div>
            </div>
          </div>
          <div className={`p-5 rounded-3xl border transition-all bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-1">Hàng hóa ký gửi</span>
                <span className="text-2xl font-black italic text-amber-500 tracking-tight">{MOCK_PRODUCTS.length} món</span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                <ShieldCheck size={18} />
              </div>
            </div>
          </div>
          <div className={`p-5 rounded-3xl border transition-all bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-1">Giá trị giao dịch thành công</span>
                <span className="text-xl font-black italic text-indigo-500 tracking-tight">{formatVND(stats.totalVolume)}</span>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                <TrendingUp size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* TIÊU ĐỀ BODY, KHU VỰC TÌM KIẾM, NÚT TẠO PHIÊN */}
        <section className="flex flex-col gap-6 p-6 rounded-3xl border transition-all bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight">Hệ thống quản lý đấu giá</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Giám sát chu trình thầu, chất lượng vật phẩm và luồng đấu giá</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Hộp tìm kiếm */}
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm, mã SP, tên người bán..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:border-blue-500 transition-all bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Nút Tạo đấu giá tại Body */}
              <button 
                onClick={handleOpenCreate}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 active:scale-95 whitespace-nowrap"
              >
                <Plus size={14} /> Tạo đấu giá mới
              </button>
            </div>
          </div>

          {/* SỬA: ĐƯA TOÀN BỘ BỘ LỌC TRẠNG THÁI PHIÊN XUỐNG DƯỚI THANH TÌM KIẾM VÀ LOẠI BỎ LỌC KIỂM ĐỊNH */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter size={12} /> Trạng thái phiên thầu:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { code: 'ALL', name: 'Tất cả trạng thái' },
                { code: 'ACTIVE', name: 'Đang hoạt động (Live)' },
                { code: 'UPCOMING', name: 'Sắp diễn ra' },
                { code: 'COMPLETED', name: 'Đã kết thúc' },
                { code: 'SUSPENDED', name: 'Tạm ngưng' }
              ].map(status => (
                <button
                  key={status.code}
                  onClick={() => setFilterStatus(status.code)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* KHÔNG GIAN LÀM VIỆC CHÍNH */}
        <section className="flex flex-col gap-8">
          
          {/* BẢNG DANH SÁCH PHIÊN ĐẤU GIÁ */}
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5'}`}>
                    <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm & Người bán</th>
                    <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Giá sàn / Hiện tại</th>
                    <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Thể thức</th>
                    <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái phiên</th>
                    <th className="px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredAuctions.map((auc) => {
                    const primaryImg = auc.product.images?.find(img => img.isPrimary)?.imageUrl || auc.product.imageUrl;
                    return (
                      <tr 
                        key={auc.auctionId}
                        className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedAuction?.auctionId === auc.auctionId ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
                        onClick={() => setSelectedAuction(auc)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={primaryImg} 
                              alt="" 
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100" }}
                            />
                            <div className="max-w-[180px] sm:max-w-[240px]">
                              <p className="text-xs font-black dark:text-white truncate" title={auc.product.productName}>
                                {auc.product.productName}
                              </p>
                              <p className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                                <span>Mã SP: {auc.product.productId}</span>
                                <span className="opacity-40">•</span>
                                <span className="text-blue-500">@{auc.seller.username}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-mono">
                          <div className="text-xs font-bold dark:text-white">{formatVND(auc.currentPrice)}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">Sàn: {formatVND(auc.startPrice)}</div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${auc.auctionType === 'LIVE' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-400'}`}>
                            {auc.auctionType === 'LIVE' ? 'Trực tiếp' : 'Thường'}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <AuctionStatusBadge status={auc.auctionStatus} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => handleOpenEdit(auc)}
                              className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                              title="Chỉnh sửa cấu hình đấu giá"
                            >
                              <Edit3 size={14}/>
                            </button>
                            <button 
                              onClick={() => handleDeleteAuction(auc.auctionId)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Xóa đấu giá"
                            >
                              <Trash2 size={14}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredAuctions.length === 0 && (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <AlertTriangle size={36} className="mb-3 opacity-30 text-amber-500" />
                <p className="text-xs font-black uppercase tracking-widest italic mb-2">Không tìm thấy phiên đấu giá nào phù hợp</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-600">Thử thay đổi từ khóa tìm kiếm hoặc chỉnh lại bộ lọc</p>
                <button 
                  onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); }}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* KHUNG CHI TIẾT SẢN PHẨM & LỊCH SỬ THẦU */}
          {selectedAuction ? (
            <div className="w-full space-y-6 animate-in slide-in-from-right-4 duration-300 relative h-fit xl:sticky xl:top-24">
              <div className={`border rounded-3xl p-6 shadow-xl relative bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
                <button 
                  onClick={() => setSelectedAuction(null)} 
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-500/5"
                  title="Đóng khung chi tiết"
                >
                  <X size={16} />
                </button>

                {/* HEADER SẢN PHẨM CHI TIẾT */}
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={selectedAuction.product.images?.find(img => img.isPrimary)?.imageUrl || selectedAuction.product.imageUrl} 
                    alt="" 
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-white/10"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200" }}
                  />
                  <div className="flex-1">
                    <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase bg-blue-500/10 text-blue-500 tracking-wider">
                      {selectedAuction.product.category?.name}
                    </span>
                    <h3 className="text-base font-black dark:text-white uppercase italic leading-tight mt-1 mb-1">
                      {selectedAuction.product.productName}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">Mã phiên: #{selectedAuction.auctionId} | Mã SP: {selectedAuction.product.productId}</p>
                  </div>
                </div>

                {/* ĐIỀU HƯỚNG TAB CHUNG / LỊCH SỬ THẦU */}
                <div className="flex border-b border-slate-100 dark:border-white/5 mb-6">
                  <button
                    onClick={() => setDetailTab('INFO')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
                      detailTab === 'INFO' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText size={14} /> Thông tin chung
                  </button>
                  <button
                    onClick={() => setDetailTab('BIDS')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 relative ${
                      detailTab === 'BIDS' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Activity size={14} /> Lịch sử đặt giá ({selectedAuction.bidsHistory.length})
                    {selectedAuction.bidsHistory.length > 0 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                        {selectedAuction.bidsHistory.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* TAB 1: THÔNG TIN CHI TIẾT VẬT PHẨM & CẤU HÌNH */}
                {detailTab === 'INFO' && (
                  <div className="space-y-6">
                    {/* Đặc tả kỹ thuật thực thể Product */}
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2.5">
                      <p className="text-[9px] font-black uppercase text-blue-500 tracking-wider flex items-center gap-1.5">
                        <Package size={12} /> Thông số vật phẩm kiểm định
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div><span className="text-slate-400">Thương hiệu:</span> <strong className="dark:text-white">{selectedAuction.product.brand || "Không rõ"}</strong></div>
                        <div><span className="text-slate-400">Xuất xứ:</span> <strong className="dark:text-white">{selectedAuction.product.origin || "Không rõ"}</strong></div>
                        <div>
                          <span className="text-slate-400">Độ mới vật lý:</span> 
                          <span className="ml-1.5 px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase">
                            {selectedAuction.product.productCondition}
                          </span>
                        </div>
                        <div><span className="text-slate-400">Giá cơ sở:</span> <strong className="dark:text-white">{formatVND(selectedAuction.product.basePrice)}</strong></div>
                      </div>
                      {selectedAuction.product.description && (
                        <p className="text-[11px] text-slate-500 italic border-t border-slate-100 dark:border-white/5 pt-2 mt-1">
                          "{selectedAuction.product.description}"
                        </p>
                      )}
                    </div>

                    {/* Chỉ số tài chính */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Mức giá hiện tại</p>
                        <p className="text-sm font-black text-emerald-500 italic font-mono">{formatVND(selectedAuction.currentPrice)}</p>
                      </div>
                      <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Bước nhảy tối thiểu</p>
                        <p className="text-sm font-black text-blue-500 italic font-mono">{formatVND(selectedAuction.stepPrice)}</p>
                      </div>
                      <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Thời điểm bắt đầu</p>
                        <p className="text-[10px] font-bold dark:text-slate-200 mt-1">{new Date(selectedAuction.startTime).toLocaleString('vi-VN')}</p>
                      </div>
                      <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Thời điểm kết thúc</p>
                        <p className="text-[10px] font-bold dark:text-slate-200 mt-1">{new Date(selectedAuction.endTime).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>

                    {/* Đối tác liên quan */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={selectedAuction.seller.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Chủ sở hữu (Người bán)</p>
                            <p className="text-xs font-black dark:text-white mt-1">@{selectedAuction.seller.username}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{selectedAuction.seller.email}</span>
                      </div>

                      {selectedAuction.winner ? (
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                          <div className="flex items-center gap-3">
                            <img src={selectedAuction.winner.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase leading-none">Thành viên thắng thầu cao nhất</p>
                              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">@{selectedAuction.winner.username}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold font-mono text-emerald-500">{formatVND(selectedAuction.currentPrice)}</span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-center text-slate-400 text-[10px] italic">
                          Chưa có ghi nhận giao dịch thầu nào hợp lệ
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: LỊCH SỬ THẦU @ENTITY BID */}
                {detailTab === 'BIDS' && (
                  <div className="space-y-6">
                    {/* Phân tích giao dịch nhanh */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Tổng lượt thầu</span>
                        <span className="text-base font-black italic text-blue-500 font-mono">{bidStats.totalBids} lượt</span>
                      </div>
                      <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Bước tăng trung bình</span>
                        <span className="text-[11px] font-black italic text-emerald-500 font-mono mt-1 block">{formatVND(bidStats.avgIncrease)}</span>
                      </div>
                      <div className="p-3 bg-purple-500/5 rounded-2xl border border-purple-500/10 text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Số người tham gia</span>
                        <span className="text-base font-black italic text-purple-500 font-mono">{bidStats.uniqueBidders} users</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Hash size={11} /> Nhật ký giao dịch đặt giá (Bảng Bid)
                        </span>
                      </div>
                      
                      <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                        {selectedAuction.bidsHistory.length === 0 ? (
                          <div className="p-12 text-center text-slate-400 text-[10px] italic">
                            Chưa ghi nhận dữ liệu giao dịch trong bảng "bid" của hệ thống.
                          </div>
                        ) : (
                          selectedAuction.bidsHistory.map((bid, idx) => (
                            <div key={bid.bidId} className={`p-3.5 flex items-center justify-between transition-colors ${idx === 0 ? 'bg-blue-500/5' : 'hover:bg-slate-50/50 dark:hover:bg-white/5'}`}>
                              <div className="flex items-center gap-3">
                                <img 
                                  src={bid.bidder.avatarUrl} 
                                  alt="" 
                                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50" }}
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black dark:text-white">@{bid.bidder.username}</span>
                                    {idx === 0 && (
                                      <span className="px-1 py-0.2 rounded bg-emerald-500 text-white text-[7px] font-black uppercase tracking-widest">CAO NHẤT</span>
                                    )}
                                  </div>
                                  <p className="text-[8px] text-slate-400 mt-0.5 font-mono">
                                    Mã thầu: <span className="text-blue-500">#{bid.bidId}</span> • {bid.bidder.email}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono block">
                                  {formatVND(bid.bidAmount)}
                                tap</span>
                                <span className="text-[8px] text-slate-400 font-mono mt-0.5 block flex items-center justify-end gap-1">
                                  <Clock size={10} /> {new Date(bid.bidTime).toLocaleTimeString('vi-VN')}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ĐIỀU CHỈNH TRẠNG THÁI PHIÊN NHANH */}
                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-white/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Điều chỉnh trạng thái phiên đấu</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleUpdateAuctionStatus(selectedAuction.auctionId, 'ACTIVE')}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-1 ${
                        selectedAuction.auctionStatus === 'ACTIVE'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 hover:bg-emerald-500/10'
                      }`}
                    >
                      <Play size={11} /> Kích hoạt Live
                    </button>
                    <button
                      onClick={() => handleUpdateAuctionStatus(selectedAuction.auctionId, 'COMPLETED')}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-1 ${
                        selectedAuction.auctionStatus === 'COMPLETED'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 hover:bg-indigo-500/10'
                      }`}
                    >
                      <CheckCircle2 size={11} /> Kết thúc phiên
                    </button>
                    <button
                      onClick={() => handleUpdateAuctionStatus(selectedAuction.auctionId, 'SUSPENDED')}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-1 ${
                        selectedAuction.auctionStatus === 'SUSPENDED'
                          ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 hover:bg-red-500/10'
                      }`}
                    >
                      <Ban size={11} /> Tạm dừng thầu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CHƯA CHỌN PHIÊN */
            <div className="hidden xl:flex xl:col-span-6 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl p-12 flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-300 mb-4 animate-bounce">
                <Info size={28} />
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed mt-2">
                Hãy nhấp vào một dòng đấu giá bất kỳ trên bảng danh sách bên trái để mở rộng thông tin chi tiết, biểu đồ phân tích và lịch sử giao dịch thầu thời gian thực.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* CREATE / EDIT AUCTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className={`border rounded-3xl p-6 shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2 text-blue-500">
              <Sparkles /> {modalType === 'CREATE' ? 'Thiết lập cấu hình phiên đấu giá mới' : 'Cập nhật thông tin cấu hình đấu giá'}
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              
              {/* PHẦN 1: CHỌN SẢN PHẨM TỪ HỆ THỐNG */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-500 flex items-center justify-between border-b dark:border-white/5 pb-2">
                  <span className="flex items-center gap-1.5"><Package size={14} /> 1. Lựa chọn sản phẩm từ kho hàng *</span>
                  {selectedProduct && (
                    <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                      <Check size={12} /> Đã chọn mã: #{selectedProduct.productId}
                    </span>
                  )}
                </p>

                {/* Ô tìm kiếm nhanh sản phẩm thầu */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm nhanh theo tên sản phẩm, thương hiệu hoặc mã sản phẩm..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className={`w-full py-1.5 pl-9 pr-4 text-xs rounded-lg border focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                  />
                </div>

                {/* Grid danh sách sản phẩm có sẵn để bấm lựa chọn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {searchedProducts.map((prod) => {
                    const primaryImg = prod.images?.find(img => img.isPrimary)?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100";
                    const isSelected = selectedProduct?.productId === prod.productId;
                    return (
                      <div
                        key={prod.productId}
                        onClick={() => handleSelectProductInForm(prod)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected 
                            ? 'bg-blue-500/10 border-blue-500 shadow-md shadow-blue-500/5' 
                            : 'bg-white dark:bg-black/20 border-slate-200 dark:border-white/5 hover:border-slate-400 dark:hover:border-white/20'
                        }`}
                      >
                        <img 
                          src={primaryImg} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-black truncate ${isSelected ? 'text-blue-500' : 'dark:text-white'}`}>
                            {prod.productName}
                          </h4>
                          <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1 font-mono">
                            <span>{prod.brand} ({prod.origin})</span>
                            <span className="text-emerald-500 font-bold">{formatVND(prod.basePrice)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {searchedProducts.length === 0 && (
                    <div className="col-span-2 p-6 text-center text-slate-400 text-[10px] italic">
                      Không tìm thấy sản phẩm nào trùng khớp trong kho dữ liệu!
                    </div>
                  )}
                </div>

                {/* Hiển thị chi tiết của sản phẩm đã được lựa chọn */}
                {selectedProduct && (
                  <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 flex flex-col sm:flex-row justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div><span className="text-slate-400">Sản phẩm đã chọn:</span> <strong className="dark:text-white">{selectedProduct.productName}</strong></div>
                      <div className="grid grid-cols-2 gap-x-4 text-[10px]">
                        <div><span className="text-slate-400">Thương hiệu:</span> <span className="dark:text-slate-200">{selectedProduct.brand}</span></div>
                        <div><span className="text-slate-400">Xuất xứ:</span> <span className="dark:text-slate-200">{selectedProduct.origin}</span></div>
                        <div><span className="text-slate-400">Độ mới vật lý:</span> <span className="dark:text-slate-200 font-black">{selectedProduct.productCondition}</span></div>
                        <div><span className="text-slate-400">Người ký gửi:</span> <span className="text-blue-500">@{selectedProduct.user.username}</span></div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l dark:border-white/5 pt-2 sm:pt-0 sm:pl-3 min-w-[120px]">
                      <span className="text-[9px] text-slate-400 uppercase font-black block">Giá sàn cơ sở</span>
                      <strong className="text-sm text-emerald-500 font-mono block mt-1">{formatVND(selectedProduct.basePrice)}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* PHẦN 2: CẤU HÌNH TÀI CHÍNH ĐẤU GIÁ */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 border-b dark:border-white/5 pb-2">
                  <DollarSign size={14} /> 2. Thiết lập định mức tài chính thầu (VNĐ)
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Giá khởi điểm cuộc thầu (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      value={formStartPrice}
                      onChange={(e) => setFormStartPrice(e.target.value)}
                      placeholder="Nhập giá khởi điểm..."
                      className={`w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                    />
                    <p className="text-[8px] text-slate-500 mt-1 italic">Mặc định lấy theo giá cơ sở của sản phẩm được chọn</p>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Bước nhảy thầu tối thiểu (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      value={formStepPrice}
                      onChange={(e) => setFormStepPrice(e.target.value)}
                      placeholder="Nhập bước nhảy thầu..."
                      className={`w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                    />
                    <p className="text-[8px] text-slate-500 mt-1 italic">Gợi ý: Hệ thống tự thiết lập bằng 2% giá khởi điểm</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Thể thức đấu giá</label>
                    <select
                      value={formAuctionType}
                      onChange={(e) => setFormAuctionType(e.target.value)}
                      className={`w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                    >
                      <option value="NORMAL">Đấu giá thường (NORMAL)</option>
                      <option value="LIVE">Đấu giá trực tiếp (LIVE)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PHẦN 3: THỜI GIAN HOẠT ĐỘNG CỦA PHIÊN */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 border-b dark:border-white/5 pb-2">
                  <Calendar size={14} /> 3. Thiết lập khung thời gian hoạt động
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Thời gian bắt đầu phiên đấu *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formStartTime}
                      onChange={(e) => setFormStartTime(e.target.value)}
                      className={`w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Thời gian kết thúc phiên đấu *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formEndTime}
                      onChange={(e) => setFormEndTime(e.target.value)}
                      className={`w-full border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-white/5`}
                    />
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20"
                >
                  {modalType === 'CREATE' ? 'Khởi tạo phiên đấu' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENT CON: BADGE CHO TRẠNG THÁI PHIÊN ĐẤU GIÁ (AuctionStatus)
function AuctionStatusBadge({ status }) {
  const configs = {
    ACTIVE: { bg: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30', text: 'ĐANG LIVE' },
    UPCOMING: { bg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20', text: 'Sắp diễn ra' },
    COMPLETED: { bg: 'bg-slate-500/10 text-slate-400 border border-slate-500/20', text: 'Đã kết thúc' },
    SUSPENDED: { bg: 'bg-red-500/10 text-red-500 border border-red-500/20', text: 'Tạm ngưng' }
  };

  const config = configs[status] || { bg: 'bg-slate-500/10 text-slate-500 border-slate-500/10', text: status };

  return (
    <span className={`px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider ${config.bg}`}>
      {config.text}
    </span>
  );
}