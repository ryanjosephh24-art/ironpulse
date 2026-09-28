import { QrCode, Flame } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { member } from '@/lib/ironpulse-data'

export function AppHeader({ onOpenPass }: { onOpenPass: () => void }) {
  return (
    <header className="flex flex-col gap-5 px-5 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-emerald-400 text-zinc-950">
            <Flame className="size-4" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">IronPulse</p>
            <p className="text-sm font-semibold text-zinc-100">{member.gym}</p>
          </div>
        </div>
        <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-400">
          {member.streak}-day streak
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 ring-2 ring-emerald-400/60 ring-offset-2 ring-offset-zinc-950">
            <AvatarImage src="/images/avatar-alex.png" alt={member.fullName} />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-zinc-500">Tuesday, Sep 29</p>
            <h1 className="text-2xl font-bold tracking-tight text-balance text-zinc-50">Hey, {member.firstName}</h1>
          </div>
        </div>
        <Button
          onClick={onOpenPass}
          className="h-11 gap-2 rounded-xl bg-emerald-400 px-4 font-semibold text-zinc-950 hover:bg-emerald-300"
        >
          <QrCode className="size-4" aria-hidden="true" />
          QR Pass
        </Button>
      </div>
    </header>
  )
}
