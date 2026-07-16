import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Paperclip, Send, StopCircle, X, Upload, FileText, Image as ImageIcon } from 'lucide-react'
import { useAutoResize } from '../../hooks/useAutoResize'
import { uploadFile } from '../../api/client'
import { cn, formatBytes } from '../../utils/format'

const UploadOverlay = lazy(() => import('./UploadOverlay'))

interface Props {
  onSend: (msg: string) => void
  onStop: () => void
  isStreaming: boolean
}

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'done' | 'error'
  error?: string
}

export default function ChatInput({ onSend, onStop, isStreaming }: Props) {
  const [text, setText] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const textareaRef = useAutoResize(text)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const submit = () => {
    if (!text.trim() || isStreaming) return
    onSend(text)
    setText('')
    setAttachments([])
  }

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files)
    for (const file of arr) {
      const id = Math.random().toString(36).slice(2)
      const item: Attachment = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading',
      }
      setAttachments((prev) => [...prev, item])
      try {
        await uploadFile(file, (p) =>
          setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, progress: p } : a))),
        )
        setAttachments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, progress: 100, status: 'done' } : a)),
        )
      } catch (err) {
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: 'error', error: (err as Error).message } : a,
          ),
        )
      }
    }
  }

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files: File[] = []
      for (const item of Array.from(e.clipboardData?.items || [])) {
        if (item.kind === 'file') {
          const f = item.getAsFile()
          if (f) files.push(f)
        }
      }
      if (files.length) {
        e.preventDefault()
        handleFiles(files)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [])

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
      }}
      className={cn(
        'relative rounded-2xl border transition-all shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]',
        dragOver
          ? 'border-indigo-400/60 bg-secondary/50'
          : 'border-border bg-background/70 glass-strong',
      )}
      data-testid="chat-input-container"
    >
      <AnimatePresence>
        {dragOver && (
          <Suspense fallback={null}>
            <UploadOverlay />
          </Suspense>
        )}
      </AnimatePresence>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-border/60 px-3 py-2">
          {attachments.map((a) => (
            <div
              key={a.id}
              className="group flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-2.5 py-1.5 text-xs"
              data-testid={`attachment-chip-${a.id}`}
            >
              {a.type.startsWith('image/') ? (
                <ImageIcon className="size-3.5 text-muted-foreground" />
              ) : (
                <FileText className="size-3.5 text-muted-foreground" />
              )}
              <span className="max-w-40 truncate">{a.name}</span>
              <span className="text-[10px] text-muted-foreground">{formatBytes(a.size)}</span>
              {a.status === 'uploading' && (
                <div className="relative h-1 w-16 overflow-hidden rounded-full bg-background">
                  <div
                    className="absolute inset-y-0 left-0 bg-linear-to-r from-indigo-500 to-cyan-400 transition-[width]"
                    style={{ width: `${a.progress}%` }}
                  />
                </div>
              )}
              {a.status === 'done' && (
                <span className="text-emerald-400 text-[10px] font-medium">indexed</span>
              )}
              {a.status === 'error' && (
                <span className="text-red-400 text-[10px]">failed</span>
              )}
              <button
                onClick={() => setAttachments((prev) => prev.filter((x) => x.id !== a.id))}
                className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                aria-label="Remove attachment"
                data-testid={`attachment-remove-${a.id}`}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 px-3 py-2.5">
        <button
          onClick={() => inputFileRef.current?.click()}
          className="mb-1.5 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Attach file"
          data-testid="attach-file-btn"
        >
          <Paperclip className="size-4" />
        </button>
        <input
          ref={inputFileRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md,.docx,image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          data-testid="file-input"
        />

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          rows={1}
          placeholder="Ask MadhuAI Anything"
          className="flex-1 resize-none bg-transparent text-[15px] leading-6 outline-none placeholder:text-muted-foreground py-2 min-h-[36px]"
          data-testid="chat-input-textarea"
        />

        {isStreaming ? (
          <button
            onClick={onStop}
            className="mb-1 flex size-9 items-center justify-center rounded-lg bg-red-500/90 text-white shadow-md hover:bg-red-500 transition"
            aria-label="Stop generating"
            data-testid="stop-generation-btn"
          >
            <StopCircle className="size-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!text.trim()}
            className={cn(
              'mb-1 flex size-9 items-center justify-center rounded-lg text-white shadow-md transition',
              text.trim()
                ? 'bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400 hover:brightness-110'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
            aria-label="Send"
            data-testid="send-btn"
          >
            <Send className="size-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 py-1.5 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Upload className="size-3" />
          <span>Drop files, paste images, or attach docs (PDF · TXT · DOCX)</span>
        </div>
        <div className="hidden sm:block">
          Enter to send · Shift+Enter for newline
        </div>
      </div>
    </div>
  )
}


