import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { Reveal } from './Reveal'

export function PaySplit({ bare = false }: { bare?: boolean }) {
  const { copy } = useLocale()
  const chapter = copy.chapters[2]

  return (
    <section className={`overflow-x-hidden bg-ink text-white${bare ? ' py-16' : ' py-24'}`} id="modules">
      <div className="page-wrap">
        {bare ? null : (
          <Reveal>
            <p className="mb-4 text-sm font-extrabold tracking-[0.22em] text-[#ffd24a]">{chapter.kicker}</p>
            <h2 className="max-w-4xl text-[clamp(2.2rem,6vw,5.2rem)] font-extrabold leading-[0.95]">
              {chapter.title}
            </h2>
          </Reveal>
        )}
        <Reveal className={bare ? '' : 'mt-10'} variant="fade">
          <div className="pay-explain">
            {copy.paySteps.map((step, index) => (
              <div key={step.share} className={`pay-explain-block${index === 0 ? ' is-first' : ''}`}>
                <p className="pay-explain-lead">{step.lead}</p>
                <p className={`pay-explain-share${index === 0 ? ' text-brand' : ' text-brand-soft'}`}>{step.share}</p>
                <p className="pay-explain-detail">{step.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>
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
