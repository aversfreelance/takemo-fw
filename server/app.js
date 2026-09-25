import cors from 'cors'
import express from 'express'
import multer from 'multer'
import Stripe from 'stripe'
import { getCompany, saveCompany } from './company.js'
import { invoicePdf, contractPdf, handoverPdf, depositInvoicePdf } from './pdf.js'
import { getById, getByToken, putOrder, allOrders, ordersByUser, uid } from './store.js'
import { computeTotals, getCatalog, saveCatalog } from './totals.js'
import { notifyNewMessage, notifyPaymentDue, notifyPreviewReady, notifyPreviewChanges } from './mail.js'
import {
  dropSession,
  googleFromCredential,
  listUsers,
  loginUser,
  publicUser,
  registerUser,
  setUserAdmin,
  userFromToken,
} from './users.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
})

const PUBLIC_URL =
  process.env.PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173')
function publicUrlForOrder(order) {
  const base = PUBLIC_URL
  if (base.includes('localhost') || base.includes('127.0.0.1')) return base
  if (order?.locale === 'hu') return process.env.PUBLIC_URL_HU || 'https://takemo.hu'
  return process.env.PUBLIC_URL_EN || process.env.PUBLIC_URL || 'https://takemo.co.uk'
}
function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY || ''
  return secret ? new Stripe(secret) : null
}

function isHuf(order) {
  return order?.totals?.currency === 'HUF' || order?.locale === 'hu'
}

function stripeAmount(amount, order) {
  const value = Math.round(Number(amount || 0))
  if (!Number.isFinite(value) || value <= 0) return 0
  return isHuf(order) ? value * 100 : value
}

function sessionMatches(session, expected) {
  return Boolean(session && session.payment_status === 'paid' && Number(session.amount_total) === expected)
}

const emptyDetails = {
  businessName: '',
  companyNumber: '',
  address: '',
  vatNumber: '',
  domain: '',
  logoMode: 'us',
  logoFile: '',
  palette: '',
  referenceFile1: '',
  referenceFile2: '',
  content: '',
  products: '',
  frequency: '',
  mediaKind: '',
}

function wrap(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

function logoDataUrl(file) {
  if (!file?.buffer) return ''
  return `data:${file.mimetype || 'image/png'};base64,${file.buffer.toString('base64')}`
}

function publicOrder(order) {
  const { token, ...rest } = order
  return { ...rest, token, stripeEnabled: Boolean(getStripe()) }
}

function selectionFromBody(body = {}, current = {}) {
  return {
    siteId: body.siteId ?? current.siteId ?? '',
    moduleIds: Array.isArray(body.moduleIds) ? body.moduleIds : current.moduleIds || [],
    careId: body.careId ?? current.careId ?? '',
    careTerm: body.careTerm === 'yearly' ? 'yearly' : 'monthly',
  }
}

async function attachUser(req, _res, next) {
  req.user = publicUser(await userFromToken(req.get('x-user-token')))
  next()
}

function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401).json({ error: 'auth' })
    return
  }
  next()
}

function requireAdmin(req, res, next) {
  if (req.user?.admin) {
    next()
    return
  }
  res.status(401).json({ error: 'admin' })
}

async function requireOrder(req, res, next) {
  const order = await getByToken(req.params.token)
  if (!order) {
    res.status(404).json({ error: 'not found' })
    return
  }
  if (req.user?.admin || order.userId === req.user?.id) {
    req.order = order
    next()
    return
  }
  res.status(403).json({ error: 'owner' })
}

function handoverText(order) {
  const value = order?.handover
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    return [value.domain, value.hosting, value.database].filter(Boolean).join('\n\n')
  }
  return ''
}

function applyHandover(order, body = {}) {
  if (body.text != null) order.handover = String(body.text)
}

function stripeClientName(order) {
  return String(order.details?.businessName || order.enquiry?.name || 'Order').trim()
}

function stripePaymentLine(order, kind, co) {
  const client = stripeClientName(order)
  const isBalance = kind === 'balance'
  return {
    name: `${client} · ${order.id} · ${isBalance ? '80% balance' : '20% deposit'}`,
    description: isBalance
      ? `${co.name} — handover (development, design, configuration)`
      : `${co.name} — deposit (domain, hosting, database)`,
  }
}

function canPayDeposit(order) {
  return order && ['review', 'ready'].includes(order.status) && !order.paidAt
}

async function markPaid(order) {
  if (!canPayDeposit(order)) return order
  order.status = 'paid'
  order.paidAt = new Date().toISOString()
  return putOrder(order)
}

