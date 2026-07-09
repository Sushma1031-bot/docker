import React, { useRef, useState } from "react";

export default function ChatInput({ onSend, onStop, isSending, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setText("");
    resize();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  return (
    <div className="shrink-0 border-t border-line bg-bg-800/80 px-3 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="panel flex items-end gap-2 p-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              resize();
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Send a message…  (Enter to send, Shift+Enter for newline)"
            className="scrollbar-thin max-h-52 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {isSending ? (
            <button onClick={onStop} className="btn-outline !px-3" title="Stop generating">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={disabled || !text.trim()}
              className="btn-primary !px-3"
              title="Send"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Responses are generated locally by Ollama. They may be inaccurate.
        </p>
      </div>
    </div>
  );
}
