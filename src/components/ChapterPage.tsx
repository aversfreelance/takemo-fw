import type { ReactNode } from 'react'
import { QuoteCta } from './QuoteCta'
import { PosterGrid } from './PosterGrid'
import { Reveal } from './Reveal'
import type { Copy } from '../i18n/copy'

export function ChapterPage({
  chapter,
  visual,
}: {
  chapter: Copy['chapters'][number]
  visual: ReactNode
}) {
  return (
    <div className="page-enter">
      <section className="chapter-hero overflow-hidden bg-[#ffd24a] pt-36 pb-20">
        <Reveal className="page-wrap">
          <p className="story-kicker">{chapter.kicker}</p>
          <h1 className="max-w-5xl text-[clamp(2.6rem,7vw,6.4rem)] font-extrabold leading-[0.92]">
            {chapter.title}
          </h1>
        </Reveal>
      </section>
      {visual}
      <PosterGrid paragraphs={chapter.paragraphs} />
      <QuoteCta />
    </div>
  )
}
