import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export function PageHero({ title, accent, children }: { title: string; accent?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-white pt-36 pb-10">
      <Reveal className="page-wrap relative z-[1]">
        <h1 className="section-title">
          {title}
          {accent ? (
            <>
              {' '}
              <strong>{accent}</strong>
            </>
          ) : null}
        </h1>
        {children ? <div className="mx-auto mt-4 max-w-2xl text-center text-ink">{children}</div> : null}
      </Reveal>
    </section>
  )
}
