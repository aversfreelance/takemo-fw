import { useUi } from '../context/ui'
import { Reveal } from './Reveal'

type Pack = { name: string; price: string; period: string; points: string[] }

export function PackageGrid({ items }: { items: Pack[] }) {
  const { openQuote } = useUi()

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {items.map((item, index) => (
        <Reveal key={item.name} delay={index * 100} variant="zoom">
          <article className="card-lift flex h-full flex-col rounded-2xl border border-line bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-soft">{item.name}</p>
            <p className="mt-3 text-4xl font-black text-ink">
              {item.price}
              <span className="ml-1 text-base font-semibold text-muted">{item.period}</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-ink">
              {item.points.map((point) => (
                <li key={point}>— {point}</li>
              ))}
            </ul>
            <button type="button" className="btn-primary mt-6 w-full" onClick={openQuote}>
              Enquire
            </button>
          </article>
        </Reveal>
      ))}
    </div>
  )
}
