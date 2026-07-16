import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function ScrollToBottom({
  visible,
  onClick,
}: {
  visible: boolean
  onClick: () => void
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: 0.18 }}
          onClick={onClick}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-foreground shadow-lg hover:bg-secondary transition"
          data-testid="scroll-to-bottom-btn"
        >
          <ChevronDown className="size-3.5" />
          Scroll to bottom
        </motion.button>
      )}
    </AnimatePresence>
  )
}


