import type { Chat } from "../types/Chat";

const KEY = "madhuai_chats";

export function loadChats(): Chat[] {
  const data = localStorage.getItem(KEY);

  if (!data) return [];

  return JSON.parse(data) as Chat[];
}

export function saveChats(chats: Chat[]) {
  localStorage.setItem(KEY, JSON.stringify(chats));
}