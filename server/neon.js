import { neon } from '@neondatabase/serverless'

let client
let migrated

export function useNeon() {
  return Boolean(process.env.DATABASE_URL)
}

export async function sql() {
  if (!useNeon()) throw new Error('DATABASE_URL missing')
  if (!client) client = neon(process.env.DATABASE_URL)
  if (!migrated) migrated = migrate(client)
  await migrated
  return client
}

async function migrate(db) {
  await db`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL DEFAULT '',
    google_id TEXT NOT NULL DEFAULT '',
    admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`
  await db`ALTER TABLE users ADD COLUMN IF NOT EXISTS admin BOOLEAN NOT NULL DEFAULT false`
  await db`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`
  await db`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    user_id TEXT,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`
  await db`CREATE TABLE IF NOT EXISTS catalog (
    id INTEGER PRIMARY KEY DEFAULT 1,
    data JSONB NOT NULL
  )`
  await db`CREATE TABLE IF NOT EXISTS admin_tokens (
    token TEXT PRIMARY KEY
  )`
}
