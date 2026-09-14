import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sql, useNeon } from './neon.js'

const root = dirname(fileURLToPath(import.meta.url))
const file = join(root, 'data', 'users.json')

function superEmail() {
  return (process.env.SUPERUSER_EMAIL || 'avers.freelance@gmail.com').toLowerCase()
}

function empty() {
  return { users: [], sessions: [] }
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
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, JSON.stringify(data, null, 2))
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}

function checkPassword(password, stored) {
  if (!stored) return false
  const [salt, hash] = stored.split(':')
  const next = scryptSync(password, salt, 64)
  return timingSafeEqual(Buffer.from(hash, 'hex'), next)
}

function fromRow(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    googleId: row.google_id,
    createdAt: row.created_at,
  }
}

export function isSuper(email) {
  return String(email || '').toLowerCase() === superEmail()
}

export function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    admin: isSuper(user.email),
  }
}

export async function findUserByEmail(email) {
  const clean = String(email || '').toLowerCase()
  if (useNeon()) {
    const db = await sql()
    const rows = await db`SELECT * FROM users WHERE email = ${clean} LIMIT 1`
    return fromRow(rows[0])
  }
  return load().users.find((user) => user.email === clean)
}

export async function userFromToken(token) {
  if (!token) return null
  if (useNeon()) {
    const db = await sql()
    const rows = await db`
      SELECT users.* FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token = ${token}
      LIMIT 1
    `
    return fromRow(rows[0])
  }
  const data = load()
  const session = data.sessions.find((item) => item.token === token)
  if (!session) return null
  return data.users.find((user) => user.id === session.userId) || null
}

export async function createSession(userId) {
  const token = randomBytes(24).toString('hex')
  if (useNeon()) {
    const db = await sql()
    await db`DELETE FROM sessions WHERE user_id = ${userId}`
    await db`INSERT INTO sessions (token, user_id) VALUES (${token}, ${userId})`
    return token
  }
  const data = load()
  data.sessions = [...data.sessions.filter((item) => item.userId !== userId), { token, userId }].slice(-80)
  save(data)
  return token
}

export async function dropSession(token) {
  if (useNeon()) {
    const db = await sql()
    await db`DELETE FROM sessions WHERE token = ${token || ''}`
    return
  }
  const data = load()
  data.sessions = data.sessions.filter((item) => item.token !== token)
  save(data)
}

export async function registerUser({ name, email, password }) {
  const clean = String(email || '').trim().toLowerCase()
  if (!clean || !password || String(password).length < 6) return { error: 'invalid' }
  if (await findUserByEmail(clean)) return { error: 'exists' }
  const user = {
    id: randomBytes(8).toString('hex'),
    email: clean,
    name: String(name || clean).trim(),
    passwordHash: hashPassword(password),
    googleId: '',
    createdAt: new Date().toISOString(),
  }
  if (useNeon()) {
    const db = await sql()
    await db`
      INSERT INTO users (id, email, name, password_hash, google_id)
      VALUES (${user.id}, ${user.email}, ${user.name}, ${user.passwordHash}, ${user.googleId})
    `
    return { user, token: await createSession(user.id) }
  }
  const data = load()
  data.users.push(user)
  save(data)
  return { user, token: await createSession(user.id) }
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email)
  if (!user || !checkPassword(password, user.passwordHash)) return { error: 'login' }
  return { user, token: await createSession(user.id) }
}

export async function upsertGoogleUser({ email, name, googleId }) {
  const clean = String(email || '').trim().toLowerCase()
  if (!clean || !googleId) return { error: 'google' }
  if (useNeon()) {
    const db = await sql()
    const existing = await db`SELECT * FROM users WHERE email = ${clean} OR google_id = ${googleId} LIMIT 1`
    let user = fromRow(existing[0])
    if (!user) {
      user = {
        id: randomBytes(8).toString('hex'),
        email: clean,
        name: String(name || clean).trim(),
        passwordHash: '',
        googleId,
        createdAt: new Date().toISOString(),
      }
      await db`
        INSERT INTO users (id, email, name, password_hash, google_id)
        VALUES (${user.id}, ${user.email}, ${user.name}, ${user.passwordHash}, ${user.googleId})
      `
    } else if (!user.googleId) {
      await db`UPDATE users SET google_id = ${googleId} WHERE id = ${user.id}`
      user.googleId = googleId
    }
    return { user, token: await createSession(user.id) }
  }
  const data = load()
  let user = data.users.find((item) => item.email === clean || item.googleId === googleId)
  if (!user) {
    user = {
      id: randomBytes(8).toString('hex'),
      email: clean,
      name: String(name || clean).trim(),
      passwordHash: '',
      googleId,
      createdAt: new Date().toISOString(),
    }
    data.users.push(user)
    save(data)
  } else if (!user.googleId) {
    user.googleId = googleId
    save(data)
  }
  return { user, token: await createSession(user.id) }
}

export async function googleFromCredential(credential) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || ''
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
  const payload = await response.json()
  if (!payload.email || (clientId && payload.aud !== clientId)) return { error: 'google' }
  return upsertGoogleUser({ email: payload.email, name: payload.name, googleId: payload.sub })
}
