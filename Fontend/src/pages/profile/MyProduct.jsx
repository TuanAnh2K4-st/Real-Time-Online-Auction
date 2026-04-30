import { useEffect, useState } from "react";
import {
  getRootCategories,
  getChildCategories,
  createProduct,
  getProvinces,
  getStoresByProvince,
  filterProducts
} from "../../services/api/profileApi";

import { Plus, Search, MapPin, X, Upload, Image as ImageIcon, Tag, Store } from "lucide-react";

export default function MyProduct() {

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== FILTER =====
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ALL");

  // CATEGORY
  const [rootCategories, setRootCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedRoot, setSelectedRoot] = useState("");
  const [selectedChild, setSelectedChild] = useState("");

  // PROVINCE + STORE
  const [provinces, setProvinces] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  // FORM
  const [form, setForm] = useState({
    productName: "",
    brand: "",
    origin: "",
    productCondition: "NEW",
    description: "",
    basePrice: "",
    storeId: "",
  });

  const [attributes, setAttributes] = useState({});

  // IMAGES
  const [primaryImage, setPrimaryImage] = useState(null);
  const [subImages, setSubImages] = useState([]);

  const attributeMap = {
    Laptop: ["cpu", "ram", "storage"],
    Phone: ["screen", "battery"],
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-xl text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

  // ================= LOAD =================
  useEffect(() => {
    getRootCategories().then(res => {
      setRootCategories(Array.isArray(res) ? res : res.data || []);
    });

    getProvinces().then(res =>
      setProvinces(res.data || [])
    );

    handleFilter();
  }, []);

  // ================= FILTER =================
  const handleFilter = async () => {
    try {
      const res = await filterProducts({
        productName: keyword || null,
        itemStatus: status === "ALL" ? null : status
      });

      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      handleFilter();
    }, 400);

    return () => clearTimeout(delay);
  }, [keyword, status]);

  // ================= STORESTATUS===============

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-yellow-100 text-yellow-700">
            Chờ duyệt
          </span>
        );

      case "SHIPPING":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700">
            Đang vận chuyển
          </span>
        );

      case "RECEIVED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-purple-100 text-purple-700">
            Đã nhận hàng
          </span>
        );

      case "APPROVED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-green-100 text-green-700">
            Đã duyệt
          </span>
        );

      case "REJECTED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-red-100 text-red-700">
            Từ chối
          </span>
        );

      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600">
            Không xác định
          </span>
        );
    }
  };

  // ================= CATEGORY =================
  const handleRootChange = async (e) => {
    const id = e.target.value;

    setSelectedRoot(id);
    setSelectedChild("");
    setChildCategories([]);
    setAttributes({});

    if (!id) return;

    const res = await getChildCategories(id);

    setChildCategories(Array.isArray(res) ? res : res.data || []);
  };

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
    setAttributes({});
  };

  // ================= PROVINCE =================
  const handleProvinceChange = async (e) => {
    const id = e.target.value;

    setSelectedProvince(id);
    setStores([]);
    setForm(prev => ({ ...prev, storeId: "" }));

    if (!id) return;

    const res = await getStoresByProvince(id);
    setStores(res.data || []);
  };

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAttributeChange = (key, value) => {
    setAttributes(prev => ({ ...prev, [key]: value }));
  };

  const selectedCategory = childCategories.find(c => c.id == selectedChild);
  const fields = attributeMap[selectedCategory?.name] || [];

  // ================= IMAGE =================
  const handlePrimaryImage = (e) => {
    setPrimaryImage(e.target.files[0]);
  };

  const handleSubImages = (e) => {
    const files = Array.from(e.target.files);

    if (subImages.length + files.length > 5) {
      alert("Tối đa 5 ảnh phụ");
      return;
    }

    setSubImages(prev => [...prev, ...files]);
  };

  const removePrimaryImage = () => {
    setPrimaryImage(null);
  };

  const removeSubImage = (index) => {
    setSubImages(prev => prev.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!primaryImage) return alert("Phải chọn ảnh chính");
      if (!selectedChild) return alert("Phải chọn category");
      if (!form.storeId) return alert("Phải chọn store");

      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      formData.append("categoryId", selectedChild);
      formData.append("attributesJson", JSON.stringify(attributes));
      formData.append("primaryImage", primaryImage);

      subImages.forEach(img => {
        formData.append("subImages", img);
      });

      await createProduct(formData);

      alert("Tạo thành công!");

      handleFilter();
      setShowForm(false);

    } catch (err) {
      console.error(err);
      alert("Lỗi tạo");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm của tôi</h2>
            <p className="text-gray-500 text-sm mt-1">Quản lý và cập nhật danh sách sản phẩm bạn đang bán.</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            Đăng sản phẩm mới
          </button>
        </div>

        {/* FILTER & SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Tìm kiếm tên sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {["ALL", "APPROVED", "REJECTED"].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`
                  px-5 h-9 rounded-full text-sm font-medium whitespace-nowrap
                  flex items-center justify-center
                  transition-all duration-200 border
                  ${status === s
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"}
                `}
              >
                {s === "ALL"
                  ? "Tất cả"
                  : s === "APPROVED"
                  ? "Đã duyệt"
                  : "Từ chối"}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {products.map(p => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
              
              {/* Image Container */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                <img
                  src={p.imageUrl}
                  alt={p.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(p.itemStatus)}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                  {p.productName}
                </h3>
                
                <div className="mt-auto">
                  <p className="text-blue-600 font-bold text-lg mb-3">
                    {p.basePrice?.toLocaleString()} <span className="text-sm underline">đ</span>
                  </p>

                  <div className="flex items-start gap-1.5 text-gray-500 text-xs">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <p className="line-clamp-2 leading-relaxed">
                      {p.street}, {p.wardName}, {p.provinceName}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* CREATE PRODUCT MODAL */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => !loading && setShowForm(false)}
            ></div>
            
            {/* Modal Content */}
            <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center z-20">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="text-blue-600" size={24} />
                  Đăng sản phẩm mới
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body - Form */}
              <div className="p-6 space-y-6">
                
                {/* Basic Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Tên sản phẩm *</label>
                    <input name="productName" placeholder="Ví dụ: Laptop Dell XPS 15..." onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Thương hiệu (Brand)</label>
                    <input name="brand" placeholder="Nhập thương hiệu" onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Xuất xứ</label>
                    <input name="origin" placeholder="Nhập xuất xứ" onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Tình trạng</label>
                    <select name="productCondition" value={form.productCondition} onChange={handleChange} className={inputClass}>
                      <option value="NEW">Mới 100% (New)</option>
                      <option value="USED">Đã sử dụng (Used)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Giá bán (VNĐ) *</label>
                    <input name="basePrice" type="number" placeholder="0" onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Danh mục gốc</label>
                    <select value={selectedRoot} onChange={handleRootChange} className={inputClass}>
                      <option value="">-- Chọn danh mục --</option>
                      {rootCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Loại sản phẩm</label>
                    <select value={selectedChild} onChange={handleChildChange} className={inputClass} disabled={!selectedRoot}>
                      <option value="">-- Chọn loại --</option>
                      {childCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Mô tả chi tiết</label>
                    <textarea name="description" rows={4} placeholder="Nhập mô tả tình trạng, cấu hình, phụ kiện đi kèm..." onChange={handleChange} className={inputClass} />
                  </div>
                  {fields.length > 0 && (
                    <div className="md:col-span-2">
                      <label className={labelClass}>Thông số kỹ thuật</label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {fields.map(field => (
                          <div key={field}>
                            <label className="text-xs text-gray-500 mb-1 block">
                              {field.toUpperCase()}
                            </label>

                            <input
                              value={attributes[field] || ""}
                              onChange={(e) =>
                                handleAttributeChange(field, e.target.value)
                              }
                              placeholder={`Nhập ${field}`}
                              className={inputClass}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <hr className="border-gray-100" />

                {/* Location Section */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Store size={18} className="text-blue-600"/> Địa chỉ bán hàng
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Tỉnh/Thành phố</label>
                      <select value={selectedProvince} onChange={handleProvinceChange} className={inputClass}>
                        <option value="">-- Chọn Tỉnh/Thành --</option>
                        {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Cửa hàng</label>
                      <select value={form.storeId} onChange={(e) => setForm({ ...form, storeId: e.target.value })} className={inputClass} disabled={!selectedProvince}>
                        <option value="">-- Chọn chi nhánh cửa hàng --</option>
                        {stores.map(s => (
                          <option key={s.storeId} value={s.storeId}>{s.storeName} - {s.street}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Images Section */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ImageIcon size={18} className="text-blue-600"/> Hình ảnh sản phẩm
                  </h4>
                  
                  <div className="space-y-6">
                    {/* Primary Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh bìa (Ảnh chính) *</label>
                      {!primaryImage ? (
                        <label className="flex flex-col items-center justify-center w-full md:w-1/2 h-40 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Nhấn để tải ảnh lên</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP lên đến 5MB</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handlePrimaryImage} />
                        </label>
                      ) : (
                        <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                          <img src={URL.createObjectURL(primaryImage)} alt="Primary" className="w-full h-full object-cover" />
                          <button onClick={removePrimaryImage} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50">
                            <X size={16} />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-1">Ảnh chính</div>
                        </div>
                      )}
                    </div>

                    {/* Sub Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh chi tiết (Tối đa 5 ảnh)</label>
                      <div className="flex flex-wrap gap-4">
                        {subImages.map((img, i) => (
                          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                            <img src={URL.createObjectURL(img)} alt={`Sub ${i}`} className="w-full h-full object-cover" />
                            <button onClick={() => removeSubImage(i)} className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        
                        {subImages.length < 5 && (
                          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <Plus className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-[10px] text-gray-500">Thêm ảnh</span>
                            <input type="file" multiple className="hidden" accept="image/*" onChange={handleSubImages} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-3xl">
                <button
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-xl font-medium text-white flex items-center gap-2 transition-all shadow-sm
                    ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"}`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang lưu...
                    </>
                  ) : "Lưu sản phẩm"}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}