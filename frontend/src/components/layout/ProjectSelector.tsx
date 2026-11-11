import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, FolderOpen, Plus } from "lucide-react";
import { createProject, getProjects, type Project } from "../../api/client";
import { useUIStore } from "../../store/useUIStore";
import { useAuth } from "../../context/AuthContext";

export default function ProjectSelector() {
  const { user } = useAuth();

  const activeProjectId = useUIStore((s) => s.activeProjectId);
  const setActiveProjectId = useUIStore((s) => s.setActiveProjectId);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const loadProjects = async () => {
    try {
      setError(null);
      setLoading(true);

      const data = await getProjects();
      setProjects(data);

      const valid = data.some((p) => p.id === activeProjectId);

      if (!valid) {
        setActiveProjectId(data[0]?.id ?? null);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setActiveProjectId(null);
      return;
    }
    loadProjects();
  }, [user?.uid]);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleCreate = async () => {
    const name = window.prompt("Project name:");
    if (!name?.trim()) return;

    try {
      setCreating(true);
      setError(null);

      const project = await createProject(name.trim());

      setProjects((prev) => [...prev, project]);
      setActiveProjectId(project.id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!activeProject?.widget_key) return;

    try {
      await navigator.clipboard.writeText(activeProject.widget_key);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Unable to copy widget key.");
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Projects"
        className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.04] px-2.5 text-xs font-medium text-white/80 transition hover:bg-white/[0.09] sm:px-3"
      >
        <FolderOpen className="size-4 shrink-0" />

        <span className="hidden max-w-28 truncate sm:block">
          {loading ? "Loading..." : (activeProject?.name ?? "No project")}
        </span>

        <ChevronDown
          className={`hidden size-3.5 shrink-0 transition sm:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-white/[0.10] bg-black/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="mb-2 text-[10px] uppercase tracking-wider text-white/35">
            Projects
          </div>

          <div className="max-h-48 space-y-1 overflow-y-auto">
            {projects.length === 0 ? (
              <div className="px-2 py-3 text-xs text-white/40">
                {loading ? "Loading..." : "No projects yet"}
              </div>
            ) : (
              projects.map((project) => {
                const active = project.id === activeProjectId;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      setActiveProjectId(project.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className="truncate">{project.name}</span>
                    {active && (
                      <Check className="size-3.5 shrink-0 text-emerald-400" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/[0.09] disabled:opacity-50"
          >
            <Plus className="size-3.5" />
            {creating ? "Creating..." : "New project"}
          </button>

          {activeProject?.widget_key && (
            <div className="mt-3 border-t border-white/[0.08] pt-3">
              <div className="mb-1.5 text-[10px] uppercase tracking-wider text-white/35">
                Widget key
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-2">
                <code className="min-w-0 flex-1 truncate text-[11px] text-white/70">
                  {activeProject.widget_key}
                </code>

                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy widget key"
                  className="shrink-0 rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-2 text-[11px] text-red-400">{error}</div>
          )}
        </div>
      )}
    </div>
  );
}