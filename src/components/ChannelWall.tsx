import { channelLogos } from './ChannelLogos'

export function ChannelWall({ reverse = false }: { reverse?: boolean }) {
  const strip = [...channelLogos, ...channelLogos]

  return (
    <div className="marquee">
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
