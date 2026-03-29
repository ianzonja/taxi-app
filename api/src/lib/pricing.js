/**
 * pricing.js
 *
 * Price calculation: €5 per kilometre, minimum fare €25.
 * All amounts are in euro cents (integer) for Stripe compatibility.
 *
 * Example:
 *   distanceKm = 142.3 → 142.3 * 500 = 71150 cents = €711.50
 *   distanceKm = 3     →   3   * 500 =  1500 cents  →  raised to MIN = 2500 = €25.00
 */

const RATE_CENTS_PER_KM = 500   // €5.00
const MINIMUM_CENTS     = 2500  // €25.00 minimum fare

/**
 * Calculate the transfer price in euro cents.
 * @param {number} distanceKm  — driving distance in kilometres
 * @returns {number}           — price in euro cents (integer, ≥ MINIMUM_CENTS)
 */
export function calculatePriceCents(distanceKm) {
  const km  = Math.max(0, Number(distanceKm) || 0)
  const raw = Math.round(km * RATE_CENTS_PER_KM)
  return Math.max(raw, MINIMUM_CENTS)
}

/**
 * Format euro cents as a human-readable string.
 * @param {number} cents
 * @returns {string}  e.g. "€142.30"
 */
export function formatEuro(cents) {
  return `€${(cents / 100).toFixed(2)}`
}
