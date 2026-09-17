import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useLocale } from '../i18n/locale'
import { watchArrived } from '../lib/whenArrived'

export const BANNER_SIZES = [
  { id: '970x250', w: 970, h: 250 },
  { id: '728x90', w: 728, h: 90 },
  { id: '300x250', w: 300, h: 250 },
  { id: '300x600', w: 300, h: 600 },
  { id: '320x100', w: 320, h: 100 },
  { id: '1080x1920', w: 1080, h: 1920 },
] as const

export type BannerSize = (typeof BANNER_SIZES)[number]['id']

const HOLD = 3400
const SLOGAN_HOLD = 6800
const LOGO_HOLD = 6000
const SWAP = 620

type Phase = 'enter' | 'flip' | 'pop' | 'hold'
type FlipChar = {
  ch: string
  accent: boolean
  breakBefore?: boolean
  side: 'left' | 'right'
}
type FlipWord = { breakBefore?: boolean; items: { item: FlipChar; index: number }[] }

const KEEP_TOGETHER = [
  ['show', 'up.'],
  ['Be', 'seen'],
  ['Légy', 'látható'],
]
const SLIM: BannerSize[] = ['728x90', '320x100']

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

function BannerSlogan({
  line1,
  line2,
  accent,
  slim,
}: {
  line1: string
  line2: string
  accent: string
  slim: boolean
}) {
  const chars = useMemo(() => buildSloganChars(line1, line2, accent), [line1, line2, accent])
  const words = useMemo(() => groupWords(chars), [chars])
  const [phase, setPhase] = useState<Phase>('enter')

  useEffect(() => {
    const timers: number[] = []
    const later = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms))
    }
    setPhase('enter')
    later(slim ? 900 : 1500, () => setPhase('flip'))
    later(slim ? 2100 : 2900, () => setPhase('pop'))
    later(slim ? 2600 : 3500, () => setPhase('hold'))
    return () => timers.forEach(clearTimeout)
  }, [line1, line2, accent, slim])

  return (
    <h2 className={`flip-stage is-${phase} site-banner-slogan`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex}>
          {word.breakBefore ? <br /> : null}
          <span className={word.items[0]?.item.ch === ' ' ? 'flip-gap' : 'flip-word'}>
            {word.items.map(({ item, index }) => (
              <span
                key={index}
                className={`flip-letter is-${item.side}${item.ch === ' ' ? ' is-space' : ''}${item.accent ? ' is-accent' : ''}`}
                style={{ '--i': index } as CSSProperties}
              >
                {item.ch === ' ' ? '\u00a0' : item.ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </h2>
  )
}

type Mark = { phrase: string; cls: string }

function FlipLine({ text, marks = [] }: { text: string; marks?: Mark[] }) {
  const ranges = marks.flatMap((mark) => {
    const from = text.toLowerCase().indexOf(mark.phrase.toLowerCase())
    if (from < 0) return []
    return [{ from, to: from + mark.phrase.length, cls: mark.cls }]
  })
  const markAt = (index: number) => ranges.find((range) => index >= range.from && index < range.to)?.cls
  let n = 0
  let at = 0
  return (
    <p className="site-banner-line">
      {text.split(/(\n|\s+)/).map((part, partIndex) => {
        const start = at
        at += part.length
        if (part === '\n') return <span key={`b-${partIndex}`} className="site-banner-break" />
        if (/^\s+$/.test(part)) {
          return (
            <span key={`s-${partIndex}`} className="site-banner-space">
              {'\u00a0'}
            </span>
          )
        }
        return (
          <span key={`w-${partIndex}`} className="site-banner-word">
            {part.split('').map((ch, charIndex) => {
              const i = n++
              const cls = markAt(start + charIndex)
              return (
                <span
                  key={charIndex}
                  className={`site-banner-ch${cls ? ` ${cls}` : ''}`}
                  style={{ '--i': i } as CSSProperties}
                >
                  {cls ? ch.toUpperCase() : ch}
                </span>
              )
            })}
          </span>
        )
      })}
    </p>
  )
}

type Slide =
  | { kind: 'slogan'; tone: string }
  | { kind: 'line'; text: string; tone: string; marks?: Mark[] }
  | { kind: 'card'; text: string; tone: string; marks?: Mark[] }
  | { kind: 'logo'; tone: string }

function SlideCopy({
  slide,
  copy,
  slim,
}: {
  slide: Slide
  copy: ReturnType<typeof useLocale>['copy']
  slim: boolean
}) {
  if (slide.kind === 'logo') {
    return (
      <img
        src="/logos/takemo-header.png"
        alt="Takemo — Take Mee Online"
        className="site-banner-mark"
      />
    )
  }
  if (slide.kind === 'slogan') {
    return <BannerSlogan line1={copy.slogan.line1} line2={copy.slogan.line2} accent={copy.slogan.accent} slim={slim} />
  }
  return <FlipLine text={slide.text} marks={slide.marks} />
}

export function SiteBanner({ size }: { size: BannerSize }) {
  const { copy, locale } = useLocale()
  const spec = BANNER_SIZES.find((item) => item.id === size) ?? BANNER_SIZES[0]
  const slim = SLIM.includes(size)
  const ref = useRef<HTMLAnchorElement>(null)
  const [live, setLive] = useState(false)
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)

  const slides: Slide[] = useMemo(
    () => [
      { kind: 'slogan', tone: 'is-yellow' },
      {
        kind: 'line',
        text: copy.chapters[0].title
          .replace(' nem elég', '\nnem elég')
          .replace(' no longer enough', '\nno longer enough'),
        tone: 'is-white',
        marks: [{ phrase: locale === 'hu' ? 'nem elég' : 'no longer enough', cls: 'is-accent' }],
      },
      { kind: 'line', text: copy.chapters[1].title, tone: 'is-red' },
      { kind: 'line', text: copy.chapters[2].title, tone: 'is-blue' },
      { kind: 'line', text: copy.journeyLine, tone: 'is-yellow' },
      { kind: 'line', text: copy.helpLine, tone: 'is-white' },
      { kind: 'line', text: copy.payLine, tone: 'is-green' },
      ...copy.helpCards.map((card, index) => {
        let text = card.title.replaceAll('Webshop', 'Webáruház')
        text = text.replace(', online fizetéssel', ',\nonline fizetéssel')
        text = text.replace(' and online payment', '\nand online payment')
        const marks: Mark[] =
          index === 0
            ? [{ phrase: locale === 'hu' ? 'egyszerű bemutatkozó oldal' : 'simple introduction site', cls: 'is-accent' }]
            : index === 1
              ? [{ phrase: locale === 'hu' ? 'komplex weboldal' : 'full website', cls: 'is-accent' }]
              : index === 2
                ? [{ phrase: locale === 'hu' ? 'Webáruház' : 'shop', cls: 'is-gold' }]
                : index === 3
                  ? [
                      { phrase: locale === 'hu' ? 'Médiamegosztó' : 'media', cls: 'is-contrast' },
                      { phrase: locale === 'hu' ? 'hírportál' : 'news', cls: 'is-contrast' },
                    ]
                  : []
        return { kind: 'card' as const, text, tone: `help-${index}`, marks }
      }),
      { kind: 'logo', tone: 'is-yellow' },
    ],
    [copy, locale],
  )

  useEffect(() => {
    const node = ref.current
    if (!node) return
    return watchArrived(node, () => setLive(true))
  }, [])

  useEffect(() => {
    if (!live) return
    const wait =
      slides[step]?.kind === 'logo' ? LOGO_HOLD : slides[step]?.kind === 'slogan' ? SLOGAN_HOLD : HOLD
    const id = window.setTimeout(() => {
      setLeaving(step)
      setStep((n) => (n + 1) % slides.length)
    }, wait)
    return () => clearTimeout(id)
  }, [live, step, slides, locale])

  useEffect(() => {
    if (leaving === null) return
    const id = window.setTimeout(() => setLeaving(null), SWAP)
    return () => clearTimeout(id)
  }, [leaving])

  useEffect(() => {
    setStep(0)
    setLeaving(null)
  }, [locale])

  const slide = slides[step]
  const gone = leaving !== null ? slides[leaving] : null

  return (
    <a
      ref={ref}
      href="https://takemo.hu"
      target="_top"
      className={`site-banner is-${size}${slim ? ' is-slim' : ''} ${slide.tone} no-underline`}
      style={{ '--bw': `${spec.w}px`, '--bh': `${spec.h}px` } as CSSProperties}
    >
      <span className={`site-banner-wash ${slide.tone}`} />
      {gone ? (
        <span className="site-banner-panel is-out">
          <SlideCopy slide={gone} copy={copy} slim={slim} />
        </span>
      ) : null}
      {live ? (
        <span className="site-banner-panel is-in">
          <SlideCopy key={`${locale}-${size}-${step}`} slide={slide} copy={copy} slim={slim} />
        </span>
      ) : null}
    </a>
  )
}
