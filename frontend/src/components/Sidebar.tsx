import { Trash2, MessageSquarePlus, MessageSquare } from "lucide-react";
import type { Chat } from "../types/Chat";
import KnowledgePanel from "./KnowledgePanel";
import { motion } from "framer-motion";

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
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="w-72 h-screen bg-[#111827]
               border-r border-white/10
               flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="mb-6 flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-xl
      bg-linear-to-r from-purple-600 to-cyan-500
      flex items-center justify-center
      text-2xl shadow-lg"
          >
            🚀
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">MadhuAI</h2>

            <p className="text-sm text-zinc-400">AI Framework</p>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2
    rounded-xl bg-linear-to-r from-purple-600 to-cyan-500
    py-3 font-semibold
    hover:scale-[1.02]
    transition-all duration-300"
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
            className={`group flex items-center justify-between rounded-xl px-3 py-3 transition-all cursor-pointer duration-300 hover:scale-1.02 ${
              activeChatId === chat.id
                ? "bg-white/10 backdrop-blur-lg border border-white/10"
                : "hover:bg-white/5"
            }`}
          >
            <button
              onClick={() => onSelect(chat.id)}
              className="flex-1 text-left truncate"
            >
              <MessageSquare size={18} />
              {chat.title}
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
      <div className="space-y-2">
        <div className="font-bold text-white">MadhuAI v2</div>

        <div className="text-green-400">🟢 Online</div>

        <div className="text-zinc-500">Powered by Groq</div>
      </div>
    </motion.aside>
  );
}
