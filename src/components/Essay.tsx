import { FlipRun } from './FlipText'
import { useLocale } from '../i18n/locale'

export function Essay({ afterHero = false }: { afterHero?: boolean }) {
  const { copy, locale } = useLocale()

  return (
    <section className={`essay${afterHero ? ' essay-after-hero' : ''}`}>
      <article className="essay-sheet" lang={copy.htmlLang}>
        {copy.chapters.map((chapter) => (
          <div key={`${locale}-${chapter.id}`} id={chapter.id}>
            <FlipRun as="h2" text={chapter.title} />
            {chapter.paragraphs.map((paragraph, index) => (
              <FlipRun key={index} as="p" text={paragraph} rich />
            ))}
          </div>
        ))}
      </article>
    </section>
  )
}
