import { company } from '../data'
import { useLocale } from '../i18n/locale'

export function PrivacyPage() {
  const { copy } = useLocale()

  return (
    <section className="page-enter bg-white pt-36 pb-16">
      <div className="mx-auto max-w-3xl px-4 leading-7">
        <h1 className="section-title">{copy.privacy}</h1>
        {copy.privacyBody.map((paragraph) => (
          <p key={paragraph} className="mt-6 text-muted">
            {paragraph}
          </p>
        ))}
        <p className="mt-4 text-muted">{company.email}</p>
      </div>
    </section>
  )
}
