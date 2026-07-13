import { useEffect, useRef } from "react";
import { MadhuAIClient } from "../client/MadhuAIClient";
import { useChat } from "../hooks/useChat";
import { useChats } from "../hooks/useChats";
import Message from "./Message";
import Sidebar from "./Sidebar";
import UploadButton from "./UploadButton";

export default function Chat() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const client = new MadhuAIClient({
    apiUrl: import.meta.env.VITE_API_URL,
  });

  const {
    chats,
    activeChatId,
    setActiveChatId,
    newChat,
    updateChatMessages,
    renameChat,
    deleteChat,
  } = useChats();

  const activeChat = chats.find((c) => c.id === activeChatId);

  const activeMessages = activeChat?.messages ?? [];

  const { input, setInput, sendMessage, loading } = useChat(
    import.meta.env.VITE_API_URL,
    activeMessages,
    (messages) => updateChatMessages(activeChatId, messages),
    (title) => renameChat(activeChatId, title),
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeMessages]);

  async function upload(file: File) {
    try {
      const result = await client.upload(file);

      alert(`✅ PDF Indexed Successfully!\n\nChunks: ${result.chunks}`);
    } catch {
      alert("❌ Failed to upload PDF.");
    }
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelect={setActiveChatId}
        onNewChat={newChat}
        onDelete={deleteChat}
      />

      <div className="flex flex-1 flex-col">
        {/* Header */}

        <header className="border-b border-zinc-800 px-6 py-4">
          <h1 className="text-center text-2xl font-bold">🚀 MadhuAI</h1>
        </header>

        {/* Messages */}

        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {activeMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-zinc-500">
                <h2 className="text-4xl">👋 Welcome to MadhuAI</h2>

                <p className="mt-3">
                  Ask anything. Code, AI, Python, React, PDFs...
                </p>
              </div>
            ) : (
              activeMessages.map((msg, index) => (
                <Message key={index} role={msg.role} content={msg.content} />
              ))
            )}

            {loading && (
              <div className="animate-pulse text-zinc-400">
                MadhuAI is typing...
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </main>

        {/* Footer */}

        <footer className="border-t border-zinc-800 p-6">
          <form
            onSubmit={sendMessage}
            className="mx-auto flex max-w-4xl items-center gap-3"
          >
            <UploadButton onUpload={upload} />

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message MadhuAI..."
              className="
                flex-1
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900
                px-5
                py-4
                outline-none
                transition
                focus:border-blue-500
              "
            />

            <button
              className="
                rounded-xl
                bg-blue-600
                px-6
                py-4
                font-semibold
                transition
                hover:bg-blue-700
              "
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
