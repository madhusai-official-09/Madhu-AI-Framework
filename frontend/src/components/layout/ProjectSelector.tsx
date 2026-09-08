import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { createProject, getProjects, type Project } from "../../api/client";
import { useUIStore } from "../../store/useUIStore";

export default function ProjectSelector() {
  const activeProjectId = useUIStore((s) => s.activeProjectId);
  const setActiveProjectId = useUIStore((s) => s.setActiveProjectId);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeProject = projects.find(
    (project) => project.id === activeProjectId,
  );

  const loadProjects = async () => {
    try {
      setError(null);

      const data = await getProjects();

      setProjects(data);

      if (!activeProjectId && data.length > 0) {
        setActiveProjectId(data[0].id);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

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

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setError("Unable to copy widget key.");
    }
  };

  return (
    <div className="sticky top-0 z-50 flex items-center gap-2 rounded-2xl border border-white/[0.10] bg-black/80 p-1.5 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5">
        <span className="text-[10px] uppercase tracking-wider text-white/35">
          Project
        </span>

        <select
          value={activeProjectId ?? ""}
          onChange={(e) => setActiveProjectId(e.target.value || null)}
          disabled={loading || projects.length === 0}
          className="max-w-40 bg-transparent text-xs font-medium text-white outline-none"
          aria-label="Active project"
        >
          {projects.length === 0 ? (
            <option value="">{loading ? "Loading..." : "No projects"}</option>
          ) : (
            projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
                className="bg-black text-white"
              >
                {project.name}
              </option>
            ))
          )}
        </select>
      </div>

      <button
        type="button"
        onClick={handleCreate}
        disabled={creating}
        className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/[0.09] disabled:opacity-50"
      >
        {creating ? "..." : "+ Project"}
      </button>

      {activeProject?.widget_key && (
        <div className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 lg:flex">
          <div className="flex flex-col leading-none">
            <span className="text-[9px] uppercase tracking-wider text-white/30">
              Widget Key
            </span>

            <code className="mt-1 max-w-48 truncate text-[10px] text-white/70">
              {activeProject.widget_key}
            </code>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-white/50 transition hover:bg-white/[0.10] hover:text-white"
            aria-label="Copy widget key"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>
      )}

      {error && (
        <span className="hidden max-w-40 truncate text-[10px] text-red-400 sm:block">
          {error}
        </span>
      )}
    </div>
  );
}
