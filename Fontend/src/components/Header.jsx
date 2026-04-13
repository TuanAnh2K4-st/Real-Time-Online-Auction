import React from 'react';
import { 
  Search, 
  Bell, 
  UserCircle, 
  Gavel, 
  ShoppingCart, 
  Phone, 
  Mail, 
  ChevronDown, 
  Menu 
} from 'lucide-react';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 font-sans">
      
      {/* 1. TOP BAR - Thanh ngang trên cùng */}
      <div className="bg-gray-800 text-gray-300 text-xs sm:text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Thông tin liên hệ */}
          <div className="flex space-x-6">
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <Phone size={14} /> 
              <span className="hidden sm:inline">Hotline:</span> 1900 1234
            </span>
            <span className="hidden md:flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <Mail size={14} /> 
              hotro@vietauction.vn
            </span>
          </div>

          {/* Links Đăng nhập / Đăng ký */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <a href="#" className="hover:text-white transition-colors">Trợ giúp</a>
            <div className="w-px h-3.5 bg-gray-600"></div>

            {!user ? (
              <>
                <Link to="/register" className="hover:text-white font-medium transition-colors">
                  Đăng ký
                </Link>
                <Link to="/login" className="hover:text-white font-medium transition-colors">
                  Đăng nhập
                </Link>
              </>
            ) : (
              <>
                <span className="text-white font-medium">
                  {user.username || user.email}
                </span>
                <button
                  onClick={logout}
                  className="hover:text-red-400 transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER - Logo, Search, Icons */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2.5 shadow-md">
                <Gavel className="text-white" size={24} />
              </div>
              <span className="font-extrabold text-2xl text-gray-900 tracking-tight">
                Viet<span className="text-blue-600">Auction</span>
              </span>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-12 relative">
              <div className="flex w-full rounded-full border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-inner bg-gray-50">
                <select className="bg-gray-100 border-r border-gray-300 text-gray-600 text-sm px-4 py-2.5 outline-none cursor-pointer hover:bg-gray-200 transition-colors">
                  <option>Tất cả danh mục</option>
                  <option>Bất động sản</option>
                  <option>Xe cộ</option>
                  <option>Nghệ thuật & Sưu tầm</option>
                </select>
                <input
                  type="text"
                  className="block w-full pl-4 pr-10 py-2.5 bg-transparent focus:outline-none text-sm placeholder-gray-500"
                  placeholder="Tìm kiếm tài sản, phiên đấu giá, mã số..."
                />
                <button className="absolute right-0 top-0 bottom-0 px-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Right Actions (Giỏ hàng, Chuông, Profile) */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Nút tìm kiếm mobile */}
              <button className="lg:hidden p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Search size={22} />
              </button>

              {/* Icon Giỏ hàng */}
              <button 
                type="button" 
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors focus:outline-none"
                title="Giỏ hàng hồ sơ"
              >
                <ShoppingCart size={22} />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                  2
                </span>
              </button>

              {/* Icon Chuông thông báo */}
              <button 
                type="button" 
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors focus:outline-none"
                title="Thông báo"
              >
                <Bell size={22} />
                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>

              {/* Icon Profile */}
               <button 
                type="button"
                onClick={() => {
                  if (user) {
                    navigate("/profile");
                  } else {
                    navigate("/login");
                  }
                }}
                className="flex items-center gap-2 p-1.5 ml-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none border border-transparent"
              >
                <UserCircle size={30} className="text-gray-600" />
                <span className="hidden md:block text-sm font-semibold text-gray-700 pr-1">
                  {user ? (user.username || user.email) : "Tài khoản"}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* 3. MENU NAVIGATION - Thanh menu chức năng */}
        <div className="bg-white border-t border-gray-100 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center h-12 space-x-8 text-sm font-medium text-gray-700">
              
              {/* Nút Danh mục nổi bật */}
              <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors py-3 border-b-2 border-transparent hover:border-blue-600">
                <Menu size={18} />
                <span>Danh mục tài sản</span>
              </div>

              <div className="w-px h-5 bg-gray-300"></div>

              {/* Các menu items */}
              <a href="#" className="hover:text-blue-600 transition-colors py-3 border-b-2 border-transparent hover:border-blue-600">
                Trang chủ
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-blue-600 transition-colors py-3 border-b-2 border-transparent hover:border-blue-600 text-blue-600 border-blue-600">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Đang diễn ra
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors py-3 border-b-2 border-transparent hover:border-blue-600">
                Sắp diễn ra
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors py-3 border-b-2 border-transparent hover:border-blue-600">
                Đã kết thúc
              </a>
              <div className="flex-1"></div> {/* Spacer */}
              
              {/* Menu con ở góc phải */}
              <div className="group relative cursor-pointer py-3">
                <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  Hướng dẫn & Biểu phí <ChevronDown size={16} />
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}