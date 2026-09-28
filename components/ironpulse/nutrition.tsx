'use client'

import { useState } from 'react'
import { Camera, Plus, ScanLine, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProgressRing } from './progress-ring'
import { cn } from '@/lib/utils'
import { nutritionGoals, type Macros, type Meal } from '@/lib/ironpulse-data'

const fmt = new Intl.NumberFormat('en-US')

type NutritionCardProps = {
  totals: Macros
  onScanMeal: () => void
  onLogManual: () => void
}

export function NutritionCard({ totals, onScanMeal, onLogManual }: NutritionCardProps) {
  const remaining = nutritionGoals.kcal - totals.kcal
  const macros = [
    { label: 'Protein', value: totals.protein, goal: nutritionGoals.protein, bar: 'bg-emerald-400', text: 'text-emerald-300' },
    { label: 'Carbs', value: totals.carbs, goal: nutritionGoals.carbs, bar: 'bg-amber-400', text: 'text-amber-300' },
    { label: 'Fats', value: totals.fat, goal: nutritionGoals.fat, bar: 'bg-rose-400', text: 'text-rose-300' },
  ]

  return (
    <section aria-labelledby="nutrition-title" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <h2 id="nutrition-title" className="text-base font-bold text-zinc-50">
          Daily Nutrition
        </h2>
        <span className="font-mono text-xs text-zinc-400">
          {fmt.format(totals.kcal)} / {fmt.format(nutritionGoals.kcal)} kcal
        </span>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <ProgressRing
          value={totals.kcal / nutritionGoals.kcal}
          size={132}
          stroke={11}
          indicatorClassName={remaining < 0 ? 'stroke-rose-400' : 'stroke-emerald-400'}
        >
          <span className="font-mono text-2xl font-bold text-zinc-50">{fmt.format(Math.abs(remaining))}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            {remaining < 0 ? 'kcal over' : 'kcal left'}
          </span>
        </ProgressRing>

        <dl className="flex flex-1 flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Goal</dt>
            <dd className="font-mono text-zinc-200">{fmt.format(nutritionGoals.kcal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Eaten</dt>
            <dd className="font-mono text-zinc-200">{fmt.format(totals.kcal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Burned</dt>
            <dd className="font-mono text-cyan-300">+420</dd>
          </div>
        </dl>
      </div>

      <ul className="mt-5 grid grid-cols-3 gap-3" aria-label="Macros">
        {macros.map((m) => (
          <li key={m.label}>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{m.label}</span>
            </div>
            <p className={cn('mt-0.5 font-mono text-sm font-bold', m.text)}>
              {m.value}g<span className="font-medium text-zinc-500"> / {m.goal}g</span>
            </p>
            <div
              className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-800"
              role="progressbar"
              aria-label={`${m.label} progress`}
              aria-valuemin={0}
              aria-valuemax={m.goal}
              aria-valuenow={m.value}
            >
              <div
                className={cn('h-full rounded-full transition-[width] duration-700', m.bar)}
                style={{ width: `${Math.min(m.value / m.goal, 1) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onLogManual} className="h-10 gap-2 rounded-xl border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800">
          <Plus className="size-4" aria-hidden="true" />
          Log Manual
        </Button>
        <Button onClick={onScanMeal} className="h-10 gap-2 rounded-xl bg-cyan-400 font-semibold text-zinc-950 hover:bg-cyan-300">
          <Camera className="size-4" aria-hidden="true" />
          Scan Meal
        </Button>
      </div>
    </section>
  )
}

export function MealLog({ meals }: { meals: Meal[] }) {
  return (
    <section aria-labelledby="meal-log-title" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 id="meal-log-title" className="text-base font-bold text-zinc-50">
        {"Today's Log"}
      </h2>
      <ul className="mt-3 flex flex-col divide-y divide-zinc-800">
        {[...meals].reverse().map((meal) => (
          <li key={meal.id} className="flex items-center gap-3 py-3">
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg',
                meal.source === 'scan' ? 'bg-cyan-400/10 text-cyan-400' : 'bg-zinc-800 text-zinc-400',
              )}
            >
              {meal.source === 'scan' ? <ScanLine className="size-4" aria-hidden="true" /> : <PenLine className="size-4" aria-hidden="true" />}
              <span className="sr-only">{meal.source === 'scan' ? 'Scanned' : 'Manual entry'}</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-100">{meal.name}</p>
              <p className="font-mono text-[11px] text-zinc-500">
                {meal.time} · P{meal.protein} C{meal.carbs} F{meal.fat}
              </p>
            </div>
            <span className="font-mono text-sm font-semibold text-zinc-200">{meal.kcal}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

type ManualLogDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (meal: Omit<Meal, 'id' | 'time' | 'source'>) => void
}

const fields = [
  { name: 'kcal', label: 'Calories', unit: 'kcal' },
  { name: 'protein', label: 'Protein', unit: 'g' },
  { name: 'carbs', label: 'Carbs', unit: 'g' },
  { name: 'fat', label: 'Fat', unit: 'g' },
] as const

export function ManualLogDialog({ open, onOpenChange, onSubmit }: ManualLogDialogProps) {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim().slice(0, 60)
    const values = fields.map((f) => Number(data.get(f.name)))
    if (!name || values.some((v) => !Number.isFinite(v) || v < 0 || v > 5000)) {
      setError('Enter a meal name and valid numbers (0–5000).')
      return
    }
    const [kcal, protein, carbs, fat] = values.map(Math.round)
    onSubmit({ name, kcal, protein, carbs, fat })
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] border-zinc-800 bg-zinc-950 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-zinc-50">Log a meal</DialogTitle>
          <DialogDescription className="text-zinc-400">Add food manually to your daily totals.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-400">
            Meal name
            <Input name="name" placeholder="e.g. Protein shake" maxLength={60} required className="h-10 border-zinc-800 bg-zinc-900" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <label key={f.name} className="flex flex-col gap-1.5 text-xs font-medium text-zinc-400">
                {f.label} ({f.unit})
                <Input
                  name={f.name}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={5000}
                  required
                  placeholder="0"
                  className="h-10 border-zinc-800 bg-zinc-900 font-mono"
                />
              </label>
            ))}
          </div>
          {error ? (
            <p role="alert" className="text-xs text-rose-400">
              {error}
            </p>
          ) : null}
          <DialogFooter className="-mx-4 -mb-4 border-zinc-800 bg-zinc-900/60">
            <Button type="submit" className="h-10 w-full rounded-xl bg-emerald-400 font-semibold text-zinc-950 hover:bg-emerald-300">
              Add to Daily Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
