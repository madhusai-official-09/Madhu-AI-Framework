import { useState } from "react";
import { MadhuAIClient } from "../client/MadhuAIClient";
import type { Message } from "../types/Chat";

export function useChat(
  apiUrl: string,
  messages: Message[],
  setMessages: (messages: Message[]) => void,
  renameChat?: (title: string) => void,
) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const client = new MadhuAIClient({
    apiUrl,
  });

  async function sendMessage(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    if (renameChat && messages.length === 0) {
      renameChat(
        userMessage.length > 35
          ? userMessage.slice(0, 35) + "..."
          : userMessage,
      );
    }

    setInput("");

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
      {
        role: "assistant",
        content: "",
      },
    ];

    setMessages(updatedMessages);

    setLoading(true);

    try {
      let assistantReply = "";

      await client.stream(userMessage, (token) => {
        assistantReply += token;

        updatedMessages[updatedMessages.length - 1] = {
          role: "assistant",
          content: assistantReply,
        };

        setMessages([...updatedMessages]);
      });
    } catch {
      updatedMessages[updatedMessages.length - 1] = {
        role: "assistant",
        content: "❌ Unable to connect to MadhuAI server.",
      };

      setMessages([...updatedMessages]);
    } finally {
      setLoading(false);
    }
  }

  return {
    input,
    setInput,
    loading,
    sendMessage,
  };
}
