import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { useContext, useEffect, useRef, useState } from "react";
import { BusinessContext } from "../../context/BusinessContext";
import { updateLogo } from "../../services/api/businessApi";
import {
  Camera,
  Building2,
  Wallet,
  Gavel,
  Trophy,
  Package,
  Loader2
} from "lucide-react";

export default function BusinessLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { business, loadBusiness } = useContext(BusinessContext);

  const fileInputRef = useRef(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    loadBusiness();
  }, []);

  const menu = [
    { label: "Thông tin doanh nghiệp", path: "/business/me", icon: Building2 },
    { label: "Số dư", path: "/business/wallet", icon: Wallet },
    { label: "Đấu giá", path: "/business/auctions", icon: Gavel },
    { label: "Thành tích", path: "/business/achievements", icon: Trophy },
    { label: "Đơn hàng", path: "/business/orders", icon: Package },
  ];

  if (!business)
    return <div className="text-center mt-10">Loading...</div>;

  // =========================
  // CHANGE LOGO HANDLER
  // =========================
  const handleClickLogo = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);

    try {
      await updateLogo(file);

      // ✔ BEST: reload full business để tránh mất data
      await loadBusiness();

    } catch (err) {
      console.error("Upload logo error:", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <Header />

      {/* HEADER */}
      <div className="bg-white shadow-sm border-b border-gray-200">

        {/* BANNER */}
        <div className="h-48 w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500"></div>

        {/* INFO */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 pb-6 sm:pb-8 -mt-20 sm:-mt-16 text-center sm:text-left">

          {/* LOGO */}
          <div className="relative group">

            <img
              src={
                business.logoUrl ||
                `https://ui-avatars.com/api/?name=${business.businessName || "Business"}&background=random`
              }
              alt="Logo"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white object-cover shadow-md bg-white"
            />

            {/* LOADING OVERLAY */}
            {uploadingLogo && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={handleClickLogo}
              disabled={uploadingLogo}
              className="absolute bottom-2 right-2 p-2 bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 border border-gray-200 rounded-full shadow-sm transition-all"
              title="Đổi logo"
            >
              <Camera size={18} />
            </button>

            {/* INPUT FILE */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* NAME */}
          <div className="flex-1 mb-2 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {business.businessName}
            </h1>

            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5 text-gray-500">
              <Building2 size={16} />
              <p>{business.taxCode || "Chưa có mã số thuế"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white shadow-sm rounded-2xl p-3 border border-gray-100 sticky top-24">
            <nav className="flex flex-col gap-1">
              {menu.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                      ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={
                        isActive ? "text-indigo-600" : "text-gray-400"
                      }
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-white shadow-sm rounded-2xl border border-gray-100 p-6 min-h-[500px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}