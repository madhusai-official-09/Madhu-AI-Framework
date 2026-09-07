import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import ChatView from "./components/chat/ChatView";
import OGLBackground from "./components/backgrounds/OGLBackground";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

import { useUIStore } from "./store/useUIStore";
import { ping, getHistory } from "./api/client";
import { useAuth } from "./context/AuthContext";
import { useChatStore } from "./store/useChatStore";

const KnowledgePanel = lazy(
  () => import("./components/knowledge/KnowledgePanel"),
);

function MainApp() {
  const theme = useUIStore((s) => s.theme);
  const setConnection = useUIStore((s) => s.setConnection);
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
        {knowledgeOpen && (
          <Suspense fallback={null}>
            <KnowledgePanel />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  const hydrateFromHistory = useChatStore(
    (s) => s.hydrateFromHistory,
  );

  const clearAll = useChatStore((s) => s.clearAll);

  useEffect(() => {
    if (loading) return;

    // No Firebase user → clear chat from memory
    if (!user) {
      clearAll();
      return;
    }

    // Firebase user exists → load that user's backend history
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const history = await getHistory();

        if (cancelled) return;

        hydrateFromHistory(history);

      } catch (error) {
        console.error("Failed to load chat history:", error);

        if (!cancelled) {
          clearAll();
        }
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [user?.uid, loading, hydrateFromHistory, clearAll]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainApp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
