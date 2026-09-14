import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { QuoteCta } from '../components/QuoteCta'
import { Reveal } from '../components/Reveal'
import { wwdPages } from '../data'

export function WhatWeDoPage() {
  const pages = wwdPages.filter((page) => page.slug !== 'overview')

  return (
    <div className="page-enter">
      <PageHero title="What we" accent="do">
        Focus on running your business. We handle the website, hosting, email and the jobs that otherwise sit on your
        desk.
      </PageHero>
      <section className="bg-wash py-16">
        <div className="page-wrap grid gap-5 md:grid-cols-2">
          {pages.map((page, index) => (
            <Reveal key={page.slug} delay={index * 80}>
              <Link to={`/what-we-do/${page.slug}`} className="card-lift block rounded-2xl bg-white p-7 no-underline text-ink">
                <h2 className="text-2xl font-bold">{page.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{page.body}</p>
                <span className="mt-5 inline-block text-sm font-bold uppercase tracking-wider text-brand">Read more →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <QuoteCta />
    </div>
  )
}
