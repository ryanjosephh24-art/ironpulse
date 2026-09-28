'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ShieldCheck } from 'lucide-react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { member } from '@/lib/ironpulse-data'

const ROTATE_SECONDS = 30

function useRotatingToken() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const cycle = Math.floor(tick / ROTATE_SECONDS)
  const secondsLeft = ROTATE_SECONDS - (tick % ROTATE_SECONDS)
  const token = `${(cycle * 7919 + 48213).toString(36).toUpperCase()}`
  return { token, secondsLeft }
}

export function QrPassCard() {
  const { token, secondsLeft } = useRotatingToken()

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex items-center justify-center p-4">
        <span className="absolute inset-0 animate-pulse-ring rounded-3xl border-2 border-emerald-400/70" aria-hidden="true" />
        <span className="absolute inset-0 rounded-3xl border-2 border-emerald-400" aria-hidden="true" />
        <div className="relative rounded-2xl bg-zinc-50 p-4">
          <QRCodeSVG
            value={`IRONPULSE:${member.memberId}:${token}`}
            size={196}
            bgColor="#fafafa"
            fgColor="#09090b"
            level="M"
            title={`Check-in QR code for member ${member.memberId}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
        Check-In Scanner Ready
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Member ID</p>
          <p className="mt-1 font-mono text-base font-semibold text-cyan-400">#{member.memberId}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Code refresh</p>
          <p className="mt-1 font-mono text-base font-semibold text-zinc-100" aria-live="polite">
            {secondsLeft}s
          </p>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
        <ShieldCheck className="size-3.5 text-emerald-400" aria-hidden="true" />
        Encrypted rotating pass · {member.plan}
      </p>
    </div>
  )
}

export function QrPassDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="mx-auto w-full max-w-md border-zinc-800 bg-zinc-950">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-lg text-zinc-50">{member.fullName}</DrawerTitle>
          <DrawerDescription className="text-zinc-400">
            Hold your phone under the scanner at the front desk.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-5 pb-8">
          {open ? <QrPassCard /> : null}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
