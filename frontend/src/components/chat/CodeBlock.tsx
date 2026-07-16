import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

interface Props {
  language: string;
  children: string;
}

export default function CodeBlock({ language, children }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-white/60">
        <span>{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded px-2 py-0.5 hover:bg-white/10 text-white/80"
          data-testid="code-copy-btn"
        >
          {copied ? (
            <Check className="size-3" />
          ) : (
            <Copy className="size-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "14px 16px",
          background: "#1e1e1e",
          fontSize: 13,
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
          lineHeight: 1.6,
        }}
        wrapLongLines
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}


