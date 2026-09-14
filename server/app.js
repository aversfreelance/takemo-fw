import { randomBytes } from 'node:crypto'
import cors from 'cors'
import express from 'express'
import multer from 'multer'
import Stripe from 'stripe'
import { invoicePdf, contractPdf } from './pdf.js'
import { addAdminToken, getById, getByToken, hasAdminToken, putOrder, allOrders, ordersByUser, uid } from './store.js'
import { computeTotals, getCatalog, saveCatalog } from './totals.js'
import {
  dropSession,
  googleFromCredential,
  loginUser,
  publicUser,
  registerUser,
  userFromToken,
} from './users.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
})

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'takemo-admin'
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:5173'
const stripeSecret = process.env.STRIPE_SECRET_KEY || ''
const stripe = stripeSecret ? new Stripe(stripeSecret) : null

const emptyDetails = {
  businessName: '',
  companyNumber: '',
  address: '',
  vatNumber: '',
  domain: '',
  logoMode: 'us',
  logoFile: '',
  palette: 'us',
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
  return { ...rest, token, stripeEnabled: Boolean(stripe) }
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

async function requireAdmin(req, res, next) {
  if ((await hasAdminToken(req.get('x-admin-token'))) || req.user?.admin) {
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

export function createApi() {
  const app = express()
  app.use(cors())
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
      if (!name || !email || !message) {
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
          name: name || req.user.name,
          email: email || req.user.email,
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
    upload.single('logo'),
    wrap(async (req, res) => {
      const order = req.order
      if (order.status !== 'accepted' && order.status !== 'details') {
        res.status(409).json({ error: 'not accepted' })
        return
      }
      const body = req.body || {}
      order.details = {
        ...emptyDetails,
        ...order.details,
        businessName: body.businessName || '',
        companyNumber: body.companyNumber || '',
        address: body.address || '',
        vatNumber: body.vatNumber || '',
        domain: body.domain || '',
        logoMode: body.logoMode === 'upload' ? 'upload' : 'us',
        logoFile: req.file ? logoDataUrl(req.file) : order.details?.logoFile || '',
        palette: body.palette || 'us',
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
    '/api/orders/:token/checkout',
    requireUser,
    wrap(requireOrder),
    wrap(async (req, res) => {
      const order = req.order
      if (!order || order.status !== 'ready') {
        res.status(409).json({ error: 'not ready' })
        return
      }
      if (!stripe) {
        res.status(400).json({ error: 'stripe-missing' })
        return
      }
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: order.enquiry.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: order.totals.currency === 'HUF' ? 'huf' : 'gbp',
              unit_amount: order.totals.deposit,
              product_data: { name: `Take Mee Online deposit ${order.id}` },
            },
          },
        ],
        metadata: { token: order.token, id: order.id },
        success_url: `${PUBLIC_URL}/order/${order.token}/pay?paid=1`,
        cancel_url: `${PUBLIC_URL}/order/${order.token}/pay`,
      })
      order.stripeSessionId = session.id
      await putOrder(order)
      res.json({ url: session.url })
    }),
  )

  app.post(
    '/api/orders/:token/demo-pay',
    requireUser,
    wrap(requireOrder),
    wrap(async (req, res) => {
      const order = req.order
      if (!order || order.status !== 'ready') {
        res.status(409).json({ error: 'not ready' })
        return
      }
      if (stripe) {
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
    '/api/orders/:token/invoice.pdf',
    wrap(async (req, res) => {
      const order = await getByToken(req.params.token)
      if (!order || order.status !== 'delivered') {
        res.status(409).json({ error: 'not delivered' })
        return
      }
      const pdf = await invoicePdf(order)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="takemo-${order.id}-invoice.pdf"`)
      res.send(pdf)
    }),
  )

  app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    wrap(async (req, res) => {
      if (!stripe) {
        res.json({ ok: true })
        return
      }
      let event = req.body
      const secret = process.env.STRIPE_WEBHOOK_SECRET
      if (secret) {
        event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], secret)
      }
      if (event.type === 'checkout.session.completed') {
        const token = event.data.object.metadata?.token
        const order = token ? await getByToken(token) : null
        if (order && order.status === 'ready') {
          order.status = 'paid'
          order.paidAt = new Date().toISOString()
          await putOrder(order)
        }
      }
      res.json({ ok: true })
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

  app.post(
    '/api/admin/login',
    wrap(async (req, res) => {
      if (req.body?.password !== ADMIN_PASSWORD) {
        res.status(401).json({ error: 'password' })
        return
      }
      const token = randomBytes(24).toString('hex')
      await addAdminToken(token)
      res.json({ token })
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
      else if (action === 'ready' && ['review', 'details'].includes(order.status)) order.status = 'ready'
      else if (action === 'paid' && order.status === 'ready') {
        order.status = 'paid'
        order.paidAt = new Date().toISOString()
      } else if (action === 'deliver' && order.status === 'paid') {
        order.status = 'delivered'
        order.deliveredAt = new Date().toISOString()
      } else if (action === 'balance' && order.status === 'delivered') {
        order.balancePaidAt = new Date().toISOString()
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
