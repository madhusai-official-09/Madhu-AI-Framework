import { useEffect, useState } from "react";
import type { Chat } from "../types/Chat";
import type { Message } from "../types/Chat";
import { createChat } from "../utils/createChat";
import { loadChats, saveChats } from "../utils/chatStorage";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState("");

  useEffect(() => {
    const stored = loadChats();

    if (stored.length === 0) {
      const first = createChat();

      setChats([first]);
      setActiveChatId(first.id);

      return;
    }

    setChats(stored);
    setActiveChatId(stored[0].id);
  }, []);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  function newChat() {
    const chat = createChat();

    setChats((prev) => [chat, ...prev]);

    setActiveChatId(chat.id);
  }

  function updateChatMessages(chatId: string, messages: Message[]) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages,
            }
          : chat,
      ),
    );
  }

  function renameChat(chatId: string, title: string) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title,
            }
          : chat,
      ),
    );
  }

  function deleteChat(chatId: string) {
    const remaining = chats.filter((c) => c.id !== chatId);

    if (remaining.length === 0) {
      const first = createChat();
      setChats([first]);
      setActiveChatId(first.id);
      return;
    }

    setChats(remaining);

    if (activeChatId === chatId) {
      setActiveChatId(remaining[0].id);
    }
  }

  return {
    chats,
    activeChatId,
    setActiveChatId,
    setChats,
    newChat,
    updateChatMessages,
    renameChat,
    deleteChat,
  };
}
