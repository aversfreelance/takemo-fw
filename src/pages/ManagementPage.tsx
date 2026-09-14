import { PackageGrid } from '../components/PackageGrid'
import { PageHero } from '../components/PageHero'
import { QuoteCta } from '../components/QuoteCta'
import { packages } from '../data'

export function ManagementPage() {
  return (
    <div className="page-enter">
      <PageHero title="Online" accent="management">
        We run the website, email, hosting and the small weekly jobs — you stay on the tools.
      </PageHero>
      <section className="bg-wash py-16">
        <div className="page-wrap">
          <PackageGrid items={packages.management} />
        </div>
      </section>
      <QuoteCta />
    </div>
  )
}
