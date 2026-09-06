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
    <div className="group my-4 overflow-hidden rounded-2xl border border-white/[0.09] bg-black/45 shadow-2xl shadow-black/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.035] px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-white/45">
            {language || "code"}
          </span>
        </div>

        <button
          onClick={copy}
          className="
            flex items-center gap-1.5 rounded-lg
            border border-white/[0.07]
            bg-white/[0.035]
            px-2.5 py-1
            text-[11px] text-white/50
            transition-all duration-200
            hover:border-white/[0.14]
            hover:bg-white/[0.08]
            hover:text-white/90
          "
          data-testid="code-copy-btn"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}

          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "transparent",
            fontSize: 13,
            fontFamily:
              "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
            lineHeight: 1.65,
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
            },
          }}
          wrapLongLines
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
