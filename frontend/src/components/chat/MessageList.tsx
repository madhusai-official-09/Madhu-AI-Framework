import { AnimatePresence, motion } from "framer-motion";
import Message from "./Message";
import type { ChatMessage } from "../../types";

interface Props {
  messages: ChatMessage[];
  onRegenerate: () => void;
  isStreaming: boolean;
}

export default function MessageList({
  messages,
  onRegenerate,
  isStreaming,
}: Props) {
  return (
    <div className="flex flex-col gap-2" data-testid="message-list">
      <AnimatePresence initial={false}>
        {messages.map((m, i) => {
          const isLastAssistant =
            m.role === "assistant" && i === messages.length - 1 && !isStreaming;

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.22,
                ease: "easeOut",
              }}
            >
              <Message
                message={m}
                canRegenerate={isLastAssistant}
                onRegenerate={onRegenerate}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
