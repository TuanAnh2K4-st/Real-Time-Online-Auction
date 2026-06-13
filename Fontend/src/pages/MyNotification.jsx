import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Clock, 
  Trash2, 
  Search, 
  Circle,
  Inbox,
  AlertTriangle,
  MailOpen,
  ChevronRight,
  Settings,
  Gavel,
  CreditCard,
  Eye,
  X,
  CheckCircle,
  Zap
} from 'lucide-react';
import {getMyNotifications, markAsRead, markAllAsRead, deleteNotification} from '../services/api/myNotificationApi';

// // --- DỮ LIỆU GIẢ LẬP (Dựa trên Entity Notification) ---
// const INITIAL_NOTIFICATIONS = [
//   {
//     notificationId: 1,
//     title: "Chúc mừng! Bạn đã thắng đấu giá",
//     content: "Vật phẩm 'iPhone 15 Pro Max 1TB' đã thuộc về bạn với mức giá 85.000.000đ. Vui lòng hoàn tất thanh toán trong 48h để hệ thống tiến hành bàn giao vật phẩm mạ vàng 24K này cho bạn sớm nhất.",
//     isRead: false,
//     createdAt: "2024-05-21T08:30:00",
//     type: 'auction_win'
//   },
//   {
//     notificationId: 2,
//     title: "Xác nhận thanh toán thành công",
//     content: "Giao dịch thanh toán cho đơn hàng #DG-2024-001 đã được hệ thống xác nhận. Vật phẩm đang được chuẩn bị bàn giao bởi đơn vị vận chuyển TechWorld VN.",
//     isRead: true,
//     createdAt: "2024-05-20T15:45:00",
//     type: 'payment'
//   },
//   {
//     notificationId: 3,
//     title: "Nhắc nhở: Sắp hết hạn thanh toán",
//     content: "Bạn còn 12 giờ để thanh toán vật phẩm 'Túi Hermes Birkin 35'. Sau thời gian này kết quả sẽ bị hủy và tài khoản có thể bị đưa vào danh sách hạn chế tham gia đấu giá.",
//     isRead: false,
//     createdAt: "2024-05-21T02:00:00",
//     type: 'alert'
//   },
//   {
//     notificationId: 4,
//     title: "Cập nhật chính sách đấu giá mới",
//     content: "Hệ thống vừa cập nhật điều khoản về việc sáp nhập địa giới hành chính khi nhập địa chỉ nhận hàng. Quý khách vui lòng chọn Tỉnh -> Phường/Xã trực tiếp.",
//     isRead: true,
//     createdAt: "2024-05-19T09:00:00",
//     type: 'system'
//   }
// ];

const timeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 60) return `${diffInMins} phút trước`;
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  return `${diffInDays} ngày trước`;
};
const mapNotificationType = (type) => {

  switch (type) {

    case 'CONGRATULATION':
      return 'auction_win';

    case 'DELIVERY_SUCCESS':
      return 'payment';

    case 'WARNING':
    case 'VIOLATION':
      return 'alert';

    case 'INFO':
    default:
      return 'system';
  }
};

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
    }, []);

    const fetchNotifications = async () => {

        try {

            setLoading(true);

            const response = await getMyNotifications();

            const mappedData = response.data.map((item) => ({
                notificationId: item.notificationId,
                title: item.title,
                content: item.content,
                createdAt: item.createdAt,
                isRead: item.isRead,
                type: mapNotificationType(item.notificationType),
            }));

            setNotifications(mappedData);

        } catch (error) {

            console.error("Lỗi lấy notifications", error);

        } finally {

            setLoading(false);
        }
    };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
        try {

            await markAsRead(id);

            setNotifications(
            notifications.map(n =>
                n.notificationId === id
                ? { ...n, isRead: true }
                : n
            )
            );

        } catch (error) {
            console.error(error);
        }
    };

  const openDetail = (notification) => {
    setSelectedNotification(notification);
    handleMarkAsRead(notification.notificationId);
  };

    const handleMarkAllAsRead = async () => {

        try {

            await markAllAsRead();

            setNotifications(
            notifications.map(n => ({
                ...n,
                isRead: true
            }))
            );

        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteNotification = async (id) => {

        try {

            await deleteNotification(id);

            setNotifications(
            notifications.filter(n => n.notificationId !== id)
            );

            if (selectedNotification?.notificationId === id) {
            setSelectedNotification(null);
            }

        } catch (error) {
            console.error(error);
        }
    };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30 pb-20">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-12 md:pt-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
              Trung tâm chỉ huy
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter flex items-center gap-4">
              THÔNG BÁO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">HỆ THỐNG</span>
              {unreadCount > 0 && (
                <span className="relative flex h-6 px-3 items-center justify-center bg-blue-600 text-white text-[10px] font-black rounded-full not-italic">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                   {unreadCount} MỚI
                </span>
              )}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={handleMarkAllAsRead} className="group p-3 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all shadow-xl flex items-center gap-2" title="Đánh dấu đã đọc tất cả">
                <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block transition-all">Đọc hết</span>
                <MailOpen className="w-5 h-5" />
             </button>
             <button className="p-3 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl">
                <Settings className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-8 bg-slate-900/40 backdrop-blur-md p-2 rounded-[1.5rem] border border-white/5">
          <div className="flex gap-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`relative px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Chưa đọc
              {unreadCount > 0 && filter !== 'unread' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
              )}
            </button>
          </div>
          <div className="relative hidden md:block mr-2">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
             <input type="text" placeholder="Tìm kiếm tin nhắn..." className="bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-blue-500/50 transition-all w-64" />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
            {loading ? (
                <div className="py-20 text-center text-slate-400">
                Đang tải thông báo...
                </div>
            ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <div 
                key={notification.notificationId}
                className={`group relative rounded-[2.5rem] p-7 border transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 overflow-hidden ${
                  !notification.isRead 
                    ? 'bg-gradient-to-r from-blue-600/10 to-indigo-600/5 border-blue-500/40 shadow-2xl shadow-blue-900/20' 
                    : 'bg-slate-900/30 border-white/5 hover:border-white/10'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Visual Accent for Unread */}
                {!notification.isRead && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                )}

                <div className="flex gap-7">
                  {/* Icon Section */}
                  <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 duration-500 ${
                    !notification.isRead ? 'shadow-lg shadow-current/10 scale-105' : ''
                  } ${
                    notification.type === 'auction_win' ? 'bg-amber-500/10 text-amber-500' :
                    notification.type === 'payment' ? 'bg-green-500/10 text-green-500' :
                    notification.type === 'alert' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {notification.type === 'auction_win' && <Gavel className="w-7 h-7" />}
                    {notification.type === 'payment' && <CreditCard className="w-7 h-7" />}
                    {notification.type === 'alert' && <AlertTriangle className="w-7 h-7" />}
                    {notification.type === 'system' && <Zap className="w-7 h-7" />}
                  </div>

                  <div className="flex-grow space-y-3">
                    <div className="flex items-center justify-between">
                       <h3 className={`text-xl font-black tracking-tighter transition-colors ${!notification.isRead ? 'text-white' : 'text-slate-400'}`}>
                        {notification.title}
                       </h3>
                       <div className="flex items-center gap-2">
                         {!notification.isRead && <Circle className="w-3 h-3 fill-blue-500 text-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                         <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{timeAgo(notification.createdAt)}</span>
                       </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed line-clamp-2 max-w-2xl ${!notification.isRead ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                      {notification.content}
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                       <button 
                        onClick={() => openDetail(notification)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-inner"
                       >
                         <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                       </button>
                       <button 
                        onClick={() => handleDeleteNotification(notification.notificationId)}
                        className="p-2.5 text-slate-700 hover:text-red-500 transition-colors"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-5 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/10">
               <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-slate-800 shadow-inner">
                  <Inbox className="w-12 h-12" />
               </div>
               <div>
                 <p className="text-2xl font-black text-white italic tracking-tighter">Trống rỗng</p>
                 <p className="text-xs text-slate-500 uppercase font-bold tracking-[0.2em] mt-1">Hộp thư của bạn không có dữ liệu nào</p>
               </div>
            </div>
          )}
        </div>

        {/* Modal Chi Tiết */}
        {selectedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
             <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedNotification(null)}></div>
             
             <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className={`h-24 flex items-center justify-center relative ${
                  selectedNotification.type === 'auction_win' ? 'bg-amber-500/20' :
                  selectedNotification.type === 'payment' ? 'bg-green-500/20' :
                  selectedNotification.type === 'alert' ? 'bg-red-500/20' : 'bg-blue-500/20'
                }`}>
                   <div className={`p-4 rounded-2xl ${
                     selectedNotification.type === 'auction_win' ? 'bg-amber-500 text-slate-900' :
                     selectedNotification.type === 'payment' ? 'bg-green-500 text-slate-900' :
                     selectedNotification.type === 'alert' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                   }`}>
                      {selectedNotification.type === 'auction_win' && <Gavel className="w-8 h-8" />}
                      {selectedNotification.type === 'payment' && <CheckCircle className="w-8 h-8" />}
                      {selectedNotification.type === 'alert' && <AlertTriangle className="w-8 h-8" />}
                      {selectedNotification.type === 'system' && <Bell className="w-8 h-8" />}
                   </div>
                   <button onClick={() => setSelectedNotification(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                {/* Modal Content */}
                <div className="p-10 space-y-6">
                   <div className="space-y-2">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{selectedNotification.type.replace('_', ' ')}</span>
                      <h2 className="text-3xl font-black text-white italic tracking-tighter leading-tight">{selectedNotification.title}</h2>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                         <Clock className="w-3.5 h-3.5" /> {new Date(selectedNotification.createdAt).toLocaleString('vi-VN')}
                      </div>
                   </div>
                   
                   <p className="text-slate-300 leading-relaxed font-medium">
                      {selectedNotification.content}
                   </p>

                   <div className="pt-6">
                      <button 
                        onClick={() => setSelectedNotification(null)}
                        className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl"
                      >
                        Đã hiểu
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;