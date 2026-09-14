import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { ChannelWall } from './ChannelWall'
import { Reveal } from './Reveal'

const tones = ['is-a', 'is-b', 'is-c', 'is-d', 'is-e']

export function Journey() {
  const { copy } = useLocale()
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('takemo-order') : ''
  const hrefs = token
    ? ['/start', `/order/${token}/details`, `/order/${token}/modules`, `/order/${token}/review`, `/order/${token}/pay`]
    : ['/start', '/start', '/modules', '/start', '/start']

  return (
    <section className="overflow-hidden bg-wash py-24" id="journey">
      <div className="page-wrap">
        <Reveal variant="left">
          <p className="mb-8 text-left text-[clamp(1.4rem,3vw,2.4rem)] font-extrabold uppercase leading-[1.1] tracking-[0.04em] text-ink">
            {copy.journeyLine}
          </p>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {copy.journey.map((item, index) => (
            <Reveal key={item.n} delay={index * 80} variant="zoom">
              <Link to={hrefs[index]} className="block no-underline">
                <article className={`stage-card stage-low ${tones[index]} flex items-center justify-center text-center`}>
                  <h3 className="text-[clamp(1.35rem,2.2vw,2.05rem)] font-extrabold leading-[1.05]">{item.label}</h3>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="mt-14">
        <ChannelWall />
      </div>
    </section>
  )
}
