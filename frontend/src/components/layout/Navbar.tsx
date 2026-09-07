import { signOut } from "firebase/auth";
import {
  Cpu,
  Github,
  Menu,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Database,
  LogOut,
  User,
} from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { cn } from "../../utils/format";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../api/firebase";
import { useState } from "react";
import GlassSurface from "../ui/GlassSurface";
import Magnet from "../ui/Magnet";

const GITHUB_URL =
  "https://github.com/madhusai-official-09/Madhu-AI-Framework.git";

export default function Navbar() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const toggleKnowledge = useUIStore((s) => s.toggleKnowledge);
  const connection = useUIStore((s) => s.connection);

  const { user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut(auth);
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 h-14 border-b border-white/0.06"
      data-testid="navbar"
    >
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={0}
        borderWidth={0.04}
        brightness={35}
        opacity={0.9}
        blur={10}
        displace={0.15}
        backgroundOpacity={0.08}
        saturation={1.15}
        distortionScale={-80}
        redOffset={0}
        greenOffset={6}
        blueOffset={12}
        mixBlendMode="normal"
        className="pointer-events-none border-b border-white/10"
        style={{
          position: "absolute",
          inset: 0,
        }}
      />

      <div className="relative z-10 flex h-full items-center justify-between px-3 sm:px-4">
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
            <div
              className="
    flex size-7 items-center justify-center
    rounded-lg
    border border-white/15
    bg-white/[0.07]
    text-foreground
    shadow-sm
    backdrop-blur-md
  "
            >
              <Cpu className="size-4" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                MadhuAI
                <span className="ml-1 text-muted-foreground/60 font-normal">
                  X_X
                </span>
              </div>
              <div className="hidden sm:block text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                Premium AI Workspace
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ConnectionPill status={connection} />

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
            className="rounded-xl border border-transparent p-2 text-muted-foreground transition-all duration-200 hover:border-white/0.08 hover:bg-white/0.06 hover:text-foreground"
            aria-label="GitHub repository"
            data-testid="github-link"
          >
            <Github
              className="
    h-5 w-5
    rounded-xl
    border border-transparent
    p-0
    text-muted-foreground
    transition-all duration-200
    hover:border-white/10
    hover:bg-white/5
    hover:text-foreground
  "
            />
          </a>
          <div className="relative ml-1">
            <Magnet
              padding={35}
              magnetStrength={8}
              activeTransition="transform 0.25s ease-out"
              inactiveTransition="transform 0.4s ease-in-out"
            >
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="
  flex items-center gap-2 rounded-full
  border border-white/[0.10]
  bg-white/[0.045]
  px-1.5 py-1
  shadow-sm
  backdrop-blur-xl
  transition-all duration-200
  hover:border-white/[0.16]
  hover:bg-white/[0.08]
"
                aria-label="Account menu"
              >
                <div className="flex size-7 items-center justify-center rounded-full border border-white/10 bg-white text-black shadow-sm">
                  <User className="size-3.5" />
                </div>

                <span className="hidden max-w-[140px] truncate pr-1 text-xs font-medium sm:block">
                  {user?.displayName || user?.email || "Account"}
                </span>
              </button>
            </Magnet>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="
  absolute right-0 top-11 z-50 w-64
  overflow-hidden rounded-2xl
  border border-white/[0.10]
  bg-black/60
  p-1.5
  shadow-2xl shadow-black/30
  backdrop-blur-2xl
"
                >
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-medium">
                      {user?.displayName || "Madhu AI User"}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>

                  <div className="my-1 h-px bg-border/60" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="
            flex w-full items-center gap-2
            rounded-lg px-3 py-2
            text-xs font-medium
            text-muted-foreground
            transition-colors
            hover:bg-destructive/10
            hover:text-destructive
          "
                  >
                    <LogOut className="size-3.5" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
