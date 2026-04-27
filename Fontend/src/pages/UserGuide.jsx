import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, User, Gavel, Radio, Clock, 
  ChevronRight, Heart, ShieldCheck, Zap, 
  ArrowRight, Menu, X, TrendingUp, Award, 
  Star, Share2, Eye, Trophy, Smartphone,
  Layers, ChevronDown, FileText, CheckCircle2,
  Users, Verified, Command, HelpCircle,
  BookOpen, ShieldAlert, CreditCard, MousePointer2
} from 'lucide-react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';

// --- COMPONENTS ---

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSearch = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const closeSearch = () => {
    setIsExpanded(false);
    setSearchValue("");
  };

  return (
    <div className="relative flex items-center">
      <div 
        className={`flex items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden rounded-2xl border ${
          isExpanded 
            ? 'w-64 md:w-80 bg-slate-900 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
            : 'w-11 h-11 bg-white/5 border-white/10 hover:border-blue-500/40 cursor-pointer'
        }`}
        onClick={() => !isExpanded && openSearch()}
      >
        <div className={`p-3 transition-colors ${isExpanded ? 'text-blue-400' : 'text-slate-400'}`}>
          <Search className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onBlur={() => !searchValue && closeSearch()}
          placeholder="Tìm câu hỏi hướng dẫn..."
          className={`bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 transition-all duration-300 w-full ${
            isExpanded ? 'opacity-100 px-1' : 'opacity-0 w-0 pointer-events-none'
          }`}
        />
      </div>
    </div>
  );
};
const GuideStep = ({ number, title, desc, icon: Icon }) => (
  <div className="group relative bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:bg-slate-900/80 hover:border-blue-500/30 transition-all duration-500">
    <div className="absolute top-8 right-8 text-6xl font-black text-white/5 group-hover:text-blue-500/10 transition-colors">
      0{number}
    </div>
    <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className={`group border-b border-white/5 py-6 cursor-pointer transition-all ${isOpen ? 'bg-white/[0.02] px-6 rounded-2xl' : ''}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className={`text-lg font-bold transition-colors ${isOpen ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
          {question}
        </h4>
        <div className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-white/5 text-slate-500'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-400 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const App = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      <Header />      

      <main className="pt-40 pb-24">
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-6 text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
          
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm mb-8">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Trung tâm hỗ trợ người dùng</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tighter">
            HƯỚNG DẪN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 italic">
              BẮT ĐẦU ĐẤU GIÁ
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Mọi thông tin bạn cần để trở thành một nhà đấu giá chuyên nghiệp. Minh bạch, an toàn và cực kỳ đơn giản.
          </p>
        </section>

        {/* 4 Steps Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GuideStep 
              number={1} 
              title="Đăng ký tài khoản" 
              desc="Xác thực thông tin cá nhân và liên kết ví điện tử để sẵn sàng tham gia các phiên đấu."
              icon={User}
            />
            <GuideStep 
              number={2} 
              title="Nạp tiền ký quỹ" 
              desc="Một khoản nhỏ để đảm bảo tính nghiêm túc. Tiền sẽ được hoàn trả 100% nếu bạn không thắng."
              icon={CreditCard}
            />
            <GuideStep 
              number={3} 
              title="Tham gia đấu" 
              desc="Sử dụng nút Gõ Búa để đặt mức giá mong muốn. Hệ thống sẽ ghi nhận theo thời gian thực."
              icon={Gavel}
            />
            <GuideStep 
              number={4} 
              title="Nhận vật phẩm" 
              desc="Sau khi thắng, thanh toán phần còn lại và vật phẩm sẽ được giao tận tay kèm bảo hiểm."
              icon={Trophy}
            />
          </div>
        </section>

        {/* Detailed Guide & Rules */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
                <ShieldCheck className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 relative z-10">Cam kết <br/>An toàn Tuyệt đối</h2>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 relative z-10 font-medium">
                Mọi giao dịch trên DauGiaViet đều được bảo chứng bởi hệ thống luật pháp Việt Nam và quy trình kiểm định 3 lớp độc lập.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all relative z-10">
                Tìm hiểu Pháp lý
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400" /> Quy định sàn
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  "Không hủy búa sau khi thắng đấu giá",
                  "Thời gian thanh toán trong vòng 24h",
                  "Phí sàn 1% trên mỗi giao dịch thành công",
                  "Ký quỹ tối thiểu 500,000 VNĐ"
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-sm font-bold text-slate-300">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Câu hỏi thường gặp</h2>
              <p className="text-slate-500 font-medium">Giải đáp những thắc mắc phổ biến nhất từ người dùng.</p>
            </div>
            <div className="space-y-2">
              <FaqItem 
                question="Làm sao để biết vật phẩm là hàng chính hãng?" 
                answer="Tất cả sản phẩm trên sàn đều phải qua bước kiểm định bởi chuyên gia hoặc cung cấp chứng chỉ GIA, Patek, Hermes... Chúng tôi bồi thường 200% nếu phát hiện hàng giả."
              />
              <FaqItem 
                question="Tiền ký quỹ sẽ được xử lý như thế nào?" 
                answer="Tiền ký quỹ được giữ tạm thời. Nếu bạn không thắng cuộc, tiền sẽ được hoàn về ví trong 30 phút sau khi phiên đấu kết thúc."
              />
              <FaqItem 
                question="Đấu giá Live khác gì so với đấu giá thông thường?" 
                answer="Đấu giá Live có người dẫn chương trình (Host), diễn ra trong thời gian ngắn (15-30 phút) và có tính tương tác cao hơn qua bình luận trực tiếp."
              />
              <FaqItem 
                question="Nếu tôi thắng nhưng không muốn mua nữa thì sao?" 
                answer="Đây được coi là hành vi vi phạm quy tắc sàn. Bạn sẽ bị mất tiền ký quỹ và tài khoản có thể bị khóa vĩnh viễn để bảo vệ quyền lợi Seller."
              />
              <FaqItem 
                question="Tôi có thể tự tạo phiên đấu giá không?" 
                answer="Có, nếu bạn đăng ký tài khoản 'Seller' và hoàn thành xác minh danh tính kinh doanh chuyên nghiệp với chúng tôi."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="relative p-12 md:p-20 bg-slate-900/50 border border-white/10 rounded-[3rem] text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                SẴN SÀNG CHO PHIÊN <br/>
                <span className="text-blue-400">ĐẦU GIÁ ĐẦU TIÊN?</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto font-medium">
                Tham gia cùng cộng đồng 1.2 triệu người dùng và bắt đầu săn những vật phẩm giới hạn ngay hôm nay.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => navigate('/register')} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-900/50 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center gap-3 group">
                  Đăng ký ngay
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/download-app')} className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center gap-3">
                  <Smartphone className="w-6 h-6" />
                  Tải App Mobile
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white uppercase tracking-tighter italic">DauGiaViet</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                Nền tảng đấu giá trực tuyến tiên phong tại Việt Nam, mang lại sự minh bạch, an toàn và chuyên nghiệp trong từng phiên đấu.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:col-span-2">
              <div className="space-y-4">
                <h5 className="text-white font-black uppercase text-xs tracking-widest">Dịch vụ</h5>
                <ul className="space-y-2 text-sm text-slate-500 font-bold">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Đấu giá Live</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Ký gửi tài sản</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Kiểm định chuyên sâu</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-white font-black uppercase text-xs tracking-widest">Hỗ trợ</h5>
                <ul className="space-y-2 text-sm text-slate-500 font-bold">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Trung tâm trợ giúp</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Quy tắc sàn</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Chính sách bảo mật</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">© 2026 DauGiaViet - Advanced Auction Tech</p>
            <div className="flex gap-6">
              {['FB', 'INSTA', 'TT'].map(s => (
                <span key={s} className="text-[10px] font-black text-slate-600 hover:text-blue-400 cursor-pointer transition-colors">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;