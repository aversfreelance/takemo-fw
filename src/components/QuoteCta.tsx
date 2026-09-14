import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { Reveal } from './Reveal'

export function QuoteCta() {
  const { copy } = useLocale()

  return (
    <section className="bg-brand py-24 text-white">
      <Reveal className="page-wrap">
        <p className="max-w-5xl text-[clamp(1.8rem,4.2vw,3.4rem)] font-extrabold leading-[1.05] text-white">
          {copy.quoteToday}
        </p>
        <Link
          to="/start"
          className="mt-10 inline-flex h-12 items-center rounded-[6px] bg-[#ffd24a] px-10 text-sm font-extrabold uppercase tracking-[0.08em] text-ink transition hover:-translate-y-1"
        >
          {copy.quoteBtn}
        </Link>
      </Reveal>
    </section>
  )
}
