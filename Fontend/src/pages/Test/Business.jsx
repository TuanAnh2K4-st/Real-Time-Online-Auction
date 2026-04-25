import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Building2, 
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
  Save,
  ChevronDown,
  Info,
  Clock,
  Briefcase,
  FileText,
  Globe,
  Settings
} from 'lucide-react';

// Dữ liệu giả lập địa giới hành chính
const LOCATION_DATA = {
  "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 7", "TP. Thủ Đức", "Bình Thạnh"],
  "Hà Nội": ["Hoàn Kiếm", "Ba Đình", "Hai Bà Trưng", "Cầu Giấy"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà"]
};

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('inventory'); // inventory, settings
  const fileInputRef = useRef(null);

  // State Business dựa trên @Entity Business
  const [businessData, setBusinessData] = useState({
    businessId: 101,
    businessName: "Authentic Luxury Solutions",
    taxCode: "0102030405-999",
    logoUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&auto=format&fit=crop",
    bio: "Đơn vị tiên phong trong lĩnh vực giám định và cung cấp giải pháp đấu giá các mặt hàng xa xỉ phẩm tại thị trường Việt Nam. Chúng tôi cam kết minh bạch và uy tín.",
    updatedAt: "2026-04-22T14:30:00",
    // Link 1-1 với Address
    address: {
      province: "TP. Hồ Chí Minh",
      ward: "Quận 1",
      fullStreet: "15 Lê Thánh Tôn"
    },
    // Link 1-1 với User (Dữ liệu người đại diện)
    user: {
      fullName: "Lê Minh Hoàng",
      email: "hoang.le@authentic.vn"
    }
  });

  const [editForm, setEditForm] = useState({ ...businessData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const saveBusinessProfile = () => {
    // Giả lập LocalDateTime.now()
    const now = new Date().toISOString();
    setBusinessData({ ...editForm, updatedAt: now });
    setIsEditing(false);
  };

  const provinceList = Object.keys(LOCATION_DATA);
  const wardList = editForm.address.province ? LOCATION_DATA[editForm.address.province] || [] : [];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full opacity-30"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 relative z-10">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-10 transition-all duration-700 animate-in fade-in slide-in-from-top-4">
          <button className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:border-blue-500/50 transition-all shadow-lg">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-black uppercase text-[10px] tracking-widest italic">Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right mr-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Doanh nghiệp</p>
              <p className="text-xs font-bold text-blue-400">#{businessData.businessId}</p>
            </div>
            <button className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
            <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all group">
              <LogOut className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Thoát</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar: Brand Identity */}
          <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-8 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-600/20 to-transparent"></div>
              
              <div className="relative pt-6">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-[2.5rem] p-1 bg-gradient-to-tr from-emerald-500 via-blue-500 to-indigo-500 shadow-2xl">
                    <div className="w-full h-full rounded-[2.3rem] border-[4px] border-slate-950 overflow-hidden bg-slate-800">
                      <img 
                        src={isEditing ? editForm.logoUrl : businessData.logoUrl} 
                        className="w-full h-full object-cover" 
                        alt="logo" 
                      />
                    </div>
                  </div>
                  
                  <input type="file" ref={fileInputRef} className="hidden" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-3 bg-emerald-600 border-4 border-slate-950 rounded-2xl text-white hover:bg-emerald-500 transition-all shadow-xl"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="mt-6 text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">
                  {isEditing ? editForm.businessName : businessData.businessName}
                </h2>
                <div className="mt-3 flex justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest">
                    MST: {isEditing ? editForm.taxCode : businessData.taxCode}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4 text-left">
                {[
                  { icon: <Building2 className="w-4 h-4" />, label: "Tên pháp lý", value: isEditing ? editForm.businessName : businessData.businessName },
                  { icon: <Mail className="w-4 h-4" />, label: "Email Doanh nghiệp", value: businessData.user.email },
                  { icon: <MapPin className="w-4 h-4" />, label: "Trụ sở chính", value: `${businessData.address.fullStreet}, ${businessData.address.ward}` }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 px-2">
                    <div className="w-9 h-9 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center text-slate-500 shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{item.label}</p>
                      <p className="text-[11px] font-bold text-slate-300 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-blue-600/20 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Trạng thái xác minh</p>
                        <p className="text-sm font-bold text-white uppercase italic">Đối tác tin cậy (Verified)</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Information Card */}
            <div className="bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Hồ sơ Doanh nghiệp</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Cập nhật lần cuối: {new Date(businessData.updatedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                  >
                    Cập nhật thông tin
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setIsEditing(false)} className="bg-slate-800 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all">Hủy</button>
                    <button onClick={saveBusinessProfile} className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/40">
                      <Save className="w-4 h-4" /> Lưu dữ liệu
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-8 animate-in fade-in zoom-in-95">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tên Business (business_name)</label>
                      <input name="businessName" value={editForm.businessName} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Mã số thuế (tax_code)</label>
                      <input name="taxCode" value={editForm.taxCode} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  {/* Address Fields */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> Địa chỉ đăng ký (address_id)
                    </h4>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Số nhà & Tên đường</label>
                        <input name="fullStreet" value={editForm.address.fullStreet} onChange={handleAddressChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tỉnh / Thành phố</label>
                          <div className="relative">
                            <select name="province" value={editForm.address.province} onChange={handleAddressChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none cursor-pointer">
                              <option value="">Chọn tỉnh</option>
                              {provinceList.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Quận / Huyện</label>
                          <div className="relative">
                            <select name="ward" value={editForm.address.ward} onChange={handleAddressChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none cursor-pointer">
                              <option value="">Chọn quận/huyện</option>
                              {wardList.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-6 border-t border-white/5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Giới thiệu (bio - text)</label>
                    <textarea name="bio" value={editForm.bio} onChange={handleInputChange} rows={4} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500 transition-all resize-none" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                  <div className="bg-slate-950/30 p-6 rounded-3xl border border-white/5 group hover:border-emerald-500/20 transition-all">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Người đại diện (User Relation)</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-white uppercase">{businessData.user.fullName}</p>
                    </div>
                  </div>
                  <div className="bg-slate-950/30 p-6 rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Mã số thuế</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-white uppercase tracking-widest">{businessData.taxCode}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-slate-950/30 p-8 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Info className="w-3 h-3" /> Hồ sơ năng lực (Bio)
                    </p>
                    <p className="text-slate-300 italic leading-relaxed text-sm">"{businessData.bio}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Inventory & Performance Tab */}
            <div className="bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl min-h-[300px]">
              <div className="flex items-center p-1.5 bg-slate-950/60 rounded-2xl w-fit mb-10 border border-white/5">
                <button 
                  onClick={() => setActiveSubTab('inventory')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'inventory' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Package className="w-4 h-4" /> Sản phẩm ký gửi
                </button>
                <button 
                  onClick={() => setActiveSubTab('settings')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'settings' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Settings className="w-4 h-4" /> Cấu hình nâng cao
                </button>
              </div>

              {activeSubTab === 'inventory' ? (
                <div className="text-center py-20 space-y-4 opacity-50">
                   <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-slate-600" />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest">Chưa có sản phẩm nào được liên kết</p>
                   <button className="text-[9px] text-blue-500 hover:underline font-bold uppercase tracking-widest italic">Bắt đầu ký gửi ngay</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-950/40 border border-white/5 rounded-3xl">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Công khai thông tin</p>
                      <p className="text-xs text-slate-400">Cho phép người dùng khác xem MST và địa chỉ trụ sở.</p>
                      <div className="mt-4 w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
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