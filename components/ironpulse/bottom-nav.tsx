import { Apple, Dumbbell, House, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Tab = 'home' | 'workout' | 'diet' | 'pass'

const tabs = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'diet', label: 'Diet', icon: Apple },
  { id: 'pass', label: 'Pass', icon: QrCode },
] as const

export function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-zinc-800 bg-zinc-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg"
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex w-full flex-col items-center gap-1 py-3 text-[11px] font-semibold transition-colors',
                  isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300',
                )}
              >
                {isActive ? <span className="absolute top-0 h-0.5 w-8 rounded-full bg-emerald-400" aria-hidden="true" /> : null}
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
