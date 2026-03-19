/**
 * Geocoding service — Photon (Komoot), backed by OpenStreetMap data.
 * No API key required. Results biased toward the Croatian coast.
 * All callers receive a normalized PlaceResult — no provider shape leaks through.
 */

const PHOTON_URL = 'https://photon.komoot.io/api'
const BIAS_LAT   = 43.8   // center of Dalmatian coast
const BIAS_LON   = 16.4

/**
 * @typedef {Object} PlaceResult
 * @property {string}   label       - Human-readable display string
 * @property {number}   lat
 * @property {number}   lon
 * @property {{ street: string, city: string, country: string, postcode: string }} address
 * @property {string|undefined} providerId  - OSM feature ID
 * @property {'photon'} source
 */

function buildLabel(p) {
  return [p.name, p.street, p.housenumber, p.city || p.locality || p.county, p.country]
    .filter(Boolean)
    .join(', ')
}

/** @param {object} feature - Photon GeoJSON feature → PlaceResult */
function normalize(feature) {
  const p           = feature.properties
  const [lon, lat]  = feature.geometry.coordinates
  return {
    label:      buildLabel(p),
    lat,
    lon,
    address: {
      street:   p.street   || '',
      city:     p.city     || p.locality || p.county || '',
      country:  p.country  || '',
      postcode: p.postcode || '',
    },
    providerId: p.osm_id != null ? String(p.osm_id) : undefined,
    source:     /** @type {'photon'} */ ('photon'),
  }
}

/**
 * Search for places matching a free-text query.
 *
 * @param {string}       query
 * @param {AbortSignal}  [signal]
 * @returns {Promise<PlaceResult[]>}
 */
export async function searchPlaces(query, signal) {
  const url = new URL(PHOTON_URL)
  url.searchParams.set('q',     query)
  url.searchParams.set('limit', '6')
  url.searchParams.set('lat',   String(BIAS_LAT))
  url.searchParams.set('lon',   String(BIAS_LON))

  const res = await fetch(url.toString(), { signal })
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`)

  const data = await res.json()
  return (data.features ?? []).map(normalize)
}
