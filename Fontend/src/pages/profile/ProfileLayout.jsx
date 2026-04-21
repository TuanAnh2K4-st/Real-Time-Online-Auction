import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { useContext, useEffect, useRef, useState } from "react";
import { ProfileContext } from "../../context/ProfileContext";
import { updateAvatar } from "../../services/api/profileApi";
import {
  Camera,
  User,
  Lock,
  Package,
  Gavel,
  Briefcase,
  Loader2
} from "lucide-react";

export default function ProfileLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { profile, loadProfile, setProfile } = useContext(ProfileContext);

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const menu = [
    { label: "Thông tin cá nhân", path: "/profile/me", icon: User },
    { label: "Đổi mật khẩu", path: "/profile/change-password", icon: Lock },
    { label: "Sản phẩm của tôi", path: "/profile/my-products", icon: Lock },
    { label: "Đơn hàng", path: "/profile/orders", icon: Package },
    { label: "Đấu giá", path: "/profile/auctions", icon: Gavel },
    { label: "Tạo phiên đấu giá", path: "/profile/create-auction-normal", icon: Gavel },
  ];

  if (!profile)
    return <div className="text-center mt-10">Loading...</div>;

  // =========================
  // AVATAR HANDLER
  // =========================
  const handleClickAvatar = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const res = await updateAvatar(file);

      // backend trả full profile
      setProfile((prev) => ({
        ...prev,
        avatarUrl: res.data.avatarUrl || res.data
        }));

      // nếu backend chỉ trả url thì dùng:
      // setProfile({ ...profile, avatarUrl: res.data });

    } catch (err) {
      console.error("Upload avatar error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <Header />

      {/* HEADER */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="h-48 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 pb-6 sm:pb-8 -mt-20 sm:-mt-16 text-center sm:text-left">

          {/* AVATAR */}
          <div className="relative group">

            <img
              src={
                profile.avatarUrl ||
                `https://ui-avatars.com/api/?name=${profile.fullName || "User"}&background=random`
              }
              alt="Avatar"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white object-cover shadow-md bg-white"
            />

            {/* LOADING OVERLAY */}
            {uploading && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}

            {/* BUTTON CHANGE AVATAR */}
            <button
              onClick={handleClickAvatar}
              disabled={uploading}
              className="absolute bottom-2 right-2 p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 rounded-full shadow-sm transition-all duration-200"
              title="Đổi ảnh đại diện"
            >
              <Camera size={18} />
            </button>

            {/* INPUT FILE */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* INFO */}
          <div className="flex-1 mb-2 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {profile.fullName}
            </h1>

            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5 text-gray-500">
              <Briefcase size={16} />
              <p>{profile.job || "Chưa cập nhật nghề nghiệp"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR MENU */}
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
                          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon 
                      size={20} 
                      className={isActive ? "text-blue-600" : "text-gray-400"} 
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* DYNAMIC CONTENT (OUTLET) */}
        <div className="flex-1 bg-white shadow-sm rounded-2xl border border-gray-100 p-6 min-h-[500px]">
          <Outlet />
        </div>

      </div>
    </div>
  );
}