import { useEffect, useRef, useState } from 'react'
import { RichText } from './RichText'

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

export function FlipRun({ text, rich = false, as: Tag }: { text: string; rich?: boolean; as: 'h2' | 'p' }) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          queue.push(() => {
            setOn(true)
            window.setTimeout(release, 320)
          })
          runNext()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref as never} className={on ? 'essay-flip is-flip' : 'essay-blank'}>
      <span className={on ? undefined : 'essay-ghost'}>{rich ? <RichText text={text} /> : text}</span>
    </Tag>
  )
}
