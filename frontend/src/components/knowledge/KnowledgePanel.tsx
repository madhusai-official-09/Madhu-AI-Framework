import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  FileText,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { deleteKnowledge, listKnowledge, uploadFile } from "../../api/client";
import { useUIStore } from "../../store/useUIStore";
import type { KnowledgeDoc } from "../../types";
import { cn, formatBytes } from "../../utils/format";

export default function KnowledgePanel() {
  const setKnowledge = useUIStore((s) => s.setKnowledge);
  const projectId = useUIStore((s) => s.activeProjectId);
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!projectId) {
      setDocs([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const list = await listKnowledge(projectId);
      setDocs(list);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (filename: string) => {
    if (!projectId) {
      setError("No active project selected.");
      return;
    }
    if (!confirm(`Delete "${filename}" from the knowledge base?`)) return;
    try {
      await deleteKnowledge(filename, projectId);
      setDocs((prev) => prev.filter((d) => d.filename !== filename));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (!projectId) {
      setError("No active project selected.");
      return;
    }

    setSuccess(null);

    for (const file of Array.from(files)) {
      const key = file.name + file.size;
      setUploads((p) => ({ ...p, [key]: 0 }));
      try {
        await uploadFile(file, projectId, (p) =>
          setUploads((u) => ({ ...u, [key]: p })),
        );
        setUploads((p) => {
          const c = { ...p };
          delete c[key];
          return c;
        });
        await load();
        setSuccess(`${file.name} uploaded and indexed successfully.`);
      } catch (e) {
        setError((e as Error).message);
        setUploads((p) => {
          const c = { ...p };
          delete c[key];
          return c;
        });
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setKnowledge(false)}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        data-testid="knowledge-backdrop"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 240 }}
        className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-border bg-background/95 glass-strong shadow-2xl"
        data-testid="knowledge-panel"
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white">
              <Database className="size-4" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Knowledge base</div>
              <div className="text-[11px] text-muted-foreground">
                {docs.length} document{docs.length === 1 ? "" : "s"} indexed
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={load}
              className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Refresh"
              data-testid="knowledge-refresh-btn"
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            </button>
            <button
              onClick={() => setKnowledge(false)}
              className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Close"
              data-testid="knowledge-close-btn"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.length)
                handleFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-8 transition-colors",
              dragOver
                ? "border-indigo-400/60 bg-secondary/40"
                : "border-border bg-secondary/20 hover:border-indigo-400/40 hover:bg-secondary/30",
            )}
            data-testid="knowledge-dropzone"
          >
            <UploadCloud className="size-6 text-muted-foreground" />
            <div className="text-sm font-medium">
              Drop files or click to upload
            </div>
            <div className="text-[11px] text-muted-foreground">
              PDF · TXT · Markdown · DOCX
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.txt,.md,.docx"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              data-testid="knowledge-file-input"
            />
          </div>

          {Object.keys(uploads).length > 0 && (
            <div className="mt-3 space-y-2">
              {Object.entries(uploads).map(([k, p]) => (
                <div
                  key={k}
                  className="rounded-lg border border-border bg-secondary/40 p-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate">{k.replace(/\d+$/, "")}</span>
                    <span className="text-muted-foreground">{p}%</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full bg-linear-to-r from-indigo-500 to-cyan-400 transition-[width]"
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {error && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              <AlertCircle className="size-3.5 mt-0.5" />
              <span className="min-w-0 flex-1">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
              {success}
            </div>
          )}

          {loading && docs.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
              <Loader2 className="mr-2 size-4 animate-spin" /> Loading...
            </div>
          ) : docs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No documents yet. Upload PDFs, markdown, or DOCX to power RAG.
            </div>
          ) : (
            <ul className="space-y-1.5" data-testid="knowledge-list">
              {docs.map((d) => (
                <li
                  key={d.filename}
                  className="group flex items-center gap-2.5 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 hover:bg-secondary/60 transition-colors"
                  data-testid={`knowledge-item-${d.filename}`}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background border border-border text-foreground">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {d.filename}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      {typeof d.size === "number" && (
                        <span>{formatBytes(d.size)}</span>
                      )}
                      {typeof d.chunks === "number" && (
                        <span>· {d.chunks} chunks</span>
                      )}
                      {d.status && (
                        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400 border border-emerald-500/20">
                          {d.status}
                        </span>
                      )}
                      {!d.status && (
                        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400 border border-emerald-500/20">
                          indexed
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(d.filename)}
                    className="rounded-md p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-background hover:text-red-400 transition-all"
                    aria-label={`Delete ${d.filename}`}
                    data-testid={`knowledge-delete-${d.filename}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.aside>
    </>
  );
}
