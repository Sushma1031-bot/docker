import { useCallback, useEffect, useRef, useState } from "react";
import { sendChat } from "../lib/api.js";

const STORAGE_KEY = "localmind.chats.v1";
const ACTIVE_KEY = "localmind.activeChat.v1";

const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || "llama3";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function createConversation() {
  return {
    id: uid(),
    title: "New chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function loadChats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persist(chats, activeId) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    localStorage.setItem(ACTIVE_KEY, activeId);
  } catch {
    /* storage may be unavailable; ignore */
  }
}

export function useChat() {
  const [chats, setChats] = useState(loadChats);
  const [activeId, setActiveId] = useState(
    () => localStorage.getItem(ACTIVE_KEY) || null
  );
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const activeRef = useRef(activeId);
  activeRef.current = activeId;

  // Seed an initial chat if none exists.
  useEffect(() => {
    setChats((prev) => {
      if (prev.length > 0) return prev;
      const first = createConversation();
      persist([first], first.id);
      setActiveId(first.id);
      return [first];
    });
  }, []);

  useEffect(() => {
    persist(chats, activeId);
  }, [chats, activeId]);

  const activeChat = chats.find((c) => c.id === activeId) || chats[0] || null;

  const updateChat = useCallback((id, updater) => {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updater(c) } : c))
    );
  }, []);

  const newChat = useCallback(() => {
    const chat = createConversation();
    setChats((prev) => [chat, ...prev]);
    setActiveId(chat.id);
    setError(null);
    return chat.id;
  }, []);

  const selectChat = useCallback((id) => {
    setActiveId(id);
    setError(null);
  }, []);

  const deleteChat = useCallback(
    (id) => {
      setChats((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (next.length === 0) {
          const fresh = createConversation();
          setActiveId(fresh.id);
          return [fresh];
        }
        if (id === activeRef.current) {
          setActiveId(next[0].id);
        }
        return next;
      });
      setError(null);
    },
    []
  );

  const clearActiveChat = useCallback(() => {
    if (!activeChat) return;
    updateChat(activeChat.id, () => ({
      messages: [],
      title: "New chat",
      updatedAt: Date.now(),
    }));
    setError(null);
  }, [activeChat, updateChat]);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsSending(false);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || "").trim();
      if (!trimmed || isSending || !activeChat) return;

      const chatId = activeChat.id;
      const userMsg = {
        id: uid(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };
      const aiMsg = {
        id: uid(),
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        pending: true,
      };

      const priorMessages = activeChat.messages;
      const nextMessages = [...priorMessages, userMsg, aiMsg];

      updateChat(chatId, () => ({
        messages: nextMessages,
        title:
          priorMessages.length === 0 ? deriveTitle(trimmed) : activeChat.title,
        updatedAt: Date.now(),
      }));

      setIsSending(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      const ollamaMessages = nextMessages
        .filter((m) => m.id !== aiMsg.id)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const { content } = await sendChat({
          model: DEFAULT_MODEL,
          messages: ollamaMessages,
          signal: controller.signal,
        });

        updateChat(chatId, (c) => ({
          messages: c.messages.map((m) =>
            m.id === aiMsg.id
              ? { ...m, content: content || "(no response)", pending: false }
              : m
          ),
          updatedAt: Date.now(),
        }));
      } catch (err) {
        if (err.name === "AbortError") {
          updateChat(chatId, (c) => ({
            messages: c.messages.map((m) =>
              m.id === aiMsg.id
                ? {
                    ...m,
                    content: m.content || "_(stopped)_",
                    pending: false,
                  }
                : m
            ),
          }));
        } else {
          setError(err.message || "Something went wrong");
          updateChat(chatId, (c) => ({
            messages: c.messages.filter((m) => m.id !== aiMsg.id),
          }));
        }
      } finally {
        abortRef.current = null;
        setIsSending(false);
      }
    },
    [activeChat, isSending, updateChat]
  );

  const dismissError = useCallback(() => setError(null), []);

  return {
    chats,
    activeChat,
    activeId,
    isSending,
    error,
    newChat,
    selectChat,
    deleteChat,
    clearActiveChat,
    sendMessage,
    stop,
    dismissError,
    defaultModel: DEFAULT_MODEL,
  };
}

function deriveTitle(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 40 ? clean.slice(0, 40) + "…" : clean || "New chat";
}
