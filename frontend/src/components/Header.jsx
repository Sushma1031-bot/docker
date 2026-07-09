import React from "react";

export function LogoMark({ className = "w-7 h-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#2b76f5" />
      <path
        d="M9 11.5a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 23 11.5v5a2.5 2.5 0 0 1-2.5 2.5H14l-4 3.5V19h-1.5A2.5 2.5 0 0 1 6 16.5v-5a3 3 0 0 1 3-3Z"
        fill="white"
      />
      <circle cx="12.5" cy="14" r="1.1" fill="#2b76f5" />
      <circle cx="16" cy="14" r="1.1" fill="#2b76f5" />
      <circle cx="19.5" cy="14" r="1.1" fill="#2b76f5" />
    </svg>
  );
}

export default function Header({ onToggleSidebar, defaultModel }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-bg-800/80 px-3 backdrop-blur sm:px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="btn-ghost !px-2 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <LogoMark />
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">LocalMind AI</div>
          <div className="text-[11px] text-slate-400">Local &amp; private</div>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-line bg-bg-700 px-3 py-1 text-xs text-slate-300 sm:flex">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Model: <span className="font-medium text-white">{defaultModel}</span>
      </div>
    </header>
  );
}
