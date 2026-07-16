
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useUIStore } from '../../store/useUIStore'

export default function AppShell({ children }: { children: ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const setSidebar = useUIStore((s) => s.setSidebar)

  return (
    <div className="relative z-10">
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-sidebar/95 backdrop-blur-xl"
            data-testid="sidebar"
          >
            <Sidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
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

      <div className={sidebarOpen ? 'md:pl-72 transition-[padding] duration-300' : 'md:pl-0 transition-[padding] duration-300'}>
        <Navbar />
        <main className="pt-14 min-h-screen">{children}</main>
      </div>
    </div>
  )
}


