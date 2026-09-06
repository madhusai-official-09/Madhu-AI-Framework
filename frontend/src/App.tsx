import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import ChatView from "./components/chat/ChatView";
import OGLBackground from "./components/backgrounds/OGLBackground";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { useUIStore } from "./store/useUIStore";
import { ping } from "./api/client";
import PublicRoute from "./components/auth/PublicRoute";

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
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicRoute/>}>
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
