import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Camera, 
  Home,
  UserRound,
  Save,
  ChevronDown,
  Briefcase,
  Info,
  Store
} from 'lucide-react';
import { 
  getMyProfile, 
  updateProfile, 
  updateAvatar, 
  getProvinces, 
  getWardsByProvince 
} from "../services/api/profileApi";
import { getMeApi } from "../services/api/authApi";
import { getMyBusiness, updateBusiness } from "../services/api/businessApi";
import { AuthContext } from "../context/AuthContext";
import Header from '../components/Header';

// NOTE: provinces/wards will be loaded from API (see profileApi.getProvinces / getWardsByProvince)

export default function Profile() {
  const { user: authUser } = useContext(AuthContext);
  const isSeller = useMemo(
    () => authUser?.role && String(authUser.role).toUpperCase().includes('SELLER'),
    [authUser?.role]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

  // State dữ liệu người dùng (khởi tạo rỗng, sẽ load từ API)
  const [userData, setUserData] = useState(null);

  // Doanh nghiệp (seller)
  const [businessData, setBusinessData] = useState(null);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessLoadError, setBusinessLoadError] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    taxCode: '',
    bio: '',
  });

  // Form chỉnh sửa (khởi tạo tối thiểu)
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    job: "",
    bio: "",
    avatarUrl: "",
    address: { province: "", ward: "", fullStreet: "" }
  });

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

  const handleProvinceChange = async (e) => {
    const id = e.target.value;
    const prov = provinces.find(p => String(p.id) === String(id));
    setEditForm(prev => ({
      ...prev,
      address: { ...prev.address, provinceId: id, province: prov?.name || "", wardId: "", ward: "" }
    }));
    await loadWards(id);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setSelectedAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyProfile();
        const data = res?.data || res || null;
        // Also fetch current user (contains email)
        let me = null;
        try {
          const rm = await getMeApi();
          me = rm?.data || rm || null;
        } catch (e) {
          console.warn('getMeApi failed', e);
        }
        if (data) {
          setUserData({
            ...data,
            email: me?.email || data.email || '',
            address: data.address || {
                province: '',
                ward: '',
                fullStreet: ''
            }
            });
          // normalize editForm.address to support provinceId/wardId and names
          setEditForm(prev => ({
            ...prev,
            fullName: data.fullName || data.name || prev.fullName,
            email: me?.email || data.email || prev.email,
            phone: data.phone || prev.phone,
            gender: data.gender || prev.gender,
            job: data.job || prev.job,
            bio: data.bio || prev.bio,
            avatarUrl: data.avatarUrl || prev.avatarUrl,
            address: {
              provinceId: data.provinceId || data.address?.provinceId || "",
              province: data.provinceName || data.address?.province || data.address?.provinceName || "",
              wardId: data.wardId || data.address?.wardId || "",
              ward: data.wardName || data.address?.ward || data.address?.wardName || "",
              fullStreet: data.street || data.address?.fullStreet || ""
            }
          }));
        }
      } catch (err) {
        console.error('Load profile error', err);
      }
    };
    load();
    // load provinces list
    const loadProvs = async () => {
      try {
        const r = await getProvinces();
        const list = r?.data || r || [];
        setProvinces(list);
      } catch (err) {
        console.error('Load provinces error', err);
      }
    };
    loadProvs();
  }, []);

  useEffect(() => {
    if (!isSeller) {
      setBusinessData(null);
      setBusinessLoadError(false);
      setIsEditingBusiness(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setBusinessLoading(true);
      setBusinessLoadError(false);
      try {
        const br = await getMyBusiness();
        const bd = br?.data ?? br;
        if (!cancelled && bd) {
          setBusinessData(bd);
          setBusinessForm({
            businessName: bd.businessName || '',
            taxCode: bd.taxCode || '',
            bio: bd.bio || '',
          });
        }
      } catch (err) {
        console.error('Load business error', err);
        if (!cancelled) {
          setBusinessData(null);
          setBusinessLoadError(true);
        }
      } finally {
        if (!cancelled) setBusinessLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isSeller]);

  const loadWards = async (provinceId) => {
    if (!provinceId) return;
    try {
      const res = await getWardsByProvince(provinceId);
      const list = res?.data || res || [];
      setWards(list);
    } catch (err) {
      console.error('Load wards error', err);
    }
  };

  const saveProfile = async () => {
    try {
      // Build payload matching backend UpdateProfileRequest
        const payload = {
          fullName: editForm.fullName,
          phone: editForm.phone,
          job: editForm.job,
          bio: editForm.bio,
          gender: editForm.gender,
          street: editForm.address?.fullStreet || "",
          provinceId: editForm.address?.provinceId || null,
          wardId: editForm.address?.wardId || null,
        };

        const res = await updateProfile(payload);
        // axiosClient response interceptor returns ApiResponse => res.data holds ProfileResponse
        const updated = res?.data || res || { ...editForm };

      // If avatar file was selected upload it
      if (selectedAvatarFile) {
        try {
          const av = await updateAvatar(selectedAvatarFile);
          // backend returns ApiResponse<String> where data is the avatar URL
          const avUrl = av?.data || av || null;
          if (avUrl) {
            updated.avatarUrl = avUrl;
          }
        } catch (err) {
          console.error('Upload avatar error', err);
          alert('Cập nhật avatar thất bại');
        }
      }

      // Normalize updated profile to ensure `address` shape exists
      const normalized = {
        ...editForm,
        ...updated,
        avatarUrl: (updated && (updated.avatarUrl || updated.avatar)) || editForm.avatarUrl || (userData && userData.avatarUrl) || "",
        address: {
          provinceId: updated?.provinceId || updated?.address?.provinceId || editForm.address?.provinceId || "",
          province: updated?.provinceName || updated?.address?.province || updated?.address?.provinceName || editForm.address?.province || "",
          wardId: updated?.wardId || updated?.address?.wardId || editForm.address?.wardId || "",
          ward: updated?.wardName || updated?.address?.ward || updated?.address?.wardName || editForm.address?.ward || "",
          fullStreet: updated?.street || updated?.address?.fullStreet || editForm.address?.fullStreet || ""
        }
      };

      setUserData(normalized);
      setEditForm(normalized);
      setSelectedAvatarFile(null);
      setIsEditing(false);
      alert('Cập nhật hồ sơ thành công');
    } catch (err) {
      console.error('Save profile error', err);
      alert('Lỗi khi cập nhật hồ sơ');
    }
  };

  const saveBusiness = async () => {
    try {
      const res = await updateBusiness({
        businessName: businessForm.businessName,
        taxCode: businessForm.taxCode,
        bio: businessForm.bio,
      });
      const updated = res?.data ?? res;
      if (updated) {
        setBusinessData(updated);
        setBusinessForm({
          businessName: updated.businessName || '',
          taxCode: updated.taxCode || '',
          bio: updated.bio || '',
        });
      }
      setIsEditingBusiness(false);
      alert('Cập nhật thông tin doanh nghiệp thành công');
    } catch (err) {
      console.error('Save business error', err);
      alert(err?.message || 'Lỗi khi cập nhật thông tin doanh nghiệp');
    }
  };

  const cancelBusinessEdit = () => {
    setBusinessForm({
      businessName: businessData?.businessName || '',
      taxCode: businessData?.taxCode || '',
      bio: businessData?.bio || '',
    });
    setIsEditingBusiness(false);
  };

  const provinceList = provinces;
  const wardList = wards;

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 selection:bg-blue-500/30">
        <div className="max-w-6xl mx-auto px-6 pt-10">
          <div className="text-center py-20 text-slate-400">Đang tải dữ liệu hồ sơ...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 selection:bg-blue-500/30 overflow-x-hidden">
      <Header />
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full opacity-30"></div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-28 relative z-50">
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
                onClick={isEditing ? handleAvatarClick : undefined}
                disabled={!isEditing}
                title={isEditing ? "Đổi ảnh đại diện" : "Bấm 'Chỉnh sửa hồ sơ' để đổi ảnh"}
                className={`absolute bottom-0 right-0 p-3 border-4 border-slate-950 rounded-2xl text-white transition-all shadow-xl
                    ${isEditing 
                    ? "bg-blue-600 hover:bg-blue-500 hover:scale-110 active:scale-90 cursor-pointer" 
                    : "bg-slate-700 opacity-50 cursor-not-allowed"}
                `}
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
                      : `${userData.address?.fullStreet || ''}, ${userData.address?.ward || ''}, ${userData.address?.province || ''}`
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
                      onClick={async () => {
                        setIsEditing(true);
                        if (editForm.address?.provinceId) await loadWards(editForm.address.provinceId);
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
                            <select value={editForm.address.provinceId || ''} onChange={handleProvinceChange} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none cursor-pointer focus:border-blue-500 transition-all">
                              <option value="">Chọn tỉnh thành</option>
                              {provinceList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Phường / Xã</label>
                          <div className="relative">
                            <select disabled={!editForm.address.provinceId} value={editForm.address.wardId || ''} onChange={(e) => {
                              const id = e.target.value;
                              const w = wards.find(x => String(x.id) === String(id));
                              setEditForm(prev => ({ ...prev, address: { ...prev.address, wardId: id, ward: w?.name || '' } }));
                            }} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none disabled:opacity-30 disabled:cursor-not-allowed focus:border-blue-500 transition-all">
                              <option value="">Chọn phường xã</option>
                              {wardList.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
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
                    { label: "Khu vực", value: userData.address?.province || '', icon: <MapPin className="w-3.5 h-3.5 text-blue-500" /> }
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

            {/* Thông tin doanh nghiệp — chỉ seller */}
            {isSeller && (
              <div className="bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-8 md:p-10 backdrop-blur-xl min-h-[320px] shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                      <Store className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase leading-none">
                        Thông tin doanh nghiệp
                      </h3>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                        Dữ liệu cửa hàng / công ty đăng ký khi trở thành người bán
                      </p>
                    </div>
                  </div>

                  {!isEditingBusiness ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingBusiness(true)}
                      disabled={!businessData || businessLoading}
                      className="bg-violet-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/40 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button type="button" onClick={cancelBusinessEdit} className="bg-slate-800 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all active:scale-95">
                        Hủy bỏ
                      </button>
                      <button type="button" onClick={saveBusiness} className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/40 active:scale-95">
                        <Save className="w-4 h-4" /> Lưu thay đổi
                      </button>
                    </div>
                  )}
                </div>

                {businessLoading ? (
                  <div className="text-center py-16 text-slate-500 text-sm">Đang tải thông tin doanh nghiệp...</div>
                ) : businessLoadError || !businessData ? (
                  <div className="text-center py-16 text-amber-500/90 text-sm">
                    Không tải được thông tin doanh nghiệp. Vui lòng đăng nhập lại hoặc thử sau.
                  </div>
                ) : isEditingBusiness ? (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 max-w-3xl">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                        Tên doanh nghiệp / cửa hàng
                      </label>
                      <input
                        value={businessForm.businessName}
                        onChange={(e) => setBusinessForm((p) => ({ ...p, businessName: e.target.value }))}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-slate-950 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                        Mã số thuế
                      </label>
                      <input
                        value={businessForm.taxCode}
                        onChange={(e) => setBusinessForm((p) => ({ ...p, taxCode: e.target.value }))}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-slate-950 transition-all"
                        placeholder="VD: 0123456789"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                        Giới thiệu doanh nghiệp
                      </label>
                      <textarea
                        value={businessForm.bio}
                        onChange={(e) => setBusinessForm((p) => ({ ...p, bio: e.target.value }))}
                        rows={5}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-violet-500 focus:bg-slate-950 transition-all resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                    <div className="md:col-span-2 bg-slate-950/30 p-8 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Tên hiển thị</p>
                      <p className="text-lg font-bold text-white">{businessData.businessName || '—'}</p>
                    </div>
                    <div className="bg-slate-950/30 p-6 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Mã số thuế</p>
                      <p className="text-sm font-bold text-slate-200">{businessData.taxCode || '—'}</p>
                    </div>
                    <div className="bg-slate-950/30 p-6 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Mã doanh nghiệp</p>
                      <p className="text-sm font-bold text-slate-400">#{businessData.businessId}</p>
                    </div>
                    <div className="md:col-span-2 bg-slate-950/30 p-8 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Info className="w-3 h-3" /> Giới thiệu
                      </p>
                      <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                        {businessData.bio?.trim() ? businessData.bio : 'Chưa có mô tả.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}