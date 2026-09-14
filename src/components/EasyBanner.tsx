import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { Reveal } from './Reveal'

export function EasyBanner({ bare = false }: { bare?: boolean }) {
  const { copy } = useLocale()
  const chapter = copy.chapters[3]

  return (
    <section className="bg-[#ffd24a] py-28" id="easy">
      <div className="page-wrap">
        <Reveal>
          {bare ? null : <p className="story-kicker">{chapter.kicker}</p>}
          <p className="giant-line max-w-6xl">
            {(chapter.paragraphs[0].match(/\*\*(.+?)\*\*/)?.[1] ?? chapter.paragraphs[0]).replace(/\*\*/g, '')}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-10 max-w-xl text-2xl font-semibold leading-9">{chapter.paragraphs[1]}</p>
          <div className="mt-12 flex flex-wrap gap-3">
            {bare ? (
              <Link to="/contact" className="btn-primary">
                {copy.ctaPrimary}
              </Link>
            ) : (
              <>
                <Link to="/easy" className="btn-outline border-ink text-ink hover:bg-ink hover:text-white">
                  {copy.more}
                </Link>
                <Link to="/contact" className="btn-primary">
                  {copy.ctaPrimary}
                </Link>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}