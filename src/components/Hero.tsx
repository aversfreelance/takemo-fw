import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'

type FlipChar = {
  ch: string
  accent: boolean
  breakBefore?: boolean
}

function buildSloganChars(line1: string, line2: string, accent: string): FlipChar[] {
  const accentFrom = line2.indexOf(accent)
  const chars: FlipChar[] = line1.split('').map((ch) => ({ ch, accent: false }))
  line2.split('').forEach((ch, index) => {
    chars.push({ ch, accent: accentFrom >= 0 && index >= accentFrom, breakBefore: index === 0 })
  })
  return chars
}

export function Hero() {
  const { copy, locale } = useLocale()
  const chars = useMemo(
    () => buildSloganChars(copy.slogan.line1, copy.slogan.line2, copy.slogan.accent),
    [copy.slogan],
  )
  const sectionRef = useRef<HTMLElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    setLive(false)
    const readyTimer = window.setTimeout(() => setLive(true), 1200)
    return () => window.clearTimeout(readyTimer)
  }, [locale])

  useEffect(() => {
    const node = sectionRef.current
    let frame = 0

    const update = () => {
      const fadeOver = Math.max(window.innerHeight * 0.75, 1)
      const next = Math.min(1, Math.max(0, window.scrollY / fadeOver))
      node?.style.setProperty('--hero-p', String(next))
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ '--hero-p': 0 } as CSSProperties}>
      <div className="hero-yellow" aria-hidden />
      <div className="hero-wipe" />
      <div className="relative z-[1] flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
        <h1
          key={locale}
          className={`flip-stage max-w-5xl text-[clamp(32px,4.4vw,68px)] font-bold leading-[1.15] text-ink${live ? ' is-live' : ''}`}
        >
          {chars.map((item, index) => (
            <span key={`${locale}-${item.ch}-${index}`}>
              {item.breakBefore ? <br /> : null}
              <span
                className={`flip-letter${item.ch === ' ' ? ' is-space' : ''}${item.accent ? ' is-accent' : ''}`}
                style={{ '--i': index, animationDelay: `${0.18 + index * 0.024}s` } as CSSProperties}
              >
                {item.ch === ' ' ? '\u00a0' : item.ch}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-copy sub-in mt-6 max-w-xl whitespace-pre-line text-lg text-muted">{copy.heroLead}</p>
        <div className="hero-copy cta-float mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/start" className="btn-primary">
            {copy.ctaPrimary}
          </Link>
          <Link to="/#today" className="btn-outline">
            {copy.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
