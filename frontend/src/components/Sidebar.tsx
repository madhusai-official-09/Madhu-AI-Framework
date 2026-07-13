import { Trash2, MessageSquarePlus } from "lucide-react";
import type { Chat } from "../types/Chat";
import KnowledgePanel from "./KnowledgePanel";

interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelect,
  onNewChat,
  onDelete,
}: SidebarProps) {
  return (
    <aside className="w-72 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 transition"
        >
          <MessageSquarePlus size={18} />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center justify-between rounded-xl px-3 py-3 transition cursor-pointer ${
              activeChatId === chat.id ? "bg-zinc-800" : "hover:bg-zinc-800"
            }`}
          >
            <button
              onClick={() => onSelect(chat.id)}
              className="flex-1 text-left truncate"
            >
              💬 {chat.title}
            </button>

            <button
              onClick={() => onDelete(chat.id)}
              className="opacity-0 group-hover:opacity-100 transition p-1"
            >
              <Trash2 size={16} className="text-red-400 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Knowledge */}
      <div className="border-t border-zinc-800">
        <KnowledgePanel />
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4 text-center text-xs text-zinc-500">
        <div className="font-semibold">🚀 MadhuAI v1.0</div>
        <div className="mt-1">Powered by Groq</div>
      </div>
    </aside>
  );
}
