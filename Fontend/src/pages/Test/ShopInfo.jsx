import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, Filter, Heart, Star, 
  ChevronDown, LayoutGrid, List, Eye, ArrowRight,
  Facebook, Instagram, Twitter, Bell, User,
  Menu, X, Check, ShieldCheck, Truck, ArrowLeft,
  ShoppingBag, Award, Verified, ExternalLink, Mail, Phone
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = ["Tất cả", "Patek Philippe", "Rolex", "Audemars Piguet", "Omega", "Hublot"];
const PRODUCTS = [
  {
    id: 1,
    name: "Patek Philippe Nautilus 5711",
    brand: "Patek Philippe",
    price: 2450000000,
    oldPrice: 2600000000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    tag: "Sản phẩm VIP",
    isNew: false
  },
  {
    id: 2,
    name: "Rolex Submariner Date",
    brand: "Rolex",
    price: 450000000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    tag: null,
    isNew: true
  },
  {
    id: 3,
    name: "Audemars Piguet Royal Oak",
    brand: "Audemars Piguet",
    price: 1850000000,
    oldPrice: 1950000000,
    image: "https://images.unsplash.com/photo-1522337360788-8b13df772ec2?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    tag: "Limited",
    isNew: false
  },
  {
    id: 4,
    name: "Omega Speedmaster Moonwatch",
    brand: "Omega",
    price: 185000000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    tag: null,
    isNew: false
  },
  {
    id: 5,
    name: "Hublot Big Bang Unico",
    brand: "Hublot",
    price: 520000000,
    oldPrice: 580000000,
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    tag: "Hot Sale",
    isNew: true
  },
  {
    id: 6,
    name: "Rolex Daytona Platinum",
    brand: "Rolex",
    price: 3200000000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    tag: "Sưu tầm",
    isNew: false
  }
];

