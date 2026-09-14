import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { RichText } from './RichText'

type Tok = { text: string; bold: boolean }

const queue: Array<() => void> = []
let busy = false

function runNext() {
  if (busy) return
  const start = queue.shift()
  if (!start) return
  busy = true
  start()
}

function release() {
  busy = false
  runNext()
}

function tokens(text: string): Tok[] {
  const out: Tok[] = []
  text.split('\n').forEach((line, lineIndex) => {
    if (lineIndex > 0) out.push({ text: '\n', bold: false })
    line.split(/(\*\*[^*]+\*\*)/g).forEach((part) => {
      const bold = part.startsWith('**') && part.endsWith('**')
      const raw = bold ? part.slice(2, -2) : part
      raw.split(/(\s+)/).forEach((bit) => {
        if (bit) out.push({ text: bit, bold })
      })
    })
  })
  return out
}

function LineText({ bits }: { bits: Tok[] }) {
  return (
    <>
      {bits.map((bit, index) =>
        bit.bold ? <strong key={index}>{bit.text}</strong> : <span key={index}>{bit.text}</span>,
      )}
    </>
  )
}

function Measure({ text, onLines }: { text: string; onLines: (lines: Tok[][]) => void }) {
  const ref = useRef<HTMLSpanElement>(null)
  const bits = tokens(text)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const nodes = [...root.querySelectorAll('[data-tok]')] as HTMLElement[]
    const grouped: Tok[][] = []
    let top = -999
    let line: Tok[] = []
    nodes.forEach((node, index) => {
      const bit = bits[index]
      if (!bit || bit.text === '\n') {
        if (line.length) grouped.push(line)
        line = []
        top = -999
        return
      }
      const next = node.offsetTop
      if (Math.abs(next - top) > 2) {
        if (line.length) grouped.push(line)
        line = []
        top = next
      }
      line.push(bit)
    })
    if (line.length) grouped.push(line)
    onLines(grouped)
  }, [bits, onLines, text])

  return (
    <span ref={ref}>
      {bits.map((bit, index) =>
        bit.text === '\n' ? (
          <br key={index} data-tok="" />
        ) : (
          <span key={index} data-tok="">
            {bit.bold ? <strong>{bit.text}</strong> : bit.text}
          </span>
        ),
      )}
    </span>
  )
}

export function FlipRun({ text, rich = false, as: Tag }: { text: string; rich?: boolean; as: 'h2' | 'p' }) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null)
  const [mode, setMode] = useState<'wait' | 'measure' | 'flip'>('wait')
  const [lines, setLines] = useState<Tok[][]>([])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          queue.push(() => setMode('measure'))
          runNext()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (mode !== 'flip') return
    const timer = window.setTimeout(release, 240 + lines.length * 40)
    return () => window.clearTimeout(timer)
  }, [mode, lines.length])

  return (
    <Tag ref={ref as never} className={mode === 'flip' ? 'essay-flip is-flip' : 'essay-blank'}>
      {mode === 'wait' || mode === 'measure' ? (
        <span className="essay-ghost">
          {mode === 'measure' ? (
            <Measure
              text={text}
              onLines={(next) => {
                setLines(next)
                setMode('flip')
              }}
            />
          ) : rich ? (
            <RichText text={text} />
          ) : (
            text
          )}
        </span>
      ) : null}
      {mode === 'flip'
        ? lines.map((line, index) => (
            <span key={index} className="essay-line" style={{ '--i': index } as CSSProperties}>
              <LineText bits={line} />
            </span>
          ))
        : null}
    </Tag>
  )
}
