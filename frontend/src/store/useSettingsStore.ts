import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "../types";

interface SettingsState extends Settings {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

const DEFAULTS: Settings = {
  temperature: 0.7,
  topP: 1,
  maxTokens: 2048,
  streaming: true,
  model: "llama-3.3-70b-versatile",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      set: (key, value) => set({ [key]: value } as Partial<SettingsState>),
      reset: () => set({ ...DEFAULTS }),
    }),
    { name: "madhuai:settings" },
  ),
);

export const AVAILABLE_MODELS = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    tag: "Groq · Versatile",
  },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", tag: "Groq · Instant" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8—7B", tag: "Groq · 32k ctx" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B", tag: "Groq · IT" },
];
