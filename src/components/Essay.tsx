import { RichText } from './RichText'
import { useLocale } from '../i18n/locale'

export function Essay({ afterHero = false }: { afterHero?: boolean }) {
  const { copy } = useLocale()

  return (
    <section className={`essay${afterHero ? ' essay-after-hero' : ''}`}>
      <article className="essay-sheet" lang={copy.htmlLang}>
        {copy.chapters.map((chapter) => (
          <div key={chapter.id} id={chapter.id}>
            <h2>{chapter.title}</h2>
            {chapter.paragraphs.map((paragraph, index) => (
              <p key={index}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        ))}
      </article>
    </section>
  )
}
