import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { watchArrived } from '../lib/whenArrived'
import { Reveal } from './Reveal'

const tones = ['is-a', 'is-b', 'is-c', 'is-d', 'is-e']
const WAIT = 5000
const END_HOLD = 6000
const REWIND = 160
const PAUSE = 2000

function FlipCopy({ text }: { text: string }) {
  let n = 0
  return (
    <p className="journey-copy is-on">
      {text.split(/(\s+)/).map((part, partIndex) => {
        if (/^\s+$/.test(part)) return <span key={`s-${partIndex}`}>{part}</span>
        return (
          <span key={`w-${partIndex}`} className="journey-word">
            {part.split('').map((ch, charIndex) => {
              const i = n++
              return (
                <span key={charIndex} className="journey-ch" style={{ '--i': i } as CSSProperties}>
                  {ch}
                </span>
              )
            })}
          </span>
        )
      })}
    </p>
  )
}

export function Journey() {
  const { copy, locale } = useLocale()
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('takemo-order') : ''
  const hrefs = token
    ? ['/start', `/order/${token}/details`, `/order/${token}/modules`, `/order/${token}/review`, `/order/${token}/pay`]
    : ['/start', '/start', '/modules', '/start', '/start']
  const count = copy.journey.length
  const [open, setOpen] = useState(-1)
  const [showText, setShowText] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const started = useRef(false)
  const currentText = showText && open >= 0 ? copy.journey[open]?.text ?? '' : ''

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const timers: number[] = []
    let cancelled = false

    const later = (ms: number, fn: () => void) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) fn()
        }, ms),
      )
    }

    const play = () => {
      setShowText(true)
      setOpen(-1)
      const run = (i: number) => {
        setOpen(i)
        if (i < count - 1) {
          later(WAIT, () => run(i + 1))
          return
        }
        later(END_HOLD, () => {
          setShowText(false)
          const rewind = (j: number) => {
            setOpen(j)
            if (j >= 0) later(REWIND, () => rewind(j - 1))
            else later(PAUSE, play)
          }
          rewind(count - 2)
        })
      }
      later(200, () => run(0))
    }

    const start = () => {
      if (started.current) return
      started.current = true
      play()
    }

    const stop = watchArrived(node, start)

    return () => {
      cancelled = true
      stop()
      timers.forEach(clearTimeout)
      started.current = false
    }
  }, [count, locale])

  return (
    <section ref={sectionRef} className="overflow-x-hidden bg-wash py-24" id="journey">
      <div className="page-wrap">
        <Reveal variant="left">
          <p className="mb-8 text-left text-[clamp(1.4rem,3vw,2.4rem)] font-extrabold uppercase leading-[1.1] tracking-[0.04em] text-ink">
            {copy.journeyLine}
          </p>
        </Reveal>
        <div className="journey-board">
          <div className="journey-list">
            {copy.journey.map((item, index) => (
            <div key={item.n} className={`journey-row${index <= open ? ' is-on' : ''}`}>
                <div className={`stage-flip${index <= open ? ' is-on' : ''}`}>
                  <div className="stage-flip-inner">
                    <div className="stage-face stage-front stage-blank" aria-hidden />
                    <Link to={hrefs[index]} className="stage-face stage-back no-underline">
                      <article className={`stage-card stage-low ${tones[index]} flex h-full items-center justify-center text-center`}>
                        <h3 className="text-[clamp(1.35rem,2.2vw,2.05rem)] font-extrabold leading-[1.05]">{item.label}</h3>
                      </article>
                    </Link>
                  </div>
                </div>
                {showText && index === open && item.text ? <FlipCopy key={`${locale}-${item.n}-${open}`} text={item.text} /> : null}
              </div>
            ))}
          </div>
          {currentText ? (
            <div className="journey-copy-wide">
              <FlipCopy key={`${locale}-wide-${open}`} text={currentText} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
