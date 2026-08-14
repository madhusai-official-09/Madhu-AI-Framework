import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Cpu,
  Github,
  Menu,
  Moon,
  Settings,
  Sun,
  Wifi,
  WifiOff,
  Database,
} from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import {
  useSettingsStore,
  AVAILABLE_MODELS,
} from "../../store/useSettingsStore";
import { cn } from "../../utils/format";

const GITHUB_URL =
  "https://github.com/madhusai-official-09/Madhu-AI-Framework.git";

export default function Navbar() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const toggleSettings = useUIStore((s) => s.toggleSettings);
  const toggleKnowledge = useUIStore((s) => s.toggleKnowledge);
  const connection = useUIStore((s) => s.connection);
  const model = useSettingsStore((s) => s.model);
  const setModel = useSettingsStore((s) => s.set);

  const [modelOpen, setModelOpen] = useState(false);
  const activeModel =
    AVAILABLE_MODELS.find((m) => m.id === model) || AVAILABLE_MODELS[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-model-menu]")) setModelOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <header
      className="fixed top-0 right-0 left-0 md:left-0 z-30 h-14 border-b border-border/60 glass"
      data-testid="navbar"
    >
      <div className="flex h-full items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Toggle sidebar"
            data-testid="toggle-sidebar-btn"
          >
            <Menu className="size-4" />
          </button>
          <div className="flex items-center gap-2 pl-1">
            <div className="flex size-7 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white shadow-md">
              <Cpu className="size-4" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                MadhuAI{" "}
                <span className="text-muted-foreground font-normal">X_X</span>
              </div>
              <div className="hidden sm:block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Premium AI Workspace
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ConnectionPill status={connection} />

          <div className="relative" data-model-menu>
            <button
              onClick={() => setModelOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"
              data-testid="model-selector-btn"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_theme(colors.emerald.400)]" />
              <span className="hidden sm:inline">{activeModel.name}</span>
              <span className="sm:hidden">Model</span>
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  modelOpen && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence>
              {modelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-popover/95 glass-strong p-1.5 shadow-2xl"
                  data-testid="model-selector-menu"
                >
                  <div className="px-2.5 pt-1.5 pb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Choose model
                  </div>
                  {AVAILABLE_MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setModel("model", m.id);
                        setModelOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-secondary transition-colors",
                        m.id === model && "bg-secondary",
                      )}
                      data-testid={`model-option-${m.id}`}
                    >
                      <div className="mt-0.5 size-1.5 rounded-full bg-linear-to-br from-indigo-400 to-cyan-400" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">
                          {m.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {m.tag}
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="mx-2 mt-1.5 border-t border-border pt-2 pb-1 text-[10px] text-muted-foreground">
                    UI-only · backend uses server default
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <IconLink
            onClick={toggleKnowledge}
            label="Knowledge base"
            testid="open-knowledge-btn"
          >
            <Database className="size-4" />
          </IconLink>
          <IconLink
            onClick={toggleTheme}
            label="Toggle theme"
            testid="theme-toggle-btn"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </IconLink>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="GitHub repository"
            data-testid="github-link"
          >
            <Github className="size-4" />
          </a>
          <IconLink
            onClick={toggleSettings}
            label="Settings"
            testid="open-settings-btn"
          >
            <Settings className="size-4" />
          </IconLink>
        </div>
      </div>
    </header>
  );
}

function IconLink({
  children,
  onClick,
  label,
  testid,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  testid: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      data-testid={testid}
      className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );
}

function ConnectionPill({
  status,
}: {
  status: "online" | "offline" | "checking";
}) {
  const map = {
    online: {
      icon: <Wifi className="size-3" />,
      label: "Connected",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      dot: "bg-emerald-500 shadow-[0_0_8px_theme(colors.emerald.500)]",
    },
    offline: {
      icon: <WifiOff className="size-3" />,
      label: "Offline",
      color: "text-red-400 bg-red-500/10 border-red-500/20",
      dot: "bg-red-500",
    },
    checking: {
      icon: <Wifi className="size-3" />,
      label: "Connecting…",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-500 animate-pulse",
    },
  }[status];
  return (
    <div
      className={cn(
        "hidden sm:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        map.color,
      )}
      data-testid={`connection-${status}`}
    >
      <span className={cn("size-1.5 rounded-full", map.dot)} />
      {map.icon}
      <span>{map.label}</span>
    </div>
  );
}
