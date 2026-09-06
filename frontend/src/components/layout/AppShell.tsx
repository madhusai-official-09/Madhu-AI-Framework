import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AeroShards from "../backgrounds/AeroShards";
import { useUIStore } from "../../store/useUIStore";

export default function AppShell({ children }: { children: ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebar = useUIStore((s) => s.setSidebar);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AeroShards
        backgroundColor="#08070D"
        shardColor="#896ABD"
        accentColor="#A855F7"
        placement="full"
        flow="stream"
        material="chrome"
        detail="fine"
        effect="none"
        scale={1}
        spread={1}
        depth={1}
        speed={0.35}
        spin={1}
        interaction="repel"
        density={0.7}
        shardSize={0.8}
        stretch={1.2}
        turbulence={0.7}
        glow={0.45}
        bloom={0.25}
        grain={0.05}
        chromaticAberration={0.08}
        className="pointer-events-none fixed inset-0 z-0"
      />

      <div className="relative z-10">
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-sidebar/95 backdrop-blur-xl"
              data-testid="sidebar"
            >
              <Sidebar />
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setSidebar(false)}
              data-testid="sidebar-backdrop"
            />
          )}
        </AnimatePresence>

        <div
          className={
            sidebarOpen
              ? "md:pl-72 transition-[padding] duration-300"
              : "md:pl-0 transition-[padding] duration-300"
          }
        >
          <Navbar />
          <main className="pt-14 min-h-screen">{children}</main>
        </div>
      </div>
    </div>
  );
}
