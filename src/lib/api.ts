import type { Catalog } from '../catalog'

export type AuthUser = { id: string; email: string; name: string; admin: boolean }

export type OrderStatus =
  | 'enquiry'
  | 'declined'
  | 'accepted'
  | 'details'
  | 'review'
  | 'ready'
  | 'paid'
  | 'delivered'

export type Order = {
  id: string
  token: string
  createdAt: string
  updatedAt: string
  locale: 'hu' | 'en'
  status: OrderStatus
  enquiry: {
    name: string
    email: string
    phone: string
    siteType: string
    message: string
  }
  details: {
    businessName: string
    companyNumber: string
    address: string
    vatNumber: string
    domain: string
    logoMode: 'upload' | 'us'
    logoFile: string
    palette: string
    content: string
    products: string
    frequency: string
    mediaKind: string
  } | null
  selection: {
    siteId: string
    moduleIds: string[]
    careId: string
    careTerm: 'monthly' | 'yearly'
  }
  totals: { net: number; vat: number; gross: number; deposit: number; remainder: number; vatRate?: number; currency?: 'GBP' | 'HUF' }
  adminNote: string
  paidAt: string | null
  deliveredAt: string | null
  stripeEnabled: boolean
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  const admin = sessionStorage.getItem('takemo-admin')
  const user = localStorage.getItem('takemo-user')
  if (admin) headers.set('x-admin-token', admin)
  if (user) headers.set('x-user-token', user)
  if (init?.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const response = await fetch(path, { ...init, headers })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || response.statusText)
  }
  const type = response.headers.get('content-type') || ''
  if (type.includes('application/json')) return response.json() as Promise<T>
  return undefined as T
}

export const api = {
  createOrder: (body: Record<string, string>) =>
    request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  getOrder: (token: string) => request<Order>(`/api/orders/${token}`),
  saveDetails: (token: string, data: FormData) =>
    request<Order>(`/api/orders/${token}/details`, { method: 'POST', body: data }),
  saveSelection: (token: string, body: Order['selection']) =>
    request<Order>(`/api/orders/${token}/selection`, { method: 'POST', body: JSON.stringify(body) }),
  submitReview: (token: string) =>
    request<Order>(`/api/orders/${token}/review`, { method: 'POST' }),
  checkout: (token: string) =>
    request<{ url: string }>(`/api/orders/${token}/checkout`, { method: 'POST' }),
  demoPay: (token: string) => request<Order>(`/api/orders/${token}/demo-pay`, { method: 'POST' }),
  login: (password: string) =>
    request<{ token: string }>('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),
  listOrders: () => request<Order[]>('/api/admin/orders'),
  act: (id: string, action: string, note = '') =>
    request<Order>(`/api/admin/orders/${id}/${action}`, { method: 'POST', body: JSON.stringify({ note }) }),
  getCatalog: () => request<Catalog>('/api/catalog'),
  saveCatalog: (catalog: Catalog) =>
    request<Catalog>('/api/admin/catalog', { method: 'PUT', body: JSON.stringify(catalog) }),
  register: (body: { name: string; email: string; password: string }) =>
    request<{ token: string; user: AuthUser }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  userLogin: (body: { email: string; password: string }) =>
    request<{ token: string; user: AuthUser }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  googleLogin: (credential: string) =>
    request<{ token: string; user: AuthUser }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),
  me: () => request<{ user: AuthUser | null; googleClientId: string }>('/api/auth/me'),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  myOrders: () => request<Order[]>('/api/me/orders'),
}

export function contractUrl(token: string) {
  return `/api/orders/${token}/contract.pdf`
}

export function invoiceUrl(token: string) {
  return `/api/orders/${token}/invoice.pdf`
}
