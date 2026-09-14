import { useState } from 'react'
import { partners, testimonials } from '../data'
import { useUi } from '../context/ui'
import { Reveal } from './Reveal'

export function Testimonials() {
  const { openReview } = useUi()
  const [index, setIndex] = useState(0)
  const current = testimonials[index]
  const strip = [...partners, ...partners]

  return (
    <section className="bg-wash py-20">
      <div className="page-wrap">
        <Reveal>
          <h2 className="section-title">
            People we already <strong>take online</strong>
          </h2>
        </Reveal>
        <div className="marquee mt-10">
          <div className="marquee-track">
            {strip.map((partner, i) => (
              <span key={`${partner.name}-${i}`} className="text-lg font-bold uppercase tracking-wide text-ink/70">
                {partner.name}
                <span className="mx-3 text-brand">·</span>
                {partner.city}
              </span>
            ))}
          </div>
        </div>

        <Reveal>
          <h3 className="section-title mt-16">
            What they <strong>say</strong>
          </h3>
        </Reveal>
        <figure className="mx-auto mt-8 max-w-4xl bg-white p-8 text-center shadow-sm">
          <blockquote className="text-lg leading-8">{current.quote}</blockquote>
          <figcaption className="mt-5 text-sm font-bold uppercase">
            {current.author}
            <span className="font-normal text-muted"> · {current.company}</span>
          </figcaption>
          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              className="btn-outline"
              onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
            >
              Previous
            </button>
            <button type="button" className="btn-outline" onClick={() => setIndex((i) => (i + 1) % testimonials.length)}>
              Next
            </button>
          </div>
        </figure>
        <div className="mt-8 text-center">
          <button type="button" className="btn-primary" onClick={openReview}>
            Send your review
          </button>
        </div>
      </div>
    </section>
  )
}
