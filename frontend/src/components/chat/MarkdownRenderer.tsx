import { lazy, Suspense, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CodeBlock = lazy(() => import("./CodeBlock"));

interface Props {
  content: string;
  streaming?: boolean;
}

function MarkdownRendererInner({ content, streaming }: Props) {
  return (
    <div className={`prose-chat${streaming ? " streaming-cursor" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { className, children, ...rest } = props as {
              className?: string;
              children?: React.ReactNode;
              inline?: boolean;
            };

            const match = /language-(\w+)/.exec(className || "");
            const text = String(children ?? "");
            const inline = !match && !text.includes("\n");

            if (inline) {
              return (
                <code
                  className="rounded-md border border-white/10 bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.9em] text-white/85"
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            return (
              <Suspense
                fallback={
                  <pre className="my-4 overflow-x-auto rounded-2xl border border-white/[0.09] bg-black/40 p-4 font-mono text-xs leading-6 text-white/50">
                    {text.replace(/\n$/, "")}
                  </pre>
                }
              >
                <CodeBlock language={match?.[1] || "text"}>
                  {text.replace(/\n$/, "")}
                </CodeBlock>
              </Suspense>
            );
          },

          a(props) {
            return (
              <a
                {...props}
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/85 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
              />
            );
          },

          hr() {
            return <hr className="my-6 border-white/[0.08]" />;
          },

          blockquote(props) {
            return (
              <blockquote
                {...props}
                className="my-4 border-l-2 border-white/20 pl-4 text-white/55"
              />
            );
          },

          table(props) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-white/[0.08]">
                <table {...props} className="w-full border-collapse text-sm" />
              </div>
            );
          },

          th(props) {
            return (
              <th
                {...props}
                className="border-b border-white/[0.08] bg-white/[0.04] px-3 py-2 text-left font-medium text-white/80"
              />
            );
          },

          td(props) {
            return (
              <td
                {...props}
                className="border-b border-white/[0.05] px-3 py-2 text-white/65"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default memo(MarkdownRendererInner);
