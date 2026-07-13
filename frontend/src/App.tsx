import type { ComponentType } from "react";
import { MadhuAIChat } from "./index";

const TypedMadhuAIChat = MadhuAIChat as ComponentType<{ apiUrl: string }>;

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <TypedMadhuAIChat apiUrl="import.meta.env.VITE_API_URL" />
    </div>
  );
}
