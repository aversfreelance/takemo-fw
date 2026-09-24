import { useEffect, useState } from 'react'
import { api, type Order } from './api'

export function useOrder(token?: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    api
      .getOrder(token)
      .then(setOrder)
      .catch(() => setError('missing'))
  }, [token])

  async function reload() {
    if (!token) return null
    try {
      const next = await api.getOrder(token)
      setOrder(next)
      return next
    } catch {
      setError('missing')
      return null
    }
  }

  return { order, setOrder, error, reload }
}
