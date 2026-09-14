import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sql, useNeon } from './neon.js'

const root = dirname(fileURLToPath(import.meta.url))
const dataDir = join(root, 'data')
const file = join(dataDir, 'orders.json')

function empty() {
  return { orders: [], adminTokens: [] }
}

function load() {
  if (!existsSync(file)) return empty()
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return empty()
  }
}

function save(data) {
  mkdirSync(dataDir, { recursive: true })
  writeFileSync(file, JSON.stringify(data, null, 2))
}

export function uid(bytes = 8) {
  return randomBytes(bytes).toString('hex')
}

export async function allOrders() {
  if (useNeon()) {
    const db = await sql()
    const rows = await db`SELECT data FROM orders ORDER BY updated_at DESC`
    return rows.map((row) => row.data)
  }
  return load().orders.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function getByToken(token) {
  if (useNeon()) {
    const db = await sql()
    const rows = await db`SELECT data FROM orders WHERE token = ${token} LIMIT 1`
    return rows[0]?.data || null
  }
  return load().orders.find((order) => order.token === token)
}

export async function getById(id) {
  if (useNeon()) {
    const db = await sql()
    const rows = await db`SELECT data FROM orders WHERE id = ${id} LIMIT 1`
    return rows[0]?.data || null
  }
  return load().orders.find((order) => order.id === id)
}

export async function ordersByUser(userId) {
  if (useNeon()) {
    const db = await sql()
    const rows = await db`SELECT data FROM orders WHERE user_id = ${userId} ORDER BY updated_at DESC`
    return rows.map((row) => row.data)
  }
  return load()
    .orders.filter((order) => order.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function putOrder(order) {
  order.updatedAt = new Date().toISOString()
  if (useNeon()) {
    const db = await sql()
    const data = JSON.parse(JSON.stringify(order))
    await db`
      INSERT INTO orders (id, token, user_id, data, updated_at)
      VALUES (${order.id}, ${order.token}, ${order.userId || null}, ${data}, now())
      ON CONFLICT (id) DO UPDATE SET
        token = EXCLUDED.token,
        user_id = EXCLUDED.user_id,
        data = EXCLUDED.data,
        updated_at = now()
    `
    return order
  }
  const data = load()
  const index = data.orders.findIndex((item) => item.id === order.id)
  if (index >= 0) data.orders[index] = order
  else data.orders.push(order)
  save(data)
  return order
}

export async function addAdminToken(token) {
  if (useNeon()) {
    const db = await sql()
    await db`INSERT INTO admin_tokens (token) VALUES (${token}) ON CONFLICT DO NOTHING`
    return
  }
  const data = load()
  data.adminTokens = [...new Set([...(data.adminTokens || []), token])].slice(-20)
  save(data)
}

export async function hasAdminToken(token) {
  if (!token) return false
  if (useNeon()) {
    const db = await sql()
    const rows = await db`SELECT token FROM admin_tokens WHERE token = ${token} LIMIT 1`
    return Boolean(rows[0])
  }
  return (load().adminTokens || []).includes(token)
}
