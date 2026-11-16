import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, RotateCcw, Sparkles, X } from "lucide-react";
import type { MadhuAIWidgetProps } from "./types";
import Magnet from "../components/ui/Magnet";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  typing?: boolean;
}

const SUGGESTIONS = [
  { emoji: "🤖", text: "What can you help me with?" },
  { emoji: "🚀", text: "Tell me about this project" },
  { emoji: "⚡", text: "How do I get started?" },
];

/* ---------- Markdown rendering (bold, inline code, lists) ---------- */

function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="rounded-md bg-fuchsia-500/15 px-1.5 py-0.5 font-mono text-[13px] text-fuchsia-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function renderMessage(content: string) {
  const blocks = content.split(/\n\s*\n/);
  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        const isBullet = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l));
        const isNumbered = lines.length > 0 && lines.every((l) => /^\d+\.\s+/.test(l));

        if (isBullet) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1.5 pl-5 marker:text-fuchsia-400">
              {lines.map((l, i) => (
                <li key={i}>{renderInlineMarkdown(l.replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (isNumbered) {
          return (
            <ol key={blockIndex} className="list-decimal space-y-1.5 pl-5 marker:text-fuchsia-400">
              {lines.map((l, i) => (
                <li key={i}>{renderInlineMarkdown(l.replace(/^\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }
        return <p key={blockIndex}>{renderInlineMarkdown(lines.join(" "))}</p>;
      })}
    </div>
  );
}

/* ---------- Small pieces ---------- */

function Avatar({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-8" : "size-10";
  const icon = size === "sm" ? "size-4" : "size-5";
  return (
    <div
      className={`${box} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 shadow-lg shadow-fuchsia-500/30 ring-1 ring-white/20`}
    >
      <Bot className={`${icon} text-white`} />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="madhu-ai-msg flex items-end gap-2.5">
      <Avatar size="sm" />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-bounce rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-300"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Widget ---------- */

export default function MadhuAIWidget({ projectId, backendUrl }: MadhuAIWidgetProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stickRef = useRef(true); // auto-scroll unless user scrolls up
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollDown = useCallback((smooth = false) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Scroll on any change (new message, typing, loader, open)
  useEffect(() => {
    if (stickRef.current) scrollDown(false);
  }, [messages, loading, open, scrollDown]);

  useEffect(() => {
    if (open) {
      textareaRef.current?.focus();
      stickRef.current = true;
      requestAnimationFrame(() => scrollDown(false));
    }
  }, [open, scrollDown]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [message]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  function resetChat() {
    if (timerRef.current) clearInterval(timerRef.current);
    setMessages([]);
    setLoading(false);
    stickRef.current = true;
  }

  // Typewriter reveal so the chat scrolls while the answer "streams"
  function typeReply(full: string) {
    let i = 0;
    const step = Math.max(2, Math.ceil(full.length / 180));
    setMessages((prev) => [...prev, { role: "assistant", content: "", typing: true }]);

    timerRef.current = setInterval(() => {
      i = Math.min(i + step, full.length);
      const done = i >= full.length;
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === "assistant") {
          next[next.length - 1] = { ...last, content: full.slice(0, i), typing: !done };
        }
        return next;
      });
      if (done && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 16);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading || timerRef.current) return;

    stickRef.current = true;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/public/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, project_id: projectId }),
      });
      if (!response.ok) throw new Error("Chat request failed");
      const data = await response.json();
      setLoading(false);
      typeReply(String(data.reply ?? ""));
    } catch {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops 😵 couldn't reach the server. Try again in a sec!",
          isError: true,
        },
      ]);
    }
  }

  const busy = loading || messages[messages.length - 1]?.typing;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <style>{`
        @keyframes madhu-ai-pop {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes madhu-ai-msg {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes madhu-ai-glow {
          0%, 100% { opacity: .55; transform: scale(1); }
          50% { opacity: .9; transform: scale(1.08); }
        }
        @keyframes madhu-ai-blink { 50% { opacity: 0; } }
        .madhu-ai-msg { animation: madhu-ai-msg 260ms ease-out; }
        .madhu-ai-cursor::after {
          content: "▍"; margin-left: 2px; color: #e879f9;
          animation: madhu-ai-blink 0.9s steps(1) infinite;
        }
        .madhu-ai-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.15) transparent; }
        @media (prefers-reduced-motion: reduce) {
          .madhu-ai-panel, .madhu-ai-msg, .madhu-ai-glow { animation: none !important; }
        }
      `}</style>

      {open && (
        <div
          role="dialog"
          aria-label="MadhuAI chat"
          className="madhu-ai-panel relative flex h-[620px] max-h-[calc(100dvh-7rem)] w-[400px] max-w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a10]/90 shadow-[0_24px_80px_rgba(168,85,247,0.25)] backdrop-blur-2xl"
          style={{ animation: "madhu-ai-pop 240ms cubic-bezier(.2,.9,.3,1.2)" }}
        >
          {/* aurora glow */}
          <div
            aria-hidden="true"
            className="madhu-ai-glow pointer-events-none absolute -top-24 -left-16 size-64 rounded-full bg-fuchsia-500/30 blur-3xl"
            style={{ animation: "madhu-ai-glow 6s ease-in-out infinite" }}
          />
          <div
            aria-hidden="true"
            className="madhu-ai-glow pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-cyan-400/20 blur-3xl"
            style={{ animation: "madhu-ai-glow 7s ease-in-out infinite" }}
          />

          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <Avatar />
              <div>
                <div className="flex items-center gap-1.5 text-base font-semibold leading-tight text-white">
                  MadhuAI
                  <Sparkles className="size-3.5 text-fuchsia-300" />
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  Online · vibing 😎
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={resetChat}
                  className="rounded-xl p-2.5 text-white/50 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-fuchsia-400"
                  aria-label="Start new chat"
                  title="New chat"
                >
                  <RotateCcw className="size-[18px]" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2.5 text-white/50 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-fuchsia-400"
                aria-label="Close chat"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="madhu-ai-scroll relative flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 text-5xl" aria-hidden="true">
                  ✨
                </div>
                <h3 className="bg-gradient-to-r from-fuchsia-300 via-violet-200 to-cyan-200 bg-clip-text text-xl font-bold text-transparent">
                  Yo, I&apos;m MadhuAI 👋
                </h3>
                <p className="mt-1.5 max-w-[270px] text-sm leading-relaxed text-white/55">
                  Ask me anything about this project. No cap, I&apos;ve got answers 🔥
                </p>

                <div className="mt-6 flex w-full flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.text}
                      type="button"
                      onClick={() => sendMessage(s.text)}
                      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/85 transition hover:-translate-y-0.5 hover:border-fuchsia-400/50 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-fuchsia-400"
                    >
                      <span className="text-lg transition group-hover:scale-125" aria-hidden="true">
                        {s.emoji}
                      </span>
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((item, index) =>
                item.role === "user" ? (
                  <div key={index} className="madhu-ai-msg flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-gradient-to-br from-fuchsia-500 to-violet-600 px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-lg shadow-fuchsia-500/20">
                      {item.content}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="madhu-ai-msg flex items-end gap-2.5">
                    <Avatar size="sm" />
                    <div
                      className={`max-w-[85%] break-words rounded-2xl rounded-bl-md px-4 py-3 text-[15px] leading-relaxed ${
                        item.isError
                          ? "border border-red-400/20 bg-red-500/10 text-red-200"
                          : "border border-white/10 bg-white/[0.06] text-white/90"
                      } ${item.typing ? "madhu-ai-cursor" : ""}`}
                    >
                      {renderMessage(item.content)}
                    </div>
                  </div>
                ),
              )
            )}

            {loading && <TypingIndicator />}
          </div>

          {/* Input */}
          <form
            className="relative border-t border-white/10 px-4 pb-3 pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(message);
            }}
          >
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] py-2 pl-4 pr-2 transition focus-within:border-fuchsia-400/60 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_24px_rgba(217,70,239,0.2)]">
              <textarea
                ref={textareaRef}
                value={message}
                rows={1}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(message);
                  }
                }}
                placeholder="Ask me anything 💭"
                aria-label="Message"
                className="max-h-[120px] min-w-0 flex-1 resize-none self-center bg-transparent py-1.5 text-base leading-6 text-white outline-none placeholder:text-white/35 sm:text-[15px]"
              />
              <button
                type="submit"
                disabled={!message.trim() || !!busy}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white transition hover:scale-105 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/10 disabled:text-white/30 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
                aria-label="Send message"
              >
                <ArrowUp className="size-5" />
              </button>
            </div>

            <div className="mt-2 text-center text-[11px] text-white/35">
              Made with 💜 · AI can slip up sometimes 🙃
            </div>
          </form>
        </div>
      )}

      {/* Launcher */}
      <div className="flex size-16 items-center justify-center">
        <Magnet padding={50} disabled={false}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={{ color: "#ffffff" }}
            className="!flex !size-16 !items-center !justify-center !rounded-full !bg-gradient-to-br !from-fuchsia-500 !via-violet-500 !to-cyan-400 shadow-2xl shadow-fuchsia-500/40 ring-1 ring-white/30 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
            aria-label={open ? "Close MadhuAI" : "Open MadhuAI"}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Bot className="size-7" />}
          </button>
        </Magnet>
      </div>
    </div>
  );
}