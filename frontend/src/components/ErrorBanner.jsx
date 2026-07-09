import React from "react";

export default function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="animate-fade-in mx-auto mb-3 flex max-w-3xl items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      <svg className="mt-0.5 w-4 h-4 shrink-0 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div className="flex-1">
        <div className="font-medium">Couldn&apos;t get a response</div>
        <div className="mt-0.5 break-words text-red-300/90">{message}</div>
      </div>
      <button
        onClick={onDismiss}
        className="rounded p-1 text-red-200/80 hover:bg-red-500/20"
        aria-label="Dismiss error"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </svg>
      </button>
    </div>
  );
}
