import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { Reveal } from './Reveal'

export function PaySplit({ bare = false }: { bare?: boolean }) {
  const { copy } = useLocale()
  const chapter = copy.chapters[2]

  return (
    <section className="overflow-x-hidden bg-ink py-24 text-white" id="modules">
      <div className="page-wrap">
        {bare ? null : (
          <Reveal>
            <p className="mb-4 text-sm font-extrabold tracking-[0.22em] text-[#ffd24a]">{chapter.kicker}</p>
            <h2 className="max-w-4xl text-[clamp(2.2rem,6vw,5.2rem)] font-extrabold leading-[0.95]">
              {chapter.title}
            </h2>
          </Reveal>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,4fr)] gap-3${bare ? '' : ' mt-14'}`}>
          <Reveal className="pay-slide min-w-0" variant="fade">
            <div className="pay-block pay-block-sm pay-from-left bg-brand">
              <div>
                <p className="pay-num">{copy.payNow}</p>
                <p className="pay-note mt-4 px-3 text-sm font-extrabold uppercase tracking-[0.16em]">{copy.payNowNote}</p>
              </div>
            </div>
          </Reveal>
          <Reveal className="pay-slide min-w-0" variant="fade" delay={140}>
            <div className="pay-block pay-from-right bg-brand-soft">
              <div>
                <p className="pay-num">{copy.payLater}</p>
                <p className="mt-4 px-6 text-sm font-extrabold uppercase tracking-[0.16em]">{copy.payLaterNote}</p>
              </div>
            </div>
          </Reveal>
        </div>
        {bare ? null : (
          <Reveal className="mt-12">
            <p className="max-w-2xl text-xl leading-8 text-white">{chapter.paragraphs[1].replace(/\*\*/g, '')}</p>
            <Link to="/modules" className="btn-primary mt-8 inline-flex">
              {copy.more}
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}
