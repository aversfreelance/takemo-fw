import { useState, type FormEvent } from 'react'
import { useLocale } from '../i18n/locale'

export function QuotePage() {
  const { copy } = useLocale()
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section className="page-enter bg-wash pt-36 pb-16">
      <div className="page-wrap grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="section-title left">{copy.quoteTitle}</h1>
          <p className="mt-4 max-w-xl text-muted">{copy.quoteLead}</p>
          {sent ? (
            <p className="mt-8 rounded-2xl bg-white px-5 py-8 font-medium shadow-sm">{copy.sent}</p>
          ) : (
            <form className="mt-8 grid gap-3 rounded-2xl bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
              <input required name="name" placeholder={copy.name} className="field" />
              <input required type="email" name="email" placeholder={copy.email} className="field" />
              <input type="tel" name="phone" placeholder={copy.phone} className="field" />
              <textarea required name="message" placeholder={copy.message} rows={6} className="field resize-y" />
              <label className="flex items-start gap-2 text-xs leading-5 text-muted">
                <input required type="checkbox" className="mt-0.5" />
                <span>{copy.privacyCheck}</span>
              </label>
              <button type="submit" className="btn-primary mt-2 w-fit">
                {copy.send}
              </button>
            </form>
          )}
        </div>
        <aside className="bg-white p-8">
          <h2 className="footer-title mt-0">{copy.quoteTitle}</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-ink">
            {copy.formHint.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
