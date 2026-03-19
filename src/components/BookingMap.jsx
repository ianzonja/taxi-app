/**
 * Leaflet + OpenStreetMap map component.
 *
 * SSG-safe: the component renders null on first paint (matching the server
 * pre-render), then mounts Leaflet exclusively in the browser via dynamic
 * import. This avoids hydration mismatches with vite-react-ssg.
 *
 * Custom DivIcon markers ("A" / "B") match the original Google Maps design.
 */
import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'

const OSM_TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTR = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'

/** Build a labeled circle DivIcon for Leaflet. */
function mkIcon(L, extraClass, letter) {
  return L.divIcon({
    className:     `map-marker ${extraClass}`,
    html:          `<span>${letter}</span>`,
    iconSize:      [28, 28],
    iconAnchor:    [14, 14],
    popupAnchor:   [0, -16],
  })
}

/**
 * @param {{
 *   pickupPlace: import('../services/geocoding').PlaceResult | null,
 *   destPlace:   import('../services/geocoding').PlaceResult | null,
 *   routeCoords: [number, number][] | null,  // GeoJSON [lon, lat] pairs
 * }} props
 */
export default function BookingMap({ pickupPlace, destPlace, routeCoords }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const pickupMkRef  = useRef(null)
  const destMkRef    = useRef(null)
  const routeRef     = useRef(null)

  // `mounted` starts false so first render matches SSG output (null).
  // Leaflet module stored in state so dependent effects re-run once it loads.
  const [mounted, setMounted] = useState(false)
  const [L,       setL]       = useState(null)

  // Step 1: mark as client-mounted
  useEffect(() => { setMounted(true) }, [])

  // Step 2: dynamically load Leaflet JS (never runs during SSG)
  useEffect(() => {
    if (!mounted) return
    import('leaflet').then(m => setL(m.default))
  }, [mounted])

  // Step 3: initialize the map once Leaflet is available
  useEffect(() => {
    if (!L || !containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center:             [43.8, 16.4],  // Dalmatian coast overview
      zoom:               7,
      zoomControl:        true,
      attributionControl: true,
    })
    L.tileLayer(OSM_TILE, { attribution: OSM_ATTR, maxZoom: 19 }).addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current   = null
      pickupMkRef.current = null
      destMkRef.current   = null
      routeRef.current    = null
    }
  }, [L])

  // Pickup marker
  useEffect(() => {
    if (!L || !mapRef.current) return
    pickupMkRef.current?.remove()
    pickupMkRef.current = null
    if (!pickupPlace) return

    pickupMkRef.current = L.marker([pickupPlace.lat, pickupPlace.lon], {
      icon:         mkIcon(L, 'map-marker--a', 'A'),
      title:        'Pickup',
      zIndexOffset: 100,
    }).addTo(mapRef.current)

    if (!destPlace) mapRef.current.setView([pickupPlace.lat, pickupPlace.lon], 11)
  }, [L, pickupPlace, destPlace])  // eslint-disable-line react-hooks/exhaustive-deps

  // Destination marker
  useEffect(() => {
    if (!L || !mapRef.current) return
    destMkRef.current?.remove()
    destMkRef.current = null
    if (!destPlace) return

    destMkRef.current = L.marker([destPlace.lat, destPlace.lon], {
      icon:         mkIcon(L, 'map-marker--b', 'B'),
      title:        'Destination',
      zIndexOffset: 100,
    }).addTo(mapRef.current)

    if (!pickupPlace) mapRef.current.setView([destPlace.lat, destPlace.lon], 11)
  }, [L, destPlace, pickupPlace])  // eslint-disable-line react-hooks/exhaustive-deps

  // Fit map to show both markers
  useEffect(() => {
    if (!L || !mapRef.current || !pickupPlace || !destPlace) return
    mapRef.current.fitBounds(
      L.latLngBounds(
        [pickupPlace.lat, pickupPlace.lon],
        [destPlace.lat,   destPlace.lon],
      ),
      { padding: [40, 40] },
    )
  }, [L, pickupPlace, destPlace])

  // Route polyline (routeCoords are GeoJSON [lon, lat] → flip for Leaflet)
  useEffect(() => {
    if (!L || !mapRef.current) return
    routeRef.current?.remove()
    routeRef.current = null
    if (!routeCoords?.length) return

    routeRef.current = L.polyline(
      routeCoords.map(([lon, lat]) => [lat, lon]),
      { color: '#2563eb', weight: 5, opacity: 0.8 },
    ).addTo(mapRef.current)
  }, [L, routeCoords])

  // Render nothing until client mount (keeps SSG hydration clean)
  if (!mounted) return null

  return (
    <>
      {/* Loading overlay while Leaflet initializes */}
      {!L && (
        <div className="bk-map-state" aria-live="polite">
          <span>Loading map…</span>
        </div>
      )}
      <div
        ref={containerRef}
        className="bk-map-canvas"
        role="img"
        aria-label="Route map showing pickup and destination"
        // Keep in layout while Leaflet loads; hiding with display:none would
        // prevent Leaflet from computing container dimensions on init.
        style={!L ? { visibility: 'hidden' } : undefined}
      />
    </>
  )
}
