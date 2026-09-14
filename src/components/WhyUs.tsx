import { useEffect, useRef, useState } from 'react'
import { reasons, stats } from '../data'
import { Reveal } from './Reveal'

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const duration = 1200
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.round(target * progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target])

  return value
}

function Stat({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const current = useCountUp(value, active)
  return (
    <div className="text-center">
      <p className="mx-auto grid h-[100px] w-[100px] place-items-center rounded-full bg-brand text-[32px] font-bold text-white shadow-[0_12px_28px_-10px_rgb(238_28_37_/_0.55)]">
        {current}
        {suffix}
      </p>
      <p className="mt-3 text-sm uppercase text-ink">{label}</p>
    </div>
  )
}

export function WhyUs() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true)
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-wash py-20">
      <div className="page-wrap">
        <Reveal>
          <h2 className="section-title">
            Why work <strong>with us?</strong>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {reasons.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <article className="card-lift flex h-full flex-col items-center rounded-2xl bg-white p-6 text-center">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-full border-2 border-brand-soft text-2xl font-black text-brand-soft">
                  +
                </div>
                <h3 className="text-xl font-bold uppercase">{item.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-ink">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div ref={ref} className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((item) => (
            <Stat key={item.label} {...item} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}
