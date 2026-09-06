import {
  Sparkles,
  Code2,
  BookOpen,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const PROMPTS = [
  {
    icon: Sparkles,
    title: "Write something",
    hint: "A sharp launch tweet for your next idea.",
    prompt:
      "Draft a punchy launch tweet for a minimalist AI note-taking app. Keep it under 240 characters and include one strong hook.",
  },
  {
    icon: Code2,
    title: "Help me understand",
    hint: "Walk me through async generators in TypeScript.",
    prompt:
      "Explain how async generators work in TypeScript with a small example and when to prefer them over Promises.",
  },
  {
    icon: BookOpen,
    title: "Make sense of my docs",
    hint: "Pull out the important points from my knowledge base.",
    prompt:
      "Give me a concise, bullet-point summary of the documents I have uploaded to the knowledge base.",
  },
  {
    icon: Lightbulb,
    title: "Let's brainstorm",
    hint: "Find a weekend project worth building.",
    prompt:
      "Brainstorm five weekend project ideas that use retrieval-augmented generation. Rank them by impact vs effort.",
  },
];

export default function HeroWelcome({
  onPick,
}: {
  onPick: (prompt: string) => void;
}) {
  return (
    <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-10 sm:py-16">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/[0.08] blur-[100px]"
      />

      {/* Status */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-white/60 shadow-lg shadow-black/10 backdrop-blur-xl"
      >
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
        </span>
        Ready when you are
      </motion.div>

      {/* Main heading */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="text-center"
      >
        <h1
          data-testid="hero-title"
          className="text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl md:text-[3.75rem]"
        >
          What can I help you
          <br />
          <span className="bg-gradient-to-r from-white via-white/80 to-white/45 bg-clip-text text-transparent">
            with today?
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-6 text-white/45 sm:text-base">
          Ask anything, explore an idea, understand a topic, or build something
          together.
        </p>
      </motion.div>

      {/* Prompt cards */}
      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {PROMPTS.map((prompt, index) => {
          const Icon = prompt.icon;

          return (
            <motion.button
              key={prompt.title}
              type="button"
              onClick={() => onPick(prompt.prompt)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.12 + index * 0.07,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -3,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.985 }}
              className="
                group relative overflow-hidden rounded-2xl
                border border-white/[0.09]
                bg-white/[0.035]
                p-4 text-left
                shadow-xl shadow-black/10
                backdrop-blur-xl
                transition-all duration-300
                hover:border-white/[0.16]
                hover:bg-white/[0.065]
                hover:shadow-2xl hover:shadow-purple-950/20
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white/20
              "
              data-testid={`suggested-prompt-${index}`}
            >
              {/* Hover light */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none absolute
                  -right-16 -top-16 size-36
                  rounded-full bg-purple-500/[0.12]
                  blur-3xl opacity-0
                  transition-opacity duration-500
                  group-hover:opacity-100
                "
              />

              {/* Subtle shine */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none absolute inset-0
                  bg-gradient-to-br from-white/[0.05] via-transparent to-transparent
                  opacity-0 transition-opacity duration-300
                  group-hover:opacity-100
                "
              />

              <div className="relative flex items-center gap-3">
                <div
                  className="
                    flex size-10 shrink-0 items-center justify-center
                    rounded-xl
                    border border-white/10
                    bg-white/[0.055]
                    text-white/65
                    shadow-inner
                    transition-all duration-300
                    group-hover:border-white/15
                    group-hover:bg-white/[0.09]
                    group-hover:text-white
                  "
                >
                  <Icon className="size-[17px]" strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium tracking-[-0.01em] text-white/90">
                    {prompt.title}
                  </div>

                  <div className="mt-0.5 truncate text-xs leading-5 text-white/40">
                    {prompt.hint}
                  </div>
                </div>

                <ArrowUpRight
                  className="
                    size-4 shrink-0
                    -translate-x-1 translate-y-1
                    text-white/40
                    opacity-0
                    transition-all duration-300
                    group-hover:translate-x-0
                    group-hover:translate-y-0
                    group-hover:text-white/80
                    group-hover:opacity-100
                  "
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="mt-8 text-center text-[11px] text-white/30"
      >
        or start with your own question
      </motion.p>
    </section>
  );
}
