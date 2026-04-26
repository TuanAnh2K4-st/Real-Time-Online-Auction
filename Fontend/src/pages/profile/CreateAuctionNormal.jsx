import { useEffect, useState } from "react";
import { 
  Gavel, PackageOpen, CheckCircle2, Calendar, Clock, DollarSign, AlertCircle, Tag, Zap
} from "lucide-react";

import {
  getProductsForAuction,
  createNormalAuction
} from "../../services/api/createNormalAuctionApi";

export default function CreateAuctionNormal() {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    productId: "",
    startPrice: "",
    stepPrice: "",
    date: "",
    time: ""
  });

  // ===== LOAD PRODUCT =====
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getProductsForAuction();
      setProducts(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== UTIL TIME =====
  const getTodayLocal = () => {
    const now = new Date();
    return now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0");
  };

  const getMinTime = () => {
    if (form.date !== getTodayLocal()) return "00:00";

    const now = new Date();
    return (
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0")
    );
  };

  // ===== FORMAT TIỀN =====
  const formatCurrency = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN");
  };

  const getShortVND = (value) => {
    const num = Number(value);
    if (!num || isNaN(num)) return "";
    if (num >= 1e9) return (num / 1e9).toLocaleString("vi-VN") + " tỷ";
    if (num >= 1e6) return (num / 1e6).toLocaleString("vi-VN") + " triệu";
    if (num >= 1e3) return (num / 1e3).toLocaleString("vi-VN") + " ngàn";
    return num.toLocaleString("vi-VN") + " ₫";
  };

  // ===== HANDLE =====
  const handleSelectProduct = (id) => {
    setForm(prev => ({
      ...prev,
      productId: prev.productId === id ? "" : id
    }));
    setError("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const raw = value.replace(/\D/g, "");
    setForm(prev => ({
      ...prev,
      [name]: raw
    }));
    setError("");
  };

  const handleQuickSelectTime = (type) => {
    const now = new Date();
    let target = new Date();

    switch(type) {
      case 'endOfDay':
        target.setHours(23, 59, 0, 0);
        if (target <= now) target.setDate(target.getDate() + 1);
        break;
      case '12h':
        target.setHours(target.getHours() + 12);
        break;
      case '24h':
        target.setHours(target.getHours() + 24);
        break;
      case '3d':
        target.setDate(target.getDate() + 3);
        break;
    }

    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    const hh = String(target.getHours()).padStart(2, '0');
    const mi = String(target.getMinutes()).padStart(2, '0');

    setForm(prev => ({
      ...prev,
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${mi}`
    }));

    setError("");
  };

  const validateEndTime = () => {
    if (!form.date || !form.time) return false;
    const selected = new Date(form.date + " " + form.time);
    return selected > new Date();
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId) {
      setError("Vui lòng chọn sản phẩm");
      return;
    }

    if (!form.startPrice || !form.stepPrice) {
      setError("Vui lòng nhập đầy đủ giá");
      return;
    }

    if (!validateEndTime()) {
      setError("Thời gian không hợp lệ");
      return;
    }

    if (Number(form.stepPrice) >= Number(form.startPrice)) {
      setError("Bước giá phải nhỏ hơn giá khởi điểm");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const endTime = `${form.date}T${form.time}`;

      const res = await createNormalAuction({
        productId: form.productId,
        startPrice: Number(form.startPrice),
        stepPrice: Number(form.stepPrice),
        endTime
      });

      setSuccess(res.message);

      setForm({
        productId: "",
        startPrice: "",
        stepPrice: "",
        date: "",
        time: ""
      });

      fetchProducts();

    } catch (err) {
      setError(err.message || "Lỗi tạo auction");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center items-start font-sans">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        
        {/* HEDER CHÍNH */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tạo Phiên Đấu Giá Mới</h2>
            <p className="text-blue-100 text-sm mt-1">Thiết lập giá và thời gian cho sản phẩm của bạn</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* ===== SECTION 1: CHỌN SẢN PHẨM ===== */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <PackageOpen className="w-5 h-5 text-indigo-500" />
                1. Chọn sản phẩm đấu giá
              </h3>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {products.length} sản phẩm có sẵn
              </span>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center">
                <PackageOpen className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">Chưa có sản phẩm nào sẵn sàng</p>
                <p className="text-slate-400 text-sm mt-1">Vui lòng thêm sản phẩm vào kho trước khi tạo đấu giá.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map(p => {
                  const isSelected = form.productId === p.productId;
                  return (
                    <div
                      key={p.productId}
                      onClick={() => handleSelectProduct(p.productId)}
                      className={`relative group flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2
                        ${isSelected 
                          ? "border-indigo-600 bg-indigo-50/30 shadow-sm" 
                          : "border-slate-100 hover:border-indigo-200 hover:shadow-sm"
                        }
                      `}
                    >
                      {/* Checkmark icon for selected state */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-indigo-600 bg-white rounded-full">
                          <CheckCircle2 fill="currentColor" className="text-indigo-600 w-6 h-6" />
                        </div>
                      )}

                      <div className="shrink-0">
                        <img
                          src={p.imageUrl || "/no-image.png"}
                          alt={p.productName}
                          className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm group-hover:scale-105 transition-transform"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="font-semibold text-slate-800 truncate pr-6 text-base" title={p.productName}>
                          {p.productName}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                             {p.itemStatus}
                           </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <hr className="border-slate-100" />

          {/* ===== SECTION 2: THIẾT LẬP GIÁ ===== */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-indigo-500" />
              2. Thiết lập cấu hình giá
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Giá khởi điểm (VNĐ) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="startPrice"
                    placeholder="VD: 1.000.000"
                    value={formatCurrency(form.startPrice)}
                    onChange={handlePriceChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white"
                  />
                </div>
                <div className="flex justify-between items-center mt-2 ml-1 h-5">
                  <p className="text-xs text-slate-500">Mức giá bắt đầu của sản phẩm.</p>
                  {form.startPrice && (
                    <p className="text-sm text-indigo-600 font-semibold animate-in fade-in zoom-in duration-200">
                      ≈ {getShortVND(form.startPrice)}
                    </p>
                  )}
                </div>
              </div>

              {/* Step Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bước giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="stepPrice"
                    placeholder="VD: 50.000"
                    value={formatCurrency(form.stepPrice)}
                    onChange={handlePriceChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white"
                  />
                </div>
                <div className="flex justify-between items-center mt-2 ml-1 h-5">
                  <p className="text-xs text-slate-500">Mức tối thiểu để vượt giá.</p>
                  {form.stepPrice && (
                    <p className="text-sm text-indigo-600 font-semibold animate-in fade-in zoom-in duration-200">
                      ≈ {getShortVND(form.stepPrice)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* ===== SECTION 3: THỜI GIAN ===== */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-indigo-500" />
              3. Thời gian kết thúc
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={getTodayLocal()}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Giờ kết thúc <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    lang="vi-VN"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* ===== Quick Select Buttons ===== */}
              <div className="md:col-span-2 pt-1">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Gợi ý thiết lập nhanh:</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickSelectTime('endOfDay')}
                    className="px-4 py-2 text-sm bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-medium rounded-lg transition-colors border border-slate-200 hover:border-indigo-200"
                  >
                    Cuối ngày hôm nay
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSelectTime('12h')}
                    className="px-4 py-2 text-sm bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-medium rounded-lg transition-colors border border-slate-200 hover:border-indigo-200"
                  >
                    +12 Giờ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSelectTime('24h')}
                    className="px-4 py-2 text-sm bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-medium rounded-lg transition-colors border border-slate-200 hover:border-indigo-200"
                  >
                    +24 Giờ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSelectTime('3d')}
                    className="px-4 py-2 text-sm bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-medium rounded-lg transition-colors border border-slate-200 hover:border-indigo-200"
                  >
                    +3 Ngày
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* ===== ERROR BANNER ===== */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 font-medium">{error}</div>
            </div>
          )}
          {/* ===== SUCCESS BANNER ===== */}
            {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div className="text-sm text-green-800 font-medium">
                {success}
                </div>
            </div>
            )}

          {/* ===== SUBMIT BUTTON ===== */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all shadow-md
                ${isSubmitting 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Gavel className="w-5 h-5" />
                  Bắt Đầu Đấu Giá
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Global CSS cho Scrollbar nhỏ gọn */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}