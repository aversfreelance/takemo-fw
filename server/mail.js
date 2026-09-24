function notifyTo() {
  return process.env.NOTIFY_EMAIL || process.env.SUPERUSER_EMAIL || ''
}

function publicUrl() {
  return process.env.PUBLIC_URL || ''
}

function formatDue(order) {
  const amount = order?.totals?.remainder
  const currency = order?.totals?.currency || 'HUF'
  if (amount == null) return ''
  if (currency === 'HUF') return `${Math.round(amount).toLocaleString('hu-HU')} Ft`
  return `£${(amount / 100).toFixed(2)}`
}

export async function notifyPaymentDue(order) {
  const to = order?.enquiry?.email
  if (!to) return

  const url = publicUrl()
  const payUrl = url ? `${url}/order/${order.token}/pay` : ''
  const due = formatDue(order)
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      message: due ? `Fizetés elküldve. Fennmaradó 80%: ${due}.` : 'Fizetés elküldve.',
      order: order?.id ? `#${order.id}` : '',
      pay: payUrl,
      _subject: `Takemo — Fizetés elküldve${order?.id ? ` #${order.id}` : ''}`,
      _replyto: notifyTo(),
      _template: 'box',
      _captcha: 'false',
    }),
  })
  if (!response.ok) {
    throw new Error(await response.text())
  }
}

export async function notifyPreviewReady(order) {
  const to = order?.enquiry?.email
  if (!to) return

  const url = publicUrl()
  const previewUrl = url ? `${url}/order/${order.token}/preview` : ''
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      message: 'A weboldal átnézhető. Nyissa meg az áttekintés oldalt, és jelezze, ha módosítást kér, vagy elfogadja.',
      preview: order?.previewUrl || '',
      overview: previewUrl,
      _subject: `Takemo — Weboldal átnézhető${order?.id ? ` #${order.id}` : ''}`,
      _replyto: notifyTo(),
      _template: 'box',
      _captcha: 'false',
    }),
  })
  if (!response.ok) {
    throw new Error(await response.text())
  }
}

export async function notifyPreviewChanges(order) {
  const to = notifyTo()
  if (!to || !order?.previewFeedback) return

  const url = publicUrl()
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      message: order.previewFeedback,
      order: order?.id ? `#${order.id}` : '',
      admin: url ? `${url}/admin` : '',
      _subject: `Takemo — Módosítás kérve${order?.id ? ` #${order.id}` : ''}`,
      _replyto: order?.enquiry?.email || notifyTo(),
      _template: 'box',
      _captcha: 'false',
    }),
  })
  if (!response.ok) {
    throw new Error(await response.text())
  }
}

export async function notifyNewMessage(order) {
  const to = notifyTo()
  const enquiry = order?.enquiry || {}
  if (!to || !enquiry.message) return

  const url = publicUrl()
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: enquiry.name || '',
      email: enquiry.email || '',
      phone: enquiry.phone || '',
      message: enquiry.message,
      order: order?.id ? `#${order.id}` : '',
      admin: url ? `${url}/admin` : '',
      _subject: `Takemo — ${enquiry.name || enquiry.email}`,
      _replyto: enquiry.email || '',
      _template: 'box',
      _captcha: 'false',
    }),
  })
  if (!response.ok) {
    throw new Error(await response.text())
  }
}
