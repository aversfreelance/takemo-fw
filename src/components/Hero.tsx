import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { watchArrived } from '../lib/whenArrived'

type Phase = 'enter' | 'trace' | 'flip' | 'pop' | 'hold' | 'out'
type FlipChar = {
  ch: string
  accent: boolean
  breakBefore?: boolean
  side: 'left' | 'right'
}

function buildSloganChars(line1: string, line2: string, accent: string): FlipChar[] {
  const accentFrom = line2.indexOf(accent)
  const chars: FlipChar[] = line1.split('').map((ch) => ({ ch, accent: false, side: 'left' }))
  line2.split('').forEach((ch, index) => {
    chars.push({
      ch,
      accent: accentFrom >= 0 && index >= accentFrom,
      breakBefore: index === 0,
      side: 'right',
    })
  })
  return chars
}

type FlipWord = { breakBefore?: boolean; items: { item: FlipChar; index: number }[] }

const KEEP_TOGETHER = [
  ['show', 'up.'],
  ['Be', 'seen'],
  ['Légy', 'látható'],
]

function groupWords(chars: FlipChar[]) {
  const words: FlipWord[] = []
  let current: FlipWord = { items: [] }
  chars.forEach((item, index) => {
    if (item.breakBefore) {
      if (current.items.length) words.push(current)
      current = { items: [], breakBefore: true }
    }
    if (item.ch === ' ') {
      if (current.items.length) words.push(current)
      words.push({ breakBefore: current.breakBefore, items: [{ item, index }] })
      current = { items: [] }
      return
    }
    current.items.push({ item, index })
  })
  if (current.items.length) words.push(current)
  return keepPhrasesTogether(words)
}

function wordText(word: FlipWord) {
  return word.items.map(({ item }) => item.ch).join('')
}

function keepPhrasesTogether(words: FlipWord[]) {
  const out: FlipWord[] = []
  for (let i = 0; i < words.length; i++) {
    const match = KEEP_TOGETHER.find(([first]) => first === wordText(words[i]))
    const gap = words[i + 1]
    const next = words[i + 2]
    if (
      match &&
      gap?.items.length === 1 &&
      gap.items[0]?.item.ch === ' ' &&
      next &&
      wordText(next) === match[1]
    ) {
      out.push({
        breakBefore: words[i].breakBefore,
        items: [...words[i].items, ...gap.items, ...next.items],
      })
      i += 2
      continue
    }
    out.push(words[i])
  }
  return out
}

const TILE = 30
const WIPE_IN = 700
const WIPE_HOLD = 1500
const TILE_FLIP = 180
const TILE_STEP = 10

function HeroWipe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const start = performance.now()
    let frame = 0

    const size = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    size()

    const square = (col: number, row: number, s = 1) => {
      const sizePx = TILE * s
      ctx.fillRect(col * TILE + (TILE - sizePx) / 2, row * TILE + (TILE - sizePx) / 2, sizePx, sizePx)
    }

    const draw = (now: number) => {
      const t = now - start
      const w = canvas.width
      const h = canvas.height
      const cols = Math.ceil(w / TILE)
      const rows = Math.ceil(h / TILE)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#ee1c25'

      if (t < WIPE_IN) {
        ctx.globalAlpha = Math.min(1, t / WIPE_IN)
        ctx.fillRect(0, 0, w, h)
        ctx.globalAlpha = 1
        frame = requestAnimationFrame(draw)
        return
      }

      if (t < WIPE_IN + WIPE_HOLD) {
        ctx.fillRect(0, 0, w, h)
        frame = requestAnimationFrame(draw)
        return
      }

      const flipT = t - WIPE_IN - WIPE_HOLD
      let done = true
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const delay = (cols - 1 - col + (rows - 1 - row)) * TILE_STEP
          const local = (flipT - delay) / TILE_FLIP
          if (local < 0) {
            square(col, row)
            done = false
          } else if (local < 1) {
            square(col, row, 1 - local)
            done = false
          }
        }
      }
      if (!done) frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={canvasRef} className="hero-wipe" aria-hidden />
}

