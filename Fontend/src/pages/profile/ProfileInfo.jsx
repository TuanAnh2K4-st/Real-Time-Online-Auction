import { useEffect, useContext, useState } from "react";
import { ProfileContext } from "../../context/ProfileContext";
import {
  Camera,
  Edit3,
  Wallet,
  Gavel,
  Trophy,
  MapPin,
  User,
  Phone,
  Briefcase
} from "lucide-react";
import {
  updateProfile,
  getProvinces,
  getWardsByProvince,
} from "../../services/api/profileApi";

export default function Profile() {
  const { profile, loadProfile, setProfile } = useContext(ProfileContext);
  const [activeTab, setActiveTab] = useState("info");

  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  const data = profile;

  useEffect(() => {
    loadProfile();
    loadProvinces();
  }, []);

  // ===== LOAD PROVINCES =====
  const loadProvinces = async () => {
    try {
      const res = await getProvinces();
      setProvinces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== LOAD WARDS =====
  const loadWards = async (provinceId) => {
    if (!provinceId) return;
    try {
      const res = await getWardsByProvince(provinceId);
      setWards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  // ===== UPDATE =====
  const handleUpdate = async () => {
    try {
      const payload = {
        ...form,
        provinceId: Number(form.provinceId),
        wardId: Number(form.wardId),
      };

      const res = await updateProfile(payload);
      setProfile(res.data);
      setIsEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== OPEN EDIT =====
  const openEdit = async () => {
    setForm(profile);
    setIsEdit(true);

    if (profile.provinceId) {
      await loadWards(profile.provinceId);
    }
  };
  return (
    <div className="space-y-6">
      {/* CONTENT */}
      <div className="lg:col-span-2">

          {/* BIO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User size={20} className="text-blue-600"/>
                Giới thiệu
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {data.bio || "Thêm một vài điều về bản thân để hồ sơ của bạn trở nên thú vị hơn."}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-2xl opacity-70"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-50 pb-6 relative z-10">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Thông tin chi tiết</h2>
              <button
                onClick={openEdit}
                className="group flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <Edit3 size={16} className="group-hover:-rotate-12 transition-transform" /> Chỉnh sửa hồ sơ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-sm mb-1 flex items-center gap-1.5">
                  <User size={14} /> Họ và tên
                </p>
                <p className="font-semibold text-gray-900 text-base">{data.fullName}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-sm mb-1">Giới tính</p>
                <p className="font-semibold text-gray-900 text-base">
                  {data.gender === "MALE" ? "Nam" : data.gender === "FEMALE" ? "Nữ" : "Chưa cập nhật"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-sm mb-1 flex items-center gap-1.5">
                  <Phone size={14} /> Số điện thoại
                </p>
                <p className="font-semibold text-gray-900 text-base">{data.phone || "Chưa cập nhật"}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-sm mb-1 flex items-center gap-1.5">
                  <Briefcase size={14} /> Nghề nghiệp
                </p>
                <p className="font-semibold text-gray-900 text-base">{data.job || "Chưa cập nhật"}</p>
              </div>

              <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-sm mb-1 flex items-center gap-1.5">
                  <MapPin size={14} /> Địa chỉ liên hệ
                </p>
                <p className="font-semibold text-gray-900 text-base">
                  {data.street ? `${data.street}, ` : ""}
                  {data.wardName ? `${data.wardName}, ` : ""}
                  {data.provinceName ? data.provinceName : "Chưa cập nhật"}
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL EDIT ===== */}
      {isEdit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h2>
              <button onClick={() => setIsEdit(false)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    value={form.fullName || ""}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Nhập họ và tên..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    value={form.phone || ""}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Nhập số điện thoại..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    value={form.gender || ""}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Nghề nghiệp</label>
                  <input
                    value={form.job || ""}
                    onChange={(e) => setForm({ ...form, job: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Nhập nghề nghiệp..."
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Giới thiệu bản thân</label>
                  <textarea
                    rows={3}
                    value={form.bio || ""}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Viết một vài dòng giới thiệu về bạn..."
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                  <h3 className="font-semibold text-gray-800 mb-2">Địa chỉ liên hệ</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                  <select
                    value={form.provinceId || ""}
                    onChange={async (e) => {
                      const id = e.target.value;
                      setForm({ ...form, provinceId: id, wardId: "" });
                      await loadWards(id);
                    }}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Phường/Xã</label>
                  <select
                    value={form.wardId || ""}
                    onChange={(e) => setForm({ ...form, wardId: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    disabled={!form.provinceId}
                  >
                    <option value="">Chọn phường/xã</option>
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Số nhà, Tên đường</label>
                  <input
                    value={form.street || ""}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="VD: 123 Đường Lê Lợi..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsEdit(false)}
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}