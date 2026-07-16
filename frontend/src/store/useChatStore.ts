import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, Conversation } from "../types";

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  searchQuery: string;
  createConversation: (title?: string) => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setActive: (id: string | null) => void;
  addMessage: (convId: string, msg: ChatMessage) => void;
  updateMessage: (
    convId: string,
    msgId: string,
    patch: Partial<ChatMessage>,
  ) => void;
  removeMessage: (convId: string, msgId: string) => void;
  clearMessages: (convId: string) => void;
  setSearchQuery: (q: string) => void;
  getActive: () => Conversation | null;
}

const genId = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId: null,
      searchQuery: "",
      createConversation: (title = "New chat") => {
        const id = genId();
        const conv: Conversation = {
          id,
          title,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({
          conversations: [conv, ...s.conversations],
          activeId: id,
        }));
        return id;
      },
      deleteConversation: (id) =>
        set((s) => {
          const conversations = s.conversations.filter((c) => c.id !== id);
          const activeId =
            s.activeId === id ? (conversations[0]?.id ?? null) : s.activeId;
          return { conversations, activeId };
        }),
      renameConversation: (id, title) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id
              ? { ...c, title: title.trim() || c.title, updatedAt: Date.now() }
              : c,
          ),
        })),
      setActive: (id) => set({ activeId: id }),
      addMessage: (convId, msg) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: [...c.messages, msg],
                  updatedAt: Date.now(),
                  title:
                    c.title === "New chat" && msg.role === "user" && msg.content
                      ? msg.content.slice(0, 42) +
                        (msg.content.length > 42 ? "€¦" : "")
                      : c.title,
                }
              : c,
          ),
        })),
      updateMessage: (convId, msgId, patch) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === msgId ? { ...m, ...patch } : m,
                  ),
                  updatedAt: Date.now(),
                }
              : c,
          ),
        })),
      removeMessage: (convId, msgId) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? { ...c, messages: c.messages.filter((m) => m.id !== msgId) }
              : c,
          ),
        })),
      clearMessages: (convId) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId ? { ...c, messages: [], updatedAt: Date.now() } : c,
          ),
        })),
      setSearchQuery: (q) => set({ searchQuery: q }),
      getActive: () => {
        const { conversations, activeId } = get();
        return conversations.find((c) => c.id === activeId) ?? null;
      },
    }),
    {
      name: "madhuai:conversations",
      partialize: (s) => ({
        conversations: s.conversations,
        activeId: s.activeId,
      }),
    },
  ),
);

export { genId };