export function Hero() {
  const { copy, locale } = useLocale()
  const chars = useMemo(
    () => buildSloganChars(copy.slogan.line1, copy.slogan.line2, copy.slogan.accent),
    [copy.slogan],
  )
  const words = useMemo(() => groupWords(chars), [chars])
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [phase, setPhase] = useState<Phase>('enter')
  const [cycle, setCycle] = useState(0)
  const [trace, setTrace] = useState({ w: 0, h: 0 })
  const [yellowLift, setYellowLift] = useState(false)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    return watchArrived(node, () => setLive(true))
  }, [])

  useEffect(() => {
    if (!live) return
    let cancelled = false
    const timers: number[] = []
    const later = (ms: number, fn: () => void) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) fn()
        }, ms),
      )
    }

    setPhase('enter')
    setYellowLift(false)
    later(4900, () => setPhase('trace'))
    later(7500, () => setPhase('flip'))
    later(10900, () => setPhase('pop'))
    later(11380, () => setPhase('hold'))
    later(15380, () => setYellowLift(true))
    later(17380, () => setPhase('out'))
    later(18680, () => setCycle((n) => n + 1))

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [cycle, locale, live])

  useEffect(() => {
    document.documentElement.classList.toggle('is-hero-lift', yellowLift)
    return () => document.documentElement.classList.remove('is-hero-lift')
  }, [yellowLift])

  useEffect(() => {
    const node = titleRef.current
    if (!node) return
    const measure = () => {
      const w = node.offsetWidth + 54
      const h = node.offsetHeight + 34
      setTrace((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [cycle, locale, chars])

  useEffect(() => {
    const node = sectionRef.current
    let frame = 0

    const update = () => {
      const fadeOver = Math.max(window.innerHeight * 0.75, 1)
      const yellowOver = Math.max(window.innerHeight * 1.8, 1)
      const next = Math.min(1, Math.max(0, window.scrollY / fadeOver))
      const yellow = Math.min(1, Math.max(0, window.scrollY / yellowOver))
      node?.style.setProperty('--hero-p', String(next))
      node?.style.setProperty('--hero-y', String(yellow))
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
    <section
      ref={sectionRef}
      className={`hero-stage relative overflow-hidden${live ? ' is-live' : ''}`}
      style={{ '--hero-p': 0, '--hero-y': 0 } as CSSProperties}
    >
      <div className="hero-yellow" aria-hidden />
      {live ? <HeroWipe key={`${locale}-${cycle}`} /> : null}
      <div className="relative z-[1] flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
        <h1
          key={`${locale}-${cycle}`}
          ref={titleRef}
          className={`flip-stage is-${phase} max-w-5xl text-[clamp(32px,4.4vw,68px)] font-bold leading-[1.15] text-ink`}
        >
          {trace.w ? (
            <svg className="hero-trace" viewBox={`0 0 ${trace.w} ${trace.h}`} aria-hidden>
              <rect x="4" y="4" width={trace.w - 8} height={trace.h - 8} pathLength="100" />
            </svg>
          ) : null}
          {words.map((word, wordIndex) => (
            <span key={`${locale}-w-${wordIndex}`}>
              {word.breakBefore ? <br /> : null}
              <span className={word.items[0]?.item.ch === ' ' ? 'flip-gap' : 'flip-word'}>
                {word.items.map(({ item, index }) => (
                  <span
                    key={`${locale}-${index}`}
                    className={`flip-letter is-${item.side}${item.ch === ' ' ? ' is-space' : ''}${item.accent ? ' is-accent' : ''}`}
                    style={{ '--i': index } as CSSProperties}
                  >
                    {item.ch === ' ' ? '\u00a0' : item.ch}
                  </span>
                ))}
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
