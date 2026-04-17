import { useEffect, useContext, useState } from "react";
import { BusinessContext } from "../context/BusinessContext";
import {
  Camera,
  Edit3,
  MapPin,
  Building2,
  FileText,
  Hash,
  Wallet,
  Gavel,
  Trophy
} from "lucide-react";

import {
  updateBusiness,
  updateLogo,
  getProvinces,
  getWardsByProvince,
} from "../services/api/businessApi";

import Header from "../components/Header";

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
    <div className="min-h-screen bg-gray-50 pb-10">
      <Header />

      {/* HEADER */}
      <div className="bg-white shadow-sm">
        <div className="h-40 bg-gradient-to-r from-purple-700 to-indigo-400"></div>

        <div className="max-w-6xl mx-auto px-6 -mt-16 flex items-end gap-6 pb-6">

          {/* LOGO */}
          <div className="relative">
            <img
              src={data.logoUrl || "/default-avatar.png"}
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow"
            />

            <button
              onClick={() => document.getElementById("logo").click()}
              className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              <Camera size={16} />
            </button>

            <input type="file" hidden id="logo" onChange={handleLogoChange} />
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {data.businessName}
            </h1>
          </div>

          <button
            onClick={openEdit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Edit3 size={16} /> Chỉnh sửa
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="space-y-6">

          {/* BIO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-indigo-600"/>
              Giới thiệu
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {data.bio || "Thêm mô tả để doanh nghiệp của bạn nổi bật hơn."}
            </p>
          </div>

          {/* STATS CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Thống kê hoạt động</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Wallet size={20} />
                  </div>
                  <span className="text-emerald-900 font-medium">Số dư</span>
                </div>
                <b className="text-emerald-700 text-lg">
                  {data.balance ? data.balance.toLocaleString('vi-VN') : 0} <span className="text-sm font-normal">VNĐ</span>
                </b>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Gavel size={20} />
                  </div>
                  <span className="text-blue-900 font-medium">Đang tham gia</span>
                </div>
                <b className="text-blue-700 text-lg">{data.activeBids || 0}</b>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Trophy size={20} />
                  </div>
                  <span className="text-amber-900 font-medium">Đã thắng</span>
                </div>
                <b className="text-amber-700 text-lg">{data.wonAuctions || 0}</b>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
              Thông tin chi tiết
            </h2>

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