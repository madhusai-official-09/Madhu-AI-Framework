import Message from './Message'
import type { ChatMessage } from '../../types'

interface Props {
  messages: ChatMessage[]
  onRegenerate: () => void
  isStreaming: boolean
}

export default function MessageList({ messages, onRegenerate, isStreaming }: Props) {
  return (
    <div className="flex flex-col divide-y divide-border/40" data-testid="message-list">
      {messages.map((m, i) => {
        const isLastAssistant =
          m.role === 'assistant' && i === messages.length - 1 && !isStreaming
        return (
          <Message
            key={m.id}
            message={m}
            canRegenerate={isLastAssistant}
            onRegenerate={onRegenerate}
          />
        )
      })}
    </div>
  )
}


