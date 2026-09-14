import { Reveal } from './Reveal'
import { RichText } from './RichText'
import type { Copy } from '../i18n/copy'

export function Story({ chapters }: { chapters: Copy['chapters'] }) {
  return (
    <>
      {chapters.map((chapter, index) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className={`story ${index % 2 === 0 ? 'bg-white' : 'bg-wash'}`}
        >
          <div className="page-wrap">
            <Reveal>
              <p className="story-kicker">{chapter.kicker}</p>
              <h2 className="story-title">{chapter.title}</h2>
            </Reveal>
            <div className="story-body">
              {chapter.paragraphs.map((paragraph, pIndex) => (
                <Reveal key={pIndex} delay={Math.min(pIndex * 50, 200)}>
                  <p>
                    <RichText text={paragraph} />
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
