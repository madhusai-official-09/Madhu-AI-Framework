import { useCallback, useRef, useState } from "react";
import { sendChat, streamChat } from "../api/client";
import { useChatStore, genId } from "../store/useChatStore";
import { useSettingsStore } from "../store/useSettingsStore";

export function useChat() {
  const abortRef = useRef<AbortController | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { addMessage, updateMessage, activeId, createConversation, getActive } =
    useChatStore();
  const streaming = useSettingsStore((s) => s.streaming);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      let convId = activeId;
      if (!convId) convId = createConversation();

      const userMsg = {
        id: genId(),
        role: "user" as const,
        content: trimmed,
        createdAt: Date.now(),
      };
      addMessage(convId, userMsg);

      const assistantId = genId();
      addMessage(convId, {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        streaming: true,
      });

      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);

      try {
        if (streaming) {
          let acc = "";
          for await (const token of streamChat(trimmed, controller.signal)) {
            acc += token;
            updateMessage(convId, assistantId, {
              content: acc,
              streaming: true,
            });
          }
          updateMessage(convId, assistantId, {
            content: acc,
            streaming: false,
          });
        } else {
          const reply = await sendChat(trimmed, controller.signal);
          updateMessage(convId, assistantId, {
            content: reply,
            streaming: false,
          });
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          updateMessage(convId, assistantId, { streaming: false });
        } else {
          updateMessage(convId, assistantId, {
            streaming: false,
            error: (err as Error).message || "Something went wrong",
          });
        }
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [
      addMessage,
      updateMessage,
      activeId,
      createConversation,
      isStreaming,
      streaming,
    ],
  );

  const regenerate = useCallback(async () => {
    const conv = getActive();
    if (!conv) return;
    const lastUser = [...conv.messages]
      .reverse()
      .find((m) => m.role === "user");
    if (!lastUser) return;
    // Remove last assistant message
    const lastAssistantIdx = conv.messages.length - 1;
    const last = conv.messages[lastAssistantIdx];
    if (last && last.role === "assistant") {
      useChatStore.getState().removeMessage(conv.id, last.id);
    }
    await send(lastUser.content);
  }, [getActive, send]);

  return { send, stop, regenerate, isStreaming };
}


