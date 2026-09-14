import { useEffect, useRef, useState } from 'react'
import { watchArrived } from '../lib/whenArrived'
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
    return watchArrived(node, () => {
      queue.push(() => {
        setOn(true)
        window.setTimeout(release, 320)
      })
      runNext()
    })
  }, [])

  return (
    <Tag ref={ref as never} className={on ? 'essay-flip is-flip' : 'essay-blank'}>
      <span className={on ? undefined : 'essay-ghost'}>{rich ? <RichText text={text} /> : text}</span>
    </Tag>
  )
}
