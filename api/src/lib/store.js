/**
 * store.js
 *
 * Simple JSON-file-backed booking store.
 * All bookings are persisted to api/data/bookings.json so they survive server restarts.
 *
 * API:
 *   getBooking(id)          → booking object | null
 *   setBooking(id, booking) → void
 *   getAllBookings()         → { [id]: booking }
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR   = join(__dirname, '../../data')
const STORE_PATH = join(DATA_DIR, 'bookings.json')

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readAll() {
  ensureDataDir()
  if (!existsSync(STORE_PATH)) return {}
  try {
    return JSON.parse(readFileSync(STORE_PATH, 'utf8'))
  } catch {
    console.error('[store] Could not parse bookings.json — starting fresh')
    return {}
  }
}

function writeAll(data) {
  ensureDataDir()
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8')
}

export function getBooking(id) {
  return readAll()[id] ?? null
}

export function setBooking(id, booking) {
  const all = readAll()
  all[id] = booking
  writeAll(all)
}

export function getAllBookings() {
  return readAll()
}
