import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, 
  FileText, 
  Gavel, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  CheckCircle2, 
  Plus, 
  X, 
  ShieldCheck, 
  Package, 
  MapPin, 
  Store, 
  UploadCloud, 
  Clock, 
  XCircle, 
  Search, 
  LayoutDashboard,
  AlertCircle,
  Zap,
  Settings,
  Sparkles,
  Filter
} from 'lucide-react';

// --- CẤU HÌNH DỮ LIỆU ---
const CATEGORIES = {
  electronics: {
    label: 'Điện tử',
    subcategories: {
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
      }
    }
  },
  watch: {
    label: 'Đồng hồ',
    subcategories: {
      mechanical: {
        label: 'Đồng hồ cơ',
        fields: [
          { name: 'movement', label: 'Bộ máy', placeholder: 'ví dụ: Calibre 3235', required: true },
          { name: 'caseSize', label: 'Kích thước', placeholder: 'ví dụ: 40mm', required: true }
        ]
      }
    }
  }
};

const LOCATIONS = {
  hanoi: { label: 'Hà Nội', stores: ['Chi nhánh Hoàn Kiếm', 'Chi nhánh Cầu Giấy', 'Trung tâm Đống Đa'] },
  hcm: { label: 'TP. Hồ Chí Minh', stores: ['Chi nhánh Quận 1', 'Chi nhánh Quận 7', 'Showroom Tân Bình'] }
};

