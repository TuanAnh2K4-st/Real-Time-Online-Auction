import { Gavel } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-tighter italic">
                DauGiaViet
              </span>
            </div>

            <p className="text-slate-500 max-w-sm leading-relaxed">
              Nền tảng đấu giá trực tuyến tiên phong tại Việt Nam,
              mang lại sự minh bạch, an toàn và chuyên nghiệp trong từng phiên đấu.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="space-y-4">
              <h5 className="text-white font-black uppercase text-xs tracking-widest">
                Dịch vụ
              </h5>

              <ul className="space-y-2 text-sm text-slate-500 font-bold">
                <li className="hover:text-blue-400 cursor-pointer">
                  Đấu giá Live
                </li>
                <li className="hover:text-blue-400 cursor-pointer">
                  Ký gửi tài sản
                </li>
                <li className="hover:text-blue-400 cursor-pointer">
                  Kiểm định chuyên sâu
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-white font-black uppercase text-xs tracking-widest">
                Hỗ trợ
              </h5>

              <ul className="space-y-2 text-sm text-slate-500 font-bold">
                <li className="hover:text-blue-400 cursor-pointer">
                  Trung tâm trợ giúp
                </li>
                <li className="hover:text-blue-400 cursor-pointer">
                  Quy tắc sàn
                </li>
                <li className="hover:text-blue-400 cursor-pointer">
                  Chính sách bảo mật
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            © 2026 DauGiaViet - Advanced Auction Tech
          </p>

          <div className="flex gap-6">
            {["FB", "INSTA", "TT"].map((s) => (
              <span
                key={s}
                className="text-[10px] font-black text-slate-600 hover:text-blue-400 cursor-pointer"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}