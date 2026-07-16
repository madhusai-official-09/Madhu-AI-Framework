import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import HeroWelcome from './HeroWelcome'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import ScrollToBottom from './ScrollToBottom'
import { useChatStore } from '../../store/useChatStore'
import { useChat } from '../../hooks/useChat'

export default function ChatView() {
  const active = useChatStore((s) => s.conversations.find((c) => c.id === s.activeId) || null)
  const { send, stop, regenerate, isStreaming } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [autoStick, setAutoStick] = useState(true)

  const messages = active?.messages ?? []

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight
      setShowScrollBtn(distance > 240)
      setAutoStick(distance < 80)
    }
    el.addEventListener('scroll', onScroll)
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [active?.id])

  useEffect(() => {
    if (!autoStick) return
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, autoStick])

  const scrollToBottom = () => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    setAutoStick(true)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scroll-smooth pb-40"
        data-testid="chat-scroll"
      >
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-16 sm:pt-24"
            >
              <HeroWelcome onPick={(p) => send(p)} />
            </motion.div>
          ) : (
            <div className="pt-8">
              <MessageList messages={messages} onRegenerate={regenerate} isStreaming={isStreaming} />
            </div>
          )}
        </div>
      </div>

      <ScrollToBottom visible={showScrollBtn} onClick={scrollToBottom} />

      <div
        className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none"
        style={{ paddingLeft: 'var(--pl, 0px)' }}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background via-background/70 to-transparent" />
        <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 pb-4 sm:pb-6 pointer-events-auto">
          <ChatInput onSend={send} onStop={stop} isStreaming={isStreaming} />
        </div>
      </div>
    </div>
  )
}


