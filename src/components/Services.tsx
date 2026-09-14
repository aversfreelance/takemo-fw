import { Link } from 'react-router-dom'
import { services } from '../data'
import { ServiceMark } from './Icons'
import { Reveal } from './Reveal'

export function Services({ compact = false }: { compact?: boolean }) {
  const items = compact ? services.slice(0, 4) : services

  return (
    <section className="bg-wash py-[75px]" id="services">
      <div className="page-wrap">
        <Reveal>
          <h2 className="section-title">
            How we take you
            <br />
            <strong>online</strong>
          </h2>
          <p className="section-sub">design · hosting · management · support</p>
        </Reveal>
        <div className="mt-[70px] grid gap-x-10 gap-y-12 md:grid-cols-2">
          {items.map((service, index) => (
            <Reveal key={service.slug} delay={index * 90}>
              <Link to={service.href} className="service-row group flex items-start gap-4 text-ink no-underline">
                <div className="w-[20%] shrink-0 pt-2 transition duration-500 group-hover:-translate-y-1 group-hover:brightness-0">
                  <ServiceMark className="ml-auto h-14 w-14 md:h-16 md:w-16" />
                </div>
                <div className="w-[80%] border-l-[5px] border-brand-soft pl-4 uppercase">
                  <span className="service-bar block h-0 w-0" />
                  <p className="m-0 text-sm font-bold text-ink/70">{service.eyebrow}</p>
                  <h3 className="mt-1 text-[clamp(20px,2vw,30px)] font-black leading-tight text-ink transition duration-300">
                    {service.title}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {compact && (
          <Reveal className="mt-12 text-center">
            <Link to="/what-we-do" className="btn-primary">
              See everything we do
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}
