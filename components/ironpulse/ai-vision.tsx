'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Camera, Dumbbell, Loader2, Plus, RotateCcw, Sparkles, Utensils, Play, ChevronRight } from 'lucide-react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { scannedEquipment, scannedFood } from '@/lib/ironpulse-data'

export type ScanMode = 'food' | 'equipment'
type Phase = 'live' | 'analyzing' | 'result'

export function AiVisionCard({ onOpen }: { onOpen: (mode: ScanMode) => void }) {
  return (
    <section aria-labelledby="ai-vision-title" className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-zinc-900 p-4">
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-cyan-400/15 blur-3xl" aria-hidden="true" />
      <div className="relative flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-zinc-950">
          <Camera className="size-6" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-400">
            <Sparkles className="size-3" aria-hidden="true" />
            Snap &amp; Track
          </p>
          <h2 id="ai-vision-title" className="text-base font-bold text-zinc-50">
            AI Vision Log
          </h2>
          <p className="text-xs text-zinc-400">Scan meals for macros or machines for form cues.</p>
        </div>
      </div>
      <div className="relative mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => onOpen('food')}
          className="h-10 justify-between rounded-xl border-zinc-700 bg-zinc-950/60 text-zinc-100 hover:bg-zinc-800"
        >
          <span className="flex items-center gap-2">
            <Utensils className="size-4 text-emerald-400" aria-hidden="true" />
            Meal
          </span>
          <ChevronRight className="size-4 text-zinc-500" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          onClick={() => onOpen('equipment')}
          className="h-10 justify-between rounded-xl border-zinc-700 bg-zinc-950/60 text-zinc-100 hover:bg-zinc-800"
        >
          <span className="flex items-center gap-2">
            <Dumbbell className="size-4 text-cyan-400" aria-hidden="true" />
            Equipment
          </span>
          <ChevronRight className="size-4 text-zinc-500" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}

type AiVisionDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMode: ScanMode
  onAddMeal: () => void
  onStartSet: () => void
}

