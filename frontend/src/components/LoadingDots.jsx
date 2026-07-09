import React from "react";

export default function LoadingDots({ label = "Thinking" }) {
  return (
    <div className="flex items-center gap-1.5 py-1" aria-live="polite">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce-dot" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce-dot [animation-delay:0.2s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce-dot [animation-delay:0.4s]" />
      </span>
    </div>
  );
}
