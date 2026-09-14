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

  return { order, setOrder, error }
}
