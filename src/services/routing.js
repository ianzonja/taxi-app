/**
 * Routing service abstraction.
 *
 * Primary:  OpenRouteService — set VITE_ORS_API_KEY in .env for production.
 *           Free tier: ~2 000 requests/day. https://openrouteservice.org/
 * Fallback: OSRM public demo  — zero-config for development / low traffic.
 *           Not suitable for production at scale.
 *
 * To swap provider: change the env var — no UI component changes required.
 */

/**
 * @typedef {Object} RouteResult
 * @property {[number,number][]} coordinates  - GeoJSON order [lon, lat] pairs
 * @property {number}  distanceMeters
 * @property {number}  durationSeconds
 * @property {string}  distanceLabel   - e.g. "142.3 km"
 * @property {string}  durationLabel   - e.g. "1 h 42 min"
 */

function fmtDist(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`
}

function fmtDur(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h} h ${m} min` : `${m} min`
}

async function viaORS(from, to, key, signal) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car`
    + `?api_key=${encodeURIComponent(key)}`
    + `&start=${from.lon},${from.lat}`
    + `&end=${to.lon},${to.lat}`

  const res = await fetch(url, { signal })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error?.message ?? `ORS error (${res.status})`)
  }
  const data = await res.json()
  const feat = data.features?.[0]
  if (!feat) throw new Error('No route returned by ORS')

  const coords              = feat.geometry.coordinates  // [lon, lat][]
  const { distance, duration } = feat.properties.summary
  return {
    coordinates:    coords,
    distanceMeters: distance,
    durationSeconds: duration,
    distanceLabel:  fmtDist(distance),
    durationLabel:  fmtDur(duration),
  }
}

async function viaOSRM(from, to, signal) {
  const url = `https://router.project-osrm.org/route/v1/driving/`
    + `${from.lon},${from.lat};${to.lon},${to.lat}`
    + `?overview=full&geometries=geojson`

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`OSRM error (${res.status})`)

  const data = await res.json()
  if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('No route found')

  const route = data.routes[0]
  return {
    coordinates:     route.geometry.coordinates,  // [lon, lat][]
    distanceMeters:  route.distance,
    durationSeconds: route.duration,
    distanceLabel:   fmtDist(route.distance),
    durationLabel:   fmtDur(route.duration),
  }
}

/**
 * Fetch a driving route between two points.
 * Uses ORS when VITE_ORS_API_KEY is configured, otherwise OSRM.
 *
 * @param {{ lat: number, lon: number }} from
 * @param {{ lat: number, lon: number }} to
 * @param {AbortSignal} [signal]
 * @returns {Promise<RouteResult>}
 */
export async function fetchRoute(from, to, signal) {
  const key = import.meta.env.VITE_ORS_API_KEY
  return key ? viaORS(from, to, key, signal) : viaOSRM(from, to, signal)
}
