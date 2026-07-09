import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ chat, isSending }) {
  const endRef = useRef(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // Auto-scroll to bottom whenever messages change.
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
  }, [chat?.messages, isSending]);

  const messages = chat?.messages || [];
  const isEmpty = messages.length === 0;

  return (
    <div
      ref={scrollerRef}
      className="scrollbar-thin flex-1 overflow-y-auto"
    >
      {isEmpty ? (
        <EmptyState />
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  const examples = [
    "Explain how Docker containers work",
    "Write a haiku about the ocean",
    "Summarize the plot of Romeo and Juliet",
    "Give me a simple Node.js HTTP server",
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 ring-1 ring-brand-500/30">
        <svg className="h-7 w-7 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-white">How can I help you today?</h2>
      <p className="mt-1 max-w-md text-sm text-slate-400">
        LocalMind runs entirely on your machine via Ollama. Ask anything — your
        prompts never leave your computer.
      </p>
      <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
        {examples.map((ex) => (
          <div
            key={ex}
            className="rounded-lg border border-line bg-bg-700 px-3 py-2 text-left text-xs text-slate-300"
          >
            {ex}
          </div>
        ))}
      </div>
    </div>
  );
}
