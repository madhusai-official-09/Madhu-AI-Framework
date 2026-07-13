import type { Chat } from "../types/Chat";

export function createChat(): Chat {
  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    createdAt: Date.now(),
    messages: [],
  };
}