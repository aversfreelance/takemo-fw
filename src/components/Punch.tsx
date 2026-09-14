import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/locale'
import { watchArrived } from '../lib/whenArrived'

type PunchSide = 'none' | 'left' | 'right'

export function Punch() {
  const { copy } = useLocale()
  const ref = useRef<HTMLElement>(null)
  const [side, setSide] = useState<PunchSide>('none')
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const timers: number[] = []

    const run = () => {
      if (started.current) return
      started.current = true
      const gaps = [0, 50, 50, 55, 60, 70, 85, 105, 135, 175, 230, 310, 420, 580, 800, 1100]
      let at = 0
      let next: 'left' | 'right' = 'left'
      gaps.forEach((gap) => {
        at += gap
        const now = next
        timers.push(window.setTimeout(() => setSide(now), at))
        next = now === 'left' ? 'right' : 'left'
      })
    }

    const stop = watchArrived(node, run)

    return () => {
      stop()
      timers.forEach(clearTimeout)
      started.current = false
    }
  }, [])

  return (
    <section ref={ref} className={`punch is-${side}`} aria-label={copy.punchNote}>
      <div className="punch-cell punch-left">
        <div>
          <p className="punch-word">{copy.punchLeft}</p>
        </div>
      </div>
      <div className="punch-cell punch-right">
        <div>
          <p className="punch-word">{copy.punchRight}</p>
          <p className="punch-note mt-6 text-base font-extrabold uppercase tracking-[0.22em]">{copy.punchNote}</p>
        </div>
      </div>
    </section>
  )
}
