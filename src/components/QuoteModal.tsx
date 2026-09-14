import { useState, type FormEvent } from 'react'
import { useLocale } from '../i18n/locale'

type Props = {
  open: boolean
  onClose: () => void
}

export function QuoteModal({ open, onClose }: Props) {
  const { copy } = useLocale()
  const [sent, setSent] = useState(false)

  if (!open) return null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-ink/60" aria-label="Close" onClick={onClose} />
      <div className="page-enter relative w-full max-w-lg rounded-[10px] bg-white p-6 shadow-2xl md:p-8">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-2xl leading-none text-muted" aria-label="Close">
          ×
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{copy.quoteTitle}</p>
        <h2 className="mt-2 text-3xl font-bold">{copy.quoteToday}</h2>
        <p className="mt-2 text-sm text-muted">{copy.quoteLead}</p>

        {sent ? (
          <p className="mt-8 rounded-xl bg-wash px-4 py-6 text-center font-medium">{copy.sent}</p>
        ) : (
          <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
            <input required name="name" placeholder={copy.name} className="field" />
            <input required type="email" name="email" placeholder={copy.email} className="field" />
            <input type="tel" name="phone" placeholder={copy.phone} className="field" />
            <textarea name="message" placeholder={copy.message} rows={4} className="field resize-y" />
            <label className="flex items-start gap-2 text-xs leading-5 text-muted">
              <input required type="checkbox" className="mt-0.5" />
              <span>{copy.privacyCheck}</span>
            </label>
            <button type="submit" className="btn-primary mt-2">
              {copy.send}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
