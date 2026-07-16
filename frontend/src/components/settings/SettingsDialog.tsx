import { motion } from 'framer-motion'
import { Sliders, X, Zap, Type, Hash, Palette } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'
import { useSettingsStore, AVAILABLE_MODELS } from '../../store/useSettingsStore'
import { cn } from '../../utils/format'

export default function SettingsDialog() {
  const setSettings = useUIStore((s) => s.setSettings)
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const s = useSettingsStore()

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSettings(false)}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        data-testid="settings-backdrop"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-background/95 glass-strong shadow-2xl"
        data-testid="settings-dialog"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white">
              <Sliders className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Settings</div>
              <div className="text-[11px] text-muted-foreground">Model & generation parameters</div>
            </div>
          </div>
          <button
            onClick={() => setSettings(false)}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
            data-testid="settings-close-btn"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
          <Section icon={<Zap className="size-3.5" />} label="Model">
            <select
              value={s.model}
              onChange={(e) => s.set('model', e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              data-testid="settings-model-select"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.tag}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              UI selection. Backend currently uses its configured default.
            </p>
          </Section>

          <SliderRow
            icon={<Type className="size-3.5" />}
            label="Temperature"
            value={s.temperature}
            min={0}
            max={2}
            step={0.05}
            format={(v) => v.toFixed(2)}
            onChange={(v) => s.set('temperature', v)}
            testid="settings-temperature"
            hint="Higher = more creative. Lower = more focused."
          />
          <SliderRow
            icon={<Type className="size-3.5" />}
            label="Top P"
            value={s.topP}
            min={0}
            max={1}
            step={0.05}
            format={(v) => v.toFixed(2)}
            onChange={(v) => s.set('topP', v)}
            testid="settings-topP"
            hint="Nucleus sampling. 1 = consider all tokens."
          />
          <SliderRow
            icon={<Hash className="size-3.5" />}
            label="Max tokens"
            value={s.maxTokens}
            min={256}
            max={8192}
            step={128}
            format={(v) => `${v}`}
            onChange={(v) => s.set('maxTokens', v)}
            testid="settings-maxTokens"
            hint="Maximum response length."
          />

          <Section icon={<Zap className="size-3.5" />} label="Streaming">
            <Toggle
              checked={s.streaming}
              onChange={(v) => s.set('streaming', v)}
              label={s.streaming ? 'Enabled - token-by-token' : 'Disabled - single response'}
              testid="settings-streaming-toggle"
            />
          </Section>

          <Section icon={<Palette className="size-3.5" />} label="Theme">
            <div className="grid grid-cols-2 gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm capitalize transition-colors',
                    theme === t
                      ? 'border-foreground/40 bg-secondary text-foreground'
                      : 'border-border bg-secondary/30 text-muted-foreground hover:bg-secondary',
                  )}
                  data-testid={`settings-theme-${t}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Section>

          <button
            onClick={() => s.reset()}
            className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            data-testid="settings-reset-btn"
          >
            Reset to defaults
          </button>
        </div>
      </motion.div>
    </>
  )
}

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  )
}

function SliderRow({
  icon,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  testid,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
  testid: string
  hint: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {icon}
          {label}
        </div>
        <span className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 font-mono text-[11px] text-foreground">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full appearance-none bg-transparent"
        style={{
          background: `linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) ${pct}%, hsl(var(--border)) ${pct}%, hsl(var(--border)) 100%)`,
          height: 4,
          borderRadius: 4,
        }}
        data-testid={testid}
      />
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
  testid,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  testid: string
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm transition-colors hover:bg-secondary',
      )}
      data-testid={testid}
    >
      <span className="text-foreground text-left">{label}</span>
      <span
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-linear-to-r from-indigo-500 to-cyan-400' : 'bg-muted',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
            checked ? 'left-4' : 'left-0.5',
          )}
        />
      </span>
    </button>
  )
}


