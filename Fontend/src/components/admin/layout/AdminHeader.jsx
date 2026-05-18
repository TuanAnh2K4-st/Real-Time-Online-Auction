import {Menu,ChevronLeft,Sun,Moon,ExternalLink,} from "lucide-react";

export default function AdminHeader({collapsed,setCollapsed,isDarkMode,setIsDarkMode,}) {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0b1120]/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">

      <div className="flex items-center gap-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-all"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>

        <a
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase hover:bg-blue-100 transition-all border border-blue-200 dark:border-blue-500/20"
        >
          <ExternalLink size={14} />
          Xem trang web
        </a>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-500 rounded-lg transition-all"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic">
              Quản trị viên
            </p>

            <p className="text-[9px] text-emerald-500 font-bold uppercase">
              Online
            </p>
          </div>

          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
            V
          </div>
        </div>
      </div>
    </header>
  );
}