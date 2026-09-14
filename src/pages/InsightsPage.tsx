import { posts } from '../data'
import { Reveal } from '../components/Reveal'

export function InsightsPage() {
  return (
    <section className="page-enter bg-white pt-36 pb-16">
      <div className="page-wrap">
        <h1 className="section-title">Insights</h1>
        <p className="section-sub">Short notes from the work: websites, local search, hosting.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 90}>
              <article className="card-lift h-full rounded-2xl border border-line p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">{post.date}</p>
                <h2 className="mt-3 text-xl font-bold">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{post.excerpt}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