const SELLER_INFO = {
  name: "LUXURY WATCH VN",
  rating: 4.9,
  followers: "12.5K",
  isVerified: true,
  description: "Chuyên cung cấp các dòng đồng hồ xa xỉ chính hãng Patek Philippe, Rolex, Audemars Piguet. Uy tín tạo nên thương hiệu.",
  joined: "2020",
  address: "Quận 1, TP. Hồ Chí Minh"
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = PRODUCTS.filter(p => 
    (selectedCategory === "Tất cả" || p.brand === selectedCategory) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Navigation Header - Synced with Auction UI */}
      <header className={`sticky top-0 z-[100] transition-all duration-300 border-b border-white/5 ${
        isScrolled ? 'bg-slate-900/90 backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <h1 className="text-xl font-black tracking-tighter text-white italic">
                LUXURY<span className="text-blue-500">WATCH</span>
              </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Tìm sản phẩm tại shop..." 
                className="bg-white/5 border border-white/10 rounded-2xl py-2.5 px-10 text-xs w-64 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all relative">
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black ring-2 ring-slate-950">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all hidden md:block shadow-lg shadow-blue-900/20">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Seller Hero Section - Synced with Auction Theme */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-indigo-600/5 blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden ring-4 ring-blue-500/20 shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" alt="Seller" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-2xl shadow-xl">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{SELLER_INFO.name}</h2>
                  <div className="flex items-center gap-2 self-center md:self-auto">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20 flex items-center gap-1">
                      <Verified className="w-3 h-3" /> Đối tác uy tín
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                  {SELLER_INFO.description}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                  <div className="flex flex-col">
                    <span className="text-white font-black text-lg leading-none">{SELLER_INFO.rating}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Đánh giá</span>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-lg leading-none">{SELLER_INFO.followers}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Người theo dõi</span>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-lg leading-none">{SELLER_INFO.joined}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Năm tham gia</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2">
                   <Bell className="w-4 h-4" /> Theo dõi Shop
                </button>
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                   <Mail className="w-4 h-4" /> Nhắn tin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-12">
        
        {/* Filter Sidebar - Synced Style */}
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 space-y-8">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-500" /> Danh mục sản phẩm
              </h3>
              <div className="space-y-3">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between group py-1.5 transition-all ${
                      selectedCategory === cat ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className={`text-xs font-black uppercase tracking-wider ${selectedCategory === cat ? 'translate-x-2' : ''} transition-transform`}>
                      {cat}
                    </span>
                    {selectedCategory === cat && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white mb-6">Khoảng giá (VND)</h3>
              <div className="space-y-4">
                <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                  <span>100 Triệu</span>
                  <span>5 Tỷ+</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white mb-6">Liên hệ trực tiếp</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-400 group cursor-pointer">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><Phone className="w-4 h-4" /></div>
                  <span className="text-[11px] font-bold">098.XXX.XXXX</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 group cursor-pointer">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><Mail className="w-4 h-4" /></div>
                  <span className="text-[11px] font-bold">luxury@watch.vn</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
              Đang xem <span className="text-white ml-1 font-black">{filteredProducts.length} tuyệt tác</span>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex bg-white/5 p-1 rounded-xl">
                <button className="p-2 bg-blue-600 shadow-lg rounded-lg text-white"><LayoutGrid className="w-4 h-4" /></button>
                <button className="p-2 text-slate-500 hover:text-slate-300"><List className="w-4 h-4" /></button>
              </div>
              <select className="bg-white/5 border-none rounded-xl py-2 px-4 text-xs font-black text-white outline-none focus:ring-2 focus:ring-blue-500/20 flex-1 md:flex-none uppercase tracking-widest">
                <option className="bg-slate-900">Mới nhất</option>
                <option className="bg-slate-900">Giá cao cấp</option>
                <option className="bg-slate-900">Phổ biến</option>
              </select>
            </div>
          </div>

          {/* Grid - Synced with Auction Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 hover:-translate-y-2">
                {/* Product Image Area */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-800">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-5 left-5 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg shadow-lg">New Arrival</span>
                    )}
                    {product.tag && (
                      <span className="bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-white/10">{product.tag}</span>
                    )}
                  </div>

                  <button className="absolute top-5 right-5 p-2.5 bg-slate-950/40 backdrop-blur-md rounded-xl text-slate-400 hover:text-red-500 hover:bg-white transition-all">
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Actions Overlay */}
                  <div className="absolute inset-x-5 bottom-5 flex gap-2 translate-y-20 group-hover:translate-y-0 transition-all duration-500">
                    <button 
                      onClick={() => setCartCount(c => c + 1)}
                      className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-xl shadow-blue-900/40"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Mua ngay
                    </button>
                    <button className="p-3.5 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-colors border border-white/10">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{product.brand}</p>
                    <h3 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight line-clamp-1 italic">{product.name}</h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-700'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">({product.rating})</span>
                  </div>

                  <div className="flex flex-col pt-2">
                    <span className="text-lg font-black text-white tracking-tight">{formatCurrency(product.price)}</span>
                    {product.oldPrice && (
                      <span className="text-[10px] font-bold text-slate-500 line-through uppercase tracking-widest">{formatCurrency(product.oldPrice)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-20 flex justify-center items-center gap-2">
            {[1, 2, 3].map((p, i) => (
              <button key={i} className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${p === 1 ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/30' : 'bg-white/5 text-slate-500 hover:bg-white/10 border border-white/5'}`}>
                {p}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Area */}
      <footer className="bg-slate-900/40 border-t border-white/5 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h2 className="text-2xl font-black tracking-tighter text-white italic">
              LUXURY<span className="text-blue-500">WATCH</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed uppercase font-bold tracking-tight">Thế giới đồng hồ cao cấp hàng đầu Việt Nam.</p>
          </div>
          <div className="col-span-1 space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-widest">Sản phẩm</h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-blue-500 transition-colors">Bán chạy</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Đấu giá live</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Bộ sưu tập 2024</a>
            </div>
          </div>
          <div className="col-span-1 space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-widest">Dịch vụ</h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-blue-500 transition-colors">Kiểm định</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Bảo hành VIP</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Spa đồng hồ</a>
            </div>
          </div>
          <div className="col-span-1 space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-widest">Newsletter</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Email nhận ưu đãi" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
              <button className="p-2 bg-blue-600 rounded-xl"><ArrowRight className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center border-t border-white/5 pt-12">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">© 2024 Luxury Watch VN - Professional Luxury Storefront</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #2563eb; }
      `}} />
    </div>
  );
};

export default App;