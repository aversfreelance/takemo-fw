import { useState, type FormEvent } from 'react'
import { company } from '../data'
import { useLocale } from '../i18n/locale'
import { api } from '../lib/api'

export function ContactPage() {
  const { copy, locale } = useLocale()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError(false)
    try {
      await api.createOrder({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        message: String(data.get('message') || ''),
        locale,
      })
      setSent(true)
    } catch {
      setError(true)
    }
  }

  return (
    <section className="page-enter bg-wash pt-36 pb-16">
      <div className="page-wrap grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="section-title left">{copy.contactTitle}</h1>
          <p className="mt-4 max-w-xl text-muted">{copy.contactLead}</p>
          <ul className="mt-6 space-y-3 text-sm leading-7">
            <li>
              <strong>E-mail:</strong> {company.email}
            </li>
            <li>
              <strong>{copy.footerContact}:</strong> {company.office}
            </li>
            <li>{copy.footerAlso}</li>
            <li>{copy.footerHours}</li>
          </ul>
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
            <iframe
              title="Takemo Minehead"
              className="h-72 w-full"
              loading="lazy"
              src="https://maps.google.com/maps?q=Minehead%20Somerset&t=&z=13&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-bold">{copy.ctaPrimary}</h2>
          {sent ? (
            <p className="mt-6 font-medium">{copy.sent}</p>
          ) : (
            <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
              <input required name="name" placeholder={copy.name} className="field" />
              <input required type="email" name="email" placeholder={copy.email} className="field" />
              <textarea required name="message" placeholder={copy.message} rows={6} className="field resize-y" />
              {error ? <p className="font-bold text-brand">…</p> : null}
              <button type="submit" className="btn-primary mt-2 w-fit">
                {copy.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
