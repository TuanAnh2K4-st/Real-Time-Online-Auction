import React, { useState, useMemo, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  Camera, 
  LogOut, 
  Bell,
  ArrowLeft,
  Package,
  Home,
  UserRound,
  Save,
  ChevronDown,
  Eye,
  EyeOff,
  Truck,
  CheckCircle,
  Clock,
  ShieldAlert,
  KeyRound,
  Briefcase,
  Info,
  Check,
  X
} from 'lucide-react';

// Dữ liệu giả lập địa giới hành chính
const LOCATION_DATA = {
  "TP. Hồ Chí Minh": ["Thảo Điền", "An Phú", "Bình Trưng Tây", "Hiệp Phú", "Bến Nghé", "Bến Thành"],
  "Hà Nội": ["Hàng Bạc", "Hàng Đào", "Hàng Trống", "Tràng Tiền", "Cống Vị", "Điện Biên"],
  "Đà Nẵng": ["Hải Châu I", "Hải Châu II", "Hòa Cường Bắc", "Hòa Cường Nam"],
  "Cần Thơ": ["An Hòa", "An Khánh", "An Lạc", "An Nghiệp"]
};

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('orders');
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const fileInputRef = useRef(null);

  // State mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // State dữ liệu người dùng
  const [userData, setUserData] = useState({
    fullName: "Lê Minh Hoàng",
    email: "hoang.le@daugiaviet.vn",
    phone: "0988 777 999",
    gender: "MALE",
    job: "Chuyên viên tư vấn nghệ thuật",
    bio: "Đam mê sưu tầm các dòng đồng hồ cổ điển và tranh sơn dầu thế kỷ 20. Rất vui được giao lưu với cộng đồng đấu giá.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    address: {
      province: "TP. Hồ Chí Minh",
      ward: "Thảo Điền",
      fullStreet: "Số 12, Đường số 5"
    }
  });

  const [editForm, setEditForm] = useState({ ...userData });

  // Kiểm tra độ mạnh mật khẩu
  const passwordRequirements = useMemo(() => {
    const p = passwordForm.newPassword;
    return [
      { id: 'length', label: 'Tối thiểu 12 ký tự', met: p.length >= 12 },
      { id: 'upper', label: 'Chữ hoa (A-Z)', met: /[A-Z]/.test(p) },
      { id: 'lower', label: 'Chữ thường (a-z)', met: /[a-z]/.test(p) },
      { id: 'number', label: 'Chữ số (0-9)', met: /[0-9]/.test(p) },
      { id: 'special', label: 'Ký tự đặc biệt (@#$...)', met: /[^A-Za-z0-9]/.test(p) },
    ];
  }, [passwordForm.newPassword]);

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const isConfirmValid = passwordForm.confirmPassword === passwordForm.newPassword && passwordForm.confirmPassword !== "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName" && value.length > 150) return;
    if (name === "phone" && value.length > 20) return;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressFieldChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleProvinceChange = (e) => {
    const val = e.target.value;
    setEditForm(prev => ({
      ...prev,
      address: { ...prev.address, province: val, ward: "" }
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setUserData({ ...editForm });
    setIsEditing(false);
  };

  const provinceList = Object.keys(LOCATION_DATA);
  const wardList = editForm.address.province ? LOCATION_DATA[editForm.address.province] || [] : [];

  const orders = [
    { id: "ORD-8821", name: "Đồng hồ Omega Seamaster 1960", status: "PENDING", date: "22/04/2026", price: "45.000.000đ" },
    { id: "ORD-7712", name: "Tranh sơn dầu Phố Cổ - Bùi Xuân Phái", status: "SHIPPING", date: "20/04/2026", price: "120.000.000đ" },
    { id: "ORD-6540", name: "Bình gốm Chu Đậu cổ", status: "COMPLETED", date: "15/04/2026", price: "15.500.000đ" }
  ];

  const getStatusStyle = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'SHIPPING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full opacity-30"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-10 transition-all duration-700 animate-in fade-in slide-in-from-top-4">
          <button className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:border-blue-500/50 transition-all shadow-lg shadow-black/50">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-black uppercase text-[10px] tracking-widest italic">Quay lại</span>
          </button>
          
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
            <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all group">
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-[10px] font-black uppercase tracking-widest">Đăng xuất</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-8 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
              
              <div className="relative pt-6">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-[2.5rem] p-1 bg-gradient-to-tr from-blue-600 via-indigo-400 to-cyan-400 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105 shadow-2xl">
                    <div className="w-full h-full rounded-[2.3rem] border-[4px] border-slate-950 overflow-hidden bg-slate-800">
                      <img 
                        src={isEditing ? editForm.avatarUrl : userData.avatarUrl} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt="avatar" 
                      />
                    </div>
                  </div>
                  
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  
                  <button 
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 p-3 bg-blue-600 border-4 border-slate-950 rounded-2xl text-white hover:bg-blue-500 transition-all shadow-xl hover:scale-110 active:scale-90"
                    title="Đổi ảnh đại diện"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="mt-6 text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                  {isEditing ? editForm.fullName : userData.fullName}
                </h2>
                <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2 italic opacity-80">
                  {isEditing ? editForm.job : userData.job}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4 text-left">
                {[
                  { icon: <Mail className="w-4 h-4" />, label: "Email", value: isEditing ? editForm.email : userData.email },
                  { icon: <Phone className="w-4 h-4" />, label: "Hotline", value: isEditing ? editForm.phone : userData.phone },
                  { 
                    icon: <Home className="w-4 h-4" />, 
                    label: "Địa chỉ", 
                    value: isEditing 
                      ? `${editForm.address.fullStreet || '...'}, ${editForm.address.ward || '...'}, ${editForm.address.province || '...'}` 
                      : `${userData.address.fullStreet}, ${userData.address.ward}, ${userData.address.province}` 
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 px-2 group">
                    <div className="w-9 h-9 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{item.label}</p>
                      <p className="text-[11px] font-bold text-slate-300 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Trạng thái xác minh</p>
                        <p className="text-sm font-bold text-white uppercase italic">Nhà sưu tầm hạng AAA</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl transition-all duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">
                    {isEditing ? 'Cập nhật định danh' : 'Hồ sơ cá nhân'}
                  </h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Dữ liệu đồng bộ hệ thống đấu giá</p>
                </div>
                
                {!isEditing ? (
                  <button 
                    onClick={() => {
                      setEditForm({...userData});
                      setIsEditing(true);
                    }}
                    className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 active:scale-95"
                  >
                    Chỉnh sửa hồ sơ
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setIsEditing(false)} className="bg-slate-800 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all active:scale-95">Hủy bỏ</button>
                    <button onClick={saveProfile} className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/40 active:scale-95">
                      <Save className="w-4 h-4" /> Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex justify-between">
                        Họ tên đầy đủ <span>{editForm.fullName.length}/150</span>
                      </label>
                      <input name="fullName" value={editForm.fullName} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 focus:bg-slate-950 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex justify-between">
                        Số điện thoại <span>{editForm.phone.length}/20</span>
                      </label>
                      <input name="phone" value={editForm.phone} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 focus:bg-slate-950 transition-all" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Giới tính</label>
                      <div className="relative p-1.5 bg-slate-950/50 border border-white/10 rounded-[1.25rem] flex h-[58px]">
                        <div 
                          className={`absolute top-1.5 bottom-1.5 rounded-[1rem] shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${editForm.gender === 'MALE' ? 'bg-blue-600 shadow-blue-900/40' : 'bg-pink-600 shadow-pink-900/40'}`}
                          style={{ width: 'calc(50% - 6px)', left: editForm.gender === 'MALE' ? '6px' : 'calc(50%)' }}
                        />
                        <button onClick={() => setEditForm(prev => ({...prev, gender: 'MALE'}))} className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${editForm.gender === 'MALE' ? 'text-white' : 'text-slate-500'}`}>
                          <User className={`w-4 h-4 ${editForm.gender === 'MALE' ? 'scale-110' : 'opacity-40'}`} /> Nam
                        </button>
                        <button onClick={() => setEditForm(prev => ({...prev, gender: 'FEMALE'}))} className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${editForm.gender === 'FEMALE' ? 'text-white' : 'text-slate-500'}`}>
                          <UserRound className={`w-4 h-4 ${editForm.gender === 'FEMALE' ? 'scale-110' : 'opacity-40'}`} /> Nữ
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nghề nghiệp</label>
                      <input name="job" value={editForm.job} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 focus:bg-slate-950 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> Thông tin địa chỉ
                    </h4>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Số nhà & Tên đường</label>
                        <div className="relative">
                          <Home className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input name="fullStreet" value={editForm.address.fullStreet} onChange={handleAddressFieldChange} placeholder="Nhập số nhà, ngõ, tên đường..." className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white outline-none focus:border-blue-500 focus:bg-slate-950 transition-all" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tỉnh / Thành phố</label>
                          <div className="relative">
                            <select value={editForm.address.province} onChange={handleProvinceChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none cursor-pointer focus:border-blue-500 transition-all">
                              <option value="">Chọn tỉnh thành</option>
                              {provinceList.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Phường / Xã</label>
                          <div className="relative">
                            <select disabled={!editForm.address.province} value={editForm.address.ward} onChange={(e) => handleAddressFieldChange({ target: { name: 'ward', value: e.target.value } })} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none disabled:opacity-30 disabled:cursor-not-allowed focus:border-blue-500 transition-all">
                              <option value="">Chọn phường xã</option>
                              {wardList.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-6 border-t border-white/5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tiểu sử cá nhân</label>
                    <textarea name="bio" value={editForm.bio} onChange={handleInputChange} rows={4} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 focus:bg-slate-950 transition-all resize-none" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                  {[
                    { label: "Giới tính", value: userData.gender === 'MALE' ? 'Nam' : 'Nữ', icon: userData.gender === 'MALE' ? <User className="w-3.5 h-3.5 text-blue-500" /> : <UserRound className="w-3.5 h-3.5 text-pink-500" /> },
                    { label: "Nghề nghiệp", value: userData.job, icon: <Briefcase className="w-3.5 h-3.5 text-blue-500" /> },
                    { label: "Khu vực", value: userData.address.province, icon: <MapPin className="w-3.5 h-3.5 text-blue-500" /> }
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-950/30 p-6 rounded-3xl border border-white/5 group hover:border-blue-500/20 hover:bg-slate-950/50 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        {item.icon}
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.label}</p>
                      </div>
                      <p className="text-sm font-bold text-white uppercase">{item.value}</p>
                    </div>
                  ))}
                  <div className="md:col-span-3 bg-slate-950/30 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                       <Info className="w-3 h-3" /> Tiểu sử nhà sưu tầm
                    </p>
                    <p className="text-slate-300 italic leading-relaxed text-sm">"{userData.bio}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* TAB SECTION: Orders & Security */}
            <div className="bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-8 md:p-10 backdrop-blur-xl min-h-[400px] shadow-2xl">
              
              <div className="flex items-center p-1.5 bg-slate-950/60 rounded-2xl w-fit mb-10 border border-white/5 shadow-inner">
                <button 
                  onClick={() => setActiveSubTab('orders')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeSubTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Package className="w-4 h-4" /> Giao dịch
                </button>
                <button 
                  onClick={() => setActiveSubTab('password')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeSubTab === 'password' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <KeyRound className="w-4 h-4" /> Bảo mật
                </button>
              </div>

              {activeSubTab === 'orders' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Thương vụ gần đây</h4>
                    <span className="text-[9px] font-bold text-slate-500 uppercase px-3 py-1 bg-slate-950 rounded-full border border-white/5 tracking-widest">{orders.length} Đơn hàng</span>
                  </div>
                  {orders.map((order) => (
                    <div key={order.id} className="group bg-slate-950/40 border border-white/5 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/30 hover:bg-slate-950/60 transition-all duration-300">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 shadow-lg ${getStatusStyle(order.status)}`}>
                          {order.status === 'PENDING' && <Clock className="w-5 h-5" />}
                          {order.status === 'SHIPPING' && <Truck className="w-5 h-5" />}
                          {order.status === 'COMPLETED' && <CheckCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-500 uppercase">{order.id}</span>
                            <span className="text-[8px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-black uppercase tracking-tighter">{order.date}</span>
                          </div>
                          <h5 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{order.name}</h5>
                          <p className="text-xs font-black text-blue-500 mt-0.5">{order.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all duration-300 ${getStatusStyle(order.status)}`}>
                          {order.status === 'PENDING' ? 'Chờ xác nhận' : order.status === 'SHIPPING' ? 'Đang giao' : 'Hoàn thành'}
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSubTab === 'password' && (
                <div className="max-w-4xl animate-in fade-in slide-in-from-left-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="mb-4">
                      <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Thiết lập mật khẩu</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Bảo vệ tài khoản bằng mật khẩu cấp độ cao</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Mật khẩu cũ</label>
                        <div className="relative">
                          <input 
                            type={showPass.old ? "text" : "password"} 
                            value={passwordForm.oldPassword}
                            onChange={(e) => setPasswordForm(p => ({...p, oldPassword: e.target.value}))}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 transition-all"
                            placeholder="••••••••"
                          />
                          <button onClick={() => setShowPass(p => ({...p, old: !p.old}))} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                            {showPass.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Mật khẩu mới</label>
                        <div className="relative">
                          <input 
                            type={showPass.new ? "text" : "password"} 
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(p => ({...p, newPassword: e.target.value}))}
                            className={`w-full bg-slate-950/50 border rounded-2xl px-6 py-4 text-sm text-white outline-none transition-all ${passwordForm.newPassword && !isPasswordValid ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                            placeholder="Tối thiểu 12 ký tự..."
                          />
                          <button onClick={() => setShowPass(p => ({...p, new: !p.new}))} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                            {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Nhập lại mật khẩu mới</label>
                        <div className="relative">
                          <input 
                            type={showPass.confirm ? "text" : "password"} 
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(p => ({...p, confirmPassword: e.target.value}))}
                            className={`w-full bg-slate-950/50 border rounded-2xl px-6 py-4 text-sm text-white outline-none transition-all ${passwordForm.confirmPassword && !isConfirmValid ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                            placeholder="Xác nhận mật khẩu..."
                          />
                          <button onClick={() => setShowPass(p => ({...p, confirm: !p.confirm}))} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                            {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordForm.confirmPassword && !isConfirmValid && (
                          <p className="text-[10px] text-red-500 font-bold ml-2">Mật khẩu xác nhận không khớp</p>
                        )}
                      </div>

                      <button 
                        disabled={!isPasswordValid || !isConfirmValid || !passwordForm.oldPassword}
                        className="w-full py-4 mt-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-orange-900/20 active:scale-95 flex items-center justify-center gap-3"
                      >
                        <ShieldAlert className="w-4 h-4" /> Cập nhật mật khẩu
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Checklist */}
                  <div className="bg-slate-950/40 border border-white/5 rounded-[2.5rem] p-8 self-start mt-4 md:mt-24 space-y-4">
                    <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Tiêu chuẩn bảo mật
                    </h5>
                    <div className="space-y-3">
                        {passwordRequirements.map((req) => (
                            <div key={req.id} className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-500 ${req.met ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-slate-900 border-white/10 text-slate-600'}`}>
                                    {req.met ? <Check className="w-3 h-3" /> : <X className="w-2 h-2" />}
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${req.met ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {req.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                        <p className="text-[10px] text-blue-300 leading-relaxed font-medium italic">
                            * Gợi ý: Hãy sử dụng mật khẩu độc nhất không trùng lặp với các nền tảng khác để tối ưu bảo mật tài sản số của bạn.
                        </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}