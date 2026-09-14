import { useState, type FormEvent } from 'react'

type Props = {
  open: boolean
  onClose: () => void
}

export function ReviewModal({ open, onClose }: Props) {
  const [sent, setSent] = useState(false)

  if (!open) return null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-ink/60" aria-label="Close" onClick={onClose} />
      <div className="page-enter relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-2xl leading-none text-muted" aria-label="Close">
          ×
        </button>
        <h2 className="text-3xl font-bold">
          Send your <strong className="text-brand">review</strong>
        </h2>
        {sent ? (
          <p className="mt-6 rounded-xl bg-wash px-4 py-6 text-center font-medium">Thank you.</p>
        ) : (
          <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
            <input required name="name" placeholder="Name" className="field" />
            <input name="company" placeholder="Company / project" className="field" />
            <textarea required name="review" placeholder="Your review" rows={5} className="field resize-y" />
            <button type="submit" className="btn-primary mt-2">
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
