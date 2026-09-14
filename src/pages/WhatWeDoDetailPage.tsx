import { Link, Navigate, useParams } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { QuoteCta } from '../components/QuoteCta'
import { Reveal } from '../components/Reveal'
import { wwdPages } from '../data'

export function WhatWeDoDetailPage() {
  const { slug } = useParams()
  const page = wwdPages.find((item) => item.slug === slug)

  if (!page || page.slug === 'overview') return <Navigate to="/what-we-do" replace />

  return (
    <div className="page-enter">
      <PageHero title={page.title} />
      <section className="bg-white pb-16">
        <Reveal className="page-wrap max-w-3xl">
          <p className="text-lg leading-8 text-ink">{page.body}</p>
          <Link to="/what-we-do" className="mt-8 inline-block text-sm font-bold uppercase tracking-wider text-brand-soft">
            ← Back to overview
          </Link>
        </Reveal>
      </section>
      <QuoteCta />
    </div>
  )
}
