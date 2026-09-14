import { PackageGrid } from '../components/PackageGrid'
import { PageHero } from '../components/PageHero'
import { QuoteCta } from '../components/QuoteCta'
import { packages } from '../data'

export function WebDesignPage() {
  return (
    <div className="page-enter">
      <PageHero title="Web" accent="design">
        Custom, mobile-first websites with clear one-off pricing. Built so you can change copy without calling a
        developer every time.
      </PageHero>
      <section className="bg-wash py-16">
        <div className="page-wrap">
          <PackageGrid items={packages.web} />
        </div>
      </section>
      <QuoteCta />
    </div>
  )
}
