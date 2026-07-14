import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-white/10
                 bg-[#0F172A]/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-6 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl
                          bg-linear-to-r from-purple-600 to-cyan-500 shadow-lg">

            <Bot size={28} className="text-white" />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              MadhuAI
            </h1>

            <p className="text-sm text-gray-400">
              Powered by Groq
            </p>

          </div>

        </div>

        <div
          className="flex items-center gap-2 rounded-full
                     border border-green-500/30
                     bg-green-500/10
                     px-4 py-2"
        >
          <Sparkles
            size={16}
            className="text-green-400"
          />

          <span className="text-sm text-green-300">
            Online
          </span>

        </div>

      </div>
    </motion.header>
  );
}