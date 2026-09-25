import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api, type Order } from '../lib/api'
import { canPayBalance } from '../lib/orderStatus'
import { canViewPreview, previewApproved, previewWaitingChanges } from '../lib/preview'

export function OrderPreviewPanel({ order, onUpdate }: { order: Order; onUpdate: (order: Order) => void }) {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const open = canViewPreview(order)
  const waiting = previewWaitingChanges(order)
  const approved = previewApproved(order)

  async function run(kind: 'approve' | 'changes') {
    setBusy(kind)
    setError('')
    try {
      const next =
        kind === 'approve'
          ? await api.approvePreview(order.token)
          : await api.requestPreviewChanges(order.token, feedback)
      onUpdate(next)
      if (kind === 'changes') setFeedback('')
    } catch {
      setError(t.previewError)
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="mt-10 grid gap-4 rounded-[18px] border-[3px] border-ink bg-white p-6">
      <h2 className="text-xl font-extrabold">{t.previewTitle}</h2>
      <p className="font-bold text-muted">{t.previewLead}</p>
      {approved ? <p className="font-extrabold text-[#15803d]">{t.previewApproved}</p> : null}
      {approved && order.balancePending ? <p className="font-extrabold">{t.paymentPending}</p> : null}
      {approved && canPayBalance(order) && !order.balancePending ? (
        <Link to={`/order/${order.token}/pay`} className="btn-primary inline-flex w-fit">
          {t.payCard} — {t.remainder}
        </Link>
      ) : null}
      {waiting ? <p className="font-extrabold text-brand">{t.previewChangesSent}</p> : null}
      {!approved && !waiting && !open ? <p className="font-bold">{t.previewWaitingSend}</p> : null}
      {open && !approved ? (
        <a href={order.previewUrl!} className="btn-primary inline-flex w-fit" target="_blank" rel="noreferrer">
          {t.previewView}
        </a>
      ) : (
        <span className="btn-outline inline-flex w-fit cursor-not-allowed opacity-45">{t.previewView}</span>
      )}
      {open && !approved ? (
        <>
          <label className="grid gap-1">
            <span className="text-sm font-extrabold uppercase tracking-[0.12em]">{t.previewChangesLabel}</span>
            <textarea
              className="field min-h-32"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder={t.previewChangesPlaceholder}
            />
          </label>
          {error ? <p className="font-extrabold text-brand">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-outline"
              disabled={!feedback.trim() || Boolean(busy)}
              onClick={() => void run('changes')}
            >
              {busy === 'changes' ? '…' : t.previewRequestChanges}
            </button>
            <button type="button" className="btn-primary" disabled={Boolean(busy)} onClick={() => void run('approve')}>
              {busy === 'approve' ? '…' : t.previewApprove}
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}