export function AiVisionDrawer({ open, onOpenChange, initialMode, onAddMeal, onStartSet }: AiVisionDrawerProps) {
  const [mode, setMode] = useState<ScanMode>(initialMode)
  const [phase, setPhase] = useState<Phase>('live')

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setMode(initialMode)
      setPhase('live')
    }
  }

  useEffect(() => {
    if (phase !== 'analyzing') return
    const id = setTimeout(() => setPhase('result'), 1800)
    return () => clearTimeout(id)
  }, [phase])

  const switchMode = (next: ScanMode) => {
    setMode(next)
    setPhase('live')
  }

  const imageSrc = mode === 'food' ? '/images/scan-food.png' : '/images/scan-equipment.png'

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="mx-auto w-full max-w-md border-zinc-800 bg-zinc-950">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="flex items-center gap-2 text-zinc-50">
            <Sparkles className="size-4 text-cyan-400" aria-hidden="true" />
            AI Vision Log
          </DrawerTitle>
          <DrawerDescription className="text-zinc-400">
            {mode === 'food' ? 'Center your plate in the frame.' : 'Point at the machine name plate or seat.'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
          <div role="tablist" aria-label="Scan mode" className="grid grid-cols-2 rounded-xl border border-zinc-800 bg-zinc-900 p-1">
            {(
              [
                { id: 'food', label: 'Food & Macros', icon: Utensils },
                { id: 'equipment', label: 'Gym Equipment / Form', icon: Dumbbell },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                onClick={() => switchMode(id)}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors',
                  mode === id ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-400 hover:text-zinc-100',
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {phase === 'result' ? (
            mode === 'food' ? (
              <FoodResult
                onRetake={() => setPhase('live')}
                onAdd={() => {
                  onAddMeal()
                  onOpenChange(false)
                }}
              />
            ) : (
              <EquipmentResult
                onRetake={() => setPhase('live')}
                onStart={() => {
                  onStartSet()
                  onOpenChange(false)
                }}
              />
            )
          ) : (
            <>
              <Viewfinder src={imageSrc} analyzing={phase === 'analyzing'} mode={mode} />
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPhase('analyzing')}
                  disabled={phase === 'analyzing'}
                  aria-label="Snap and analyze"
                  className="flex size-18 items-center justify-center rounded-full border-4 border-zinc-100 p-1 transition-transform active:scale-95 disabled:opacity-60"
                >
                  <span className="flex size-full items-center justify-center rounded-full bg-cyan-400 text-zinc-950">
                    {phase === 'analyzing' ? (
                      <Loader2 className="size-6 animate-spin" aria-hidden="true" />
                    ) : (
                      <Camera className="size-6" aria-hidden="true" />
                    )}
                  </span>
                </button>
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400" aria-live="polite">
                  {phase === 'analyzing' ? 'Analyzing…' : 'Snap & Analyze'}
                </span>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function Viewfinder({ src, analyzing, mode }: { src: string; analyzing: boolean; mode: ScanMode }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <Image
        src={src}
        alt={mode === 'food' ? 'Live camera view of a meal' : 'Live camera view of gym equipment'}
        fill
        sizes="(max-width: 448px) 100vw, 448px"
        className={cn('object-cover transition-all duration-500', analyzing ? 'scale-105 brightness-75' : 'brightness-90')}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950/50" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-5" aria-hidden="true">
        <span className="absolute top-0 left-0 size-8 rounded-tl-lg border-t-[3px] border-l-[3px] border-cyan-400" />
        <span className="absolute top-0 right-0 size-8 rounded-tr-lg border-t-[3px] border-r-[3px] border-cyan-400" />
        <span className="absolute bottom-0 left-0 size-8 rounded-bl-lg border-b-[3px] border-l-[3px] border-cyan-400" />
        <span className="absolute right-0 bottom-0 size-8 rounded-br-lg border-r-[3px] border-b-[3px] border-cyan-400" />
        <span
          className={cn(
            'absolute inset-x-0 h-0.5 animate-scan-line bg-cyan-400 shadow-[0_0_16px_4px_rgba(34,211,238,0.6)]',
            analyzing && '[animation-duration:0.9s]',
          )}
        />
      </div>

      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-zinc-950/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-200 backdrop-blur">
        <span className="size-1.5 animate-pulse rounded-full bg-rose-500" aria-hidden="true" />
        Live
      </div>
      <div className="absolute right-3 bottom-3 rounded-full bg-zinc-950/70 px-2 py-1 font-mono text-[10px] text-cyan-300 backdrop-blur">
        {analyzing ? 'Detecting objects…' : 'AI ready'}
      </div>
    </div>
  )
}

function FoodResult({ onRetake, onAdd }: { onRetake: () => void; onAdd: () => void }) {
  const macros = [
    { label: 'Protein', value: `${scannedFood.protein}g`, className: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' },
    { label: 'Carbs', value: `${scannedFood.carbs}g`, className: 'border-amber-400/30 bg-amber-400/10 text-amber-300' },
    { label: 'Fat', value: `${scannedFood.fat}g`, className: 'border-rose-400/30 bg-rose-400/10 text-rose-300' },
  ]
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
          <Image src="/images/scan-food.png" alt="Captured meal photo" fill sizes="80px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">Detected · 94% match</p>
          <p className="mt-0.5 font-semibold leading-snug text-zinc-50">{scannedFood.name}</p>
          <p className="mt-1 font-mono text-lg font-bold text-zinc-100">
            Est. {scannedFood.kcal} <span className="text-xs font-medium text-zinc-400">kcal</span>
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-3 gap-2" aria-label="Estimated macros">
        {macros.map((m) => (
          <li key={m.label} className={cn('rounded-xl border px-3 py-2 text-center', m.className)}>
            <span className="block font-mono text-lg font-bold">{m.value}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{m.label}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRetake} className="h-11 rounded-xl border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800">
          <RotateCcw className="size-4" aria-hidden="true" />
          <span className="sr-only">Retake photo</span>
        </Button>
        <Button onClick={onAdd} className="h-11 flex-1 gap-2 rounded-xl bg-emerald-400 font-semibold text-zinc-950 hover:bg-emerald-300">
          <Plus className="size-4" aria-hidden="true" />
          Add to Daily Log
        </Button>
      </div>
    </div>
  )
}

function EquipmentResult({ onRetake, onStart }: { onRetake: () => void; onStart: () => void }) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
          <Image src="/images/scan-equipment.png" alt="Captured equipment photo" fill sizes="80px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">Machine detected · 97%</p>
          <p className="mt-0.5 text-lg font-bold text-zinc-50">{scannedEquipment.name}</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label="Target muscles">
            {scannedEquipment.muscles.map((m) => (
              <li key={m} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-300">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Form cue</p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-300">{scannedEquipment.cue}</p>
        <p className="mt-2 font-mono text-xs text-emerald-300">Suggested: {scannedEquipment.suggestion}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRetake} className="h-11 rounded-xl border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800">
          <RotateCcw className="size-4" aria-hidden="true" />
          <span className="sr-only">Retake photo</span>
        </Button>
        <Button onClick={onStart} className="h-11 flex-1 gap-2 rounded-xl bg-cyan-400 font-semibold text-zinc-950 hover:bg-cyan-300">
          <Play className="size-4" aria-hidden="true" />
          Start Set
        </Button>
      </div>
    </div>
  )
}
