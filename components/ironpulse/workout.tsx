'use client'

import { useEffect, useState } from 'react'
import { Brain, History, Minus, Plus, SkipForward, Timer, TrendingUp } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ProgressRing } from './progress-ring'
import { cn } from '@/lib/utils'
import type { Exercise, WorkoutSet } from '@/lib/ironpulse-data'

type WorkoutTrackerProps = {
  exercises: Exercise[]
  onUpdateSet: (exerciseId: string, setIndex: number, patch: Partial<WorkoutSet>) => void
  onRest: () => void
  compact?: boolean
}

export function WorkoutTracker({ exercises, onUpdateSet, onRest, compact = false }: WorkoutTrackerProps) {
  const totalSets = exercises.reduce((n, e) => n + e.sets.length, 0)
  const doneSets = exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)
  const visible = compact ? exercises.slice(0, 2) : exercises

  return (
    <section aria-labelledby="workout-title" className="rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 p-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">{"Today's routine"}</p>
          <h2 id="workout-title" className="text-base font-bold text-zinc-50">
            Push Day A — Hypertrophy
          </h2>
          <p className="font-mono text-xs text-zinc-500">
            {doneSets}/{totalSets} sets · ~55 min
          </p>
        </div>
        <Button onClick={onRest} variant="outline" className="h-10 shrink-0 gap-1.5 rounded-xl border-cyan-400/40 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20">
          <Timer className="size-4" aria-hidden="true" />
          Rest 90s
        </Button>
      </div>

      <div className="h-1 bg-zinc-800" aria-hidden="true">
        <div className="h-full bg-emerald-400 transition-[width] duration-500" style={{ width: `${(doneSets / totalSets) * 100}%` }} />
      </div>

      <ol className="flex flex-col divide-y divide-zinc-800">
        {visible.map((exercise, i) => (
          <li key={exercise.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-100">
                  <span className="mr-1.5 font-mono text-xs text-zinc-500">{String(i + 1).padStart(2, '0')}</span>
                  {exercise.name}
                </h3>
                <p className="text-xs text-zinc-500">
                  {exercise.target} · {exercise.muscles}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-zinc-300">
                <History className="size-3 text-cyan-400" aria-hidden="true" />
                Last: {exercise.last}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-[2rem_1fr_1fr_2.25rem] items-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              <span>Set</span>
              <span>Weight (kg)</span>
              <span>Reps</span>
              <span className="text-center">Done</span>
            </div>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {exercise.sets.map((set, idx) => {
                const label = `${exercise.name} set ${idx + 1}`
                return (
                  <li
                    key={idx}
                    className={cn(
                      'grid grid-cols-[2rem_1fr_1fr_2.25rem] items-center gap-2 rounded-lg px-1 py-1 transition-colors',
                      set.done && 'bg-emerald-400/[0.08]',
                    )}
                  >
                    <span className={cn('text-center font-mono text-sm font-semibold', set.done ? 'text-emerald-400' : 'text-zinc-400')}>
                      {idx + 1}
                    </span>
                    <Input
                      aria-label={`${label} weight in kilograms`}
                      inputMode="decimal"
                      placeholder={exercise.last.split('kg')[0]}
                      value={set.weight}
                      onChange={(e) => onUpdateSet(exercise.id, idx, { weight: e.target.value.replace(/[^\d.]/g, '').slice(0, 5) })}
                      className="h-9 border-zinc-800 bg-zinc-950 text-center font-mono"
                    />
                    <Input
                      aria-label={`${label} reps`}
                      inputMode="numeric"
                      placeholder={exercise.last.split('× ')[1]}
                      value={set.reps}
                      onChange={(e) => onUpdateSet(exercise.id, idx, { reps: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                      className="h-9 border-zinc-800 bg-zinc-950 text-center font-mono"
                    />
                    <span className="flex justify-center">
                      <Checkbox
                        aria-label={`Mark ${label} complete`}
                        checked={set.done}
                        onCheckedChange={(checked) => onUpdateSet(exercise.id, idx, { done: checked === true })}
                        className="size-6 rounded-md border-zinc-600 data-checked:border-emerald-400 data-checked:bg-emerald-400 data-checked:text-zinc-950"
                      />
                    </span>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>
      {compact && exercises.length > visible.length ? (
        <p className="border-t border-zinc-800 px-4 py-3 text-center text-xs text-zinc-500">
          +{exercises.length - visible.length} more exercises in Workout
        </p>
      ) : null}
    </section>
  )
}

export function OverloadInsight() {
  return (
    <aside aria-label="Coach insight" className="flex gap-3 rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/10 to-cyan-400/5 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-400">
        <Brain className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
          <TrendingUp className="size-3" aria-hidden="true" />
          Progressive overload
        </p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-200">
          You exceeded target reps on your top sets for 2 consecutive sessions.{' '}
          <span className="font-semibold text-emerald-300">Recommended: +2.5kg next cycle.</span>
        </p>
      </div>
    </aside>
  )
}

const REST_DEFAULT = 90

export function RestTimerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [total, setTotal] = useState(REST_DEFAULT)
  const [remaining, setRemaining] = useState(REST_DEFAULT)

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setTotal(REST_DEFAULT)
      setRemaining(REST_DEFAULT)
    }
  }

  useEffect(() => {
    if (!open) return
    const id = setInterval(() => setRemaining((r) => Math.max(r - 1, 0)), 1000)
    return () => clearInterval(id)
  }, [open])

  const adjust = (delta: number) => {
    setRemaining((r) => Math.max(r + delta, 0))
    setTotal((t) => Math.max(t + delta, 15))
  }

  const mm = Math.floor(remaining / 60)
  const ss = String(remaining % 60).padStart(2, '0')
  const finished = remaining === 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] border-zinc-800 bg-zinc-950 sm:max-w-xs">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-zinc-50">{finished ? 'Time to lift' : 'Rest timer'}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {finished ? 'Rest complete — hit your next set.' : 'Breathe, hydrate, reset your grip.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5 py-2">
          <ProgressRing value={remaining / total} size={180} stroke={10} indicatorClassName={finished ? 'stroke-emerald-400' : 'stroke-cyan-400'}>
            <span className="font-mono text-4xl font-bold text-zinc-50" aria-live="polite" aria-atomic="true">
              {mm}:{ss}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">remaining</span>
          </ProgressRing>
          <div className="grid w-full grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => adjust(-15)} className="h-10 rounded-xl border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800">
              <Minus className="size-3.5" aria-hidden="true" />
              15s
            </Button>
            <Button variant="outline" onClick={() => adjust(15)} className="h-10 rounded-xl border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800">
              <Plus className="size-3.5" aria-hidden="true" />
              15s
            </Button>
            <Button onClick={() => onOpenChange(false)} className="h-10 rounded-xl bg-emerald-400 font-semibold text-zinc-950 hover:bg-emerald-300">
              <SkipForward className="size-3.5" aria-hidden="true" />
              {finished ? 'Go' : 'Skip'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
