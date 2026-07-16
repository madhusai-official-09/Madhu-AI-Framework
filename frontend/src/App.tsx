import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import AppShell from "./components/layout/AppShell";
import ChatView from "./components/chat/ChatView";
import OGLBackground from "./components/backgrounds/OGLBackground";
import { useUIStore } from "./store/useUIStore";
import { ping } from "./api/client";

const SettingsDialog = lazy(
  () => import("./components/settings/SettingsDialog"),
);
const KnowledgePanel = lazy(
  () => import("./components/knowledge/KnowledgePanel"),
);

export default function App() {
  const theme = useUIStore((s) => s.theme);
  const setConnection = useUIStore((s) => s.setConnection);
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const knowledgeOpen = useUIStore((s) => s.knowledgeOpen);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      setConnection("checking");
      const ok = await ping();
      if (!mounted) return;
      setConnection(ok ? "online" : "offline");
    };
    check();
    const t = setInterval(check, 30_000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [setConnection]);

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans">
      <OGLBackground />
      <AppShell>
        <ChatView />
      </AppShell>

      <AnimatePresence>
        {settingsOpen && (
          <Suspense fallback={null}>
            <SettingsDialog />
          </Suspense>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {knowledgeOpen && (
          <Suspense fallback={null}>
            <KnowledgePanel />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}


