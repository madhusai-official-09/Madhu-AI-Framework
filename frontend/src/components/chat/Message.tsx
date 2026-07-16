import { lazy, Suspense, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Copy, RotateCcw, User, Check, AlertCircle } from "lucide-react";
import type { ChatMessage } from "../../types";
import { formatTime, cn } from "../../utils/format";
import { useState } from "react";

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
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 220 }}
      className={cn(
        "group relative flex gap-3 sm:gap-4 py-4",
        isUser ? "justify-end" : "justify-start",
      )}
      data-testid={`message-${message.role}`}
    >
      {!isUser && (
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white shadow-md">
          <Bot className="size-4" />
        </div>
      )}

      <div
        className={cn(
          "min-w-0 flex flex-col gap-1.5",
          isUser ? "items-end max-w-[85%]" : "items-start flex-1",
        )}
      >
        {isUser ? (
          <div
            className="rounded-2xl rounded-br-sm border border-border bg-secondary/70 px-4 py-3 text-[15px] text-foreground shadow-sm whitespace-pre-wrap break-words"
            data-testid="user-bubble"
          >
            {message.content}
          </div>
        ) : (
          <div
            className="w-full text-foreground"
            data-testid="assistant-bubble"
          >
            <Suspense
              fallback={
                <div className="h-4 w-2/3 rounded shimmer bg-muted/30" />
              }
            >
              <MarkdownRenderer
                content={message.content}
                streaming={message.streaming}
              />
            </Suspense>
            {message.streaming && !message.content && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <span className="inline-block size-1.5 rounded-full bg-foreground/80 animate-bounce [animation-delay:-200ms]" />
                <span className="inline-block size-1.5 rounded-full bg-foreground/80 animate-bounce [animation-delay:-100ms]" />
                <span className="inline-block size-1.5 rounded-full bg-foreground/80 animate-bounce" />
              </div>
            )}
            {message.error && (
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                <AlertCircle className="size-4 mt-0.5" />
                <span>{message.error}</span>
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-1",
            isUser ? "flex-row-reverse" : "flex-row",
          )}
        >
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {formatTime(message.createdAt)}
          </span>
          <AnimatePresence>
            {!message.streaming && message.content && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
                  isUser ? "flex-row-reverse" : "flex-row",
                )}
              >
                <button
                  onClick={copy}
                  className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
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
                    className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
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
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-foreground">
          <User className="size-4" />
        </div>
      )}
    </motion.div>
  );
}

const Message = memo(MessageInner);
export default Message;


