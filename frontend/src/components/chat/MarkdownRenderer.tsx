import { lazy, Suspense, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const CodeBlock = lazy(() => import('./CodeBlock'))

interface Props {
  content: string
  streaming?: boolean
}

function MarkdownRendererInner({ content, streaming }: Props) {
  return (
    <div className={'prose-chat' + (streaming ? ' streaming-cursor' : '')}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { className, children, ...rest } = props as {
              className?: string
              children?: React.ReactNode
              inline?: boolean
            }
            const match = /language-(\w+)/.exec(className || '')
            const inline = !match && !String(children ?? '').includes('\n')
            if (inline) {
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              )
            }
            return (
              <Suspense
                fallback={
                  <pre className="rounded-xl border border-border bg-[#1e1e1e] p-4 text-xs text-white/60">
                    {String(children).replace(/\n$/, '')}
                  </pre>
                }
              >
                <CodeBlock language={match?.[1] || 'text'}>
                  {String(children).replace(/\n$/, '')}
                </CodeBlock>
              </Suspense>
            )
          },
          a(props) {
            return <a {...props} target="_blank" rel="noreferrer noopener" />
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default memo(MarkdownRendererInner)


