import { Reveal } from './Reveal'
import { RichText } from './RichText'

export function PosterGrid({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section className="bg-white py-16">
      <div className="page-wrap poster-grid">
        {paragraphs.map((paragraph, index) => (
          <Reveal key={index} delay={Math.min(index * 50, 200)} variant={index % 2 ? 'right' : 'left'} className="h-full">
            <article className={`poster poster-${index % 4} h-full`}>
              <p>
                <RichText text={paragraph} />
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
