'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { MapPin } from 'lucide-react'
import { AppHeader } from './app-header'
import { MembershipCard } from './membership-card'
import { AiVisionCard, AiVisionDrawer, type ScanMode } from './ai-vision'
import { MealLog, ManualLogDialog, NutritionCard } from './nutrition'
import { OverloadInsight, RestTimerDialog, WorkoutTracker } from './workout'
import { QrPassCard, QrPassDrawer } from './qr-pass'
import { BottomNav, type Tab } from './bottom-nav'
import {
  checkIns,
  initialExercises,
  initialMeals,
  member,
  scannedFood,
  sumMacros,
  type Exercise,
  type Meal,
  type WorkoutSet,
} from '@/lib/ironpulse-data'

const nowLabel = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export function IronPulseApp() {
  const [tab, setTab] = useState<Tab>('home')
  const [passOpen, setPassOpen] = useState(false)
  const [scanOpen, setScanOpen] = useState(false)
  const [scanMode, setScanMode] = useState<ScanMode>('food')
  const [manualOpen, setManualOpen] = useState(false)
  const [restOpen, setRestOpen] = useState(false)
  const [rateLocked, setRateLocked] = useState(false)
  const [meals, setMeals] = useState<Meal[]>(initialMeals)
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)

  const totals = useMemo(() => sumMacros(meals), [meals])

  const openScanner = (mode: ScanMode) => {
    setScanMode(mode)
    setScanOpen(true)
  }

  const addMeal = (meal: Omit<Meal, 'id' | 'time'>) => {
    setMeals((prev) => [...prev, { ...meal, id: crypto.randomUUID(), time: nowLabel() }])
    toast.success(`${meal.name} logged`, { description: `+${meal.kcal} kcal · ${meal.protein}g protein` })
  }

  const updateSet = (exerciseId: string, setIndex: number, patch: Partial<WorkoutSet>) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId ? { ...ex, sets: ex.sets.map((s, i) => (i === setIndex ? { ...s, ...patch } : s)) } : ex,
      ),
    )
  }

  const renew = () => {
    setRateLocked(true)
    toast.success('Membership renewed', { description: `Gold All-Access locked at $${member.monthlyRate}/mo.` })
  }

  const changeTab = (next: Tab) => {
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const workoutProps = { exercises, onUpdateSet: updateSet, onRest: () => setRestOpen(true) }
  const nutritionProps = { totals, onScanMeal: () => openScanner('food'), onLogManual: () => setManualOpen(true) }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md border-zinc-900 bg-zinc-950 md:border-x">
      <AppHeader onOpenPass={() => setPassOpen(true)} />

      <main className="flex flex-col gap-4 px-4 pt-5 pb-28">
        {tab === 'home' && (
          <>
            <MembershipCard rateLocked={rateLocked} onRenew={renew} />
            <AiVisionCard onOpen={openScanner} />
            <NutritionCard {...nutritionProps} />
            <OverloadInsight />
            <WorkoutTracker {...workoutProps} compact />
          </>
        )}

        {tab === 'workout' && (
          <>
            <OverloadInsight />
            <WorkoutTracker {...workoutProps} />
          </>
        )}

        {tab === 'diet' && (
          <>
            <NutritionCard {...nutritionProps} />
            <AiVisionCard onOpen={openScanner} />
            <MealLog meals={meals} />
          </>
        )}

        {tab === 'pass' && (
          <>
            <section aria-label="Check-in pass" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <QrPassCard />
            </section>
            <MembershipCard rateLocked={rateLocked} onRenew={renew} />
            <section aria-labelledby="checkins-title" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <h2 id="checkins-title" className="text-base font-bold text-zinc-50">
                Recent check-ins
              </h2>
              <ul className="mt-3 flex flex-col divide-y divide-zinc-800">
                {checkIns.map((c) => (
                  <li key={`${c.day}-${c.time}`} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-100">{c.day}</p>
                      <p className="flex items-center gap-1 text-xs text-zinc-500">
                        <MapPin className="size-3" aria-hidden="true" />
                        {c.location}
                      </p>
                    </div>
                    <span className="font-mono text-sm text-emerald-300">{c.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-zinc-500">Member since {member.memberSince}</p>
            </section>
          </>
        )}
      </main>

      <BottomNav active={tab} onChange={changeTab} />

      <QrPassDrawer open={passOpen} onOpenChange={setPassOpen} />
      <AiVisionDrawer
        open={scanOpen}
        onOpenChange={setScanOpen}
        initialMode={scanMode}
        onAddMeal={() => addMeal({ ...scannedFood, source: 'scan' })}
        onStartSet={() => {
          changeTab('workout')
          toast('Hack Squat queued', { description: 'Log your first set below.' })
        }}
      />
      <ManualLogDialog open={manualOpen} onOpenChange={setManualOpen} onSubmit={(m) => addMeal({ ...m, source: 'manual' })} />
      <RestTimerDialog open={restOpen} onOpenChange={setRestOpen} />
    </div>
  )
}
