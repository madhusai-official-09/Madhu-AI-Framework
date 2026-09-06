import { useEffect, useRef, useState } from "react";
import HeroWelcome from "./HeroWelcome";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ScrollToBottom from "./ScrollToBottom";
import { useChatStore } from "../../store/useChatStore";
import { useChat } from "../../hooks/useChat";

export default function ChatView() {
  const active = useChatStore(
    (s) => s.conversations.find((c) => c.id === s.activeId) || null,
  );

  const { send, stop, regenerate, isStreaming } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [autoStick, setAutoStick] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null)
  const messages = active?.messages ?? [];
  const isEmpty = messages.length === 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;

      setShowScrollBtn(distance > 240);
      setAutoStick(distance < 160);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, [active?.id]);

  useEffect(() => {
    if (!autoStick) return;

    const el = scrollRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages, autoStick, isStreaming]);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });

    setAutoStick(true);
  };

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] min-h-0 flex-col overflow-hidden">
      {/* Chat scroll area */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth pb-44"
        data-testid="chat-scroll"
      >
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          {isEmpty ? (
            <div className="pt-12 sm:pt-20">
              <HeroWelcome onPick={send} />
            </div>
          ) : (
            <div className="pt-6 sm:pt-8">
              <MessageList
                messages={messages}
                onRegenerate={regenerate}
                isStreaming={isStreaming}
              />
            </div>
          )}
          <div ref={bottomRef} className="h-px" />
        </div>
      </div>

      {/* Scroll button */}
      <ScrollToBottom visible={showScrollBtn} onClick={scrollToBottom} />

      {/* Floating input */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background via-background/80 to-transparent" />

        <div className="pointer-events-auto relative mx-auto w-full max-w-4xl px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8">
          <ChatInput onSend={send} onStop={stop} isStreaming={isStreaming} />
        </div>
      </div>
    </div>
  );
}
