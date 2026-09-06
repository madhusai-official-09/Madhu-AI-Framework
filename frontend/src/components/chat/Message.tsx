import { lazy, Suspense, memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Copy, RotateCcw, User, Check, AlertCircle } from "lucide-react";
import type { ChatMessage } from "../../types";
import { formatTime, cn } from "../../utils/format";

const MarkdownRenderer = lazy(() => import("./MarkdownRenderer"));

interface MessageProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
}

function MessageInner({ message, onRegenerate, canRegenerate }: MessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "group relative flex gap-3 py-3 sm:gap-4 sm:py-4",
        isUser ? "justify-end" : "justify-start",
      )}
      data-testid={`message-${message.role}`}
    >
      {!isUser && (
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-foreground shadow-sm backdrop-blur-md">
          <Bot className="size-4" />
        </div>
      )}

      <div
        className={cn(
          "min-w-0 flex flex-col gap-1.5",
          isUser
            ? "max-w-[85%] items-end sm:max-w-[78%]"
            : "flex-1 items-start",
        )}
      >
        {isUser ? (
          <div
            className="rounded-2xl rounded-br-md border border-white/10 bg-white/[0.08] px-4 py-3 text-[15px] leading-6 text-foreground shadow-sm backdrop-blur-md whitespace-pre-wrap break-words"
            data-testid="user-bubble"
          >
            {message.content}
          </div>
        ) : (
          <div
            className="w-full min-w-0 text-foreground"
            data-testid="assistant-bubble"
          >
            <Suspense
              fallback={
                <div className="h-5 w-2/3 rounded-md bg-white/[0.06] shimmer" />
              }
            >
              <MarkdownRenderer
                content={message.content}
                streaming={message.streaming}
              />
            </Suspense>

            {message.streaming && !message.content && (
              <div className="flex items-center gap-1.5 py-1 text-muted-foreground">
                <span className="size-1.5 animate-bounce rounded-full bg-foreground/70 [animation-delay:-200ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-foreground/70 [animation-delay:-100ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-foreground/70" />
              </div>
            )}

            {message.error && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-3 py-2.5 text-sm text-red-300">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{message.error}</span>
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex min-h-5 items-center gap-1.5",
            isUser ? "flex-row-reverse" : "flex-row",
          )}
        >
          <span className="text-[10px] tabular-nums text-muted-foreground/60">
            {formatTime(message.createdAt)}
          </span>

          <AnimatePresence>
            {!message.streaming && message.content && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                  isUser ? "flex-row-reverse" : "flex-row",
                )}
              >
                <button
                  onClick={copy}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground"
                  aria-label="Copy"
                  data-testid={`copy-btn-${message.id}`}
                >
                  {copied ? (
                    <Check className="size-3" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>

                {!isUser && canRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground"
                    aria-label="Regenerate"
                    data-testid={`regenerate-btn-${message.id}`}
                  >
                    <RotateCcw className="size-3" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isUser && (
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-foreground shadow-sm backdrop-blur-md">
          <User className="size-4" />
        </div>
      )}
    </div>
  );
}

const Message = memo(MessageInner);

export default Message;
