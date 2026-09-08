import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import type { MadhuAIWidgetProps } from "./types";
import Magnet from "../components/ui/Magnet";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MadhuAIWidget({
  projectId,
  backendUrl,
}: MadhuAIWidgetProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {open && (
        <div className="mb-3 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-[0_4px_20px_rgba(255,255,255,0.04)]">
                <Bot className="size-4 text-white/80" />
              </div>

              <div>
                <div className="text-sm font-semibold text-white">MadhuAI</div>

                <div className="text-[11px] text-white/50">AI Assistant</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-xs text-white/40">
                Ask me anything.
              </div>
            ) : (
              messages.map((item, index) => (
                <div
                  key={index}
                  className={
                    item.role === "user"
                      ? "flex justify-end"
                      : "flex items-start gap-2"
                  }
                >
                  {item.role === "assistant" && (
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-[0_4px_20px_rgba(255,255,255,0.04)]">
                      <Bot className="size-4 text-white/80" />
                    </div>
                  )}

                  <div
                    className={
                      item.role === "user"
                        ? "max-w-[85%] rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white"
                        : "max-w-[85%] rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90"
                    }
                  >
                    {item.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <form
            className="border-t border-white/10 p-3"
            onSubmit={async (event) => {
              event.preventDefault();

              const trimmed = message.trim();

              if (!trimmed) return;

              setMessages((prev) => [
                ...prev,
                {
                  role: "user",
                  content: trimmed,
                },
              ]);

              setMessage("");

              try {
                const response = await fetch(`${backendUrl}/public/chat`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    message: trimmed,
                    project_id: projectId,
                  }),
                });

                if (!response.ok) {
                  throw new Error("Chat request failed");
                }

                const data = await response.json();

                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: data.reply,
                  },
                ]);
              } catch {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: "Sorry, I couldn't connect right now.",
                  },
                ]);
              }
            }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-3 py-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask MadhuAI..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white/90 outline-none placeholder:text-white/30"
              />

              <button
                type="submit"
                className="rounded-lg p-2 text-white transition hover:bg-white/10"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="px-4 pb-2 text-[9px] text-white/30">
            Powered by MadhuAI
          </div>
        </div>
      )}

      {/* Launcher */}
      <div className="flex size-14 items-center justify-center">
        <Magnet padding={50} disabled={false}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
            }}
            className="!flex !size-14 !items-center !justify-center !rounded-full !bg-black !text-white shadow-2xl ring-1 ring-white/20"
            aria-label={open ? "Close MadhuAI" : "Open MadhuAI"}
          >
            {open ? (
              <X className="size-5" />
            ) : (
              <MessageCircle className="size-5" />
            )}
          </button>
        </Magnet>
      </div>
    </div>
  );
}