export function createApi() {
  const app = express()
  app.use(cors())

  app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    wrap(async (req, res) => {
      const stripe = getStripe()
      if (!stripe) {
        res.json({ ok: true })
        return
      }
      const secret = process.env.STRIPE_WEBHOOK_SECRET
      const payload = Buffer.isBuffer(req.body) ? req.body : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}))
      const event = secret
        ? stripe.webhooks.constructEvent(payload, req.headers['stripe-signature'], secret)
        : JSON.parse(payload.toString())
      if (event.type === 'checkout.session.completed') {
        const token = event.data.object.metadata?.token
        const kind = event.data.object.metadata?.kind
        const order = token ? await getByToken(token) : null
        if (order && kind === 'balance' && order.status === 'delivered' && !order.balancePaidAt) {
          const expected = stripeAmount(order.totals.remainder, order)
          if (sessionMatches(event.data.object, expected)) {
            order.balancePending = true
            await putOrder(order)
          }
        } else if (order && kind !== 'balance' && canPayDeposit(order)) {
          const expected = stripeAmount(order.totals.deposit, order)
          if (sessionMatches(event.data.object, expected)) {
            order.depositPending = true
            await putOrder(order)
          }
        }
      }
      res.json({ ok: true })
    }),
  )

  app.use(express.json({ limit: '2mb' }))
  app.use(wrap(attachUser))

  app.post(
    '/api/auth/register',
    wrap(async (req, res) => {
      const result = await registerUser(req.body || {})
      if (result.error) {
        res.status(400).json(result)
        return
      }
      res.json({ token: result.token, user: publicUser(result.user) })
    }),
  )

  app.post(
    '/api/auth/login',
    wrap(async (req, res) => {
      const result = await loginUser(req.body || {})
      if (result.error) {
        res.status(401).json(result)
        return
      }
      res.json({ token: result.token, user: publicUser(result.user) })
    }),
  )

  app.post(
    '/api/auth/google',
    wrap(async (req, res) => {
      const result = await googleFromCredential(req.body?.credential || '')
      if (result.error) {
        res.status(401).json(result)
        return
      }
      res.json({ token: result.token, user: publicUser(result.user) })
    }),
  )

  app.get('/api/auth/me', (req, res) => {
    res.json({
      user: req.user,
      googleClientId: process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
    })
  })

  app.post(
    '/api/auth/logout',
    wrap(async (req, res) => {
      await dropSession(req.get('x-user-token'))
      res.json({ ok: true })
    }),
  )

  app.get(
    '/api/me/orders',
    requireUser,
    wrap(async (req, res) => {
      res.json((await ordersByUser(req.user.id)).map(publicOrder))
    }),
  )

  app.post(
    '/api/orders',
    requireUser,
    wrap(async (req, res) => {
      const { name, email, phone, siteType, message, locale, siteId, careId, careTerm, moduleIds } = req.body || {}
      if (!message) {
        res.status(400).json({ error: 'missing' })
        return
      }
      const selection = selectionFromBody({
        siteId: siteId || (['simple', 'booking', 'shop', 'media'].includes(siteType) ? siteType : ''),
        careId,
        careTerm,
        moduleIds: Array.isArray(moduleIds)
          ? moduleIds
          : String(moduleIds || '')
              .split(',')
              .map((id) => id.trim())
              .filter(Boolean),
      })
      const order = await putOrder({
        id: uid(4),
        token: uid(16),
        userId: req.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        locale: locale === 'hu' ? 'hu' : 'en',
        status: 'enquiry',
        enquiry: {
          name: String(name || req.user.name || '').trim(),
          email: String(email || req.user.email || '').trim(),
          phone: phone || '',
          siteType: siteType || '',
          message,
        },
        details: null,
        selection,
        totals: await computeTotals(selection, locale === 'hu' ? 'hu' : 'en'),
        adminNote: '',
        paidAt: null,
        deliveredAt: null,
        balancePaidAt: null,
        stripeSessionId: null,
        handover: '',
        previewUrl: '',
        previewSentAt: null,
        previewApprovedAt: null,
        previewFeedback: null,
        previewRound: 0,
      })
      notifyNewMessage(order).catch((error) => {
        console.error('notify', error)
      })
      res.json(publicOrder(order))
    }),
  )

  app.get('/api/orders/:token', requireUser, wrap(requireOrder), (req, res) => {
    res.json(publicOrder(req.order))
  })

  app.post(
    '/api/orders/:token/details',
    requireUser,
    wrap(requireOrder),
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'reference1', maxCount: 1 },
      { name: 'reference2', maxCount: 1 },
    ]),
    wrap(async (req, res) => {
      const order = req.order
      if (order.status !== 'accepted' && order.status !== 'details') {
        res.status(409).json({ error: 'not accepted' })
        return
      }
      const body = req.body || {}
      const files = req.files || {}
      const logo = files.logo?.[0]
      const reference1 = files.reference1?.[0]
      const reference2 = files.reference2?.[0]
      order.details = {
        ...emptyDetails,
        ...order.details,
        businessName: body.businessName || '',
        companyNumber: body.companyNumber || '',
        address: body.address || '',
        vatNumber: body.vatNumber || '',
        domain: body.domain || '',
        logoMode: body.logoMode === 'upload' ? 'upload' : 'us',
        logoFile: logo ? logoDataUrl(logo) : order.details?.logoFile || '',
        palette: String(body.colors || '').trim(),
        referenceFile1: reference1 ? logoDataUrl(reference1) : order.details?.referenceFile1 || '',
        referenceFile2: reference2 ? logoDataUrl(reference2) : order.details?.referenceFile2 || '',
        content: body.content || '',
        products: body.products || '',
        frequency: body.frequency || '',
        mediaKind: body.mediaKind || '',
      }
      order.status = 'details'
      res.json(publicOrder(await putOrder(order)))
    }),
  )

  app.post(
    '/api/orders/:token/selection',
    requireUser,
    wrap(requireOrder),
    wrap(async (req, res) => {
      const order = req.order
      if (!['details', 'review', 'accepted'].includes(order.status)) {
        res.status(409).json({ error: 'locked' })
        return
      }
      order.selection = selectionFromBody(req.body, order.selection)
      order.totals = await computeTotals(order.selection, order.locale)
      res.json(publicOrder(await putOrder(order)))
    }),
  )

  app.post(
    '/api/orders/:token/review',
    requireUser,
    wrap(requireOrder),
    wrap(async (req, res) => {
      const order = req.order
      if (!order.details?.businessName) {
        res.status(409).json({ error: 'details' })
        return
      }
      order.status = 'review'
      res.json(publicOrder(await putOrder(order)))
    }),
  )

  app.post(
    '/api/orders/:token/preview/approve',
    requireUser,
    wrap(requireOrder),
    wrap(async (req, res) => {
      const order = req.order
      if (!order.previewSentAt || order.previewApprovedAt) {
        res.status(409).json({ error: 'preview' })
        return
      }
      order.previewApprovedAt = new Date().toISOString()
      res.json(publicOrder(await putOrder(order)))
    }),
  )

  app.post(
    '/api/orders/:token/preview/changes',
    requireUser,
    wrap(requireOrder),
    wrap(async (req, res) => {
      const order = req.order
      const feedback = String(req.body?.feedback || '').trim()
      if (!order.previewSentAt || !feedback) {
        res.status(400).json({ error: 'preview' })
        return
      }
      order.previewFeedback = feedback
      order.previewSentAt = null
      notifyPreviewChanges(order).catch((error) => {
        console.error('notify preview changes', error)
      })
      res.json(publicOrder(await putOrder(order)))
    }),
  )

  app.post(
    '/api/orders/:token/checkout',
    requireUser,
    wrap(requireOrder),
    wrap(async (req, res) => {
      const order = req.order
      const kind = req.body?.kind === 'balance' ? 'balance' : 'deposit'
      if (kind === 'deposit' && !canPayDeposit(order)) {
        res.status(409).json({ error: 'not ready' })
        return
      }
      if (kind === 'balance' && (order.status !== 'delivered' || !order.balanceDue || order.balancePaidAt)) {
        res.status(409).json({ error: 'not delivered' })
        return
      }
      const stripe = getStripe()
      if (!stripe) {
        res.status(400).json({ error: 'stripe-missing' })
        return
      }
      const amount = kind === 'balance' ? order.totals.remainder : order.totals.deposit
      const unitAmount = stripeAmount(amount, order)
      if (!unitAmount) {
        res.status(400).json({ error: 'amount' })
        return
      }
      const co = await getCompany()
      const line = stripePaymentLine(order, kind, co)
      const siteUrl = publicUrlForOrder(order)
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        locale: order.locale === 'hu' ? 'hu' : 'en',
        customer_email: order.enquiry.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: isHuf(order) ? 'huf' : 'gbp',
              unit_amount: unitAmount,
              product_data: {
                name: line.name,
                description: line.description,
              },
            },
          },
        ],
        metadata: {
          token: order.token,
          id: order.id,
          kind,
          businessName: stripeClientName(order),
          payment: kind === 'balance' ? '80%' : '20%',
        },
        payment_intent_data: {
          description: line.name,
          metadata: {
            orderId: order.id,
            businessName: stripeClientName(order),
            payment: kind === 'balance' ? '80%' : '20%',
          },
        },
        success_url:
          kind === 'balance'
            ? `${siteUrl}/order/${order.token}/pay?paid=1`
            : `${siteUrl}/order/${order.token}/modules?paid=1`,
        cancel_url:
          kind === 'balance'
            ? `${siteUrl}/order/${order.token}/pay`
            : `${siteUrl}/order/${order.token}/modules`,
      })
      if (kind === 'balance') order.stripeBalanceSessionId = session.id
      else order.stripeSessionId = session.id
      await putOrder(order)
      res.json({ url: session.url })
    }),
  )

  app.post(
    '/api/orders/:token/confirm-pay',
    requireUser,
    wrap(requireOrder),
    wrap(async (req, res) => {
      const order = req.order
      const stripe = getStripe()
      let checkout = null

      if (stripe && order.status === 'delivered' && !order.balancePaidAt && order.stripeBalanceSessionId) {
        const session = await stripe.checkout.sessions.retrieve(order.stripeBalanceSessionId)
        if (sessionMatches(session, stripeAmount(order.totals.remainder, order))) {
          order.balancePending = true
          checkout = 'succeeded'
        } else {
          order.balancePending = false
          checkout = 'failed'
        }
        res.json({ order: publicOrder(await putOrder(order)), checkout })
        return
      }

      if (stripe && order.stripeSessionId && canPayDeposit(order)) {
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId)
        if (sessionMatches(session, stripeAmount(order.totals.deposit, order))) {
          order.depositPending = true
          checkout = 'succeeded'
        } else {
          order.depositPending = false
          checkout = 'failed'
        }
        res.json({ order: publicOrder(await putOrder(order)), checkout })
        return
      }

      res.json({ order: publicOrder(order) })
    }),
  )

  app.post(
    '/api/orders/:token/demo-pay',
    requireUser,
    wrap(requireOrder),
    wrap(async (req, res) => {
      const order = req.order
      if (!canPayDeposit(order)) {
        res.status(409).json({ error: 'not ready' })
        return
      }
      if (getStripe()) {
        res.status(400).json({ error: 'use-stripe' })
        return
      }
      order.status = 'paid'
      order.paidAt = new Date().toISOString()
      res.json(publicOrder(await putOrder(order)))
    }),
  )

  app.get(
    '/api/orders/:token/contract.pdf',
    wrap(async (req, res) => {
      const order = await getByToken(req.params.token)
      if (!order || !['paid', 'delivered'].includes(order.status)) {
        res.status(409).json({ error: 'not paid' })
        return
      }
      const pdf = await contractPdf(order)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="takemo-${order.id}-contract.pdf"`)
      res.send(pdf)
    }),
  )

  app.get(
    '/api/orders/:token/deposit-invoice.pdf',
    wrap(async (req, res) => {
      const order = await getByToken(req.params.token)
      if (!order || !order.paidAt) {
        res.status(409).json({ error: 'not paid' })
        return
      }
      const pdf = await depositInvoicePdf(order)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="takemo-${order.id}-deposit-invoice.pdf"`)
      res.send(pdf)
    }),
  )

  app.get(
    '/api/orders/:token/invoice.pdf',
    wrap(async (req, res) => {
      const order = await getByToken(req.params.token)
      if (!order || order.status !== 'delivered' || !order.balancePaidAt) {
        res.status(409).json({ error: 'not paid' })
        return
      }
      const pdf = await invoicePdf(order)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="takemo-${order.id}-invoice.pdf"`)
      res.send(pdf)
    }),
  )

  app.get(
    '/api/orders/:token/handover.pdf',
    wrap(async (req, res) => {
      const order = await getByToken(req.params.token)
      if (!order || order.status !== 'delivered' || !order.balancePaidAt) {
        res.status(409).json({ error: 'not paid' })
        return
      }
      if (!handoverText(order).trim()) {
        res.status(409).json({ error: 'no handover' })
        return
      }
      const pdf = await handoverPdf(order)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="takemo-${order.id}-website.pdf"`)
      res.send(pdf)
    }),
  )

  app.get(
    '/api/catalog',
    wrap(async (_req, res) => {
      res.json(await getCatalog())
    }),
  )

  app.put(
    '/api/admin/catalog',
    wrap(requireAdmin),
    wrap(async (req, res) => {
      const next = req.body
      if (!next?.sites || !next?.care || !next?.groups) {
        res.status(400).json({ error: 'catalog' })
        return
      }
      res.json(await saveCatalog(next))
    }),
  )

  app.get(
    '/api/admin/company',
    wrap(requireAdmin),
    wrap(async (_req, res) => {
      res.json(await getCompany())
    }),
  )

  app.put(
    '/api/admin/company',
    wrap(requireAdmin),
    wrap(async (req, res) => {
      res.json(await saveCompany(req.body))
    }),
  )

  app.get(
    '/api/admin/users',
    wrap(requireAdmin),
    wrap(async (_req, res) => {
      res.json(await listUsers())
    }),
  )

  app.post(
    '/api/admin/users/:id/admin',
    wrap(requireAdmin),
    wrap(async (req, res) => {
      const result = await setUserAdmin(req.params.id, req.body?.admin !== false)
      if (result.error) {
        res.status(404).json({ error: result.error })
        return
      }
      res.json(publicUser(result.user))
    }),
  )

  app.delete(
    '/api/admin/users/:id/admin',
    wrap(requireAdmin),
    wrap(async (req, res) => {
      const result = await setUserAdmin(req.params.id, false)
      if (result.error) {
        res.status(404).json({ error: result.error })
        return
      }
      res.json(publicUser(result.user))
    }),
  )

  app.get(
    '/api/admin/orders',
    wrap(requireAdmin),
    wrap(async (_req, res) => {
      res.json((await allOrders()).map(publicOrder))
    }),
  )

  app.post(
    '/api/admin/orders/:id/:action',
    wrap(requireAdmin),
    wrap(async (req, res) => {
      const order = await getById(req.params.id)
      if (!order) {
        res.status(404).json({ error: 'not found' })
        return
      }
      const action = req.params.action
      if (req.body?.note) order.adminNote = req.body.note
      if (action === 'accept' && order.status === 'enquiry') order.status = 'accepted'
      else if (action === 'decline' && order.status === 'enquiry') order.status = 'declined'
      else if (action === 'ready' && ['review', 'details'].includes(order.status)) {
        order.status = 'ready'
        order.readyAt = new Date().toISOString()
      }
      else if (action === 'handover') {
        applyHandover(order, req.body)
      } else if (action === 'set-preview' && order.status === 'paid') {
        order.previewUrl = String(req.body?.previewUrl || '').trim()
      } else if (action === 'send-preview' && order.status === 'paid') {
        if (!order.previewUrl) {
          res.status(400).json({ error: 'preview-url' })
          return
        }
        order.previewSentAt = new Date().toISOString()
        order.previewRound = Number(order.previewRound || 0) + 1
        order.previewFeedback = null
        notifyPreviewReady(order).catch((error) => {
          console.error('notify preview', error)
        })
      } else if (action === 'confirm-deposit' && canPayDeposit(order) && order.depositPending) {
        order.status = 'paid'
        order.paidAt = new Date().toISOString()
        order.depositPending = false
      } else if (action === 'paid' && canPayDeposit(order) && !order.depositPending) {
        order.status = 'paid'
        order.paidAt = new Date().toISOString()
        order.depositPending = false
      } else if (action === 'deliver' && order.status === 'paid') {
        if (!order.previewApprovedAt) {
          res.status(409).json({ error: 'preview' })
          return
        }
        order.status = 'delivered'
        order.deliveredAt = new Date().toISOString()
      } else if (action === 'balance-due' && order.status === 'delivered' && !order.balancePaidAt) {
        order.balanceDue = true
        order.balanceDueAt = new Date().toISOString()
        notifyPaymentDue(order).catch((error) => {
          console.error('notify payment', error)
        })
      } else if (action === 'confirm-balance' && order.status === 'delivered' && order.balancePending) {
        applyHandover(order, req.body)
        order.balancePaidAt = new Date().toISOString()
        order.balanceDue = false
        order.balancePending = false
      } else if (action === 'balance' && order.status === 'delivered') {
        applyHandover(order, req.body)
        order.balancePaidAt = new Date().toISOString()
        order.balanceDue = false
        order.balancePending = false
      } else if (action === 'note') {
        /* note only */
      } else {
        res.status(409).json({ error: 'status' })
        return
      }
      res.json(publicOrder(await putOrder(order)))
    }),
  )

  return app
}
