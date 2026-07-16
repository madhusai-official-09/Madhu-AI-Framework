import { Sparkles, Code2, BookOpen, Lightbulb, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

const PROMPTS = [
  {
    icon: <Sparkles className="size-4" />,
    title: 'Draft a launch tweet',
    hint: 'for a minimalist AI note-taking app.',
    prompt: 'Draft a punchy launch tweet for a minimalist AI note-taking app. Keep it under 240 characters and include one strong hook.',
  },
  {
    icon: <Code2 className="size-4" />,
    title: 'Explain a code snippet',
    hint: 'walk me through async generators in TS.',
    prompt: 'Explain how async generators work in TypeScript with a small example and when to prefer them over Promises.',
  },
  {
    icon: <BookOpen className="size-4" />,
    title: 'Summarize my docs',
    hint: 'from the uploaded knowledge base.',
    prompt: 'Give me a concise, bullet-point summary of the documents I have uploaded to the knowledge base.',
  },
  {
    icon: <Lightbulb className="size-4" />,
    title: 'Brainstorm ideas',
    hint: 'weekend project using RAG.',
    prompt: 'Brainstorm five weekend project ideas that use retrieval-augmented generation. Rank them by impact vs effort.',
  },
]

export default function HeroWelcome({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20"
      >
        <Sparkles className="size-6" />
      </motion.div>

      <h1
        className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight"
        data-testid="hero-title"
      >
        How can I help you{' '}
        <span className="bg-linear-to-r from-indigo-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
          today?
        </span>
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Ask anything. Upload docs. Stream answers. Powered by Groq + RAG on your private knowledge base.
      </p>

      <div className="mx-auto mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-2xl">
        {PROMPTS.map((p, i) => (
          <motion.button
            key={p.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            onClick={() => onPick(p.prompt)}
            className="group relative overflow-hidden rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 p-4 text-left transition-all hover:-translate-y-0.5"
            data-testid={`suggested-prompt-${i}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-background/60 border border-border text-foreground">
                {p.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{p.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{p.hint}</div>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}


