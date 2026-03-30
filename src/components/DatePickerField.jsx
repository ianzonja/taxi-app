import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDisplay(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function DatePickerField({
  id, value, onChange, hasError, placeholder = 'Select date',
}) {
  const today     = getToday()
  const initYear  = value ? +value.split('-')[0] : today.getFullYear()
  const initMonth = value ? +value.split('-')[1] - 1 : today.getMonth()

  const [open,      setOpen]      = useState(false)
  const [viewYear,  setViewYear]  = useState(initYear)
  const [viewMonth, setViewMonth] = useState(initMonth)
  const wrapRef = useRef(null)

  /* close on outside click (desktop only — mobile has backdrop) */
  useEffect(() => {
    if (!open) return
    const fn = e => { if (!wrapRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  /* close on Escape */
  useEffect(() => {
    if (!open) return
    const fn = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [open])

  /* lock body scroll only on mobile (bottom-sheet mode) */
  useEffect(() => {
    if (open && window.innerWidth < 640) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* sync view to value when changed externally */
  useEffect(() => {
    if (!value) return
    setViewYear(+value.split('-')[0])
    setViewMonth(+value.split('-')[1] - 1)
  }, [value])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
  const cells       = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const pad    = n => String(n).padStart(2, '0')
  const toIso  = d => `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`
  const isPast = d => new Date(viewYear, viewMonth, d) < today
  const isSel  = d => value === toIso(d)
  const isTdy  = d => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d

  const select = d => { onChange(toIso(d)); setOpen(false) }

  return (
    <div className="dp-wrap" ref={wrapRef}>
      {/* Trigger */}
      <button
        type="button"
        id={id}
        className={`dp-trigger bk-input${hasError ? ' bk-input--err' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? 'dp-value' : 'dp-placeholder'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="dp-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />

          {/* Calendar popup */}
          <div className="dp-popup" role="dialog" aria-modal="true" aria-label="Pick a date">
            {/* Header */}
            <div className="dp-popup-hdr">
              <span className="dp-popup-title">Select Date</span>
              <button
                type="button"
                className="dp-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Month navigation */}
            <div className="dp-nav">
              <button type="button" className="dp-nav-btn" onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft />
              </button>
              <span className="dp-nav-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <button type="button" className="dp-nav-btn" onClick={nextMonth} aria-label="Next month">
                <ChevronRight />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="dp-dow-row">
              {DAY_NAMES.map(d => <span key={d} className="dp-dow">{d}</span>)}
            </div>

            {/* Day grid */}
            <div className="dp-grid">
              {cells.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  className={[
                    'dp-day',
                    !d             && 'dp-day--blank',
                    d && isTdy(d)  && 'dp-day--today',
                    d && isSel(d)  && 'dp-day--sel',
                    d && isPast(d) && 'dp-day--past',
                  ].filter(Boolean).join(' ')}
                  onClick={() => d && !isPast(d) && select(d)}
                  disabled={!d || isPast(d)}
                  aria-hidden={!d || undefined}
                  tabIndex={d && !isPast(d) ? 0 : -1}
                >
                  {d ?? ''}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
