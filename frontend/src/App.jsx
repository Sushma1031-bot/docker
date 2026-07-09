import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import ChatInput from "./components/ChatInput.jsx";
import ErrorBanner from "./components/ErrorBanner.jsx";
import { useChat } from "./hooks/useChat.js";

export default function App() {
  const {
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
    defaultModel,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close the mobile sidebar whenever the active chat changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeId]);

  return (
    <div className="flex h-full overflow-hidden bg-bg-900">
      <Sidebar
        chats={chats}
        activeId={activeId}
        onNewChat={newChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        onClearChat={clearActiveChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          defaultModel={defaultModel}
        />

        <main className="flex min-h-0 flex-1 flex-col">
          {error && (
            <div className="px-3 pt-3 sm:px-6">
              <ErrorBanner message={error} onDismiss={dismissError} />
            </div>
          )}

          <ChatWindow chat={activeChat} isSending={isSending} />

          <ChatInput
            onSend={sendMessage}
            onStop={stop}
            isSending={isSending}
            disabled={!activeChat}
          />
        </main>
      </div>
    </div>
  );
}
