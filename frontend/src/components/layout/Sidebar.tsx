import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { cn, relativeTime } from "../../utils/format";
import { useUIStore } from "../../store/useUIStore";

export default function Sidebar() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const setActive = useChatStore((s) => s.setActive);
  const createConversation = useChatStore((s) => s.createConversation);
  const deleteConversation = useChatStore((s) => s.deleteConversation);
  const renameConversation = useChatStore((s) => s.renameConversation);
  const searchQuery = useChatStore((s) => s.searchQuery);
  const setSearchQuery = useChatStore((s) => s.setSearchQuery);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q)),
    );
  }, [conversations, searchQuery]);

  const startRename = (id: string, current: string) => {
    setRenamingId(id);
    setRenameValue(current);
  };
  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      renameConversation(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };
  const setSidebar = useUIStore((s) => s.setSidebar);

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex h-14 items-center gap-2 border-b border-white/[0.06] px-3">
        <div className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-white shadow-sm backdrop-blur-md">
          <MessageSquare className="size-4" />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="text-sm font-semibold truncate">Conversations</div>
          <div className="text-[11px] text-muted-foreground">
            {conversations.length} chat{conversations.length === 1 ? "" : "s"}
          </div>
          <button
            type="button"
            onClick={() => setSidebar(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-transparent p-1.5 text-muted-foreground transition-all hover:border-white/[0.08] hover:bg-white/[0.06] hover:text-foreground"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <button
          onClick={() => createConversation()}
          className="group flex w-full items-center justify-start gap-2 rounded-xl border border-white/[0.09] bg-white/[0.045] px-3 py-2.5 text-sm font-medium shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.08]"
        >
          <Plus className="size-4" />
          New chat
          <span className="ml-auto text-[10px] tracking-[0.12em] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            Create
          </span>
        </button>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-lg border border-border bg-background/60 pl-8 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
            data-testid="search-conversations-input"
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-2 pb-4"
        data-testid="conversations-list"
      >
        {filtered.length === 0 ? (
          <div className="mx-3 my-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-xs text-muted-foreground/70">
            {conversations.length === 0
              ? "Your conversations will appear here."
              : "No matches for your search."}
          </div>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((c) => {
              const isActive = c.id === activeId;
              const isRenaming = renamingId === c.id;
              return (
                <li key={c.id}>
                  <motion.div
                    layout
                    className={cn(
                      "group relative flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-sm transition-all duration-200",
                      isActive
                        ? "border-white/[0.10] bg-white/[0.08] text-foreground shadow-sm"
                        : "border-transparent text-muted-foreground hover:border-white/[0.06] hover:bg-white/[0.045] hover:text-foreground",
                    )}
                    onClick={() => !isRenaming && setActive(c.id)}
                    data-testid={`conversation-item-${c.id}`}
                  >
                    <MessageSquare className="size-3.5 shrink-0 opacity-70" />
                    {isRenaming ? (
                      <>
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename();
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none"
                          data-testid={`conversation-rename-input-${c.id}`}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            commitRename();
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                          data-testid={`conversation-rename-confirm-${c.id}`}
                        >
                          <Check className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenamingId(null);
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                          data-testid={`conversation-rename-cancel-${c.id}`}
                        >
                          <X className="size-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="min-w-0 flex-1">
                          <div className="truncate">
                            {c.title || "Untitled"}
                          </div>
                          <div className="text-[10px] text-muted-foreground/80">
                            {relativeTime(c.updatedAt)}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(c.id, c.title);
                            }}
                            className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                            aria-label="Rename"
                            data-testid={`conversation-rename-btn-${c.id}`}
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Delete this conversation?"))
                                deleteConversation(c.id);
                            }}
                            className="rounded p-1 text-muted-foreground hover:bg-background hover:text-red-400"
                            aria-label="Delete"
                            data-testid={`conversation-delete-btn-${c.id}`}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-white/[0.06] p-3">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2.5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
            Local · your chats stay in this browser
          </div>
        </div>
      </div>
    </div>
  );
}
