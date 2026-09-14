import { useEffect, useRef, useState } from 'react'
import { watchArrived } from '../lib/whenArrived'
import { channelLogos } from './ChannelLogos'

export function ChannelWall({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  const strip = [...channelLogos, ...channelLogos]

  useEffect(() => {
    const node = ref.current
    if (!node) return
    return watchArrived(node, () => setOn(true))
  }, [])

  return (
    <div ref={ref} className={`marquee${on ? ' is-on' : ''}`}>
      <div className={`marquee-track${reverse ? ' reverse' : ''}`}>
        {strip.map((item, index) => (
          <span key={`${item.id}-${index}`} className="channel-logo">
            <img src={item.src} alt={item.label} />
          </span>
        ))}
      </div>
    </div>
  )
}
