import PDFDocument from 'pdfkit'
import { company } from './company.js'

function money(order, amount) {
  if (order.totals?.currency === 'HUF' || order.locale === 'hu') {
    return `${Number(amount).toLocaleString('hu-HU')} Ft`
  }
  return `£${(amount / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function writeDoc(order, kind) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48 })
    const chunks = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const title = kind === 'invoice' ? 'INVOICE / SZÁMLA' : 'CONTRACT / SZERZŐDÉS'
    doc.fillColor('#ee1c25').fontSize(22).text(company.legal)
    doc.fillColor('#1c1f2a').fontSize(16).text(title)
    doc.moveDown()
    doc.fontSize(11).fillColor('#1c1f2a')
    doc.text(`Order: ${order.id}`)
    doc.text(`Date: ${new Date(kind === 'invoice' ? order.deliveredAt || Date.now() : order.paidAt || Date.now()).toLocaleDateString('en-GB')}`)
    doc.text(`takemo.co.uk · ${company.office}`)
    doc.text(company.email)
    doc.moveDown()

    const who = order.details || {}
    doc.fontSize(12).text(who.businessName || order.enquiry.name)
    if (who.address) doc.text(who.address)
    if (who.vatNumber) doc.text(`VAT / adószám: ${who.vatNumber}`)
    if (who.domain) doc.text(`Website: ${who.domain}`)
    doc.text(order.enquiry.email)
    doc.moveDown()

    const lines = []
    if (order.selection.siteId) lines.push(`Website package: ${order.selection.siteId}`)
    for (const id of order.selection.moduleIds || []) lines.push(`Module: ${id}`)
    if (order.selection.careId) {
      lines.push(`Care: ${order.selection.careId} (${order.selection.careTerm || 'monthly'})`)
    }
    lines.forEach((line) => doc.text(line))
    doc.moveDown()

    const t = order.totals
    const vatPct = Math.round((t.vatRate || 0.2) * 100)
    doc.text(`Net: ${money(order, t.net)}`)
    doc.text(`VAT / ÁFA ${vatPct}%: ${money(order, t.vat)}`)
    doc.fontSize(13).text(`Total: ${money(order, t.gross)}`)
    doc.fontSize(11).text(`Deposit 20% paid: ${money(order, t.deposit)}`)
    doc.text(`Remainder on handover: ${money(order, t.remainder)}`)
    doc.moveDown()

    if (kind === 'contract') {
      doc.text(
        'This contract starts when the 20% deposit is paid. The remaining 80% is invoiced when the completed system is delivered and ready for use. Prices are as shown on takemo.co.uk.',
      )
      doc.moveDown()
      doc.text('Take Mee Online')
      doc.text('Client: paid by card — accepted')
    } else {
      doc.text(`Deposit received: ${money(order, t.deposit)}`)
      if (order.balancePaidAt) {
        doc.text(`Balance received: ${money(order, t.remainder)}`)
        doc.text('Status: paid in full')
      } else {
        doc.text(`Balance due: ${money(order, t.remainder)}`)
      }
    }

    doc.end()
  })
}

export function contractPdf(order) {
  return writeDoc(order, 'contract')
}

export function invoicePdf(order) {
  return writeDoc(order, 'invoice')
}
