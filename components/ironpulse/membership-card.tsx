import { CalendarClock, Crown, Lock, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { member } from '@/lib/ironpulse-data'

type MembershipCardProps = {
  rateLocked: boolean
  onRenew: () => void
}

export function MembershipCard({ rateLocked, onRenew }: MembershipCardProps) {
  const cycleProgress = (30 - member.daysLeft) / 30

  return (
    <section aria-labelledby="membership-title" className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="relative p-4">
        <div
          className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-amber-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-300">
              <Crown className="size-3.5" aria-hidden="true" />
              Current plan
            </p>
            <h2 id="membership-title" className="mt-1 text-xl font-bold text-zinc-50">
              {member.plan}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
              <CalendarClock className="size-3.5" aria-hidden="true" />
              Renews {member.renewalDate} · ${member.monthlyRate}/mo
            </p>
          </div>
          <span className="shrink-0 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1.5 text-center">
            <span className="block font-mono text-lg leading-none font-bold text-cyan-300">{member.daysLeft}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-400/80">Days left</span>
          </span>
        </div>

        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-label="Billing cycle progress"
          aria-valuemin={0}
          aria-valuemax={30}
          aria-valuenow={30 - member.daysLeft}
        >
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${cycleProgress * 100}%` }} />
        </div>
      </div>

      {rateLocked ? (
        <div className="flex items-center gap-3 border-t border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-400" aria-hidden="true" />
          <p className="text-sm text-emerald-200">
            <span className="font-semibold">Rate locked at ${member.monthlyRate}/mo</span> for the next 12 months.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 border-t border-amber-400/20 bg-amber-400/[0.07] px-4 py-3">
          <div className="flex gap-3">
            <TrendingUp className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-zinc-300">
              <span className="font-semibold text-amber-300">Gym Rate Alert:</span> Rates increase by 15% next month. Lock in
              your current membership rate today.
            </p>
          </div>
          <Button onClick={onRenew} className="h-10 w-full gap-2 rounded-xl bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300">
            <Lock className="size-4" aria-hidden="true" />
            Renew Plan · Lock ${member.monthlyRate}/mo
          </Button>
        </div>
      )}
    </section>
  )
}