const INITIAL_TRACKING_DATA = [
  { id: 'REG-9921', title: 'MacBook Pro M3 2024', status: 'processing', date: '20/10/2023', store: 'Chi nhánh Quận 1' },
  { id: 'REG-8842', title: 'iPhone 15 Pro Max', status: 'accepted', date: '18/10/2023', store: 'Chi nhánh Cầu Giấy' },
  { id: 'REG-7710', title: 'Rolex Submariner', status: 'rejected', date: '15/10/2023', store: 'Chi nhánh Hoàn Kiếm', reason: 'Thiếu giấy tờ bảo hành gốc' },
  { id: 'REG-6655', title: 'iPad Pro M2', status: 'processing', date: '22/10/2023', store: 'Chi nhánh Quận 7' },
  { id: 'REG-5544', title: 'Sony Alpha A7 IV', status: 'accepted', date: '25/10/2023', store: 'Showroom Tân Bình' }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('next'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingList, setTrackingList] = useState(INITIAL_TRACKING_DATA);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    specs: {},
    description: '',
    mainImage: null,
    subImages: [],
    city: '',
    selectedStore: ''
  });

  const activeCategory = CATEGORIES[formData.category];
  const activeSubcategory = activeCategory?.subcategories[formData.subcategory];

  // Lọc danh sách sản phẩm
  const filteredList = useMemo(() => {
    return trackingList.filter(item => {
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [trackingList, filterStatus, searchTerm]);

  const handleSpecChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [fieldName]: value }
    }));
    if (errors[`spec_${fieldName}`]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[`spec_${fieldName}`];
        return next;
      });
    }
  };

  const validateStep = (currentStep) => {
    let newErrors = {};
    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tên sản phẩm';
      if (!formData.category) newErrors.category = 'Vui lòng chọn danh mục';
      if (!formData.subcategory) newErrors.subcategory = 'Vui lòng chọn danh mục con';
      if (activeSubcategory) {
        activeSubcategory.fields.forEach(field => {
          if (field.required && !formData.specs[field.name]) {
            newErrors[`spec_${field.name}`] = `Cần nhập ${field.label}`;
          }
        });
      }
    } else if (currentStep === 2) {
      if (!formData.mainImage) newErrors.mainImage = 'Vui lòng tải lên ảnh chính';
      if (!formData.description.trim() || formData.description.length < 10) 
        newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    } else if (currentStep === 3) {
      if (!formData.city) newErrors.city = 'Vui lòng chọn thành phố';
      if (!formData.selectedStore) newErrors.selectedStore = 'Vui lòng chọn cửa hàng';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setDirection('next');
      setStep(prev => prev + 1);
      setErrors({});
    } else {
      triggerShake();
    }
  };

  const handlePrev = () => {
    setDirection('prev');
    setStep(prev => prev - 1);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setFormData(prev => ({ ...prev, category: value, subcategory: '', specs: {} }));
    }
    if (errors[name]) setErrors(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = () => {
    if (!validateStep(3)) {
      triggerShake();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const newItem = {
        id: `REG-${Math.floor(Math.random() * 9000 + 1000)}`,
        title: formData.title,
        status: 'processing',
        date: new Date().toLocaleDateString('vi-VN'),
        store: formData.selectedStore
      };
      setTrackingList([newItem, ...trackingList]);
      setIsSubmitting(false);
      setActiveTab('tracking');
      setStep(1);
      setFormData({
        title: '', category: '', subcategory: '', specs: {}, description: '',
        mainImage: null, subImages: [], city: '', selectedStore: ''
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-10 font-sans selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-indigo-600/10 blur-[140px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-slate-900/80 p-1.5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
            {[
              { id: 'register', label: 'Đăng ký ký gửi', icon: Sparkles },
              { id: 'tracking', label: 'Theo dõi sản phẩm', icon: LayoutDashboard }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
                  activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] scale-105' 
                  : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'register' ? (
          <div className={`space-y-10 ${shake ? 'animate-shake' : ''}`}>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-tighter">
                  <Zap className="w-3.5 h-3.5 fill-current" /> Dịch vụ ký gửi cao cấp
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                  KHỞI TẠO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic">HỒ SƠ SẢN PHẨM</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium">Hoàn thành 3 bước để đưa sản phẩm của bạn ra thị trường.</p>
              </div>

              {/* Enhanced Stepper */}
              <div className="flex items-center gap-5 bg-slate-900/50 p-3 rounded-3xl border border-white/5 backdrop-blur-md">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center">
                    <div className={`relative group`}>
                      {step === i && (
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                      )}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-700 relative z-10 ${
                        step >= i 
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                        : 'bg-slate-800 text-slate-600 border border-white/5'
                      } ${step === i ? 'scale-110' : 'scale-100'}`}>
                        {step > i ? <CheckCircle2 className="w-6 h-6 animate-in zoom-in" /> : i}
                      </div>
                    </div>
                    {i < 3 && (
                      <div className="w-10 h-[2px] mx-1 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full bg-blue-500 transition-all duration-1000 ease-in-out ${step > i ? 'w-full' : 'w-0'}`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </header>

            <main className="bg-slate-900/30 border border-white/10 rounded-[4rem] p-8 md:p-14 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative min-h-[500px]">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none rotate-12">
                 <Sparkles className="w-80 h-80 text-blue-500" />
              </div>

              <div className={`transition-all duration-700 transform ${direction === 'next' ? 'animate-in fade-in slide-in-from-right-12' : 'animate-in fade-in slide-in-from-left-12'}`}>
                {/* Bước 1: Thông tin phân loại */}
                {step === 1 && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <FieldWrapper label="Tên gọi sản phẩm" error={errors.title}>
                        <div className="relative group">
                          <input 
                            name="title" 
                            value={formData.title} 
                            onChange={handleInputChange} 
                            type="text" 
                            placeholder="Ví dụ: MacBook Pro M3 Max 16-inch..." 
                            className={`w-full bg-slate-950/60 border-2 ${errors.title ? 'border-red-500/50 bg-red-500/5' : 'border-white/5'} rounded-2xl px-7 py-5 text-white focus:border-blue-500/50 focus:bg-slate-950/90 outline-none font-bold transition-all placeholder:text-slate-700 shadow-inner group-hover:border-white/10`} 
                          />
                        </div>
                      </FieldWrapper>

                      <div className="grid grid-cols-2 gap-5">
                        <FieldWrapper label="Phân khúc" error={errors.category}>
                          <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleInputChange} 
                            className={`w-full bg-slate-950/60 border-2 ${errors.category ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-5 text-white focus:border-blue-500 outline-none font-bold appearance-none cursor-pointer transition-all hover:bg-slate-950/90`}
                          >
                            <option value="">Chọn loại</option>
                            {Object.keys(CATEGORIES).map(k => <option key={k} value={k}>{CATEGORIES[k].label}</option>)}
                          </select>
                        </FieldWrapper>
                        <FieldWrapper label="Dòng máy" error={errors.subcategory}>
                          <select 
                            name="subcategory" 
                            value={formData.subcategory} 
                            onChange={handleInputChange} 
                            disabled={!formData.category}
                            className={`w-full bg-slate-950/60 border-2 ${errors.subcategory ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-5 text-white focus:border-blue-500 outline-none font-bold appearance-none disabled:opacity-20 transition-all hover:bg-slate-950/90`}
                          >
                            <option value="">Chọn dòng</option>
                            {activeCategory && Object.keys(activeCategory.subcategories).map(k => (
                              <option key={k} value={k}>{activeCategory.subcategories[k].label}</option>
                            ))}
                          </select>
                        </FieldWrapper>
                      </div>
                    </div>

                    {activeSubcategory && (
                      <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border border-white/5 space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-4">
                           <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400"><Settings className="w-5 h-5 animate-spin-slow" /></div>
                           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Cấu hình chi tiết</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {activeSubcategory.fields.map(f => (
                            <FieldWrapper key={f.name} label={f.label} error={errors[`spec_${f.name}`]}>
                              <input 
                                type="text" 
                                placeholder={f.placeholder} 
                                value={formData.specs[f.name] || ''} 
                                onChange={(e) => handleSpecChange(f.name, e.target.value)} 
                                className={`w-full bg-slate-950/80 border ${errors[`spec_${f.name}`] ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-5 py-4 text-sm text-white focus:border-blue-500 outline-none font-medium transition-all shadow-lg`} 
                              />
                            </FieldWrapper>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bước 2: Hình ảnh & Mô tả */}
                {step === 2 && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <FieldWrapper label="Visual chính diện" error={errors.mainImage}>
                        <div className={`aspect-video bg-slate-950/80 rounded-[2.5rem] border-2 border-dashed ${errors.mainImage ? 'border-red-500/40 bg-red-500/5' : 'border-white/10'} overflow-hidden relative group transition-all hover:border-blue-500/50`}>
                          {formData.mainImage ? (
                            <>
                              <img src={formData.mainImage} className="w-full h-full object-cover animate-in fade-in" alt="Main" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                 <button onClick={() => setFormData(p => ({...p, mainImage: null}))} className="p-4 bg-red-500 text-white rounded-full hover:scale-110 active:scale-95 transition-transform"><X className="w-6 h-6" /></button>
                              </div>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-blue-500/5 transition-all duration-500 group">
                              <div className="p-6 bg-slate-900 rounded-3xl mb-4 group-hover:bg-blue-500 transition-all duration-500 shadow-2xl">
                                <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-white transition-colors" />
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Tải lên hình ảnh 4K</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                 const file = e.target.files[0];
                                 if(file) {
                                   const reader = new FileReader();
                                   reader.onload = (e) => setFormData(p => ({...p, mainImage: e.target.result}));
                                   reader.readAsDataURL(file);
                                 }
                                 setErrors(p => ({...p, mainImage: null}));
                              }} />
                            </label>
                          )}
                        </div>
                      </FieldWrapper>

                      <FieldWrapper label={`Ảnh chi tiết góc cạnh (${formData.subImages.length}/5)`}>
                        <div className="grid grid-cols-3 gap-4 h-full">
                          {formData.subImages.map((img, i) => (
                            <div key={i} className="aspect-square rounded-3xl overflow-hidden relative border border-white/5 animate-in zoom-in">
                              <img src={img} className="w-full h-full object-cover" alt={`Sub ${i}`} />
                              <button onClick={() => setFormData(p => ({ ...p, subImages: p.subImages.filter((_, idx) => idx !== i) }))} className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                          {formData.subImages.length < 5 && (
                            <label className="aspect-square bg-slate-950/80 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-500 group">
                              <div className="p-3 bg-slate-900 rounded-xl group-hover:bg-blue-500/20 transition-all">
                                <Plus className="w-6 h-6 text-slate-600 group-hover:text-blue-400" />
                              </div>
                              <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => {
                                 const files = Array.from(e.target.files);
                                 if(formData.subImages.length + files.length > 5) return;
                                 files.forEach(file => {
                                   const reader = new FileReader();
                                   reader.onload = (ev) => setFormData(p => ({...p, subImages: [...p.subImages, ev.target.result]}));
                                   reader.readAsDataURL(file);
                                 });
                              }} />
                            </label>
                          )}
                        </div>
                      </FieldWrapper>
                    </div>

                    <FieldWrapper label="Nhận xét tình trạng & Phụ kiện kèm theo" error={errors.description}>
                      <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange} 
                        rows="4" 
                        placeholder="Máy đã dán cường lực, còn sạc zin, có vết trầy nhẹ ở góc dưới..." 
                        className={`w-full bg-slate-950/60 border-2 ${errors.description ? 'border-red-500/50' : 'border-white/5'} rounded-[2.5rem] px-8 py-7 text-white focus:border-blue-500 outline-none font-bold resize-none transition-all placeholder:text-slate-700 shadow-inner`} 
                      />
                    </FieldWrapper>
                  </div>
                )}

                {/* Bước 3: Địa điểm gửi hàng */}
                {step === 3 && (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <FieldWrapper label="Khu vực dịch vụ" error={errors.city}>
                        <select name="city" value={formData.city} onChange={handleInputChange} className={`w-full bg-slate-950/80 border-2 ${errors.city ? 'border-red-500/50' : 'border-white/5'} rounded-[1.8rem] px-7 py-6 text-white focus:border-blue-500 outline-none font-black appearance-none cursor-pointer hover:bg-slate-950`}>
                          <option value="">Chọn thành phố</option>
                          {Object.keys(LOCATIONS).map(k => <option key={k} value={k}>{LOCATIONS[k].label}</option>)}
                        </select>
                      </FieldWrapper>
                      <FieldWrapper label="Showroom tiếp nhận" error={errors.selectedStore}>
                        <select name="selectedStore" value={formData.selectedStore} onChange={handleInputChange} disabled={!formData.city} className={`w-full bg-slate-950/80 border-2 ${errors.selectedStore ? 'border-red-500/50' : 'border-white/5'} rounded-[1.8rem] px-7 py-6 text-white focus:border-blue-500 outline-none font-black appearance-none disabled:opacity-20 cursor-pointer hover:bg-slate-950`}>
                          <option value="">Chọn địa điểm chi tiết</option>
                          {formData.city && LOCATIONS[formData.city].stores.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </FieldWrapper>
                    </div>

                    <div className="p-12 rounded-[3.5rem] bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-white/5 relative overflow-hidden group shadow-2xl">
                       <div className="absolute -right-16 -bottom-16 opacity-[0.03] group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000 ease-out">
                          <MapPin className="w-64 h-64 text-blue-400" />
                       </div>
                       <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                          <div className="w-20 h-20 bg-blue-600/20 rounded-[2rem] flex items-center justify-center shrink-0 border border-blue-500/20 shadow-inner">
                            <ShieldCheck className="w-10 h-10 text-blue-400" />
                          </div>
                          <div className="space-y-3 text-center md:text-left">
                            <h3 className="text-xl font-black text-white italic tracking-wide uppercase">Chứng nhận bảo mật ký gửi</h3>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-2xl">
                              Quy trình thẩm định được camera ghi hình 24/7. Sản phẩm của bạn được lưu trữ trong tủ chống ẩm và mua bảo hiểm cháy nổ 100%. 
                              <span className="block mt-2 text-blue-400 font-bold">Mã QR tiếp nhận sẽ được gửi qua SMS sau khi bạn nhấn hoàn tất.</span>
                            </p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                <button 
                  onClick={handlePrev} 
                  disabled={step === 1} 
                  className={`flex items-center gap-3 px-8 py-4 font-black text-[11px] uppercase tracking-[0.2em] transition-all rounded-2xl ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  <ChevronLeft className="w-5 h-5" /> Quay lại
                </button>

                {step < 3 ? (
                  <button 
                    onClick={handleNext} 
                    className="group flex items-center gap-4 px-12 py-5 bg-white text-black rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
                  >
                    Tiếp theo <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} 
                    className="flex items-center gap-4 px-14 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang xử lý hồ sơ...</>
                    ) : (
                      <><CheckCircle2 className="w-5 h-5 animate-pulse" /> Đăng ký ngay</>
                    )}
                  </button>
                )}
              </div>
            </main>
          </div>
        ) : (
          /* --- THEO DÕI SẢN PHẨM --- */
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-12">
            {/* Header Section */}
            <div className="px-4 space-y-4">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                  Theo dõi <span className="text-blue-500 not-italic">Sản phẩm</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium">Cập nhật thời gian thực về hồ sơ thẩm định sản phẩm.</p>
              </div>
            </div>

            {/* Filter & Search Bar Section */}
            <div className="flex flex-col lg:flex-row items-center gap-6 px-4 py-8 border-y border-white/5 bg-slate-900/10 backdrop-blur-sm rounded-[2rem]">
               <div className="flex bg-slate-950/80 p-2 rounded-2xl border border-white/5 shadow-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'processing', label: 'Chờ duyệt' },
                    { id: 'accepted', label: 'Hợp lệ' },
                    { id: 'rejected', label: 'Từ chối' }
                  ].map(filter => (
                    <button 
                      key={filter.id}
                      onClick={() => setFilterStatus(filter.id)}
                      className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                        filterStatus === filter.id 
                        ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] scale-105' 
                        : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
               </div>

               <div className="relative group w-full lg:max-w-md ml-auto">
                  <div className="absolute inset-0 bg-blue-500/5 blur-2xl group-focus-within:bg-blue-500/15 transition-all"></div>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Nhập ID hồ sơ hoặc tên sản phẩm..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all backdrop-blur-xl font-bold placeholder:text-slate-800" 
                    />
                  </div>
               </div>
            </div>

            {/* Danh sách sản phẩm - Đã chỉnh sửa đồng bộ kích thước */}
            <div className="grid grid-cols-1 gap-6 min-h-[400px]">
              {filteredList.length > 0 ? (
                filteredList.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="bg-slate-900/40 border-2 border-white/5 rounded-[3rem] p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 hover:bg-slate-900/90 transition-all group hover:translate-y-[-8px] hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-8 min-h-[160px]"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
                      <StatusIcon status={item.status} />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-2.5 py-1 rounded-lg border border-blue-500/10 shrink-0">{item.id}</span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                            <Clock className="w-3 h-3" /> {item.date}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight truncate">{item.title}</h3>
                        <div className="flex items-center gap-2.5 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                          <div className="p-1 bg-slate-800 rounded-md"><Store className="w-2.5 h-2.5" /></div> {item.store}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-center justify-between w-full md:w-auto md:justify-end gap-6 md:gap-12 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                      {/* Section trạng thái & lý do - Cấu trúc lại để không giãn card */}
                      <div className="text-center md:text-right space-y-2 min-w-[140px]">
                        <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                          item.status === 'accepted' ? 'text-green-500' :
                          item.status === 'rejected' ? 'text-red-500' :
                          'text-yellow-500'
                        }`}>
                          {item.status === 'accepted' ? 'Hợp lệ' :
                           item.status === 'rejected' ? 'Từ chối' :
                           'Chờ duyệt'}
                        </div>
                        {item.reason && (
                          <div className="flex items-center gap-2 justify-center md:justify-end text-[10px] text-red-400 font-bold bg-red-400/5 px-3 py-1.5 rounded-lg border border-red-400/10 italic max-w-[200px] md:max-w-[250px] mx-auto md:mr-0 line-clamp-1 group-hover:line-clamp-none transition-all">
                             <AlertCircle className="w-3 h-3 shrink-0" /> <span className="truncate group-hover:whitespace-normal">{item.reason}</span>
                          </div>
                        )}
                      </div>
                      
                      <button className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 group-hover:bg-blue-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center transition-all shadow-xl group-hover:scale-110 active:scale-90 shrink-0">
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-500 group-hover:text-white transition-colors" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-32 space-y-6 opacity-40">
                   <div className="p-8 bg-slate-900 rounded-full border border-white/5">
                      <Filter className="w-12 h-12 text-slate-500" />
                   </div>
                   <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Không tìm thấy sản phẩm phù hợp</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

// Component con để bọc các trường input kèm lỗi
const FieldWrapper = ({ label, error, children }) => (
  <div className="space-y-3.5">
    <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2 flex justify-between items-center">
      {label}
      {error && <span className="text-red-500 flex items-center gap-1.5 animate-in slide-in-from-right-2"><AlertCircle className="w-3.5 h-3.5" /> {error}</span>}
    </label>
    {children}
  </div>
);

// Component hiển thị Icon trạng thái
const StatusIcon = ({ status }) => {
  const configs = {
    accepted: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    processing: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' }
  };
  const config = configs[status];
  const Icon = config.icon;
  return (
    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center shrink-0 border-2 ${config.bg} ${config.border} ${config.color} shadow-2xl relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <Icon className="w-7 h-7 md:w-10 md:h-10 relative z-10" />
    </div>
  );
};

export default App;