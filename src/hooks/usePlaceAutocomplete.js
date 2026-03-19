import { useState, useEffect, useRef } from 'react'
import { searchPlaces } from '../services/geocoding'

const DEBOUNCE_MS = 300
const MIN_CHARS   = 2

/**
 * Debounced place search hook. Cancels in-flight requests on every new
 * query to prevent stale results from appearing out of order.
 *
 * @param {string} query - Current input text (raw, unfiltered)
 * @returns {{
 *   results: import('../services/geocoding').PlaceResult[],
 *   loading: boolean,
 *   error: string | null
 * }}
 */
export function usePlaceAutocomplete(query) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const abortRef = useRef(/** @type {AbortController|null} */ (null))

  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length < MIN_CHARS) {
      abortRef.current?.abort()
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const ctrl     = new AbortController()
      abortRef.current = ctrl

      setLoading(true)
      setError(null)
      try {
        const res = await searchPlaces(trimmed, ctrl.signal)
        setResults(res)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setResults([])
          setError('Could not load suggestions')
        }
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      abortRef.current?.abort()
    }
  }, [query])

  return { results, loading, error }
}
