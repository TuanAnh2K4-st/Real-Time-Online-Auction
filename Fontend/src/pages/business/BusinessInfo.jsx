import { useEffect, useContext, useState } from "react";
import { BusinessContext } from "../../context/BusinessContext";
import {
  Camera,
  Edit3,
  MapPin,
  Building2,
  FileText,
  Hash,
  Wallet,
  Gavel,
  User,
  Trophy
} from "lucide-react";

import {
  updateBusiness,
  updateLogo,
  getProvinces,
  getWardsByProvince,
} from "../../services/api/businessApi";

export default function Business() {
  const { business, loadBusiness, setBusiness } = useContext(BusinessContext);

  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  const data = business;

  useEffect(() => {
    loadBusiness();
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    const res = await getProvinces();
    setProvinces(res.data);
  };

  const loadWards = async (provinceId) => {
    if (!provinceId) return;
    const res = await getWardsByProvince(provinceId);
    setWards(res.data);
  };

  if (!business) return <div className="text-center mt-10">Loading...</div>;

  // ===== UPDATE =====
  const handleUpdate = async () => {
    try {
      const payload = {
        ...form,
        provinceId: Number(form.provinceId),
        wardId: Number(form.wardId),
      };

      const res = await updateBusiness(payload);
      setBusiness(res.data);
      setIsEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== LOGO =====
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const res = await updateLogo(file);

    setBusiness({
      ...business,
      logoUrl: res.data,
    });
  };

  const openEdit = async () => {
    setForm(business);
    setIsEdit(true);

    if (business.provinceId) {
      await loadWards(business.provinceId);
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
                  <Building2 size={14}/> Tên doanh nghiệp
                </p>
                <p className="font-semibold">{data.businessName}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-sm mb-1 flex items-center gap-1.5">
                  <Hash size={14}/> Mã số thuế
                </p>
                <p className="font-semibold">{data.taxCode || "Chưa cập nhật"}</p>
              </div>

              <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-sm mb-1 flex items-center gap-1.5">
                  <MapPin size={14}/> Địa chỉ
                </p>

                <p className="font-semibold">
                  {data.street ? `${data.street}, ` : ""}
                  {data.wardName ? `${data.wardName}, ` : ""}
                  {data.provinceName || "Chưa cập nhật"}
                </p>
              </div>

            </div>
          </div>
        </div>
    {isEdit && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* HEADER */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa doanh nghiệp</h2>
            <button onClick={() => setIsEdit(false)} className="text-gray-400 hover:text-gray-700">
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* ===== THÔNG TIN CƠ BẢN ===== */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Tên doanh nghiệp <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.businessName || ""}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nhập tên doanh nghiệp..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Mã số thuế</label>
                <input
                  value={form.taxCode || ""}
                  onChange={(e) => setForm({ ...form, taxCode: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nhập mã số thuế..."
                />
              </div>

              {/* ===== MÔ TẢ ===== */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Mô tả doanh nghiệp</label>
                <textarea
                  rows={3}
                  value={form.bio || ""}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Viết mô tả về doanh nghiệp..."
                />
              </div>

              {/* ===== ADDRESS SECTION ===== */}
              <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                <h3 className="font-semibold text-gray-800 mb-2">Địa chỉ doanh nghiệp</h3>
              </div>

              {/* PROVINCE */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                <select
                  value={form.provinceId || ""}
                  onChange={async (e) => {
                    const id = e.target.value;
                    setForm({ ...form, provinceId: id, wardId: "" });
                    await loadWards(id);
                  }}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* WARD */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Phường/Xã</label>
                <select
                  value={form.wardId || ""}
                  onChange={(e) => setForm({ ...form, wardId: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                  disabled={!form.provinceId}
                >
                  <option value="">Chọn phường/xã</option>
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              {/* STREET */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Địa chỉ cụ thể</label>
                <input
                  value={form.street || ""}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="VD: 123 Nguyễn Trãi..."
                />
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-end gap-3">
            <button
              onClick={() => setIsEdit(false)}
              className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-xl"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleUpdate}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
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