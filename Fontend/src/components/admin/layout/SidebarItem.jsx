import React from "react";
export default function SidebarItem({ icon, label, active, onClick, collapsed,}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 group relative ${
        active
          ? "bg-blue-600/10 border-r-4 border-blue-500 text-blue-500"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-500"
      }`}
    >
      <div className="flex items-center justify-center min-w-[24px]">
        {icon}
      </div>

      {!collapsed && (
        <span className="font-bold text-sm uppercase tracking-wider whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}