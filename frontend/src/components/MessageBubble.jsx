import React from "react";
import LoadingDots from "./LoadingDots.jsx";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const pending = message.pending;

  return (
    <div className="animate-fade-in flex gap-3 sm:gap-4">
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
          isUser
            ? "bg-brand-500 text-white"
            : "bg-bg-500 text-slate-300",
        ].join(" ")}
      >
        {isUser ? "You" : "AI"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 text-xs font-medium text-slate-400">
          {isUser ? "You" : "Assistant"}
        </div>
        <div
          className={[
            "rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words",
            isUser
              ? "bg-brand-600/15 text-slate-100"
              : "bg-bg-700 text-slate-100",
            pending && !isUser ? "min-h-[2.5rem]" : "",
          ].join(" ")}
        >
          {pending ? <LoadingDots /> : message.content}
        </div>
      </div>
    </div>
  );
}
