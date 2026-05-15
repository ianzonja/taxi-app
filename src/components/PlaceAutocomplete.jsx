import { useState, useRef, useEffect } from 'react'
import { Loader2, MapPin, AlertCircle } from 'lucide-react'
import { usePlaceAutocomplete } from '../hooks/usePlaceAutocomplete'

/**
 * Accessible place autocomplete combobox.
 * Follows ARIA 1.2 combobox / listbox pattern.
 *
 * @param {{
 *   id:               string,
 *   value:            string,
 *   onChange:         (text: string) => void,
 *   onSelect:         (place: import('../services/geocoding').PlaceResult | null) => void,
 *   placeholder?:     string,
 *   hasError?:        boolean,
 *   'aria-describedby'?: string,
 * }} props
 */
export default function PlaceAutocomplete({
  id,
  value,
  onChange,
  onSelect,
  placeholder = 'Search for a place…',
  hasError,
  'aria-describedby': ariaDescBy,
}) {
  const listboxId           = `${id}-lb`
  const [open, setOpen]     = useState(false)
  const [active, setActive] = useState(-1)
  const inputRef            = useRef(null)
  const justSelected        = useRef(false)

  const { results, loading, error } = usePlaceAutocomplete(value)

  const minChars = value.trim().length >= 2
  const showList = open && minChars

  // Re-open and reset active index whenever suggestions change,
  // but skip the update that immediately follows a selection.
  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false
      return
    }
    if (minChars) setOpen(true)
    setActive(-1)
  }, [results, minChars])

  function select(place) {
    justSelected.current = true
    onSelect(place)
    setOpen(false)
    setActive(-1)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!showList) {
      if (e.key === 'ArrowDown') { setOpen(true); e.preventDefault() }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && active >= 0 && results[active]) {
      e.preventDefault()
      select(results[active])
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (active < 0) return
    document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, id])

  return (
    <div
      className="place-ac"
      role="combobox"
      aria-expanded={showList}
      aria-haspopup="listbox"
      aria-owns={listboxId}
    >
      <div className="place-ac-wrap">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          className={`bk-input${hasError ? ' bk-input--err' : ''}`}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          aria-describedby={ariaDescBy}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (minChars) setOpen(true) }}
          onBlur={() => setOpen(false)}
        />
        {loading && (
          <Loader2 className="place-ac-spin spinning" aria-hidden="true" />
        )}
      </div>

      {/* Always rendered so screen readers can announce it; visibility toggled via CSS */}
      <ul
        id={listboxId}
        role="listbox"
        aria-label="Place suggestions"
        className={`place-ac-list${showList ? ' place-ac-list--open' : ''}`}
        // Prevent the input from losing focus when the user interacts with the list
        onMouseDown={e => e.preventDefault()}
      >
        {results.length > 0
          ? results.map((place, i) => (
              <li
                key={place.providerId ?? `${place.lat},${place.lon}`}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                className={`place-ac-item${i === active ? ' place-ac-item--on' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => select(place)}
              >
                <MapPin className="place-ac-item-pin" aria-hidden="true" />
                <span>{place.label}</span>
              </li>
            ))
          : error
          ? (
            <li className="place-ac-msg place-ac-msg--err" role="option" aria-selected="false">
              <AlertCircle aria-hidden="true" />
              <span>{error}</span>
            </li>
          )
          : !loading && (
            <li className="place-ac-msg" role="option" aria-selected="false">
              <span>No results found</span>
            </li>
          )
        }
      </ul>
    </div>
  )
}
