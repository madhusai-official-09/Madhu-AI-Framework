import { useEffect, useState } from "react";
import { createProject, getProjects, type Project } from "../../api/client";
import { useUIStore } from "../../store/useUIStore";

export default function ProjectSelector() {
  const activeProjectId = useUIStore((s) => s.activeProjectId);
  const setActiveProjectId = useUIStore((s) => s.setActiveProjectId);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex items-center gap-2">
      <select
        value={activeProjectId ?? ""}
        onChange={(e) => setActiveProjectId(e.target.value || null)}
        disabled={loading || projects.length === 0}
        className="max-w-48 rounded-lg border border-white/[0.10] bg-white/[0.05] px-3 py-1.5 text-xs text-foreground outline-none backdrop-blur-xl"
        aria-label="Active project"
      >
        {projects.length === 0 ? (
          <option value="">
            {loading ? "Loading projects..." : "No projects"}
          </option>
        ) : (
          projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))
        )}
      </select>

      <button
        type="button"
        onClick={handleCreate}
        disabled={creating}
        className="rounded-lg border border-white/[0.10] bg-white/[0.05] px-2.5 py-1.5 text-xs font-medium transition hover:bg-white/[0.10] disabled:opacity-50"
      >
        {creating ? "..." : "+ Project"}
      </button>

      {error && (
        <span className="hidden max-w-40 truncate text-[10px] text-red-400 sm:block">
          {error}
        </span>
      )}
    </div>
  );
}
