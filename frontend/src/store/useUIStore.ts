import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConnectionStatus } from "../types";

interface UIState {
  theme: "dark" | "light";
  sidebarOpen: boolean;
  knowledgeOpen: boolean;
  settingsOpen: boolean;
  connection: ConnectionStatus;
  toggleTheme: () => void;
  setTheme: (t: "dark" | "light") => void;
  toggleSidebar: () => void;
  setSidebar: (v: boolean) => void;
  toggleKnowledge: () => void;
  setKnowledge: (v: boolean) => void;
  toggleSettings: () => void;
  setSettings: (v: boolean) => void;
  setConnection: (s: ConnectionStatus) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "dark",
      sidebarOpen: true,
      knowledgeOpen: false,
      settingsOpen: false,
      connection: "checking",
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === "dark" ? "light" : "dark";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next === "dark");
          }
          return { theme: next };
        }),
      setTheme: (t) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", t === "dark");
        }
        set({ theme: t });
      },
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebar: (v) => set({ sidebarOpen: v }),
      toggleKnowledge: () => set((s) => ({ knowledgeOpen: !s.knowledgeOpen })),
      setKnowledge: (v) => set({ knowledgeOpen: v }),
      toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen })),
      setSettings: (v) => set({ settingsOpen: v }),
      setConnection: (s) => set({ connection: s }),
    }),
    {
      name: "madhuai:ui",
      partialize: (s) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen }),
    },
  ),
);


