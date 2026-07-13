import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  role: "user" | "assistant";
  content: string;
}

export default function Message({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-start gap-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold shrink-0">
          🤖
        </div>
      )}

      <div
        className={`rounded-2xl px-5 py-4 max-w-3xl shadow-lg ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-900 text-zinc-100 border border-zinc-800"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children }: any) {
              const match = /language-(\w+)/.exec(className || "");

              if (!inline && match) {
                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      borderRadius: 12,
                      fontSize: 15,
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                );
              }

              return (
                <code className="bg-black/40 px-2 py-1 rounded">
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-lg font-bold shrink-0">
          👤
        </div>
      )}
    </div>
  );
}
