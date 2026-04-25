import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, FileText, Scale, Lock, Gavel, 
  ChevronRight, ArrowLeft, CheckCircle2, AlertCircle,
  Users, Landmark, ClipboardCheck, Eye, ShieldAlert,
  Download, ExternalLink, HelpCircle
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('rules');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const LEGAL_SECTIONS = [
    {
      id: 'rules',
      title: 'Quy chế sàn',
      icon: <Gavel className="w-6 h-6" />,
      content: 'Tập hợp các quy định về việc đăng ký tài khoản, quy trình đấu giá và trách nhiệm của các bên tham gia sàn DauGiaViet.',
      details: [
        "Quy định về đăng ký tài khoản và định danh KYC.",
        "Quy trình gõ búa và xác nhận giao dịch tự động.",
        "Trách nhiệm của Nhà bán hàng về tính xác thực của sản phẩm.",
        "Quy định về phí sàn và phí thanh toán."
      ]
    },
    {
      id: 'privacy',
      title: 'Bảo mật dữ liệu',
      icon: <Lock className="w-6 h-6" />,
      content: 'Cam kết bảo mật thông tin cá nhân và lịch sử giao dịch của người dùng theo tiêu chuẩn quốc tế ISO/IEC 27001.',
      details: [
        "Mã hóa đầu cuối tất cả thông tin thanh toán.",
        "Không chia sẻ dữ liệu cho bên thứ ba khi chưa có sự đồng ý.",
        "Quyền yêu cầu xóa dữ liệu cá nhân bất cứ lúc nào.",
        "Hệ thống giám sát truy cập trái phép 24/7."
      ]
    },
    {
      id: 'dispute',
      title: 'Giải quyết tranh chấp',
      icon: <Scale className="w-6 h-6" />,
      content: 'Cơ chế trọng tài độc lập giúp giải quyết các khiếu nại giữa người mua và người bán một cách công bằng, minh bạch.',
      details: [
        "Quy trình 48 giờ phản hồi khiếu nại.",
        "Chính sách hoàn tiền 100% nếu sản phẩm sai mô tả.",
        "Đội ngũ chuyên gia thẩm định độc lập tham gia xử lý.",
        "Hỗ trợ thủ tục pháp lý nếu xảy ra vi phạm dân sự."
      ]
    }
  ];

  const CERTIFICATES = [
    { title: "Giấy phép TMĐT", issuer: "Bộ Công Thương", icon: <Landmark /> },
    { title: "Chứng nhận An toàn", issuer: "NCSC Vietnam", icon: <ShieldCheck /> },
    { title: "Kiểm định Tài sản", issuer: "Hội Giám định Việt Nam", icon: <ClipboardCheck /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>

      {/* Header / Nav */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Nút Quay lại được thiết kế lại */}
          <button 
            onClick={() => window.history.back()}
            className="group relative flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 active:scale-95"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-2 bg-slate-900 rounded-xl group-hover:text-blue-400 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="relative text-sm font-black text-slate-300 group-hover:text-white uppercase tracking-wider">
              Quay lại <span className="hidden sm:inline">trang chủ</span>
            </span>
          </button>
          
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/40">
                <ShieldCheck className="w-5 h-5 text-white" />
             </div>
             <span className="text-xl font-black text-white tracking-tighter">LEGAL CENTER</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-48 pb-20 text-center px-6">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-widest mb-6">
            <Verified className="w-4 h-4" /> Pháp lý & Tin cậy tuyệt đối
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tighter">
            Lá chắn bảo vệ <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
              Mọi giao dịch của bạn
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
            Tại DauGiaViet, chúng tôi xây dựng một môi trường kinh doanh minh bạch bằng cách kết hợp công nghệ hiện đại và khung pháp lý nghiêm ngặt nhất.
          </p>
        </div>
      </header>

      {/* Core Tabs Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Nav */}
          <div className="lg:col-span-4 space-y-4">
            {LEGAL_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-4 p-6 rounded-3xl border transition-all duration-500 text-left ${
                  activeTab === section.id 
                  ? 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-900/50 scale-[1.02]' 
                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className={`${activeTab === section.id ? 'text-white' : 'text-blue-400'}`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight">{section.title}</h3>
                  <p className={`text-[10px] uppercase font-bold tracking-widest opacity-60 ${activeTab === section.id ? 'text-white' : 'text-slate-500'}`}>
                    Cập nhật: 2024
                  </p>
                </div>
                <ChevronRight className={`ml-auto w-5 h-5 transition-transform ${activeTab === section.id ? 'rotate-90' : ''}`} />
              </button>
            ))}

            <div className="mt-8 p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] relative overflow-hidden group">
               <div className="relative z-10 space-y-4">
                  <h4 className="text-xl font-black text-white">Cần hỗ trợ trực tiếp?</h4>
                  <p className="text-blue-100 text-sm font-medium opacity-80">Đội ngũ pháp lý của chúng tôi sẵn sàng giải đáp thắc mắc của bạn.</p>
                  <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Gửi yêu cầu
                  </button>
               </div>
               <ShieldAlert className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 min-h-[500px] relative">
              {LEGAL_SECTIONS.map((section) => section.id === activeTab && (
                <div key={section.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-blue-600/20 rounded-2xl text-blue-400 border border-blue-500/20">
                      {section.icon}
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{section.title}</h2>
                  </div>
                  
                  <p className="text-slate-300 text-xl leading-relaxed mb-10 font-medium italic border-l-4 border-blue-500 pl-6">
                    "{section.content}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {section.details.map((detail, idx) => (
                      <div key={idx} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <p className="text-sm font-medium text-slate-400">{detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition-all">
                      <Download className="w-4 h-4" /> Tải văn bản PDF
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition-all">
                      <ExternalLink className="w-4 h-4" /> Xem văn bản gốc
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Chứng nhận & Giấy phép</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CERTIFICATES.map((cert, i) => (
            <div key={i} className="group p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] hover:border-blue-500/30 transition-all duration-500 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"></div>
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform relative z-10 border border-blue-500/20">
                {cert.icon}
              </div>
              <h4 className="text-xl font-black text-white mb-1 relative z-10">{cert.title}</h4>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest relative z-10">{cert.issuer}</p>
              
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                <CheckCircle2 className="w-3 h-3" /> Đang hiệu lực
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Flow */}
      <section className="max-w-7xl mx-auto px-6 py-24 mb-24">
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <ShieldCheck className="w-64 h-64 text-blue-400" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Quy trình đấu giá <br/><span className="text-blue-400">An toàn tuyệt đối</span></h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                Chúng tôi áp dụng mô hình Ký quỹ thông minh (Escrow) để đảm bảo quyền lợi cho cả người mua và người bán. Tiền chỉ được chuyển khi sản phẩm đã được xác nhận.
              </p>
              <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                <Users className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-sm font-black text-white">Hơn 500,000+ người dùng</p>
                  <p className="text-xs text-slate-500 font-medium">Đã tin tưởng và thực hiện giao dịch an toàn.</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {[
                { step: "01", title: "Đặt cọc & Ký quỹ", desc: "Người mua thực hiện đặt cọc trước khi tham gia đấu giá để đảm bảo tính cam kết." },
                { step: "02", title: "Xác thực & Vận chuyển", desc: "Sau khi thắng đấu giá, sản phẩm được kiểm định lại lần cuối và gửi tới người mua." },
                { step: "03", title: "Giải ngân an toàn", desc: "Hệ thống chỉ chuyển tiền cho Seller khi người mua hài lòng và xác nhận vật phẩm." }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="text-3xl font-black text-blue-500/30 group-hover:text-blue-500 transition-colors duration-500">{step.step}</div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1">{step.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Phòng Pháp chế DauGiaViet - Đã đăng ký bản quyền nội dung © 2026
        </p>
      </footer>
    </div>
  );
};

// Placeholder icons not in lucide-react but needed
const Verified = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default App;