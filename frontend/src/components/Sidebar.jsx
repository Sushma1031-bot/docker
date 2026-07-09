import React from "react";
import { LogoMark } from "./Header.jsx";

export default function Sidebar({
  chats,
  activeId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onClearChat,
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-bg-800 transition-transform duration-200 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-4">
          <LogoMark className="w-6 h-6" />
          <span className="text-sm font-semibold text-white">LocalMind</span>
          <button
            onClick={onClose}
            className="btn-ghost ml-auto !px-2 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <div className="p-3">
          <button onClick={onNewChat} className="btn-primary w-full">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New chat
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-2">
          <div className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Conversations
          </div>
          {chats.length === 0 && (
            <p className="px-2 py-4 text-sm text-slate-500">No chats yet.</p>
          )}
          <ul className="space-y-0.5">
            {chats.map((chat) => {
              const isActive = chat.id === activeId;
              return (
                <li key={chat.id}>
                  <div
                    className={[
                      "group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-bg-500 text-white"
                        : "text-slate-300 hover:bg-bg-600",
                    ].join(" ")}
                  >
                    <button
                      onClick={() => onSelectChat(chat.id)}
                      className="flex flex-1 items-center gap-2 truncate text-left"
                    >
                      <svg className="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="truncate">{chat.title}</span>
                    </button>
                    <button
                      onClick={() => onDeleteChat(chat.id)}
                      className="btn-ghost !px-1.5 !py-1 opacity-0 group-hover:opacity-100"
                      aria-label="Delete chat"
                      title="Delete chat"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-line p-3">
          <button
            onClick={onClearChat}
            className="btn-outline w-full"
            disabled={!chats.some((c) => c.id === activeId && c.messages.length > 0)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
            Clear chat
          </button>
        </div>
      </aside>
    </>
  );
}
